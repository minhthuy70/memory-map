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
      return null;
    }

    if (!user.passwordHash) {
      // User registered via OAuth only
      return null;
    }

    // Check if account is locked
    if (user.lockedUntil && new Date() < user.lockedUntil) {
      const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account is locked. Try again in ${lockTimeRemaining} minutes.`,
      );
    }

    // Reset lock if expired
    if (user.lockedUntil && new Date() >= user.lockedUntil) {
      await this.usersService.resetLoginAttempts(user.id);
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
        'Too many failed login attempts. Account has been locked for 15 minutes.',
      );
    }

    return null;
  }

  async login(
    email: string,
    password: string,
    deviceInfo?: string,
    ipAddress?: string,
  ) {
    const user =
      await this.validateUser(
        email,
        password,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

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
}