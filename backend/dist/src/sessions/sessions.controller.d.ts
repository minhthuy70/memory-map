import { SessionsService } from './sessions.service';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    getSessions(req: any): Promise<{
        id: string;
        token: string;
        deviceInfo: string | null;
        ipAddress: string | null;
        lastActivity: Date;
        expiresAt: Date;
        createdAt: Date;
        userId: string;
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
