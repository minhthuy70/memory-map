export declare class CreateGeocacheDto {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    difficulty?: number;
    terrain?: number;
    size?: string;
    riddle?: string;
    hint?: string;
    isPublished?: boolean;
}
export declare class UpdateGeocacheDto {
    title?: string;
    description?: string;
    latitude?: number;
    longitude?: number;
    difficulty?: number;
    terrain?: number;
    size?: string;
    riddle?: string;
    hint?: string;
    isPublished?: boolean;
}
export declare class CreateGeocacheLogDto {
    username: string;
    message?: string;
    logType: string;
}
