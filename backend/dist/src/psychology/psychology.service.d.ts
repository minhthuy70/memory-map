import { PrismaService } from '../prisma/prisma.service';
export declare class PsychologyService {
    private prisma;
    constructor(prisma: PrismaService);
    getGratitudeEntries(userId: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        memoryId: string | null;
        isShared: boolean;
    }[]>;
    createGratitudeEntry(userId: string, data: any): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        memoryId: string | null;
        isShared: boolean;
    }>;
    getResilienceMoments(userId: string): Promise<{
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
    createResilienceMoment(userId: string, data: any): Promise<{
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
    getDailySerendipity(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        date: Date;
        viewedAt: Date | null;
        isViewed: boolean;
        moodBefore: string | null;
        moodAfter: string | null;
    }>;
    markViewed(userId: string, moodBefore: string, moodAfter: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        date: Date;
        viewedAt: Date | null;
        isViewed: boolean;
        moodBefore: string | null;
        moodAfter: string | null;
    }>;
    getEmotionalWaveforms(userId: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        mood: number;
        date: Date;
        stressLevel: number;
        notes: string | null;
    }[]>;
    createEmotionalWaveform(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        mood: number;
        date: Date;
        stressLevel: number;
        notes: string | null;
    }>;
    getDreamJournals(userId: string): Promise<{
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
    createDreamJournal(userId: string, data: any): Promise<{
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
