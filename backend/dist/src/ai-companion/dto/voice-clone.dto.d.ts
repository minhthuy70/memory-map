export declare enum VoiceCloneStatus {
    TRAINING = "training",
    READY = "ready",
    FAILED = "failed"
}
export declare class CreateVoiceCloneModelDto {
    modelName: string;
    sampleAudioUrl: string;
}
export declare class GenerateVoiceNarrationDto {
    modelId: string;
    text: string;
}
