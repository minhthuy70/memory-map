import { AuthService } from './auth.service';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthDto } from './dto/oauth.dto';
import { SendVerificationCodeDto, VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RequestEmailChangeDto, ConfirmEmailChangeDto } from './dto/change-email.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EnableTwoFactorDto, DisableTwoFactorDto, VerifyTwoFactorLoginDto } from './dto/two-factor.dto';
export declare class AuthController {
    private readonly authService;
    private readonly sessionsService;
    constructor(authService: AuthService, sessionsService: SessionsService);
    register(registerDto: RegisterDto, userAgent?: string, forwardedFor?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
    }>;
    login(loginDto: LoginDto, userAgent?: string, forwardedFor?: string): Promise<{
        requires2FA: boolean;
        tempToken: string;
        message: string;
        access_token?: undefined;
        user?: undefined;
    } | {
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
        requires2FA?: undefined;
        tempToken?: undefined;
        message?: undefined;
    }>;
    verify2FALogin(dto: VerifyTwoFactorLoginDto, userAgent?: string, forwardedFor?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
    }>;
    oauth(oauthDto: OAuthDto, userAgent?: string, forwardedFor?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
    }>;
    sendVerificationCode(dto: SendVerificationCodeDto): Promise<{
        success: boolean;
        message: string;
        email: string;
        debugCode: string;
    }>;
    verifyEmail(dto: VerifyEmailDto): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
        email: string;
        resetLink: string;
    }>;
    verifyResetToken(token: string): Promise<{
        valid: boolean;
        email: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(req: any): Promise<{
        memoryCount: number;
        hasPassword: boolean;
        twoFactorBackupCodesCount: number;
        id: string;
        email: string;
        facebookId: string | null;
        googleId: string | null;
        resetPasswordToken: string | null;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        lockedUntil: Date | null;
        loginAttempts: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordExpires: Date | null;
        pendingEmail: string | null;
        twoFactorEnabled: boolean;
        twoFactorLastUsed: Date | null;
        biometricEnabled: boolean;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        facebookId: string | null;
        googleId: string | null;
        resetPasswordToken: string | null;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        lockedUntil: Date | null;
        loginAttempts: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordExpires: Date | null;
        pendingEmail: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        twoFactorTempSecret: string | null;
        twoFactorBackupCodes: string[];
        twoFactorLastUsed: Date | null;
        biometricEnabled: boolean;
    }>;
    requestEmailChange(req: any, dto: RequestEmailChangeDto): Promise<{
        success: boolean;
        message: string;
        newEmail: string;
        debugCode: string;
    }>;
    confirmEmailChange(req: any, dto: ConfirmEmailChangeDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
        message: string;
    }>;
    changePassword(req: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    deactivateAccount(req: any): Promise<{
        message: string;
    }>;
    deleteAccount(req: any): Promise<{
        message: string;
    }>;
    logout(req: any, authHeader: string): Promise<{
        message: string;
    }>;
    getTwoFactorStatus(req: any): Promise<{
        enabled: boolean;
        backupCodesCount: number;
        lastUsed: Date;
    }>;
    generateTwoFactor(req: any): Promise<{
        secret: string;
        qrCodeUrl: string;
        otpauthUrl: string;
    }>;
    enableTwoFactor(req: any, dto: EnableTwoFactorDto): Promise<{
        success: boolean;
        message: string;
        backupCodes: string[];
    }>;
    disableTwoFactor(req: any, dto: DisableTwoFactorDto): Promise<{
        success: boolean;
        message: string;
    }>;
    generateBackupCodes(req: any): Promise<{
        success: boolean;
        message: string;
        backupCodes: string[];
    }>;
    getWebAuthnRegisterOptions(req: any): Promise<any>;
    verifyWebAuthnRegister(req: any, body: {
        response: any;
        deviceName?: string;
    }): Promise<{
        success: boolean;
        message: string;
        credential: {
            id: string;
            credentialId: string;
            deviceName: string;
            createdAt: Date;
        };
    }>;
    getWebAuthnLoginOptions(email?: string): Promise<any>;
    verifyWebAuthnLogin(body: {
        response: any;
        rememberMe?: boolean;
    }, userAgent?: string, forwardedFor?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
    }>;
    getWebAuthnStatus(req: any): Promise<{
        enabled: boolean;
        credentialsCount: number;
        credentials: {
            id: string;
            createdAt: Date;
            credentialId: string;
            deviceType: string;
            backedUp: boolean;
            transports: string[];
            deviceName: string;
            lastUsedAt: Date;
        }[];
    }>;
    getWebAuthnCredentials(req: any): Promise<{
        id: string;
        createdAt: Date;
        credentialId: string;
        deviceType: string;
        backedUp: boolean;
        transports: string[];
        deviceName: string;
        lastUsedAt: Date;
    }[]>;
    deleteWebAuthnCredential(req: any, credentialId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
