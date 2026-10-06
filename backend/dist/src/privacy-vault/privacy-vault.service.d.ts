import { PrismaService } from '../prisma/prisma.service';
import { CreateVaultMemoryDto, UpdateVaultMemoryDto, AccessVaultMemoryDto, VaultType } from './dto/vault-memory.dto';
import { CreateAuditLogDto, GetAuditLogsDto } from './dto/audit-log.dto';
import { CreateDuressPasswordDto, VerifyDuressPasswordDto } from './dto/duress-password.dto';
export declare class PrivacyVaultService {
    private prisma;
    constructor(prisma: PrismaService);
    createVaultMemory(userId: string, dto: CreateVaultMemoryDto): Promise<{
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
    getVaultMemories(userId: string, vaultType?: VaultType): Promise<{
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
    getVaultMemory(id: string, userId: string): Promise<{
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
    updateVaultMemory(id: string, userId: string, dto: UpdateVaultMemoryDto): Promise<{
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
    deleteVaultMemory(id: string, userId: string): Promise<{
        message: string;
    }>;
    accessVaultMemory(id: string, userId: string, dto: AccessVaultMemoryDto): Promise<{
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
    destroyVaultMemory(id: string, userId: string): Promise<{
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
    createAuditLog(userId: string, dto: CreateAuditLogDto): Promise<{
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
    getAuditLogs(userId: string, dto: GetAuditLogsDto): Promise<{
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
    verifyAuditLogIntegrity(userId: string): Promise<{
        allValid: boolean;
        results: any[];
    }>;
    createDuressPassword(userId: string, dto: CreateDuressPasswordDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        passwordHash: string;
        lastUsedAt: Date | null;
        isEmergency: boolean;
        alertSent: boolean;
        alertContacts: string;
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
        userId: string;
        createdAt: Date;
        passwordHash: string;
        lastUsedAt: Date | null;
        isEmergency: boolean;
        alertSent: boolean;
        alertContacts: string;
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
