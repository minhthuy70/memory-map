export declare enum StressLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare class CreatePredictiveResurfacingDto {
    memoryId: string;
    sentimentScore: number;
    stressLevel: StressLevel;
    scheduledAt: string;
}
export declare class UpdatePredictiveResurfacingDto {
    wasViewed?: boolean;
    userFeedback?: string;
}
