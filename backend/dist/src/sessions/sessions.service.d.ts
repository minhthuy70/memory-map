import { PrismaService } from '../prisma/prisma.service';
export declare class SessionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSession(userId: string, token: string, deviceInfo?: string, ipAddress?: string, rememberMe?: boolean): Promise<{
        id: string;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
        ipAddress: string | null;
        token: string;
        deviceInfo: string | null;
        lastActivity: Date;
    }>;
    findByToken(token: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            email: string;
            facebookId: string | null;
            googleId: string | null;
            resetPasswordToken: string | null;
            passwordHash: string | null;
            name: string | null;
            avatar: string | null;
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
        };
    } & {
        id: string;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
        ipAddress: string | null;
        token: string;
        deviceInfo: string | null;
        lastActivity: Date;
    }>;
    updateLastActivity(token: string): Promise<{
        id: string;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
        ipAddress: string | null;
        token: string;
        deviceInfo: string | null;
        lastActivity: Date;
    }>;
    getUserSessions(userId: string): Promise<{
        id: string;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
        ipAddress: string | null;
        token: string;
        deviceInfo: string | null;
        lastActivity: Date;
    }[]>;
    deleteSession(sessionId: string, userId: string): Promise<{
        message: string;
    }>;
    deleteAllUserSessions(userId: string, exceptToken?: string): Promise<{
        message: string;
        count: number;
    }>;
    deleteExpiredSessions(): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteSessionByToken(token: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
