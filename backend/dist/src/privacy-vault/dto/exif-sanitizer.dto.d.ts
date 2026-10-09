export declare class CreateExifSanitizerDto {
    photoId: string;
    originalExif?: string;
    stripDate?: boolean;
    stripGPS?: boolean;
    stripCamera?: boolean;
    stripDevice?: boolean;
    stripNetwork?: boolean;
}
export declare class UpdateExifSanitizerDto {
    sanitizedExif?: string;
    stripDate?: boolean;
    stripGPS?: boolean;
    stripCamera?: boolean;
    stripDevice?: boolean;
    stripNetwork?: boolean;
}
