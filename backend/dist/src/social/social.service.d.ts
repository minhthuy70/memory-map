import { PrismaService } from '../prisma/prisma.service';
import * as dto from './dto/social.dto';
export declare class SocialService {
    private prisma;
    constructor(prisma: PrismaService);
    getReactions(memoryId: string): Promise<({
        user: {
            id: string;
            username: never;
            avatarUrl: never;
        };
    } & {
        id: string;
        userId: string;
        memoryId: string;
        reactionType: string;
        createdAt: Date;
    })[]>;
    addReaction(userId: string, memoryId: string, reactionType: string): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        reactionType: string;
        createdAt: Date;
    }>;
    getComments(memoryId: string): Promise<({
        user: {
            id: string;
            username: never;
            avatarUrl: never;
        };
        replies: never;
    } & {
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
    })[]>;
    createComment(userId: string, memoryId: string, content: string, parentId?: string): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
    }>;
    deleteComment(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
    }>;
    getCircles(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                username: never;
                avatarUrl: never;
            };
        } & {
            id: string;
            userId: string;
            circleId: string;
            role: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isPublic: boolean;
    })[]>;
    createCircle(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isPublic: boolean;
    }>;
    addCircleMember(circleId: string, userId: string, newMemberId: string): Promise<{
        id: string;
        userId: string;
        circleId: string;
        role: string;
        joinedAt: Date;
    }>;
    getSharedAlbums(userId: string): Promise<({
        circle: {
            id: string;
            userId: string;
            createdAt: Date;
            name: string;
            description: string | null;
            isPublic: boolean;
        };
        contributors: ({
            user: {
                id: string;
                username: never;
                avatarUrl: never;
            };
        } & {
            id: string;
            userId: string;
            joinedAt: Date;
            albumId: string;
            permission: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublic: boolean;
        circleId: string | null;
        title: string;
    })[]>;
    createSharedAlbum(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublic: boolean;
        circleId: string | null;
        title: string;
    }>;
    addAlbumContributor(albumId: string, userId: string, newContributorId: string, permission: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        albumId: string;
        permission: string;
    }>;
    getStories(userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        mediaUrl: string;
        location: string | null;
        privacy: string;
        stickers: string | null;
        musicUrl: string | null;
        viewCount: number;
        expiresAt: Date;
    }[]>;
    createStory(userId: string, dto: dto.CreateMemoryStoryDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        mediaUrl: string;
        location: string | null;
        privacy: string;
        stickers: string | null;
        musicUrl: string | null;
        viewCount: number;
        expiresAt: Date;
    }>;
    updateStory(id: string, userId: string, dto: dto.UpdateMemoryStoryDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        mediaUrl: string;
        location: string | null;
        privacy: string;
        stickers: string | null;
        musicUrl: string | null;
        viewCount: number;
        expiresAt: Date;
    }>;
    deleteStory(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        mediaUrl: string;
        location: string | null;
        privacy: string;
        stickers: string | null;
        musicUrl: string | null;
        viewCount: number;
        expiresAt: Date;
    }>;
    getCommunityFeeds(userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        category: string | null;
        mood: string | null;
        popularity: number;
        isSafe: boolean;
    }[]>;
    createCommunityFeed(userId: string, dto: dto.CreateCommunityMapFeedDto): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        category: string | null;
        mood: string | null;
        popularity: number;
        isSafe: boolean;
    }>;
    updateCommunityFeed(id: string, userId: string, dto: dto.UpdateCommunityMapFeedDto): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        category: string | null;
        mood: string | null;
        popularity: number;
        isSafe: boolean;
    }>;
    deleteCommunityFeed(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        category: string | null;
        mood: string | null;
        popularity: number;
        isSafe: boolean;
    }>;
    getNearbyPings(userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        friendId: string;
        distance: number;
        enabled: boolean;
        threshold: number;
    }[]>;
    createNearbyPing(userId: string, dto: dto.CreateNearbyFriendsPingDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        friendId: string;
        distance: number;
        enabled: boolean;
        threshold: number;
    }>;
    updateNearbyPing(id: string, userId: string, dto: dto.UpdateNearbyFriendsPingDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        friendId: string;
        distance: number;
        enabled: boolean;
        threshold: number;
    }>;
    deleteNearbyPing(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        friendId: string;
        distance: number;
        enabled: boolean;
        threshold: number;
    }>;
    getCoPresenceSuggestions(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        detectedUsers: string;
        suggestedAt: Date;
    }[]>;
    createCoPresenceSuggestion(userId: string, dto: dto.CreateCoPresenceSuggestionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        detectedUsers: string;
        suggestedAt: Date;
    }>;
    deleteCoPresenceSuggestion(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        detectedUsers: string;
        suggestedAt: Date;
    }>;
    getExplorationChallenges(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeType: string;
        targetCount: number;
        progress: number;
        completedAt: Date | null;
        badgeUrl: string | null;
    }[]>;
    createExplorationChallenge(userId: string, dto: dto.CreateExplorationChallengeDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeType: string;
        targetCount: number;
        progress: number;
        completedAt: Date | null;
        badgeUrl: string | null;
    }>;
    updateExplorationChallenge(id: string, userId: string, dto: dto.UpdateExplorationChallengeDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeType: string;
        targetCount: number;
        progress: number;
        completedAt: Date | null;
        badgeUrl: string | null;
    }>;
    deleteExplorationChallenge(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeType: string;
        targetCount: number;
        progress: number;
        completedAt: Date | null;
        badgeUrl: string | null;
    }>;
    getMemoryContests(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        description: string;
        title: string;
        badgeUrl: string | null;
        theme: string;
        submissionIds: string;
        deadline: Date;
        votingEndsAt: Date;
        winnerId: string | null;
    }[]>;
    createMemoryContest(userId: string, dto: dto.CreateMemoryContestDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        description: string;
        title: string;
        badgeUrl: string | null;
        theme: string;
        submissionIds: string;
        deadline: Date;
        votingEndsAt: Date;
        winnerId: string | null;
    }>;
    updateMemoryContest(id: string, userId: string, dto: dto.UpdateMemoryContestDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        description: string;
        title: string;
        badgeUrl: string | null;
        theme: string;
        submissionIds: string;
        deadline: Date;
        votingEndsAt: Date;
        winnerId: string | null;
    }>;
    deleteMemoryContest(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        description: string;
        title: string;
        badgeUrl: string | null;
        theme: string;
        submissionIds: string;
        deadline: Date;
        votingEndsAt: Date;
        winnerId: string | null;
    }>;
    getDigitalPostcards(userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        recipientEmail: string;
        message: string;
        stampUrl: string | null;
        postcardUrl: string;
        openedAt: Date | null;
    }[]>;
    createDigitalPostcard(userId: string, dto: dto.CreateDigitalPostcardDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        recipientEmail: string;
        message: string;
        stampUrl: string | null;
        postcardUrl: string;
        openedAt: Date | null;
    }>;
    markPostcardOpened(id: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        recipientEmail: string;
        message: string;
        stampUrl: string | null;
        postcardUrl: string;
        openedAt: Date | null;
    }>;
    deleteDigitalPostcard(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        recipientEmail: string;
        message: string;
        stampUrl: string | null;
        postcardUrl: string;
        openedAt: Date | null;
    }>;
    getMemoryPenpals(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        penpalId: string;
        language: string;
        interests: string;
        isAnonymous: boolean;
        status: string;
    }[]>;
    createMemoryPenpal(userId: string, dto: dto.CreateMemoryPenpalDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        penpalId: string;
        language: string;
        interests: string;
        isAnonymous: boolean;
        status: string;
    }>;
    updateMemoryPenpal(id: string, userId: string, dto: dto.UpdateMemoryPenpalDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        penpalId: string;
        language: string;
        interests: string;
        isAnonymous: boolean;
        status: string;
    }>;
    deleteMemoryPenpal(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        penpalId: string;
        language: string;
        interests: string;
        isAnonymous: boolean;
        status: string;
    }>;
}
