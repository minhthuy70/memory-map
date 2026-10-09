export declare enum Platform {
    ANDROID = "android",
    IOS = "ios"
}
export declare class CreateScreenshotPreventionDto {
    isEnabled: boolean;
    watermarkEnabled?: boolean;
    watermarkText?: string;
    blurPreview?: boolean;
    platform: Platform;
}
export declare class UpdateScreenshotPreventionDto {
    isEnabled?: boolean;
    watermarkEnabled?: boolean;
    watermarkText?: string;
    blurPreview?: boolean;
}
