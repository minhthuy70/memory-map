import { PrismaService } from '../prisma/prisma.service';
export declare class PsychologyService {
    private prisma;
    constructor(prisma: PrismaService);
    getGratitudeEntries(userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        content: string;
        category: string;
        isShared: boolean;
        createdAt: Date;
    }[]>;
    createGratitudeEntry(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        content: string;
        category: string;
        isShared: boolean;
        createdAt: Date;
    }>;
    getResilienceMoments(userId: string): Promise<{
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
    createResilienceMoment(userId: string, data: any): Promise<{
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
    getDailySerendipity(userId: string): Promise<{
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
    markViewed(userId: string, moodBefore: string, moodAfter: string): Promise<{
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
    getEmotionalWaveforms(userId: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        date: Date;
        mood: number;
        stressLevel: number;
        notes: string | null;
    }[]>;
    createEmotionalWaveform(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        date: Date;
        mood: number;
        stressLevel: number;
        notes: string | null;
    }>;
    getDreamJournals(userId: string): Promise<{
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
    createDreamJournal(userId: string, data: any): Promise<{
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
