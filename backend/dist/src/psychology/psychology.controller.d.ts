import { PsychologyService } from './psychology.service';
export declare class PsychologyController {
    private readonly psychologyService;
    constructor(psychologyService: PsychologyService);
    getGratitudeEntries(req: any): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        content: string;
        category: string;
        isShared: boolean;
        createdAt: Date;
    }[]>;
    createGratitudeEntry(req: any, data: any): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        content: string;
        category: string;
        isShared: boolean;
        createdAt: Date;
    }>;
    getResilienceMoments(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        description: string;
        date: Date;
        difficulty: number;
        overcomeAt: Date | null;
        selfEncouragement: string | null;
    }[]>;
    createResilienceMoment(req: any, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        description: string;
        date: Date;
        difficulty: number;
        overcomeAt: Date | null;
        selfEncouragement: string | null;
    }>;
    getDailySerendipity(req: any): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        date: Date;
        viewedAt: Date | null;
        isViewed: boolean;
        moodBefore: string | null;
        moodAfter: string | null;
    }>;
    markViewed(req: any, data: any): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
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
        mood: number;
        stressLevel: number;
        notes: string | null;
    }[]>;
    createEmotionalWaveform(req: any, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        date: Date;
        mood: number;
        stressLevel: number;
        notes: string | null;
    }>;
    getDreamJournals(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        description: string;
        dreamDate: Date;
        isLucid: boolean;
        symbols: string;
        locationLatitude: number | null;
        locationLongitude: number | null;
        locationName: string | null;
    }[]>;
    createDreamJournal(req: any, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        description: string;
        dreamDate: Date;
        isLucid: boolean;
        symbols: string;
        locationLatitude: number | null;
        locationLongitude: number | null;
        locationName: string | null;
    }>;
}
