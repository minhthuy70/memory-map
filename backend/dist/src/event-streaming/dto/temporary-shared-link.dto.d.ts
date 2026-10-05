export declare class CreateTemporarySharedLinkDto {
    title: string;
    memoryId?: string;
    passcode?: string;
    maxViews?: number;
    expiresAt: Date;
}
export declare class AccessSharedLinkDto {
    url: string;
    passcode?: string;
}
