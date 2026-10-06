import { PrivacyVaultService } from './privacy-vault.service';
import { CreateVaultMemoryDto, UpdateVaultMemoryDto, AccessVaultMemoryDto, VaultType } from './dto/vault-memory.dto';
import { CreateAuditLogDto, GetAuditLogsDto } from './dto/audit-log.dto';
import { CreateDuressPasswordDto, VerifyDuressPasswordDto } from './dto/duress-password.dto';
export declare class PrivacyVaultController {
    private readonly privacyVaultService;
    constructor(privacyVaultService: PrivacyVaultService);
    createVaultMemory(req: any, dto: CreateVaultMemoryDto): Promise<{
        id: string;
        memoryId: string;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        viewCount: number;
        maxViews: number | null;
        expiresAt: Date | null;
        isDestroyed: boolean;
        destroyedAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    getVaultMemories(req: any, vaultType?: VaultType): Promise<{
        id: string;
        memoryId: string;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        viewCount: number;
        maxViews: number | null;
        expiresAt: Date | null;
        isDestroyed: boolean;
        destroyedAt: Date | null;
        createdAt: Date;
        userId: string;
    }[]>;
    getVaultMemory(id: string, req: any): Promise<{
        id: string;
        memoryId: string;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        viewCount: number;
        maxViews: number | null;
        expiresAt: Date | null;
        isDestroyed: boolean;
        destroyedAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    updateVaultMemory(id: string, req: any, dto: UpdateVaultMemoryDto): Promise<{
        id: string;
        memoryId: string;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        viewCount: number;
        maxViews: number | null;
        expiresAt: Date | null;
        isDestroyed: boolean;
        destroyedAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    deleteVaultMemory(id: string, req: any): Promise<{
        message: string;
    }>;
    accessVaultMemory(id: string, req: any, dto: AccessVaultMemoryDto): Promise<{
        id: string;
        memoryId: string;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        viewCount: number;
        maxViews: number | null;
        expiresAt: Date | null;
        isDestroyed: boolean;
        destroyedAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    destroyVaultMemory(id: string, req: any): Promise<{
        id: string;
        memoryId: string;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        viewCount: number;
        maxViews: number | null;
        expiresAt: Date | null;
        isDestroyed: boolean;
        destroyedAt: Date | null;
        createdAt: Date;
        userId: string;
    }>;
    createAuditLog(req: any, dto: CreateAuditLogDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        action: string;
        entityType: string;
        entityId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: string | null;
        previousHash: string | null;
        currentHash: string;
    }>;
    getAuditLogs(req: any, query: GetAuditLogsDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        action: string;
        entityType: string;
        entityId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        metadata: string | null;
        previousHash: string | null;
        currentHash: string;
    }[]>;
    verifyAuditLogIntegrity(req: any): Promise<{
        allValid: boolean;
        results: any[];
    }>;
    createDuressPassword(req: any, dto: CreateDuressPasswordDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        passwordHash: string;
        isEmergency: boolean;
        alertSent: boolean;
        alertContacts: string;
        lastUsedAt: Date | null;
    }>;
    verifyDuressPassword(req: any, dto: VerifyDuressPasswordDto): Promise<{
        isDuress: boolean;
        isEmergency: boolean;
        alertContacts?: undefined;
    } | {
        isDuress: boolean;
        isEmergency: boolean;
        alertContacts: any;
    }>;
    getDuressPasswords(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        passwordHash: string;
        isEmergency: boolean;
        alertSent: boolean;
        alertContacts: string;
        lastUsedAt: Date | null;
    }[]>;
    deleteDuressPassword(id: string, req: any): Promise<{
        message: string;
    }>;
    triggerEmergencyKillSwitch(req: any): Promise<{
        message: string;
    }>;
    fuzzCoordinates(body: {
        lat: number;
        lng: number;
        radiusMeters?: number;
    }): Promise<{
        lat: number;
        lng: number;
    }>;
}
