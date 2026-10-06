import { PrismaService } from '../prisma/prisma.service';
import { CreateVaultMemoryDto, UpdateVaultMemoryDto, AccessVaultMemoryDto, VaultType } from './dto/vault-memory.dto';
import { CreateAuditLogDto, GetAuditLogsDto } from './dto/audit-log.dto';
import { CreateDuressPasswordDto, VerifyDuressPasswordDto } from './dto/duress-password.dto';
export declare class PrivacyVaultService {
    private prisma;
    constructor(prisma: PrismaService);
    createVaultMemory(userId: string, dto: CreateVaultMemoryDto): Promise<{
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
    getVaultMemories(userId: string, vaultType?: VaultType): Promise<{
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
    getVaultMemory(id: string, userId: string): Promise<{
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
    updateVaultMemory(id: string, userId: string, dto: UpdateVaultMemoryDto): Promise<{
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
    deleteVaultMemory(id: string, userId: string): Promise<{
        message: string;
    }>;
    accessVaultMemory(id: string, userId: string, dto: AccessVaultMemoryDto): Promise<{
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
    destroyVaultMemory(id: string, userId: string): Promise<{
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
    createAuditLog(userId: string, dto: CreateAuditLogDto): Promise<{
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
    getAuditLogs(userId: string, dto: GetAuditLogsDto): Promise<{
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
    verifyAuditLogIntegrity(userId: string): Promise<{
        allValid: boolean;
        results: any[];
    }>;
    createDuressPassword(userId: string, dto: CreateDuressPasswordDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        passwordHash: string;
        isEmergency: boolean;
        alertSent: boolean;
        alertContacts: string;
        lastUsedAt: Date | null;
    }>;
    verifyDuressPassword(userId: string, dto: VerifyDuressPasswordDto): Promise<{
        isDuress: boolean;
        isEmergency: boolean;
        alertContacts?: undefined;
    } | {
        isDuress: boolean;
        isEmergency: boolean;
        alertContacts: any;
    }>;
    getDuressPasswords(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        passwordHash: string;
        isEmergency: boolean;
        alertSent: boolean;
        alertContacts: string;
        lastUsedAt: Date | null;
    }[]>;
    deleteDuressPassword(id: string, userId: string): Promise<{
        message: string;
    }>;
    triggerEmergencyKillSwitch(userId: string): Promise<{
        message: string;
    }>;
    fuzzCoordinates(lat: number, lng: number, radiusMeters?: number): Promise<{
        lat: number;
        lng: number;
    }>;
}
