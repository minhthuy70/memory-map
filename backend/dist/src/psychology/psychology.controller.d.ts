import { PsychologyService } from './psychology.service';
export declare class PsychologyController {
    private readonly psychologyService;
    constructor(psychologyService: PsychologyService);
    getGratitudeEntries(req: any): Promise<{
        id: string;
        userId: string;
        isShared: boolean;
        createdAt: Date;
        memoryId: string | null;
        category: string;
        content: string;
    }[]>;
    createGratitudeEntry(req: any, data: any): Promise<{
        id: string;
        userId: string;
        isShared: boolean;
        createdAt: Date;
        memoryId: string | null;
        category: string;
        content: string;
    }>;
    getResilienceMoments(req: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        date: Date;
        description: string;
        difficulty: number;
        overcomeAt: Date | null;
        selfEncouragement: string | null;
    }[]>;
    createResilienceMoment(req: any, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        date: Date;
        description: string;
        difficulty: number;
        overcomeAt: Date | null;
        selfEncouragement: string | null;
    }>;
    getDailySerendipity(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        date: Date;
        viewedAt: Date | null;
        isViewed: boolean;
        moodBefore: string | null;
        moodAfter: string | null;
    }>;
    markViewed(req: any, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        date: Date;
        viewedAt: Date | null;
        isViewed: boolean;
        moodBefore: string | null;
        moodAfter: string | null;
    }>;
    getEmotionalWaveforms(req: any, startDate?: string, endDate?: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        date: Date;
        notes: string | null;
        mood: number;
        stressLevel: number;
    }[]>;
    createEmotionalWaveform(req: any, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        date: Date;
        notes: string | null;
        mood: number;
        stressLevel: number;
    }>;
    getDreamJournals(req: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        locationName: string | null;
        description: string;
        dreamDate: Date;
        isLucid: boolean;
        symbols: string;
        locationLatitude: number | null;
        locationLongitude: number | null;
    }[]>;
    createDreamJournal(req: any, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        locationName: string | null;
        description: string;
        dreamDate: Date;
        isLucid: boolean;
        symbols: string;
        locationLatitude: number | null;
        locationLongitude: number | null;
    }>;
}
