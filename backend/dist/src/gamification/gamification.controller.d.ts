import { GamificationService } from './gamification.service';
import { UpdateFogOfWarDto, ExploreAreaDto } from './dto/fog-of-war.dto';
import { CreateGeocacheDto, UpdateGeocacheDto, CreateGeocacheLogDto } from './dto/geocache.dto';
import { CreateARTreasureChestDto, UpdateARTreasureChestDto, UnlockARTreasureChestDto } from './dto/ar-treasure-chest.dto';
import { CreateTravelLeaderboardDto, UpdateTravelLeaderboardDto, CreateLeaderboardEntryDto, UpdateLeaderboardEntryDto } from './dto/travel-leaderboard.dto';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
    getUserStats(req: any): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
    }>;
    addXP(req: any, body: {
        amount: number;
    }): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
    }>;
    updateMemoryCount(req: any): Promise<{
        id: string;
        updatedAt: Date;
        userId: string;
        xp: number;
        level: number;
        totalMemories: number;
        totalPhotos: number;
        totalDistance: number;
        locationsVisited: number;
        streakDays: number;
        longestStreak: number;
    }>;
    getBadges(req: any): Promise<{
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
    createBadge(req: any, body: {
        badgeType: string;
        badgeName: string;
        target: number;
    }): Promise<{
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
    updateBadgeProgress(id: string, body: {
        increment: number;
    }): Promise<{
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
    getJournalingStreak(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        longestStreak: number;
        currentStreak: number;
        lastJournalDate: Date | null;
        freezeTokens: number;
        milestones: string;
    }>;
    recordJournalEntry(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        longestStreak: number;
        currentStreak: number;
        lastJournalDate: Date | null;
        freezeTokens: number;
        milestones: string;
    }>;
    getPassportStamps(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
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
        createdAt: Date;
        userId: string;
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
            createdAt: Date;
            userId: string;
            completedAt: Date | null;
            challengeId: string;
            completedIndices: string;
            rewardClaimed: boolean;
        };
    }>;
    completeBingoItem(req: any, year: string, body: {
        index: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        completedAt: Date | null;
        challengeId: string;
        completedIndices: string;
        rewardClaimed: boolean;
    }>;
    getVirtualSouvenirs(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        position: number;
        metadata: string | null;
        unlockedAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
    }[]>;
    unlockSouvenir(req: any, body: {
        name: string;
        type: string;
        location: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        position: number;
        metadata: string | null;
        unlockedAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
    }>;
    updateSouvenirPosition(id: string, req: any, body: {
        position: number;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        position: number;
        metadata: string | null;
        unlockedAt: Date;
        type: string;
        location: string;
        isDisplayed: boolean;
    }>;
    getFogOfWarMap(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        exploredAreas: string;
        totalAreaExplored: number;
        worldPercentage: number;
        lastExploreLocation: string | null;
        lastExploreAt: Date | null;
    }>;
    updateFogOfWarMap(req: any, dto: UpdateFogOfWarDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        exploredAreas: string;
        totalAreaExplored: number;
        worldPercentage: number;
        lastExploreLocation: string | null;
        lastExploreAt: Date | null;
    }>;
    exploreArea(req: any, dto: ExploreAreaDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        exploredAreas: string;
        totalAreaExplored: number;
        worldPercentage: number;
        lastExploreLocation: string | null;
        lastExploreAt: Date | null;
    }>;
    getGeocaches(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        latitude: number;
        longitude: number;
        description: string;
        difficulty: number;
        terrain: number;
        size: string;
        riddle: string | null;
        hint: string | null;
        isPublished: boolean;
    }[]>;
    getPublishedGeocaches(): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        latitude: number;
        longitude: number;
        description: string;
        difficulty: number;
        terrain: number;
        size: string;
        riddle: string | null;
        hint: string | null;
        isPublished: boolean;
    }[]>;
    createGeocache(req: any, dto: CreateGeocacheDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        latitude: number;
        longitude: number;
        description: string;
        difficulty: number;
        terrain: number;
        size: string;
        riddle: string | null;
        hint: string | null;
        isPublished: boolean;
    }>;
    updateGeocache(id: string, req: any, dto: UpdateGeocacheDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        latitude: number;
        longitude: number;
        description: string;
        difficulty: number;
        terrain: number;
        size: string;
        riddle: string | null;
        hint: string | null;
        isPublished: boolean;
    }>;
    deleteGeocache(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        latitude: number;
        longitude: number;
        description: string;
        difficulty: number;
        terrain: number;
        size: string;
        riddle: string | null;
        hint: string | null;
        isPublished: boolean;
    }>;
    logGeocache(id: string, req: any, dto: CreateGeocacheLogDto): Promise<{
        id: string;
        userId: string;
        message: string | null;
        username: string;
        logType: string;
        loggedAt: Date;
        geocacheId: string;
    }>;
    getGeocacheLogs(id: string): Promise<{
        id: string;
        userId: string;
        message: string | null;
        username: string;
        logType: string;
        loggedAt: Date;
        geocacheId: string;
    }[]>;
    getARTreasureChests(req: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        latitude: number;
        longitude: number;
        locationName: string;
        unlockedAt: Date | null;
        contentType: string;
        contentData: string;
        isUnlocked: boolean;
    }[]>;
    createARTreasureChest(req: any, dto: CreateARTreasureChestDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        latitude: number;
        longitude: number;
        locationName: string;
        unlockedAt: Date | null;
        contentType: string;
        contentData: string;
        isUnlocked: boolean;
    }>;
    updateARTreasureChest(id: string, req: any, dto: UpdateARTreasureChestDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        latitude: number;
        longitude: number;
        locationName: string;
        unlockedAt: Date | null;
        contentType: string;
        contentData: string;
        isUnlocked: boolean;
    }>;
    unlockARTreasureChest(req: any, dto: UnlockARTreasureChestDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        latitude: number;
        longitude: number;
        locationName: string;
        unlockedAt: Date | null;
        contentType: string;
        contentData: string;
        isUnlocked: boolean;
    }>;
    getTravelLeaderboards(circleId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        type: string;
        circleId: string;
        period: string;
    }[]>;
    createTravelLeaderboard(dto: CreateTravelLeaderboardDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        type: string;
        circleId: string;
        period: string;
    }>;
    updateTravelLeaderboard(id: string, dto: UpdateTravelLeaderboardDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        isActive: boolean;
        type: string;
        circleId: string;
        period: string;
    }>;
    getLeaderboardEntries(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        leaderboardId: string;
        score: number;
        rank: number;
        periodStart: Date;
        periodEnd: Date;
    }[]>;
    createLeaderboardEntry(req: any, dto: CreateLeaderboardEntryDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        leaderboardId: string;
        score: number;
        rank: number;
        periodStart: Date;
        periodEnd: Date;
    }>;
    updateLeaderboardEntry(id: string, req: any, dto: UpdateLeaderboardEntryDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        leaderboardId: string;
        score: number;
        rank: number;
        periodStart: Date;
        periodEnd: Date;
    }>;
}
