import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { OAuthDto } from './dto/oauth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ) {
    const user =
      await this.usersService.findByEmail(
        email,
      );

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác.');
    }

    if (!user.passwordHash) {
      // User registered via OAuth only
      throw new UnauthorizedException(
        'Tài khoản này được tạo bằng Google hoặc Facebook. Vui lòng chọn đăng nhập bằng liên kết mạng xã hội tương ứng.',
      );
    }

    // Check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Tài khoản đang bị khóa tạm thời. Vui lòng thử lại sau ${lockTimeRemaining} phút.`,
      );
    }

    // Reset lock if expired
    if (user.lockedUntil && new Date() >= user.lockedUntil) {
      await this.usersService.resetLoginAttempts(user.id);
      user.loginAttempts = 0;
      user.lockedUntil = null;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (isPasswordValid) {
      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        await this.usersService.resetLoginAttempts(user.id);
      }

      // Update last login date
      await this.usersService.updateLastLogin(user.id);

      const {
        passwordHash,
        ...result
      } = user;

      return result;
    }

    // Increment login attempts on failed login
    const newAttempts = user.loginAttempts + 1;
    await this.usersService.incrementLoginAttempts(user.id);

    // Lock account after 5 failed attempts for 15 minutes
    if (newAttempts >= 5) {
      const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      await this.usersService.lockAccount(user.id, lockUntil);
      throw new UnauthorizedException(
        'Bạn đã nhập sai mật khẩu quá 5 lần. Tài khoản đã bị khóa trong 15 phút để bảo mật.',
      );
    }

    const remainingAttempts = 5 - newAttempts;
    throw new UnauthorizedException(
      `Mật khẩu không chính xác. Bạn còn ${remainingAttempts} lần thử trước khi tài khoản bị khóa 15 phút.`,
    );
  }

  async login(
    email: string,
    password: string,
    deviceInfo?: string,
    ipAddress?: string,
    rememberMe?: boolean,
  ) {
    const user =
      await this.validateUser(
        email,
        password,
      );

    const payload = {
      email: user.email,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload);

    // Create session
    await this.sessionsService.createSession(
      user.id,
      token,
      deviceInfo,
      ipAddress,
      rememberMe,
    );

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async register(
    email: string,
    password: string,
    name?: string,
    deviceInfo?: string,
    ipAddress?: string,
  ) {
    const existingUser =
      await this.usersService.findByEmail(
        email,
      );

    if (existingUser) {
      throw new ConflictException(
        'Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.',
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const user =
      await this.usersService.create({
        email,
        passwordHash,
        name,
        isEmailVerified: false,
      });

    const payload = {
      email: user.email,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload);

    // Create session on registration
    await this.sessionsService.createSession(
      user.id,
      token,
      deviceInfo,
      ipAddress,
    );

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async handleOAuth(
    oauthDto: OAuthDto,
    deviceInfo?: string,
    ipAddress?: string,
  ) {
    const { provider, email, name, avatar, providerId } = oauthDto;

    // Check if user exists by email or provider ID
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      if (provider === 'google') {
        user = await this.usersService.findByGoogleId(providerId);
      } else if (provider === 'facebook') {
        user = await this.usersService.findByFacebookId(providerId);
      }
    }

    if (!user) {
      // Create new user with OAuth details (email is pre-verified by OAuth provider)
      user = await this.usersService.create({
        email,
        name: name || (provider === 'google' ? 'Google User' : 'Facebook User'),
        avatar,
        googleId: provider === 'google' ? providerId : undefined,
        facebookId: provider === 'facebook' ? providerId : undefined,
        isEmailVerified: true,
      });
    } else {
      // Update existing user OAuth ID & avatar if not set
      const updateData: any = {};
      if (provider === 'google' && !user.googleId) updateData.googleId = providerId;
      if (provider === 'facebook' && !user.facebookId) updateData.facebookId = providerId;
      if (!user.avatar && avatar) updateData.avatar = avatar;
      if (!user.name && name) updateData.name = name;
      if (!user.isEmailVerified) updateData.isEmailVerified = true;

      if (Object.keys(updateData).length > 0) {
        user = await this.usersService.update(user.id, updateData);
      }
    }

    // Reset login attempts & update last login
    await this.usersService.resetLoginAttempts(user.id);
    await this.usersService.updateLastLogin(user.id);

    const payload = {
      email: user.email,
      sub: user.id,
    };

    const token = this.jwtService.sign(payload);

    // Create session
    await this.sessionsService.createSession(
      user.id,
      token,
      deviceInfo,
      ipAddress,
    );

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async sendVerificationCode(email: string) {
    let user = await this.usersService.findByEmail(email);
    
    // Generate a 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      await this.usersService.setVerificationCode(email, code, expires);
    }

    // Log the verification code for development & testing visibility
    console.log(`\n======================================================`);
    console.log(`[EMAIL VERIFICATION] Mã xác nhận cho email ${email}: ${code}`);
    console.log(`[EMAIL VERIFICATION] Hết hạn lúc: ${expires.toLocaleTimeString()}`);
    console.log(`======================================================\n`);

    return {
      success: true,
      message: `Mã xác nhận đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư.`,
      email,
      // Provide code in dev mode for easy testing
      debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với email này');
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      throw new BadRequestException('Mã xác nhận không chính xác');
    }

    if (!user.verificationExpires || new Date() > user.verificationExpires) {
      throw new BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
    }

    await this.usersService.markEmailVerified(user.id);

    return {
      success: true,
      message: 'Email đã được xác thực thành công!',
    };
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const updatedUser = await this.usersService.update(
      userId,
      updateProfileDto,
    );

    const {
      passwordHash,
      ...result
    } = updatedUser;

    return result;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.passwordHash) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(userId, passwordHash);
      return { message: 'Password set successfully' };
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePassword(
      userId,
      passwordHash,
    );

    return { message: 'Password changed successfully' };
  }

  async getProfileWithStats(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const memoryCount = await this.usersService.getMemoryCount(userId);

    const {
      passwordHash,
      ...result
    } = user;

    return {
      ...result,
      memoryCount,
    };
  }

  async deactivateAccount(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.usersService.deactivateAccount(userId);

    return { message: 'Account deactivated successfully' };
  }

  async deleteAccount(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.usersService.deleteAccount(userId);

    return { message: 'Account deleted successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản với email này.');
    }

    // Generate crypto token (32 bytes hex = 64 characters)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // exactly 1 hour expiry

    await this.usersService.setResetPasswordToken(email, token, expires);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    console.log(`\n======================================================`);
    console.log(`[PASSWORD RESET] Gửi link đặt lại mật khẩu đến: ${email}`);
    console.log(`[PASSWORD RESET] Link: ${resetLink}`);
    console.log(`[PASSWORD RESET] Hết hạn lúc: ${expires.toLocaleTimeString()} (hiệu lực 1 giờ)`);
    console.log(`======================================================\n`);

    return {
      success: true,
      message: 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn và có hiệu lực trong 1 giờ.',
      email,
      resetLink: process.env.NODE_ENV !== 'production' ? resetLink : undefined,
    };
  }

  async verifyResetToken(token: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Liên kết khôi phục mật khẩu không hợp lệ hoặc đã qua sử dụng.');
    }

    if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Liên kết khôi phục mật khẩu đã hết hạn (chỉ có hiệu lực trong 1 giờ). Vui lòng yêu cầu liên kết mới.');
    }

    return {
      valid: true,
      email: user.email,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);

    if (!user) {
      throw new BadRequestException('Liên kết khôi phục mật khẩu không hợp lệ hoặc đã qua sử dụng.');
    }

    if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
      throw new BadRequestException('Liên kết khôi phục mật khẩu đã hết hạn (chỉ có hiệu lực trong 1 giờ). Vui lòng yêu cầu liên kết mới.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersService.resetPasswordWithToken(user.id, passwordHash);

    return {
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bằng mật khẩu mới.',
    };
  }
}