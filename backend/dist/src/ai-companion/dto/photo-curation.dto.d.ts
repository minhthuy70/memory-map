export declare class CreatePhotoCurationDto {
    memoryId: string;
    photoId: string;
    aestheticScore: number;
    focusScore: number;
    smileScore: number;
    overallScore: number;
    isHighlighted?: boolean;
    isRejected?: boolean;
    reasons?: string[];
}
export declare class UpdatePhotoCurationDto {
    isHighlighted?: boolean;
    isRejected?: boolean;
}
export declare class BatchCurationDto {
    memoryId: string;
    photoIds: string[];
}
