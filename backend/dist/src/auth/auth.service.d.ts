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
        createdAt: Date;
        name: string | null;
        email: string;
        avatar: string | null;
        googleId: string | null;
        facebookId: string | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        loginAttempts: number;
        lockedUntil: Date | null;
        lastLoginAt: Date | null;
        isActive: boolean;
        pendingEmail: string | null;
        updatedAt: Date;
    }>;
    login(email: string, password: string, deviceInfo?: string, ipAddress?: string, rememberMe?: boolean): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            isEmailVerified: boolean;
        };
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
        createdAt: Date;
        name: string | null;
        email: string;
        avatar: string | null;
        googleId: string | null;
        facebookId: string | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        loginAttempts: number;
        lockedUntil: Date | null;
        lastLoginAt: Date | null;
        isActive: boolean;
        pendingEmail: string | null;
        updatedAt: Date;
    }>;
    changePassword(userId: string, currentPassword: string | undefined, newPassword: string): Promise<{
        message: string;
    }>;
    getProfileWithStats(userId: string): Promise<{
        memoryCount: number;
        hasPassword: boolean;
        id: string;
        createdAt: Date;
        name: string | null;
        email: string;
        avatar: string | null;
        googleId: string | null;
        facebookId: string | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        resetPasswordToken: string | null;
        resetPasswordExpires: Date | null;
        loginAttempts: number;
        lockedUntil: Date | null;
        lastLoginAt: Date | null;
        isActive: boolean;
        pendingEmail: string | null;
        updatedAt: Date;
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
}
