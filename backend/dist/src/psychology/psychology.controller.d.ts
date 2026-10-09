import { PsychologyService } from './psychology.service';
export declare class PsychologyController {
    private readonly psychologyService;
    constructor(psychologyService: PsychologyService);
    getGratitudeEntries(req: any): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        category: string;
        content: string;
        isShared: boolean;
    }[]>;
    createGratitudeEntry(req: any, data: any): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        category: string;
        content: string;
        isShared: boolean;
    }>;
    getResilienceMoments(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string;
        date: Date;
        difficulty: number;
        overcomeAt: Date | null;
        selfEncouragement: string | null;
    }[]>;
    createResilienceMoment(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string;
        date: Date;
        difficulty: number;
        overcomeAt: Date | null;
        selfEncouragement: string | null;
    }>;
    getDailySerendipity(req: any): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        userId: string;
        date: Date;
        viewedAt: Date | null;
        isViewed: boolean;
        moodBefore: string | null;
        moodAfter: string | null;
    }>;
    markViewed(req: any, data: any): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        userId: string;
        date: Date;
        viewedAt: Date | null;
        isViewed: boolean;
        moodBefore: string | null;
        moodAfter: string | null;
    }>;
    getEmotionalWaveforms(req: any, startDate?: string, endDate?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        mood: number;
        date: Date;
        stressLevel: number;
        notes: string | null;
    }[]>;
    createEmotionalWaveform(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        mood: number;
        date: Date;
        stressLevel: number;
        notes: string | null;
    }>;
    getDreamJournals(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
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
        createdAt: Date;
        userId: string;
        title: string;
        locationName: string | null;
        description: string;
        dreamDate: Date;
        isLucid: boolean;
        symbols: string;
        locationLatitude: number | null;
        locationLongitude: number | null;
    }>;
}
