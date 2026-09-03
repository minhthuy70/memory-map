import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { OAuthDto } from './dto/oauth.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly sessionsService;
    constructor(usersService: UsersService, jwtService: JwtService, sessionsService: SessionsService);
    validateUser(email: string, password: string): Promise<{
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
    login(email: string, password: string, deviceInfo?: string, ipAddress?: string): Promise<{
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
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    getProfileWithStats(userId: string): Promise<{
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
    deactivateAccount(userId: string): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
