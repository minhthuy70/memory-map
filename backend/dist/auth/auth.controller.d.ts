import { AuthService } from './auth.service';
import { SessionsService } from '../sessions/sessions.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OAuthDto } from './dto/oauth.dto';
import { SendVerificationCodeDto, VerifyEmailDto } from './dto/verify-email.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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
    getProfile(req: any): Promise<{
        memoryCount: number;
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        googleId: string | null;
        facebookId: string | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        loginAttempts: number;
        lockedUntil: Date | null;
        lastLoginAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<{
        id: string;
        email: string;
        name: string | null;
        avatar: string | null;
        googleId: string | null;
        facebookId: string | null;
        isEmailVerified: boolean;
        verificationCode: string | null;
        verificationExpires: Date | null;
        loginAttempts: number;
        lockedUntil: Date | null;
        lastLoginAt: Date | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
}
