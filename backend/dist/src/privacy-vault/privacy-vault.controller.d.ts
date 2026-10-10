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
        userId: string;
        createdAt: Date;
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
    getVaultMemories(req: any, vaultType?: VaultType): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    getVaultMemory(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    updateVaultMemory(id: string, req: any, dto: UpdateVaultMemoryDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    deleteVaultMemory(id: string, req: any): Promise<{
        message: string;
    }>;
    accessVaultMemory(id: string, req: any, dto: AccessVaultMemoryDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    destroyVaultMemory(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    createAuditLog(req: any, dto: CreateAuditLogDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        metadata: string | null;
        ipAddress: string | null;
        entityType: string;
        entityId: string | null;
        action: string;
        userAgent: string | null;
        previousHash: string | null;
        currentHash: string;
    }>;
    getAuditLogs(req: any, query: GetAuditLogsDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        metadata: string | null;
        ipAddress: string | null;
        entityType: string;
        entityId: string | null;
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
    createCalculatorCamouflage(req: any, dto: CreateCalculatorCamouflageDto): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        isEnabled: boolean;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
    }>;
    getCalculatorCamouflage(req: any): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        isEnabled: boolean;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
    }>;
    updateCalculatorCamouflage(req: any, dto: UpdateCalculatorCamouflageDto): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        isEnabled: boolean;
        secretPin: string;
        decoyName: string;
        customIcon: string | null;
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
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    getZeroKnowledgeE2EE(req: any): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        isEnabled: boolean;
        masterKey: string;
        algorithm: string;
        keyDerivation: string;
        lastRotated: Date | null;
    }>;
    updateZeroKnowledgeE2EE(req: any, dto: UpdateZeroKnowledgeE2EEDto): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
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
        userId: string;
        updatedAt: Date;
        createdAt: Date;
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
        userId: string;
        createdAt: Date;
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
        userId: string;
        createdAt: Date;
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
        userId: string;
        createdAt: Date;
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
        userId: string;
        createdAt: Date;
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
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        isEnabled: boolean;
        platform: string;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
    }>;
    getScreenshotPrevention(req: any): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        isEnabled: boolean;
        platform: string;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
    }>;
    updateScreenshotPrevention(req: any, dto: UpdateScreenshotPreventionDto): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        isEnabled: boolean;
        platform: string;
        watermarkEnabled: boolean;
        watermarkText: string | null;
        blurPreview: boolean;
    }>;
    deleteScreenshotPrevention(req: any): Promise<{
        message: string;
    }>;
}
