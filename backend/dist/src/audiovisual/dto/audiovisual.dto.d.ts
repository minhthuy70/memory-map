export declare class CreateHandwritingCanvasDto {
    memoryId?: string;
    imageUrl?: string;
    drawingData: string;
    brushType: string;
    brushColor: string;
    brushSize: number;
}
export declare class UpdateHandwritingCanvasDto {
    drawingData?: string;
    brushType?: string;
    brushColor?: string;
    brushSize?: number;
}
export declare class CreateVintageFilmDto {
    memoryId?: string;
    originalImageUrl: string;
    filterType: string;
    intensity: number;
    grainAmount: number;
    lightLeak?: string;
    dateStamp?: string;
}
export declare class UpdateVintageFilmDto {
    filterType?: string;
    intensity?: number;
    grainAmount?: number;
    lightLeak?: string;
    dateStamp?: string;
    processedImageUrl?: string;
}
export declare class CreateLivePhotoDto {
    memoryId?: string;
    photoUrl: string;
    videoUrl?: string;
    platform: string;
    duration?: number;
    isLoop?: boolean;
}
export declare class UpdateLivePhotoDto {
    videoUrl?: string;
    keyframeUrl?: string;
    isLoop?: boolean;
}
export declare class CreateBeforeAfterSliderDto {
    memoryId?: string;
    beforeImageUrl: string;
    afterImageUrl: string;
    orientation?: string;
    sliderPosition?: number;
    blendMode?: string;
}
export declare class UpdateBeforeAfterSliderDto {
    beforeImageUrl?: string;
    afterImageUrl?: string;
    orientation?: string;
    sliderPosition?: number;
    blendMode?: string;
}
export declare class CreateTypographyStampDto {
    text: string;
    fontName: string;
    fontSize: number;
    fontColor: string;
    stampType: string;
    positionX: number;
    positionY: number;
    rotation?: number;
    memoryId?: string;
}
export declare class UpdateTypographyStampDto {
    text?: string;
    fontName?: string;
    fontSize?: number;
    fontColor?: string;
    stampType?: string;
    positionX?: number;
    positionY?: number;
    rotation?: number;
}
export declare class CreateBeatSyncVideoDto {
    memoryIds: string;
    audioUrl: string;
    beatPattern: string;
    pacing?: string;
    transitionStyle?: string;
}
export declare class UpdateBeatSyncVideoDto {
    videoUrl?: string;
    status?: string;
}
export declare class CreateAIVoiceoverDto {
    memoryId?: string;
    audioUrl: string;
    duration: number;
    transcript?: string;
    timestamps: string;
    noiseLevel: number;
    vocalFilter: string;
}
export declare class UpdateAIVoiceoverDto {
    transcript?: string;
    noiseLevel?: number;
    vocalFilter?: string;
}
export declare class CreateMemorySoundtrackDto {
    memoryId?: string;
    spotifyTrackId?: string;
    fieldRecordingUrl?: string;
    mixSettings: string;
    duration: number;
}
export declare class UpdateMemorySoundtrackDto {
    spotifyTrackId?: string;
    fieldRecordingUrl?: string;
    mixSettings?: string;
    outputUrl?: string;
}
