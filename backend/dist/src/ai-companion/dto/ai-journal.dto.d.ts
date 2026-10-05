export declare class CreateAIJournalEntryDto {
    date: string;
    title: string;
    content: string;
    photos?: string[];
    locations?: any[];
    isDraft?: boolean;
}
export declare class UpdateAIJournalEntryDto {
    title?: string;
    content?: string;
    isDraft?: boolean;
    isReviewed?: boolean;
}
export declare class GenerateJournalEntryDto {
    date: string;
    photoIds?: string[];
}
