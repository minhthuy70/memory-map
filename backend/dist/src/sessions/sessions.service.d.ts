import { PrismaService } from '../prisma/prisma.service';
export declare class SessionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSession(userId: string, token: string, deviceInfo?: string, ipAddress?: string, rememberMe?: boolean): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
    }>;
    findByToken(token: string): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string | null;
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
            biometricEnabled: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
    }>;
    updateLastActivity(token: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
    }>;
    getUserSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
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
