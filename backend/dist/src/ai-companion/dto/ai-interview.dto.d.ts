export declare class CreateAIInterviewDto {
    question: string;
}
export declare class UpdateAIInterviewDto {
    answer?: string;
    audioUrl?: string;
    duration?: number;
    isCompleted?: boolean;
}
export declare class GenerateQuestionDto {
    topic?: string;
}
