import { PrismaService } from '../prisma/prisma.service';
export declare class GamificationService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserStats(userId: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
    }>;
    addXP(userId: string, amount: number): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
    }>;
    updateMemoryCount(userId: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
    }>;
    getBadges(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        badgeType: string;
        badgeName: string;
        rarity: string;
        progress: number;
        target: number;
        unlockedAt: Date | null;
    }[]>;
    createBadge(userId: string, badgeType: string, badgeName: string, target: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        badgeType: string;
        badgeName: string;
        rarity: string;
        progress: number;
        target: number;
        unlockedAt: Date | null;
    }>;
    updateBadgeProgress(badgeId: string, increment: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        badgeType: string;
        badgeName: string;
        rarity: string;
        progress: number;
        target: number;
        unlockedAt: Date | null;
    }>;
    getJournalingStreak(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        longestStreak: number;
        currentStreak: number;
        lastJournalDate: Date | null;
        freezeTokens: number;
        milestones: string;
    }>;
    recordJournalEntry(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        longestStreak: number;
        currentStreak: number;
        lastJournalDate: Date | null;
        freezeTokens: number;
        milestones: string;
    }>;
    getPassportStamps(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        country: string;
        city: string;
        province: string;
        stampDate: Date;
        stampDesign: string;
    }[]>;
    addPassportStamp(userId: string, country: string, city: string, province: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
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
            createdAt: Date;
            userId: string;
            completedAt: Date | null;
            challengeId: string;
            completedIndices: string;
            rewardClaimed: boolean;
        };
    }>;
    completeBingoItem(userId: string, year: number, index: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        completedAt: Date | null;
        challengeId: string;
        completedIndices: string;
        rewardClaimed: boolean;
    }>;
    private checkBingo;
    getVirtualSouvenirs(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        name: string;
        metadata: string | null;
        position: number;
        unlockedAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
    }[]>;
    unlockSouvenir(userId: string, name: string, type: string, location: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        name: string;
        metadata: string | null;
        position: number;
        unlockedAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
    }>;
    updateSouvenirPosition(id: string, userId: string, position: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        name: string;
        metadata: string | null;
        position: number;
        unlockedAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
    }>;
}
