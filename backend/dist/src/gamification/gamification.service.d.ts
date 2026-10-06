import { PrismaService } from '../prisma/prisma.service';
export declare class GamificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserStats(userId: string): Promise<{
        id: string;
        userId: string;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
        updatedAt: Date;
    }>;
    addXP(userId: string, amount: number): Promise<{
        id: string;
        userId: string;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
        updatedAt: Date;
    }>;
    updateMemoryCount(userId: string): Promise<{
        id: string;
        userId: string;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
        updatedAt: Date;
    }>;
    getBadges(userId: string): Promise<{
        id: string;
        userId: string;
        badgeType: string;
        badgeName: string;
        rarity: string;
        progress: number;
        target: number;
        unlockedAt: Date | null;
        createdAt: Date;
    }[]>;
    createBadge(userId: string, badgeType: string, badgeName: string, target: number): Promise<{
        id: string;
        userId: string;
        badgeType: string;
        badgeName: string;
        rarity: string;
        progress: number;
        target: number;
        unlockedAt: Date | null;
        createdAt: Date;
    }>;
    updateBadgeProgress(badgeId: string, increment: number): Promise<{
        id: string;
        userId: string;
        badgeType: string;
        badgeName: string;
        rarity: string;
        progress: number;
        target: number;
        unlockedAt: Date | null;
        createdAt: Date;
    }>;
    getJournalingStreak(userId: string): Promise<{
        id: string;
        userId: string;
        longestStreak: number;
        updatedAt: Date;
        createdAt: Date;
        currentStreak: number;
        lastJournalDate: Date | null;
        freezeTokens: number;
        milestones: string;
    }>;
    recordJournalEntry(userId: string): Promise<{
        id: string;
        userId: string;
        longestStreak: number;
        updatedAt: Date;
        createdAt: Date;
        currentStreak: number;
        lastJournalDate: Date | null;
        freezeTokens: number;
        milestones: string;
    }>;
    getPassportStamps(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        country: string;
        city: string;
        province: string;
        stampDate: Date;
        stampDesign: string;
    }[]>;
    addPassportStamp(userId: string, country: string, city: string, province: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        country: string;
        city: string;
        province: string;
        stampDate: Date;
        stampDesign: string;
    }>;
    getBingoChallenge(year: number): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        year: number;
        challenges: string;
    }>;
    getBingoCompletion(userId: string, year: number): Promise<{
        challenge: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            year: number;
            challenges: string;
        };
        completion: {
            id: string;
            userId: string;
            createdAt: Date;
            challengeId: string;
            completedIndices: string;
            completedAt: Date | null;
            rewardClaimed: boolean;
        };
    }>;
    completeBingoItem(userId: string, year: number, index: number): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeId: string;
        completedIndices: string;
        completedAt: Date | null;
        rewardClaimed: boolean;
    }>;
    private checkBingo;
    getVirtualSouvenirs(userId: string): Promise<{
        id: string;
        userId: string;
        name: string;
        unlockedAt: Date;
        createdAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
        position: number;
        metadata: string | null;
    }[]>;
    unlockSouvenir(userId: string, name: string, type: string, location: string): Promise<{
        id: string;
        userId: string;
        name: string;
        unlockedAt: Date;
        createdAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
        position: number;
        metadata: string | null;
    }>;
    updateSouvenirPosition(id: string, userId: string, position: number): Promise<{
        id: string;
        userId: string;
        name: string;
        unlockedAt: Date;
        createdAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
        position: number;
        metadata: string | null;
    }>;
}
