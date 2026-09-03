import { PrismaService } from '../prisma/prisma.service';
export declare class SessionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSession(userId: string, token: string, deviceInfo?: string, ipAddress?: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        userId: string;
    }>;
    findByToken(token: string): Promise<{
        user: {
            id: string;
            email: string;
            passwordHash: string | null;
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
        };
    } & {
        id: string;
        createdAt: Date;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        userId: string;
    }>;
    updateLastActivity(token: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        userId: string;
    }>;
    getUserSessions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        userId: string;
    }[]>;
    deleteSession(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        userId: string;
    }>;
    deleteAllUserSessions(userId: string, exceptToken?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteExpiredSessions(): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteSessionByToken(token: string): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        userId: string;
    }>;
}
