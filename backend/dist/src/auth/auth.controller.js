"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const sessions_service_1 = require("../sessions/sessions.service");
const register_dto_1 = require("./dto/register.dto");
const login_dto_1 = require("./dto/login.dto");
const oauth_dto_1 = require("./dto/oauth.dto");
const verify_email_dto_1 = require("./dto/verify-email.dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const change_email_dto_1 = require("./dto/change-email.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const two_factor_dto_1 = require("./dto/two-factor.dto");
let AuthController = class AuthController {
    constructor(authService, sessionsService) {
        this.authService = authService;
        this.sessionsService = sessionsService;
    }
    async register(registerDto, userAgent, forwardedFor) {
        const deviceInfo = userAgent || 'Unknown Device';
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP';
        return this.authService.register(registerDto.email, registerDto.password, registerDto.name, deviceInfo, ipAddress);
    }
    async login(loginDto, userAgent, forwardedFor) {
        const deviceInfo = userAgent || 'Unknown Device';
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP';
        return this.authService.login(loginDto.email, loginDto.password, deviceInfo, ipAddress, loginDto.rememberMe, loginDto.twoFactorCode);
    }
    async verify2FALogin(dto, userAgent, forwardedFor) {
        const deviceInfo = userAgent || 'Unknown Device';
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP';
        return this.authService.verifyTwoFactorLogin(dto.tempToken, dto.code, deviceInfo, ipAddress, dto.rememberMe);
    }
    async oauth(oauthDto, userAgent, forwardedFor) {
        const deviceInfo = userAgent || 'Unknown Device';
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP';
        return this.authService.handleOAuth(oauthDto, deviceInfo, ipAddress);
    }
    async sendVerificationCode(dto) {
        return this.authService.sendVerificationCode(dto.email);
    }
    async verifyEmail(dto) {
        return this.authService.verifyEmail(dto.email, dto.code);
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto.email);
    }
    async verifyResetToken(token) {
        return this.authService.verifyResetToken(token);
    }
    async resetPassword(dto) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }
    async getProfile(req) {
        const user = await this.authService.getProfileWithStats(req.user.id);
        return user;
    }
    async updateProfile(req, updateProfileDto) {
        return this.authService.updateProfile(req.user.id, updateProfileDto);
    }
    async requestEmailChange(req, dto) {
        return this.authService.requestEmailChange(req.user.id, dto.newEmail);
    }
    async confirmEmailChange(req, dto) {
        return this.authService.confirmEmailChange(req.user.id, dto.code);
    }
    async changePassword(req, changePasswordDto) {
        return this.authService.changePassword(req.user.id, changePasswordDto.currentPassword, changePasswordDto.newPassword);
    }
    async deactivateAccount(req) {
        return this.authService.deactivateAccount(req.user.id);
    }
    async deleteAccount(req) {
        return this.authService.deleteAccount(req.user.id);
    }
    async logout(req, authHeader) {
        const token = authHeader?.replace('Bearer ', '');
        await this.sessionsService.deleteSessionByToken(token);
        return { message: 'Logged out successfully' };
    }
    async getTwoFactorStatus(req) {
        return this.authService.getTwoFactorStatus(req.user.id);
    }
    async generateTwoFactor(req) {
        return this.authService.generateTwoFactorSecret(req.user.id);
    }
    async enableTwoFactor(req, dto) {
        return this.authService.enableTwoFactor(req.user.id, dto.code);
    }
    async disableTwoFactor(req, dto) {
        return this.authService.disableTwoFactor(req.user.id, dto.code, dto.password);
    }
    async generateBackupCodes(req) {
        return this.authService.generateNewBackupCodes(req.user.id);
    }
    async getWebAuthnRegisterOptions(req) {
        return this.authService.generateWebAuthnRegistrationOptions(req.user.id);
    }
    async verifyWebAuthnRegister(req, body) {
        return this.authService.verifyWebAuthnRegistration(req.user.id, body);
    }
    async getWebAuthnLoginOptions(email) {
        return this.authService.generateWebAuthnLoginOptions(email);
    }
    async verifyWebAuthnLogin(body, userAgent, forwardedFor) {
        const deviceInfo = userAgent || 'Unknown Device (Biometric)';
        const ipAddress = forwardedFor?.split(',')[0]?.trim() || 'Unknown IP';
        return this.authService.verifyWebAuthnLogin({
            response: body.response,
            rememberMe: body.rememberMe,
            deviceInfo,
            ipAddress,
        });
    }
    async getWebAuthnStatus(req) {
        return this.authService.getWebAuthnStatus(req.user.id);
    }
    async getWebAuthnCredentials(req) {
        return this.authService.getWebAuthnCredentials(req.user.id);
    }
    async deleteWebAuthnCredential(req, credentialId) {
        return this.authService.deleteWebAuthnCredential(req.user.id, credentialId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Headers)('x-forwarded-for')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Headers)('x-forwarded-for')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    (0, common_1.Post)('2fa/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Headers)('x-forwarded-for')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [two_factor_dto_1.VerifyTwoFactorLoginDto, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2FALogin", null);
__decorate([
    (0, common_1.Post)('oauth'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Headers)('x-forwarded-for')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [oauth_dto_1.OAuthDto, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "oauth", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, common_1.Post)('send-verification-code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.SendVerificationCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "sendVerificationCode", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_email_dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60000 } }),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Get)('verify-reset-token'),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyResetToken", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('profile'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('request-email-change'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_email_dto_1.RequestEmailChangeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestEmailChange", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('confirm-email-change'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_email_dto_1.ConfirmEmailChangeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmailChange", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('deactivate-account'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deactivateAccount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('delete-account'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('2fa/status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getTwoFactorStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/generate'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateTwoFactor", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/enable'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, two_factor_dto_1.EnableTwoFactorDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "enableTwoFactor", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/disable'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, two_factor_dto_1.DisableTwoFactorDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableTwoFactor", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('2fa/backup-codes'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "generateBackupCodes", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('webauthn/register-options'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getWebAuthnRegisterOptions", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('webauthn/register-verify'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyWebAuthnRegister", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 15, ttl: 60000 } }),
    (0, common_1.Post)('webauthn/login-options'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getWebAuthnLoginOptions", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 15, ttl: 60000 } }),
    (0, common_1.Post)('webauthn/login-verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('user-agent')),
    __param(2, (0, common_1.Headers)('x-forwarded-for')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyWebAuthnLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('webauthn/status'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getWebAuthnStatus", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('webauthn/credentials'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getWebAuthnCredentials", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('webauthn/credentials/:id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteWebAuthnCredential", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        sessions_service_1.SessionsService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map