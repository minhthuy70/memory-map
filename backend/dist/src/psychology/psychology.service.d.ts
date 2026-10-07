import { PrismaService } from '../prisma/prisma.service';
export declare class PsychologyService {
    private prisma;
    constructor(prisma: PrismaService);
    getGratitudeEntries(userId: string): Promise<{
        id: string;
        userId: string;
        isShared: boolean;
        createdAt: Date;
        memoryId: string | null;
        category: string;
        content: string;
    }[]>;
    createGratitudeEntry(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        isShared: boolean;
        createdAt: Date;
        memoryId: string | null;
        category: string;
        content: string;
    }>;
    getResilienceMoments(userId: string): Promise<{
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
    createResilienceMoment(userId: string, data: any): Promise<{
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
    getDailySerendipity(userId: string): Promise<{
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
    markViewed(userId: string, moodBefore: string, moodAfter: string): Promise<{
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
    getEmotionalWaveforms(userId: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        date: Date;
        notes: string | null;
        mood: number;
        stressLevel: number;
    }[]>;
    createEmotionalWaveform(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        date: Date;
        notes: string | null;
        mood: number;
        stressLevel: number;
    }>;
    getDreamJournals(userId: string): Promise<{
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
    createDreamJournal(userId: string, data: any): Promise<{
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
