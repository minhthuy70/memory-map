export declare enum SynthesisTone {
    HUMOROUS = "humorous",
    POETIC = "poetic",
    ADVENTUROUS = "adventurous",
    NEUTRAL = "neutral"
}
export declare class CreateMemorySynthesisDto {
    title: string;
    description: string;
    participantIds: string;
    memoryIds: string;
    tone: SynthesisTone;
}
export declare class UpdateMemorySynthesisDto {
    title?: string;
    description?: string;
    participantIds?: string;
    memoryIds?: string;
    tone?: SynthesisTone;
    chapters?: string;
}
