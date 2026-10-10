export declare class CreateDreamJournalDto {
    title: string;
    description: string;
    dreamDate: string;
    isLucid?: boolean;
    symbols?: string;
    locationLatitude?: number;
    locationLongitude?: number;
    locationName?: string;
    mood?: string;
}
export declare class UpdateDreamJournalDto {
    title?: string;
    description?: string;
    dreamDate?: string;
    isLucid?: boolean;
    symbols?: string;
    locationLatitude?: number;
    locationLongitude?: number;
    locationName?: string;
    mood?: string;
}
