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
import { generateSecret, generateURI, verifySync } from 'otplib';
import * as QRCode from 'qrcode';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { OAuthDto } from './dto/oauth.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  // In-memory store for pending email verifications (supports verification before account registration)
  private readonly pendingEmailVerifications = new Map<
    string,
    { code: string; expires: Date; verified: boolean }
  >();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
    private readonly mailService: MailService,
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

    if (user.isActive === false) {
      throw new UnauthorizedException(
        'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
      );
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
    twoFactorCode?: string,
  ) {
    const user =
      await this.validateUser(
        email,
        password,
      );

    // If 2FA is enabled for this account
    if (user.twoFactorEnabled) {
      if (twoFactorCode) {
        const isVerified = await this.verifyTwoFactorOrBackupCode(user, twoFactorCode);
        if (!isVerified) {
          throw new UnauthorizedException('Mã xác thực 2FA không chính xác hoặc mã dự phòng đã qua sử dụng.');
        }
        await this.usersService.updateTwoFactorLastUsed(user.id);
      } else {
        // Return 2FA challenge with temporary short-lived token
        const tempToken = this.jwtService.sign(
          { sub: user.id, email: user.email, is2FA: true, rememberMe: !!rememberMe },
          { expiresIn: '5m' },
        );
        return {
          requires2FA: true,
          tempToken,
          message: 'Tài khoản đã kích hoạt bảo mật 2 lớp. Vui lòng nhập mã xác thực từ ứng dụng Authenticator hoặc mã dự phòng.',
        };
      }
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
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser =
      await this.usersService.findByEmail(
        normalizedEmail,
      );

    if (existingUser) {
      throw new ConflictException(
        'Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.',
      );
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    // Check if email was pre-verified via OTP code
    const pending = this.pendingEmailVerifications.get(normalizedEmail);
    const isPreVerified = pending?.verified === true;
    if (pending) {
      this.pendingEmailVerifications.delete(normalizedEmail);
    }

    const user =
      await this.usersService.create({
        email: normalizedEmail,
        passwordHash,
        name,
        isEmailVerified: isPreVerified,
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

    if (user && user.isActive === false) {
      throw new UnauthorizedException(
        'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.',
      );
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
    const normalizedEmail = email.toLowerCase().trim();
    let user = await this.usersService.findByEmail(normalizedEmail);
    
    // Generate a 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (user) {
      await this.usersService.setVerificationCode(normalizedEmail, code, expires);
    }

    // Always store in pendingEmailVerifications so registration flow can verify before user is created
    this.pendingEmailVerifications.set(normalizedEmail, {
      code,
      expires,
      verified: false,
    });

    // Send real email (falls back to logger when SMTP is not configured)
    await this.mailService.sendVerificationCode(normalizedEmail, code, expires);

    return {
      success: true,
      message: `Mã xác nhận đã được gửi đến email ${normalizedEmail}. Vui lòng kiểm tra hộp thư.`,
      email: normalizedEmail,
      // Provide code in dev mode for easy testing
      debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    };
  }

  async verifyEmail(email: string, code: string) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalizedEmail);
    const pending = this.pendingEmailVerifications.get(normalizedEmail);

    // 1. If user already exists in DB
    if (user) {
      if (!user.verificationCode || user.verificationCode !== code) {
        throw new BadRequestException('Mã xác nhận không chính xác');
      }

      if (!user.verificationExpires || new Date() > user.verificationExpires) {
        throw new BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
      }

      await this.usersService.markEmailVerified(user.id);
      if (pending) {
        pending.verified = true;
      }

      return {
        success: true,
        message: 'Email đã được xác thực thành công!',
      };
    }

    // 2. If user is verifying before registration
    if (!pending || pending.code !== code) {
      throw new BadRequestException('Mã xác nhận không chính xác hoặc không tồn tại');
    }

    if (new Date() > pending.expires) {
      throw new BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
    }

    pending.verified = true;

    return {
      success: true,
      message: 'Email đã được xác thực thành công! Bạn có thể tiếp tục hoàn tất đăng ký.',
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
    currentPassword: string | undefined,
    newPassword: string,
  ) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Không tìm thấy tài khoản.');
    }

    // OAuth user: no password yet — just set a new one
    if (!user.passwordHash) {
      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.usersService.updatePassword(userId, passwordHash);
      return { message: 'Đặt mật khẩu thành công.' };
    }

    // Normal user: must supply current password
    if (!currentPassword) {
      throw new BadRequestException('Vui lòng nhập mật khẩu hiện tại.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.usersService.updatePassword(
      userId,
      passwordHash,
    );

    return { message: 'Đổi mật khẩu thành công.' };
  }

  async getProfileWithStats(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const memoryCount = await this.usersService.getMemoryCount(userId);

    const {
      passwordHash,
      twoFactorSecret,
      twoFactorTempSecret,
      twoFactorBackupCodes,
      ...result
    } = user;

    return {
      ...result,
      memoryCount,
      hasPassword: !!passwordHash,
      twoFactorBackupCodesCount: twoFactorBackupCodes?.length || 0,
    };
  }

  async deactivateAccount(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.usersService.deactivateAccount(userId);

    // Invalidate all active sessions so current tokens are immediately rejected
    await this.sessionsService.deleteAllUserSessions(userId);

    return { message: 'Tài khoản đã được vô hiệu hóa thành công' };
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

  async requestEmailChange(userId: string, newEmail: string) {
    const normalizedNew = newEmail.toLowerCase().trim();

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy tài khoản.');
    }

    if (user.email.toLowerCase() === normalizedNew) {
      throw new BadRequestException('Email mới phải khác email hiện tại.');
    }

    const existingUser = await this.usersService.findByEmail(normalizedNew);
    if (existingUser) {
      throw new ConflictException('Email này đã được sử dụng bởi một tài khoản khác.');
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // ✅ FIX: Store BOTH the pending email AND the verification code in DB
    await this.usersService.setPendingEmail(userId, normalizedNew, code, expires);

    // ✅ FIX: Send the code to the NEW email (not the current one)
    await this.mailService.sendVerificationCode(normalizedNew, code, expires);

    return {
      success: true,
      message: `Mã xác nhận đã được gửi đến ${normalizedNew}. Vui lòng kiểm tra hộp thư để xác thực.`,
      newEmail: normalizedNew,
      debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
    };
  }

  async confirmEmailChange(userId: string, code: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy tài khoản.');
    }

    // ✅ FIX: Read pendingEmail from DB — never trust newEmail from request body
    const newEmail = user.pendingEmail;
    if (!newEmail) {
      throw new BadRequestException('Không có yêu cầu đổi email nào đang chờ xác nhận. Vui lòng thực hiện lại từ đầu.');
    }

    // Double-check the new email is still available (race condition guard)
    const existingUser = await this.usersService.findByEmail(newEmail);
    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException('Email này vừa được sử dụng bởi một tài khoản khác. Vui lòng chọn email khác.');
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      throw new BadRequestException('Mã xác nhận không chính xác.');
    }

    if (!user.verificationExpires || new Date() > user.verificationExpires) {
      throw new BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
    }

    // Apply the pending email change (clears pendingEmail, verificationCode, verificationExpires)
    const updatedUser = await this.usersService.updateEmail(userId, newEmail);

    // Issue a new JWT with the updated email
    const payload = { email: updatedUser.email, sub: updatedUser.id };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
        isEmailVerified: updatedUser.isEmailVerified,
      },
      message: 'Thay đổi email thành công!',
    };
  }

  // ==========================================
  // TWO-FACTOR AUTHENTICATION (2FA / TOTP)
  // ==========================================

  async generateTwoFactorSecret(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    const secret = generateSecret();
    const issuer = 'Memory Map';
    const otpauthUrl = generateURI({
      secret,
      label: user.email,
      issuer,
    });

    const qrCodeUrl = await QRCode.toDataURL(otpauthUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });

    await this.usersService.setTwoFactorTempSecret(user.id, secret);

    return {
      secret,
      qrCodeUrl,
      otpauthUrl,
    };
  }

  async enableTwoFactor(userId: string, code: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    if (!user.twoFactorTempSecret) {
      throw new BadRequestException('Chưa tạo khóa bí mật 2FA. Vui lòng tạo mã QR trước.');
    }

    const numericCode = (code || '').trim().replace(/\s+/g, '');
    const verification = verifySync({
      token: numericCode,
      secret: user.twoFactorTempSecret,
      epochTolerance: 30,
    });

    if (!verification.valid) {
      throw new BadRequestException('Mã xác thực Authenticator không chính xác hoặc đã hết hạn.');
    }

    // Generate 10 one-time backup recovery codes
    const plainBackupCodes: string[] = [];
    const hashedBackupCodes: string[] = [];

    for (let i = 0; i < 10; i++) {
      const raw = crypto.randomBytes(8).toString('hex').toUpperCase();
      const formatted = `${raw.substring(0, 4)}-${raw.substring(4, 8)}-${raw.substring(8, 12)}-${raw.substring(12, 16)}`;
      plainBackupCodes.push(formatted);
      hashedBackupCodes.push(await bcrypt.hash(formatted, 10));
    }

    await this.usersService.enableTwoFactor(
      user.id,
      user.twoFactorTempSecret,
      hashedBackupCodes,
    );

    return {
      success: true,
      message: 'Xác thực hai yếu tố (2FA) đã được kích hoạt thành công!',
      backupCodes: plainBackupCodes,
    };
  }

  async disableTwoFactor(userId: string, code?: string, password?: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException('Tài khoản chưa bật xác thực hai yếu tố.');
    }

    // Verify password if user has password set
    if (password && user.passwordHash) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        throw new BadRequestException('Mật khẩu không chính xác.');
      }
    } else if (code) {
      const isVerified = await this.verifyTwoFactorOrBackupCode(user, code);
      if (!isVerified) {
        throw new BadRequestException('Mã xác thực không chính xác.');
      }
    } else if (user.passwordHash) {
      throw new BadRequestException('Vui lòng cung cấp mật khẩu hoặc mã xác thực để tắt 2FA.');
    }

    await this.usersService.disableTwoFactor(user.id);

    return {
      success: true,
      message: 'Đã hủy kích hoạt xác thực hai yếu tố.',
    };
  }

  async getTwoFactorStatus(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }

    return {
      enabled: !!user.twoFactorEnabled,
      backupCodesCount: user.twoFactorBackupCodes?.length || 0,
      lastUsed: user.twoFactorLastUsed,
    };
  }

  async generateNewBackupCodes(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.twoFactorEnabled) {
      throw new BadRequestException('Bạn cần kích hoạt 2FA trước khi tạo mã dự phòng mới.');
    }

    const plainBackupCodes: string[] = [];
    const hashedBackupCodes: string[] = [];

    for (let i = 0; i < 10; i++) {
      const raw = crypto.randomBytes(8).toString('hex').toUpperCase();
      const formatted = `${raw.substring(0, 4)}-${raw.substring(4, 8)}-${raw.substring(8, 12)}-${raw.substring(12, 16)}`;
      plainBackupCodes.push(formatted);
      hashedBackupCodes.push(await bcrypt.hash(formatted, 10));
    }

    await this.usersService.updateTwoFactorBackupCodes(user.id, hashedBackupCodes);

    return {
      success: true,
      message: 'Đã tạo 10 mã dự phòng mới thành công.',
      backupCodes: plainBackupCodes,
    };
  }

  async verifyTwoFactorLogin(
    tempToken: string,
    code: string,
    deviceInfo?: string,
    ipAddress?: string,
    rememberMe?: boolean,
  ) {
    let payload: any;
    try {
      payload = this.jwtService.verify(tempToken);
    } catch {
      throw new UnauthorizedException('Phiên xác thực 2FA đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
    }

    if (!payload?.is2FA || !payload?.sub) {
      throw new UnauthorizedException('Token xác thực 2FA không hợp lệ.');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new UnauthorizedException('Trạng thái xác thực 2FA không hợp lệ.');
    }

    const isValid = await this.verifyTwoFactorOrBackupCode(user, code);
    if (!isValid) {
      throw new UnauthorizedException('Mã xác thực 2FA không chính xác hoặc mã dự phòng đã qua sử dụng.');
    }

    const shouldUseRememberMe = rememberMe ?? payload.rememberMe ?? false;
    const token = this.jwtService.sign({ email: user.email, sub: user.id });

    await this.sessionsService.createSession(
      user.id,
      token,
      deviceInfo,
      ipAddress,
      shouldUseRememberMe,
    );

    await this.usersService.updateTwoFactorLastUsed(user.id);

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

  private async verifyTwoFactorOrBackupCode(user: any, rawCode: string): Promise<boolean> {
    const code = (rawCode || '').trim();
    if (!code) return false;

    // 1. Try TOTP (6-digit Authenticator code)
    const numericCode = code.replace(/\s+/g, '');
    if (/^\d{6}$/.test(numericCode) && user.twoFactorSecret) {
      try {
        const verification = verifySync({
          token: numericCode,
          secret: user.twoFactorSecret,
          epochTolerance: 30,
        });
        if (verification.valid) {
          return true;
        }
      } catch {
        // Continue to backup code check
      }
    }

    // 2. Try Backup Codes
    if (user.twoFactorBackupCodes && user.twoFactorBackupCodes.length > 0) {
      const normalizedInput = code.toUpperCase();
      for (let i = 0; i < user.twoFactorBackupCodes.length; i++) {
        const hashed = user.twoFactorBackupCodes[i];
        const isMatch = await bcrypt.compare(normalizedInput, hashed);
        if (isMatch) {
          // Consume used backup code
          const remainingCodes = user.twoFactorBackupCodes.filter((_: any, idx: number) => idx !== i);
          await this.usersService.updateTwoFactorBackupCodes(user.id, remainingCodes);
          return true;
        }
      }
    }

    return false;
  }
}