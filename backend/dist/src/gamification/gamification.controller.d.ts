import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getUserStats(req: any): Promise<{
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
    addXP(req: any, body: {
        amount: number;
    }): Promise<{
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
    updateMemoryCount(req: any): Promise<{
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
    getBadges(req: any): Promise<{
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
    createBadge(req: any, body: {
        badgeType: string;
        badgeName: string;
        target: number;
    }): Promise<{
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
    updateBadgeProgress(id: string, body: {
        increment: number;
    }): Promise<{
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
    getJournalingStreak(req: any): Promise<{
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
    recordJournalEntry(req: any): Promise<{
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
    getPassportStamps(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        country: string;
        city: string;
        province: string;
        stampDate: Date;
        stampDesign: string;
    }[]>;
    addPassportStamp(req: any, body: {
        country: string;
        city: string;
        province: string;
    }): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        country: string;
        city: string;
        province: string;
        stampDate: Date;
        stampDesign: string;
    }>;
    getBingoCompletion(req: any, year: string): Promise<{
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
    completeBingoItem(req: any, year: string, body: {
        index: number;
    }): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeId: string;
        completedIndices: string;
        completedAt: Date | null;
        rewardClaimed: boolean;
    }>;
    getVirtualSouvenirs(req: any): Promise<{
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
    unlockSouvenir(req: any, body: {
        name: string;
        type: string;
        location: string;
    }): Promise<{
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
    updateSouvenirPosition(id: string, req: any, body: {
        position: number;
    }): Promise<{
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
