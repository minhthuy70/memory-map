export declare enum DataSaverMode {
    TWO_G = "2g",
    THREE_G = "3g",
    LOW_BANDWIDTH = "low-bandwidth"
}
export declare enum CompressionLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare enum QualityLevel {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare class CreateWildernessDataSaverDto {
    isEnabled: boolean;
    mode: DataSaverMode;
    compression: CompressionLevel;
    imageQuality: QualityLevel;
    videoQuality: QualityLevel;
    vectorTiles?: boolean;
    backgroundQueue?: boolean;
    dataLimit?: number;
}
export declare class UpdateWildernessDataSaverDto {
    isEnabled?: boolean;
    mode?: DataSaverMode;
    compression?: CompressionLevel;
    imageQuality?: QualityLevel;
    videoQuality?: QualityLevel;
    vectorTiles?: boolean;
    backgroundQueue?: boolean;
    dataLimit?: number;
}
