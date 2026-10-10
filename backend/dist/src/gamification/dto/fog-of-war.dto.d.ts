export declare class CreateFogOfWarDto {
    exploredAreas?: string;
    totalAreaExplored?: number;
    worldPercentage?: number;
}
export declare class UpdateFogOfWarDto {
    exploredAreas?: string;
    totalAreaExplored?: number;
    worldPercentage?: number;
    lastExploreLocation?: string;
}
export declare class ExploreAreaDto {
    latitude: number;
    longitude: number;
    radius?: number;
}
