import { SocialService } from './social.service';
import * as dto from './dto/social.dto';
export declare class SocialController {
    private readonly socialService;
    constructor(socialService: SocialService);
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
    addReaction(req: any, data: any): Promise<{
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
    createComment(req: any, data: any): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
    }>;
    deleteComment(req: any, id: string): Promise<{
        id: string;
        userId: string;
        memoryId: string;
        createdAt: Date;
        updatedAt: Date;
        parentId: string | null;
        content: string;
    }>;
    getCircles(req: any): Promise<({
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
    createCircle(req: any, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        name: string;
        description: string | null;
        isPublic: boolean;
    }>;
    addCircleMember(req: any, circleId: string, data: any): Promise<{
        id: string;
        userId: string;
        circleId: string;
        role: string;
        joinedAt: Date;
    }>;
    getSharedAlbums(req: any): Promise<({
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
    createSharedAlbum(req: any, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isPublic: boolean;
        circleId: string | null;
        title: string;
    }>;
    addAlbumContributor(req: any, albumId: string, data: any): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        albumId: string;
        permission: string;
    }>;
    getStories(req: any): Promise<{
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
    createStory(req: any, dto: dto.CreateMemoryStoryDto): Promise<{
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
    updateStory(req: any, id: string, dto: dto.UpdateMemoryStoryDto): Promise<{
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
    deleteStory(req: any, id: string): Promise<{
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
    getCommunityFeeds(req: any): Promise<{
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
    createCommunityFeed(req: any, dto: dto.CreateCommunityMapFeedDto): Promise<{
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
    updateCommunityFeed(req: any, id: string, dto: dto.UpdateCommunityMapFeedDto): Promise<{
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
    deleteCommunityFeed(req: any, id: string): Promise<{
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
    getNearbyPings(req: any): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        friendId: string;
        distance: number;
        enabled: boolean;
        threshold: number;
    }[]>;
    createNearbyPing(req: any, dto: dto.CreateNearbyFriendsPingDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        friendId: string;
        distance: number;
        enabled: boolean;
        threshold: number;
    }>;
    updateNearbyPing(req: any, id: string, dto: dto.UpdateNearbyFriendsPingDto): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        friendId: string;
        distance: number;
        enabled: boolean;
        threshold: number;
    }>;
    deleteNearbyPing(req: any, id: string): Promise<{
        id: string;
        userId: string;
        memoryId: string | null;
        createdAt: Date;
        friendId: string;
        distance: number;
        enabled: boolean;
        threshold: number;
    }>;
    getCoPresenceSuggestions(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        detectedUsers: string;
        suggestedAt: Date;
    }[]>;
    createCoPresenceSuggestion(req: any, dto: dto.CreateCoPresenceSuggestionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        detectedUsers: string;
        suggestedAt: Date;
    }>;
    deleteCoPresenceSuggestion(req: any, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        location: string;
        latitude: number;
        longitude: number;
        detectedUsers: string;
        suggestedAt: Date;
    }>;
    getExplorationChallenges(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeType: string;
        targetCount: number;
        progress: number;
        completedAt: Date | null;
        badgeUrl: string | null;
    }[]>;
    createExplorationChallenge(req: any, dto: dto.CreateExplorationChallengeDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeType: string;
        targetCount: number;
        progress: number;
        completedAt: Date | null;
        badgeUrl: string | null;
    }>;
    updateExplorationChallenge(req: any, id: string, dto: dto.UpdateExplorationChallengeDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeType: string;
        targetCount: number;
        progress: number;
        completedAt: Date | null;
        badgeUrl: string | null;
    }>;
    deleteExplorationChallenge(req: any, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        challengeType: string;
        targetCount: number;
        progress: number;
        completedAt: Date | null;
        badgeUrl: string | null;
    }>;
    getMemoryContests(req: any): Promise<{
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
    createMemoryContest(req: any, dto: dto.CreateMemoryContestDto): Promise<{
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
    updateMemoryContest(req: any, id: string, dto: dto.UpdateMemoryContestDto): Promise<{
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
    deleteMemoryContest(req: any, id: string): Promise<{
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
    getDigitalPostcards(req: any): Promise<{
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
    createDigitalPostcard(req: any, dto: dto.CreateDigitalPostcardDto): Promise<{
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
    deleteDigitalPostcard(req: any, id: string): Promise<{
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
    getMemoryPenpals(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        penpalId: string;
        language: string;
        interests: string;
        isAnonymous: boolean;
        status: string;
    }[]>;
    createMemoryPenpal(req: any, dto: dto.CreateMemoryPenpalDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        penpalId: string;
        language: string;
        interests: string;
        isAnonymous: boolean;
        status: string;
    }>;
    updateMemoryPenpal(req: any, id: string, dto: dto.UpdateMemoryPenpalDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        penpalId: string;
        language: string;
        interests: string;
        isAnonymous: boolean;
        status: string;
    }>;
    deleteMemoryPenpal(req: any, id: string): Promise<{
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
