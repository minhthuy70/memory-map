export declare class CreateClipboardSyncDto {
    dataType: string;
    data: string;
    sourceDevice: string;
    expiresAt?: string;
}
export declare class GetClipboardSyncDto {
    clipboardId: string;
}
export declare class GetClipboardSyncsDto {
    userId: string;
}
