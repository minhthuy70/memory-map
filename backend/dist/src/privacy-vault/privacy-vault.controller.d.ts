import { PrivacyVaultService } from './privacy-vault.service';
import { CreateVaultMemoryDto, UpdateVaultMemoryDto, AccessVaultMemoryDto, VaultType } from './dto/vault-memory.dto';
import { CreateAuditLogDto, GetAuditLogsDto } from './dto/audit-log.dto';
import { CreateDuressPasswordDto, VerifyDuressPasswordDto } from './dto/duress-password.dto';
export declare class PrivacyVaultController {
    private readonly privacyVaultService;
    constructor(privacyVaultService: PrivacyVaultService);
    createVaultMemory(req: any, dto: CreateVaultMemoryDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        expiresAt: Date | null;
        maxViews: number | null;
        viewCount: number;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        isDestroyed: boolean;
        destroyedAt: Date | null;
    }>;
    getVaultMemories(req: any, vaultType?: VaultType): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        expiresAt: Date | null;
        maxViews: number | null;
        viewCount: number;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        isDestroyed: boolean;
        destroyedAt: Date | null;
    }[]>;
    getVaultMemory(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        expiresAt: Date | null;
        maxViews: number | null;
        viewCount: number;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        isDestroyed: boolean;
        destroyedAt: Date | null;
    }>;
    updateVaultMemory(id: string, req: any, dto: UpdateVaultMemoryDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        expiresAt: Date | null;
        maxViews: number | null;
        viewCount: number;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        isDestroyed: boolean;
        destroyedAt: Date | null;
    }>;
    deleteVaultMemory(id: string, req: any): Promise<{
        message: string;
    }>;
    accessVaultMemory(id: string, req: any, dto: AccessVaultMemoryDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        expiresAt: Date | null;
        maxViews: number | null;
        viewCount: number;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        isDestroyed: boolean;
        destroyedAt: Date | null;
    }>;
    destroyVaultMemory(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        expiresAt: Date | null;
        maxViews: number | null;
        viewCount: number;
        vaultType: string;
        encryptionKey: string | null;
        isEncrypted: boolean;
        isDestroyed: boolean;
        destroyedAt: Date | null;
    }>;
    createAuditLog(req: any, dto: CreateAuditLogDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        ipAddress: string | null;
        entityType: string;
        entityId: string | null;
        metadata: string | null;
        action: string;
        userAgent: string | null;
        previousHash: string | null;
        currentHash: string;
    }>;
    getAuditLogs(req: any, query: GetAuditLogsDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        ipAddress: string | null;
        entityType: string;
        entityId: string | null;
        metadata: string | null;
        action: string;
        userAgent: string | null;
        previousHash: string | null;
        currentHash: string;
    }[]>;
    verifyAuditLogIntegrity(req: any): Promise<{
        allValid: boolean;
        results: any[];
    }>;
    createDuressPassword(req: any, dto: CreateDuressPasswordDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        passwordHash: string;
        lastUsedAt: Date | null;
        isEmergency: boolean;
        alertSent: boolean;
        alertContacts: string;
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
        userId: string;
        createdAt: Date;
        passwordHash: string;
        lastUsedAt: Date | null;
        isEmergency: boolean;
        alertSent: boolean;
        alertContacts: string;
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
