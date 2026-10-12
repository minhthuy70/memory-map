import { PrismaService } from '../prisma/prisma.service';
import { CreateVaultMemoryDto, UpdateVaultMemoryDto, AccessVaultMemoryDto, VaultType } from './dto/vault-memory.dto';
import { CreateAuditLogDto, GetAuditLogsDto } from './dto/audit-log.dto';
import { CreateDuressPasswordDto, VerifyDuressPasswordDto } from './dto/duress-password.dto';
import { CreateCalculatorCamouflageDto, UpdateCalculatorCamouflageDto } from './dto/calculator-camouflage.dto';
import { CreateZeroKnowledgeE2EEDto, UpdateZeroKnowledgeE2EEDto } from './dto/zero-knowledge-e2ee.dto';
import { CreateExifSanitizerDto, UpdateExifSanitizerDto } from './dto/exif-sanitizer.dto';
import { CreateScreenshotPreventionDto, UpdateScreenshotPreventionDto } from './dto/screenshot-prevention.dto';
export declare class PrivacyVaultService {
    private prisma;
    constructor(prisma: PrismaService);
    createVaultMemory(userId: string, dto: CreateVaultMemoryDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date | null;
        memoryId: string;
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
        createdAt: Date;
        userId: string;
        expiresAt: Date | null;
        memoryId: string;
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
        createdAt: Date;
        userId: string;
        expiresAt: Date | null;
        memoryId: string;
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
        createdAt: Date;
        userId: string;
        expiresAt: Date | null;
        memoryId: string;
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
        createdAt: Date;
        userId: string;
        expiresAt: Date | null;
        memoryId: string;
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
        createdAt: Date;
        userId: string;
        expiresAt: Date | null;
        memoryId: string;
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
        createdAt: Date;
        userId: string;
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
        createdAt: Date;
        userId: string;
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
        passwordHash: string;
        createdAt: Date;
        lastUsedAt: Date | null;
        userId: string;
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
        passwordHash: string;
        createdAt: Date;
        lastUsedAt: Date | null;
        userId: string;
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
    createCalculatorCamouflage(userId: string, dto: CreateCalculatorCamouflageDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
    }>;
    getCalculatorCamouflage(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
    }>;
    updateCalculatorCamouflage(userId: string, dto: UpdateCalculatorCamouflageDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
    }>;
    deleteCalculatorCamouflage(userId: string): Promise<{
        message: string;
    }>;
    verifySecretPin(userId: string, pin: string): Promise<{
        valid: boolean;
        decoyName: string;
    }>;
    createZeroKnowledgeE2EE(userId: string, dto: CreateZeroKnowledgeE2EEDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    getZeroKnowledgeE2EE(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    updateZeroKnowledgeE2EE(userId: string, dto: UpdateZeroKnowledgeE2EEDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    rotateMasterKey(userId: string, newMasterKey: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    deleteZeroKnowledgeE2EE(userId: string): Promise<{
        message: string;
    }>;
    createExifSanitizer(userId: string, dto: CreateExifSanitizerDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        photoId: string;
        originalExif: string;
        sanitizedExif: string;
        stripDate: boolean;
        stripGPS: boolean;
        stripCamera: boolean;
        stripDevice: boolean;
        stripNetwork: boolean;
    }>;
    getExifSanitizers(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        photoId: string;
        originalExif: string;
        sanitizedExif: string;
        stripDate: boolean;
        stripGPS: boolean;
        stripCamera: boolean;
        stripDevice: boolean;
        stripNetwork: boolean;
    }[]>;
    getExifSanitizer(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        photoId: string;
        originalExif: string;
        sanitizedExif: string;
        stripDate: boolean;
        stripGPS: boolean;
        stripCamera: boolean;
        stripDevice: boolean;
        stripNetwork: boolean;
    }>;
    updateExifSanitizer(id: string, userId: string, dto: UpdateExifSanitizerDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        photoId: string;
        originalExif: string;
        sanitizedExif: string;
        stripDate: boolean;
        stripGPS: boolean;
        stripCamera: boolean;
        stripDevice: boolean;
        stripNetwork: boolean;
    }>;
    deleteExifSanitizer(id: string, userId: string): Promise<{
        message: string;
    }>;
    createScreenshotPrevention(userId: string, dto: CreateScreenshotPreventionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        platform: string;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
    }>;
    getScreenshotPrevention(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        platform: string;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
    }>;
    updateScreenshotPrevention(userId: string, dto: UpdateScreenshotPreventionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isEnabled: boolean;
        platform: string;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
    }>;
    deleteScreenshotPrevention(userId: string): Promise<{
        message: string;
    }>;
}
