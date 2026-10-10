export declare class CreateEmotionalWaveformDto {
    date: string;
    mood: string;
    intensity: number;
    lifeChapter?: string;
    note?: string;
}
export declare class UpdateEmotionalWaveformDto {
    mood?: string;
    intensity?: number;
    lifeChapter?: string;
    note?: string;
}
