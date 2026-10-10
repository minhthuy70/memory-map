export declare class CreateARTreasureChestDto {
    name: string;
    latitude: number;
    longitude: number;
    locationName: string;
    contentType: string;
    contentData: string;
}
export declare class UpdateARTreasureChestDto {
    name?: string;
    latitude?: number;
    longitude?: number;
    locationName?: string;
    contentType?: string;
    contentData?: string;
}
export declare class UnlockARTreasureChestDto {
    chestId: string;
}
