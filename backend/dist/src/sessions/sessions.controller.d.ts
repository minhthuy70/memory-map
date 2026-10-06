import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    getSessions(req: any): Promise<{
        id: string;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
        ipAddress: string | null;
        token: string;
        deviceInfo: string | null;
        lastActivity: Date;
    }[]>;
    deleteAllSessions(req: any): Promise<{
        message: string;
        count: number;
    }>;
    deleteOtherSessions(req: any, authHeader: string): Promise<{
        message: string;
        count: number;
    }>;
    deleteSession(req: any, sessionId: string): Promise<{
        message: string;
    }>;
}
