import { PrismaService } from '../prisma/prisma.service';
export declare class PsychologyService {
    private prisma;
    constructor(prisma: PrismaService);
    getGratitudeEntries(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        category: string;
        content: string;
        isShared: boolean;
    }[]>;
    createGratitudeEntry(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        category: string;
        content: string;
        isShared: boolean;
    }>;
    getResilienceMoments(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string;
        createdAt: Date;
        date: Date;
        difficulty: number;
        overcomeAt: Date | null;
        selfEncouragement: string | null;
    }[]>;
    createResilienceMoment(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string;
        createdAt: Date;
        date: Date;
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
        mood: number;
        date: Date;
        stressLevel: number;
        notes: string | null;
    }[]>;
    createEmotionalWaveform(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        mood: number;
        date: Date;
        stressLevel: number;
        notes: string | null;
    }>;
    getDreamJournals(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string;
        createdAt: Date;
        locationName: string | null;
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
        description: string;
        createdAt: Date;
        locationName: string | null;
        dreamDate: Date;
        isLucid: boolean;
        symbols: string;
        locationLatitude: number | null;
        locationLongitude: number | null;
    }>;
}
