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
let AuthService = class AuthService {
    constructor(usersService, jwtService, sessionsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.sessionsService = sessionsService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác.');
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
    async login(email, password, deviceInfo, ipAddress, rememberMe) {
        const user = await this.validateUser(email, password);
        const payload = {
            email: user.email,
            sub: user.id,
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
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new common_1.ConflictException('Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.');
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
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
        let user = await this.usersService.findByEmail(email);
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        if (user) {
            await this.usersService.setVerificationCode(email, code, expires);
        }
        console.log(`\n======================================================`);
        console.log(`[EMAIL VERIFICATION] Mã xác nhận cho email ${email}: ${code}`);
        console.log(`[EMAIL VERIFICATION] Hết hạn lúc: ${expires.toLocaleTimeString()}`);
        console.log(`======================================================\n`);
        return {
            success: true,
            message: `Mã xác nhận đã được gửi đến email ${email}. Vui lòng kiểm tra hộp thư.`,
            email,
            debugCode: process.env.NODE_ENV !== 'production' ? code : undefined,
        };
    }
    async verifyEmail(email, code) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy tài khoản với email này');
        }
        if (!user.verificationCode || user.verificationCode !== code) {
            throw new common_1.BadRequestException('Mã xác nhận không chính xác');
        }
        if (!user.verificationExpires || new Date() > user.verificationExpires) {
            throw new common_1.BadRequestException('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
        }
        await this.usersService.markEmailVerified(user.id);
        return {
            success: true,
            message: 'Email đã được xác thực thành công!',
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
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.passwordHash) {
            const passwordHash = await bcrypt.hash(newPassword, 10);
            await this.usersService.updatePassword(userId, passwordHash);
            return { message: 'Password set successfully' };
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.usersService.updatePassword(userId, passwordHash);
        return { message: 'Password changed successfully' };
    }
    async getProfileWithStats(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const memoryCount = await this.usersService.getMemoryCount(userId);
        const { passwordHash, ...result } = user;
        return {
            ...result,
            memoryCount,
        };
    }
    async deactivateAccount(userId) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        await this.usersService.deactivateAccount(userId);
        return { message: 'Account deactivated successfully' };
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        sessions_service_1.SessionsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map