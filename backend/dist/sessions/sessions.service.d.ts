import { PrismaService } from '../prisma/prisma.service';
export declare class SessionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSession(userId: string, token: string, deviceInfo?: string, ipAddress?: string, rememberMe?: boolean): Promise<{
        id: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
    }>;
    findByToken(token: string): Promise<{
        user: {
            id: string;
            createdAt: Date;
            name: string | null;
            email: string;
            passwordHash: string | null;
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
            updatedAt: Date;
        };
    } & {
        id: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
    }>;
    updateLastActivity(token: string): Promise<{
        id: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
    }>;
    getUserSessions(userId: string): Promise<{
        id: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
    }[]>;
    deleteSession(sessionId: string): Promise<{
        id: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
    }>;
    deleteAllUserSessions(userId: string, exceptToken?: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteExpiredSessions(): Promise<import(".prisma/client").Prisma.BatchPayload>;
    deleteSessionByToken(token: string): Promise<{
        id: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
    }>;
}
