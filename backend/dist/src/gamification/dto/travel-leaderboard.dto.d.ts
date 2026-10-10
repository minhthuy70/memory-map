export declare class CreateTravelLeaderboardDto {
    circleId: string;
    name: string;
    type: string;
    period: string;
    isActive?: boolean;
}
export declare class UpdateTravelLeaderboardDto {
    name?: string;
    type?: string;
    period?: string;
    isActive?: boolean;
}
export declare class CreateLeaderboardEntryDto {
    leaderboardId: string;
    score: number;
    period?: string;
}
export declare class UpdateLeaderboardEntryDto {
    score?: number;
}
