import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    getSessions(req: any): Promise<{
        id: string;
        createdAt: Date;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        userId: string;
    }[]>;
    deleteAllSessions(req: any, authHeader: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
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
}
