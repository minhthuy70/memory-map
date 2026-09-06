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
            createdAt: Date;
            updatedAt: Date;
            email: string;
            passwordHash: string | null;
            name: string | null;
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
    deleteSession(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
    }>;
    deleteAllUserSessions(userId: string, exceptToken?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteExpiredSessions(): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteSessionByToken(token: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
    }>;
}
