export declare class CreateVaultExportDto {
    fileName: string;
    isPublic?: boolean;
    expiresAt?: string;
}
export declare class DownloadVaultExportDto {
    accessCode: string;
}
export declare class GetVaultExportsDto {
    userId: string;
}
