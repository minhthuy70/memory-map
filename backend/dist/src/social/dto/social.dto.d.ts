export declare class CreateMemoryStoryDto {
    memoryId?: string;
    mediaUrl: string;
    location?: string;
    privacy?: string;
    stickers?: string;
    musicUrl?: string;
}
export declare class UpdateMemoryStoryDto {
    privacy?: string;
    stickers?: string;
}
export declare class CreateCommunityMapFeedDto {
    memoryId: string;
    location: string;
    latitude: number;
    longitude: number;
    category?: string;
    mood?: string;
}
export declare class UpdateCommunityMapFeedDto {
    category?: string;
    mood?: string;
    isSafe?: boolean;
}
export declare class CreateNearbyFriendsPingDto {
    friendId: string;
    memoryId?: string;
    distance: number;
    enabled?: boolean;
    threshold?: number;
}
export declare class UpdateNearbyFriendsPingDto {
    enabled?: boolean;
    threshold?: number;
}
export declare class CreateCoPresenceSuggestionDto {
    location: string;
    latitude: number;
    longitude: number;
    detectedUsers: string;
}
export declare class CreateExplorationChallengeDto {
    challengeType: string;
    targetCount: number;
}
export declare class UpdateExplorationChallengeDto {
    progress?: number;
    badgeUrl?: string;
}
export declare class CreateMemoryContestDto {
    title: string;
    theme: string;
    description: string;
    submissionIds: string;
    deadline: string;
    votingEndsAt: string;
}
export declare class UpdateMemoryContestDto {
    winnerId?: string;
    badgeUrl?: string;
}
export declare class CreateDigitalPostcardDto {
    memoryId?: string;
    recipientEmail: string;
    message: string;
    stampUrl?: string;
    postcardUrl: string;
}
export declare class CreateMemoryPenpalDto {
    penpalId: string;
    language: string;
    interests: string;
    isAnonymous?: boolean;
}
export declare class UpdateMemoryPenpalDto {
    status?: string;
}
