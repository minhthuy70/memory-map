import { PrivacyVaultService } from './privacy-vault.service';
import { CreateVaultMemoryDto, UpdateVaultMemoryDto, AccessVaultMemoryDto, VaultType } from './dto/vault-memory.dto';
import { CreateAuditLogDto, GetAuditLogsDto } from './dto/audit-log.dto';
import { CreateDuressPasswordDto, VerifyDuressPasswordDto } from './dto/duress-password.dto';
import { CreateCalculatorCamouflageDto, UpdateCalculatorCamouflageDto } from './dto/calculator-camouflage.dto';
import { CreateZeroKnowledgeE2EEDto, UpdateZeroKnowledgeE2EEDto } from './dto/zero-knowledge-e2ee.dto';
import { CreateExifSanitizerDto, UpdateExifSanitizerDto } from './dto/exif-sanitizer.dto';
import { CreateScreenshotPreventionDto, UpdateScreenshotPreventionDto } from './dto/screenshot-prevention.dto';
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
    createCalculatorCamouflage(req: any, dto: CreateCalculatorCamouflageDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
        isEnabled: boolean;
    }>;
    getCalculatorCamouflage(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
        isEnabled: boolean;
    }>;
    updateCalculatorCamouflage(req: any, dto: UpdateCalculatorCamouflageDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
        isEnabled: boolean;
    }>;
    deleteCalculatorCamouflage(req: any): Promise<{
        message: string;
    }>;
    verifySecretPin(req: any, body: {
        pin: string;
    }): Promise<{
        valid: boolean;
        decoyName: string;
    }>;
    createZeroKnowledgeE2EE(req: any, dto: CreateZeroKnowledgeE2EEDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    getZeroKnowledgeE2EE(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    updateZeroKnowledgeE2EE(req: any, dto: UpdateZeroKnowledgeE2EEDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    rotateMasterKey(req: any, body: {
        newMasterKey: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    deleteZeroKnowledgeE2EE(req: any): Promise<{
        message: string;
    }>;
    createExifSanitizer(req: any, dto: CreateExifSanitizerDto): Promise<{
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
    getExifSanitizers(req: any): Promise<{
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
    getExifSanitizer(id: string, req: any): Promise<{
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
    updateExifSanitizer(id: string, req: any, dto: UpdateExifSanitizerDto): Promise<{
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
    deleteExifSanitizer(id: string, req: any): Promise<{
        message: string;
    }>;
    createScreenshotPrevention(req: any, dto: CreateScreenshotPreventionDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isEnabled: boolean;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
        platform: string;
    }>;
    getScreenshotPrevention(req: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isEnabled: boolean;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
        platform: string;
    }>;
    updateScreenshotPrevention(req: any, dto: UpdateScreenshotPreventionDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isEnabled: boolean;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
        platform: string;
    }>;
    deleteScreenshotPrevention(req: any): Promise<{
        message: string;
    }>;
}
