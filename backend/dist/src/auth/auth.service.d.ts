import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OAuthDto } from './dto/oauth.dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly sessionsService;
    private readonly mailService;
    private readonly pendingEmailVerifications;
    constructor(usersService: UsersService, jwtService: JwtService, sessionsService: SessionsService, mailService: MailService);
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        lockedUntil: Date | null;
        loginAttempts: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        facebookId: string | null;
        googleId: string | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordExpires: Date | null;
        resetPasswordToken: string | null;
        pendingEmail: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        twoFactorTempSecret: string | null;
        twoFactorBackupCodes: string[];
        twoFactorLastUsed: Date | null;
    }>;
    login(email: string, password: string, deviceInfo?: string, ipAddress?: string, rememberMe?: boolean, twoFactorCode?: string): Promise<{
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
    register(email: string, password: string, name?: string, deviceInfo?: string, ipAddress?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
    }>;
    handleOAuth(oauthDto: OAuthDto, deviceInfo?: string, ipAddress?: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
    }>;
    sendVerificationCode(email: string): Promise<{
        success: boolean;
        message: string;
        email: string;
        debugCode: string;
    }>;
    verifyEmail(email: string, code: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        lockedUntil: Date | null;
        loginAttempts: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        facebookId: string | null;
        googleId: string | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordExpires: Date | null;
        resetPasswordToken: string | null;
        pendingEmail: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        twoFactorTempSecret: string | null;
        twoFactorBackupCodes: string[];
        twoFactorLastUsed: Date | null;
    }>;
    changePassword(userId: string, currentPassword: string | undefined, newPassword: string): Promise<{
        message: string;
    }>;
    getProfileWithStats(userId: string): Promise<{
        memoryCount: number;
        hasPassword: boolean;
        twoFactorBackupCodesCount: number;
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        createdAt: Date;
        updatedAt: Date;
        lockedUntil: Date | null;
        loginAttempts: number;
        isActive: boolean;
        lastLoginAt: Date | null;
        facebookId: string | null;
        googleId: string | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordExpires: Date | null;
        resetPasswordToken: string | null;
        pendingEmail: string | null;
        twoFactorEnabled: boolean;
        twoFactorLastUsed: Date | null;
    }>;
    deactivateAccount(userId: string): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
        email: string;
        resetLink: string;
    }>;
    verifyResetToken(token: string): Promise<{
        valid: boolean;
        email: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    requestEmailChange(userId: string, newEmail: string): Promise<{
        success: boolean;
        message: string;
        newEmail: string;
        debugCode: string;
    }>;
    confirmEmailChange(userId: string, code: string): Promise<{
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
    generateTwoFactorSecret(userId: string): Promise<{
        secret: string;
        qrCodeUrl: string;
        otpauthUrl: string;
    }>;
    enableTwoFactor(userId: string, code: string): Promise<{
        success: boolean;
        message: string;
        backupCodes: string[];
    }>;
    disableTwoFactor(userId: string, code?: string, password?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getTwoFactorStatus(userId: string): Promise<{
        enabled: boolean;
        backupCodesCount: number;
        lastUsed: Date;
    }>;
    generateNewBackupCodes(userId: string): Promise<{
        success: boolean;
        message: string;
        backupCodes: string[];
    }>;
    verifyTwoFactorLogin(tempToken: string, code: string, deviceInfo?: string, ipAddress?: string, rememberMe?: boolean): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
    }>;
    private verifyTwoFactorOrBackupCode;
}
