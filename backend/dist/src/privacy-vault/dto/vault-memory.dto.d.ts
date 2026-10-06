export declare enum VaultType {
    STANDARD = "standard",
    DOUBLE_LOCK = "double-lock",
    EPHEMERAL = "ephemeral"
}
export declare class CreateVaultMemoryDto {
    memoryId: string;
    vaultType: VaultType;
    encryptionKey?: string;
    maxViews?: number;
    expiresAt?: string;
}
export declare class UpdateVaultMemoryDto {
    vaultType?: VaultType;
    isEncrypted?: boolean;
    maxViews?: number;
    expiresAt?: string;
}
export declare class AccessVaultMemoryDto {
    accessMethod: string;
}
