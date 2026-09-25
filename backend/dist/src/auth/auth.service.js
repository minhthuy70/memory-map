"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const sessions_service_1 = require("../sessions/sessions.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const otplib_1 = require("otplib");
const QRCode = __importStar(require("qrcode"));
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, sessionsService, mailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.sessionsService = sessionsService;
        this.mailService = mailService;
        this.pendingEmailVerifications = new Map();
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác.');
        }
        if (user.isActive === false) {
            throw new common_1.UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException('Tài khoản này được tạo bằng Google hoặc Facebook. Vui lòng chọn đăng nhập bằng liên kết mạng xã hội tương ứng.');
        }
        if (user.lockedUntil && new Date() < user.lockedUntil) {
            const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
            throw new common_1.UnauthorizedException(`Tài khoản đang bị khóa tạm thời. Vui lòng thử lại sau ${lockTimeRemaining} phút.`);
        }
        if (user.lockedUntil && new Date() >= user.lockedUntil) {
            await this.usersService.resetLoginAttempts(user.id);
            user.loginAttempts = 0;
            user.lockedUntil = null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (isPasswordValid) {
            if (user.loginAttempts > 0) {
                await this.usersService.resetLoginAttempts(user.id);
            }
            await this.usersService.updateLastLogin(user.id);
            const { passwordHash, ...result } = user;
            return result;
        }
        const newAttempts = user.loginAttempts + 1;
        await this.usersService.incrementLoginAttempts(user.id);
        if (newAttempts >= 5) {
            const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
            await this.usersService.lockAccount(user.id, lockUntil);
            throw new common_1.UnauthorizedException('Bạn đã nhập sai mật khẩu quá 5 lần. Tài khoản đã bị khóa trong 15 phút để bảo mật.');
        }
        const remainingAttempts = 5 - newAttempts;
        throw new common_1.UnauthorizedException(`Mật khẩu không chính xác. Bạn còn ${remainingAttempts} lần thử trước khi tài khoản bị khóa 15 phút.`);
    }
    async login(email, password, deviceInfo, ipAddress, rememberMe, twoFactorCode) {
        const user = await this.validateUser(email, password);
        if (user.twoFactorEnabled) {
            if (twoFactorCode) {
                const isVerified = await this.verifyTwoFactorOrBackupCode(user, twoFactorCode);
                if (!isVerified) {
                    throw new common_1.UnauthorizedException('Mã xác thực 2FA không chính xác hoặc mã dự phòng đã qua sử dụng.');
                }
                await this.usersService.updateTwoFactorLastUsed(user.id);
            }
            else {
                const tempToken = this.jwtService.sign({ sub: user.id, email: user.email, is2FA: true, rememberMe: !!rememberMe, jti: crypto.randomUUID() }, { expiresIn: '5m' });
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
            jti: crypto.randomUUID(),
        };
        const token = this.jwtService.sign(payload);
        await this.sessionsService.createSession(user.id, token, deviceInfo, ipAddress, rememberMe);
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
    async register(email, password, name, deviceInfo, ipAddress) {
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await this.usersService.findByEmail(normalizedEmail);
        if (existingUser) {
            throw new common_1.ConflictException('Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const pending = this.pendingEmailVerifications.get(normalizedEmail);
        const isPreVerified = pending?.verified === true;
        if (pending) {
            this.pendingEmailVerifications.delete(normalizedEmail);
        }
        const user = await this.usersService.create({
            email: normalizedEmail,
            passwordHash,
            name,
            isEmailVerified: isPreVerified,
        });
        const payload = {
            email: user.email,
            sub: user.id,
            jti: crypto.randomUUID(),
        };
        const token = this.jwtService.sign(payload);
        await this.sessionsService.createSession(user.id, token, deviceInfo, ipAddress);
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
    async handleOAuth(oauthDto, deviceInfo, ipAddress) {
        const { provider, email, name, avatar, providerId } = oauthDto;
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            if (provider === 'google') {
                user = await this.usersService.findByGoogleId(providerId);
            }
            else if (provider === 'facebook') {
                user = await this.usersService.findByFacebookId(providerId);
            }
        }
        if (user && user.isActive === false) {
            throw new common_1.UnauthorizedException('Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
        }
        if (!user) {
            user = await this.usersService.create({
                email,
                name: name || (provider === 'google' ? 'Google User' : 'Facebook User'),
                avatar,
                googleId: provider === 'google' ? providerId : undefined,
                facebookId: provider === 'facebook' ? providerId : undefined,
                isEmailVerified: true,
            });
        }
        else {
            const updateData = {};
            if (provider === 'google' && !user.googleId)
                updateData.googleId = providerId;
            if (provider === 'facebook' && !user.facebookId)
                updateData.facebookId = providerId;
            if (!user.avatar && avatar)
                updateData.avatar = avatar;
            if (!user.name && name)
                updateData.name = name;
            if (!user.isEmailVerified)
                updateData.isEmailVerified = true;
            if (Object.keys(updateData).length > 0) {
                user = await this.usersService.update(user.id, updateData);
            }
        }
        await this.usersService.resetLoginAttempts(user.id);
        await this.usersService.updateLastLogin(user.id);
        const payload = {
            email: user.email,
            sub: user.id,
            jti: crypto.randomUUID(),
        };
        const token = this.jwtService.sign(payload);
        await this.sessionsService.createSession(user.id, token, deviceInfo, ipAddress);
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
    async sendVerificationCode(email) {
        const normalizedEmail = email.toLowerCase().trim();
        let user = await this.usersService.findByEmail(normalizedEmail);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        if (user) {
            await this.usersService.setVerificationCode(normalizedEmail, code, expires);
        }
        this.pendingEmailVerifications.set(normalizedEmail, {
            code,
            expires,
            verified: false,
        });
        await this.mailService.sendVerificationCode(normalizedEmail, code, expires);
        return {
            success: true,
            message: `Mã xác nhận đã được gửi đến email ${normalizedEmail}. Vui lòng kiểm tra hộp thư.`,
            email: normalizedEmail,
            debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
        };
    }
    async verifyEmail(email, code) {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.usersService.findByEmail(normalizedEmail);
        const pending = this.pendingEmailVerifications.get(normalizedEmail);
        if (user) {
            if (!user.verificationCode || user.verificationCode !== code) {
                throw new common_1.BadRequestException('Mã xác nhận không chính xác');
            }
            if (!user.verificationExpires || new Date() > user.verificationExpires) {
                throw new common_1.BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
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
        if (!pending || pending.code !== code) {
            throw new common_1.BadRequestException('Mã xác nhận không chính xác hoặc không tồn tại');
        }
        if (new Date() > pending.expires) {
            throw new common_1.BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
        }
        pending.verified = true;
        return {
            success: true,
            message: 'Email đã được xác thực thành công! Bạn có thể tiếp tục hoàn tất đăng ký.',
        };
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const updatedUser = await this.usersService.update(userId, updateProfileDto);
        const { passwordHash, ...result } = updatedUser;
        return result;
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Không tìm thấy tài khoản.');
        }
        if (!user.passwordHash) {
            const passwordHash = await bcrypt.hash(newPassword, 10);
            await this.usersService.updatePassword(userId, passwordHash);
            return { message: 'Đặt mật khẩu thành công.' };
        }
        if (!currentPassword) {
            throw new common_1.BadRequestException('Vui lòng nhập mật khẩu hiện tại.');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Mật khẩu hiện tại không chính xác.');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.usersService.updatePassword(userId, passwordHash);
        return { message: 'Đổi mật khẩu thành công.' };
    }
    async getProfileWithStats(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const memoryCount = await this.usersService.getMemoryCount(userId);
        const { passwordHash, twoFactorSecret, twoFactorTempSecret, twoFactorBackupCodes, ...result } = user;
        return {
            ...result,
            memoryCount,
            hasPassword: !!passwordHash,
            twoFactorBackupCodesCount: twoFactorBackupCodes?.length || 0,
        };
    }
    async deactivateAccount(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.usersService.deactivateAccount(userId);
        await this.sessionsService.deleteAllUserSessions(userId);
        return { message: 'Tài khoản đã được vô hiệu hóa thành công' };
    }
    async deleteAccount(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.usersService.deleteAccount(userId);
        return { message: 'Account deleted successfully' };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy tài khoản với email này.');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000);
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
    async verifyResetToken(token) {
        const user = await this.usersService.findByResetToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Liên kết khôi phục mật khẩu không hợp lệ hoặc đã qua sử dụng.');
        }
        if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
            throw new common_1.BadRequestException('Liên kết khôi phục mật khẩu đã hết hạn (chỉ có hiệu lực trong 1 giờ). Vui lòng yêu cầu liên kết mới.');
        }
        return {
            valid: true,
            email: user.email,
        };
    }
    async resetPassword(token, newPassword) {
        const user = await this.usersService.findByResetToken(token);
        if (!user) {
            throw new common_1.BadRequestException('Liên kết khôi phục mật khẩu không hợp lệ hoặc đã qua sử dụng.');
        }
        if (!user.resetPasswordExpires || new Date() > user.resetPasswordExpires) {
            throw new common_1.BadRequestException('Liên kết khôi phục mật khẩu đã hết hạn (chỉ có hiệu lực trong 1 giờ). Vui lòng yêu cầu liên kết mới.');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.usersService.resetPasswordWithToken(user.id, passwordHash);
        return {
            success: true,
            message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bằng mật khẩu mới.',
        };
    }
    async requestEmailChange(userId, newEmail) {
        const normalizedNew = newEmail.toLowerCase().trim();
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Không tìm thấy tài khoản.');
        }
        if (user.email.toLowerCase() === normalizedNew) {
            throw new common_1.BadRequestException('Email mới phải khác email hiện tại.');
        }
        const existingUser = await this.usersService.findByEmail(normalizedNew);
        if (existingUser) {
            throw new common_1.ConflictException('Email này đã được sử dụng bởi một tài khoản khác.');
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        await this.usersService.setPendingEmail(userId, normalizedNew, code, expires);
        await this.mailService.sendVerificationCode(normalizedNew, code, expires);
        return {
            success: true,
            message: `Mã xác nhận đã được gửi đến ${normalizedNew}. Vui lòng kiểm tra hộp thư để xác thực.`,
            newEmail: normalizedNew,
            debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
        };
    }
    async confirmEmailChange(userId, code) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('Không tìm thấy tài khoản.');
        }
        const newEmail = user.pendingEmail;
        if (!newEmail) {
            throw new common_1.BadRequestException('Không có yêu cầu đổi email nào đang chờ xác nhận. Vui lòng thực hiện lại từ đầu.');
        }
        const existingUser = await this.usersService.findByEmail(newEmail);
        if (existingUser && existingUser.id !== userId) {
            throw new common_1.ConflictException('Email này vừa được sử dụng bởi một tài khoản khác. Vui lòng chọn email khác.');
        }
        if (!user.verificationCode || user.verificationCode !== code) {
            throw new common_1.BadRequestException('Mã xác nhận không chính xác.');
        }
        if (!user.verificationExpires || new Date() > user.verificationExpires) {
            throw new common_1.BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
        }
        const updatedUser = await this.usersService.updateEmail(userId, newEmail);
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
    async generateTwoFactorSecret(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại.');
        }
        const secret = (0, otplib_1.generateSecret)();
        const issuer = 'Memory Map';
        const otpauthUrl = (0, otplib_1.generateURI)({
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
    async enableTwoFactor(userId, code) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại.');
        }
        if (!user.twoFactorTempSecret) {
            throw new common_1.BadRequestException('Chưa tạo khóa bí mật 2FA. Vui lòng tạo mã QR trước.');
        }
        const numericCode = (code || '').trim().replace(/\s+/g, '');
        const verification = (0, otplib_1.verifySync)({
            token: numericCode,
            secret: user.twoFactorTempSecret,
            epochTolerance: 30,
        });
        if (!verification.valid) {
            throw new common_1.BadRequestException('Mã xác thực Authenticator không chính xác hoặc đã hết hạn.');
        }
        const plainBackupCodes = [];
        const hashedBackupCodes = [];
        for (let i = 0; i < 10; i++) {
            const raw = crypto.randomBytes(8).toString('hex').toUpperCase();
            const formatted = `${raw.substring(0, 4)}-${raw.substring(4, 8)}-${raw.substring(8, 12)}-${raw.substring(12, 16)}`;
            plainBackupCodes.push(formatted);
            hashedBackupCodes.push(await bcrypt.hash(formatted, 10));
        }
        await this.usersService.enableTwoFactor(user.id, user.twoFactorTempSecret, hashedBackupCodes);
        return {
            success: true,
            message: 'Xác thực hai yếu tố (2FA) đã được kích hoạt thành công!',
            backupCodes: plainBackupCodes,
        };
    }
    async disableTwoFactor(userId, code, password) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại.');
        }
        if (!user.twoFactorEnabled) {
            throw new common_1.BadRequestException('Tài khoản chưa bật xác thực hai yếu tố.');
        }
        if (password && user.passwordHash) {
            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
            if (!isPasswordValid) {
                throw new common_1.BadRequestException('Mật khẩu không chính xác.');
            }
        }
        else if (code) {
            const isVerified = await this.verifyTwoFactorOrBackupCode(user, code);
            if (!isVerified) {
                throw new common_1.BadRequestException('Mã xác thực không chính xác.');
            }
        }
        else if (user.passwordHash) {
            throw new common_1.BadRequestException('Vui lòng cung cấp mật khẩu hoặc mã xác thực để tắt 2FA.');
        }
        await this.usersService.disableTwoFactor(user.id);
        return {
            success: true,
            message: 'Đã hủy kích hoạt xác thực hai yếu tố.',
        };
    }
    async getTwoFactorStatus(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('Người dùng không tồn tại.');
        }
        return {
            enabled: !!user.twoFactorEnabled,
            backupCodesCount: user.twoFactorBackupCodes?.length || 0,
            lastUsed: user.twoFactorLastUsed,
        };
    }
    async generateNewBackupCodes(userId) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.twoFactorEnabled) {
            throw new common_1.BadRequestException('Bạn cần kích hoạt 2FA trước khi tạo mã dự phòng mới.');
        }
        const plainBackupCodes = [];
        const hashedBackupCodes = [];
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
    async verifyTwoFactorLogin(tempToken, code, deviceInfo, ipAddress, rememberMe) {
        let payload;
        try {
            payload = this.jwtService.verify(tempToken);
        }
        catch {
            throw new common_1.UnauthorizedException('Phiên xác thực 2FA đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
        }
        if (!payload?.is2FA || !payload?.sub) {
            throw new common_1.UnauthorizedException('Token xác thực 2FA không hợp lệ.');
        }
        const user = await this.usersService.findById(payload.sub);
        if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
            throw new common_1.UnauthorizedException('Trạng thái xác thực 2FA không hợp lệ.');
        }
        const isValid = await this.verifyTwoFactorOrBackupCode(user, code);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Mã xác thực 2FA không chính xác hoặc mã dự phòng đã qua sử dụng.');
        }
        const shouldUseRememberMe = rememberMe ?? payload.rememberMe ?? false;
        const token = this.jwtService.sign({ email: user.email, sub: user.id, jti: crypto.randomUUID() });
        await this.sessionsService.createSession(user.id, token, deviceInfo, ipAddress, shouldUseRememberMe);
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
    async verifyTwoFactorOrBackupCode(user, rawCode) {
        const code = (rawCode || '').trim();
        if (!code)
            return false;
        const numericCode = code.replace(/\s+/g, '');
        if (/^\d{6}$/.test(numericCode) && user.twoFactorSecret) {
            try {
                const verification = (0, otplib_1.verifySync)({
                    token: numericCode,
                    secret: user.twoFactorSecret,
                    epochTolerance: 30,
                });
                if (verification.valid) {
                    return true;
                }
            }
            catch {
            }
        }
        if (user.twoFactorBackupCodes && user.twoFactorBackupCodes.length > 0) {
            const normalizedInput = code.toUpperCase();
            for (let i = 0; i < user.twoFactorBackupCodes.length; i++) {
                const hashed = user.twoFactorBackupCodes[i];
                const isMatch = await bcrypt.compare(normalizedInput, hashed);
                if (isMatch) {
                    const remainingCodes = user.twoFactorBackupCodes.filter((_, idx) => idx !== i);
                    await this.usersService.updateTwoFactorBackupCodes(user.id, remainingCodes);
                    return true;
                }
            }
        }
        return false;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        sessions_service_1.SessionsService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map