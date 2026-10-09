import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';
import {
  CreateVaultMemoryDto,
  UpdateVaultMemoryDto,
  AccessVaultMemoryDto,
  VaultType,
} from './dto/vault-memory.dto';
import {
  CreateAuditLogDto,
  GetAuditLogsDto,
} from './dto/audit-log.dto';
import {
  CreateDuressPasswordDto,
  VerifyDuressPasswordDto,
} from './dto/duress-password.dto';
import {
  CreateCalculatorCamouflageDto,
  UpdateCalculatorCamouflageDto,
} from './dto/calculator-camouflage.dto';
import {
  CreateZeroKnowledgeE2EEDto,
  UpdateZeroKnowledgeE2EEDto,
} from './dto/zero-knowledge-e2ee.dto';
import {
  CreateExifSanitizerDto,
  UpdateExifSanitizerDto,
} from './dto/exif-sanitizer.dto';
import {
  CreateScreenshotPreventionDto,
  UpdateScreenshotPreventionDto,
  Platform,
} from './dto/screenshot-prevention.dto';

@Injectable()
export class PrivacyVaultService {
  constructor(private prisma: PrismaService) {}

  // ==================== Vault Memories ====================

  async createVaultMemory(userId: string, dto: CreateVaultMemoryDto) {
    const vaultMemory = await this.prisma.vaultMemory.create({
      data: {
        user: { connect: { id: userId } },
        memoryId: dto.memoryId,
        vaultType: dto.vaultType,
        encryptionKey: dto.encryptionKey,
        maxViews: dto.maxViews,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    // Log the action
    await this.createAuditLog(userId, {
      action: 'vault_create',
      entityType: 'vault_memory',
      entityId: vaultMemory.id,
    });

    return vaultMemory;
  }

  async getVaultMemories(userId: string, vaultType?: VaultType) {
    const where: any = { userId, isDestroyed: false };
    if (vaultType) {
      where.vaultType = vaultType;
    }

    return this.prisma.vaultMemory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVaultMemory(id: string, userId: string) {
    const vaultMemory = await this.prisma.vaultMemory.findUnique({
      where: { id },
    });

    if (!vaultMemory) {
      throw new NotFoundException('Vault memory not found');
    }

    if (vaultMemory.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (vaultMemory.isDestroyed) {
      throw new NotFoundException('Memory has been destroyed');
    }

    // Check expiration
    if (vaultMemory.expiresAt && vaultMemory.expiresAt < new Date()) {
      await this.destroyVaultMemory(id, userId);
      throw new NotFoundException('Memory has expired');
    }

    return vaultMemory;
  }

  async updateVaultMemory(id: string, userId: string, dto: UpdateVaultMemoryDto) {
    const vaultMemory = await this.getVaultMemory(id, userId);

    const updated = await this.prisma.vaultMemory.update({
      where: { id },
      data: {
        ...(dto.vaultType && { vaultType: dto.vaultType }),
        ...(dto.isEncrypted !== undefined && { isEncrypted: dto.isEncrypted }),
        ...(dto.maxViews !== undefined && { maxViews: dto.maxViews }),
        ...(dto.expiresAt && { expiresAt: new Date(dto.expiresAt) }),
      },
    });

    await this.createAuditLog(userId, {
      action: 'vault_update',
      entityType: 'vault_memory',
      entityId: id,
    });

    return updated;
  }

  async deleteVaultMemory(id: string, userId: string) {
    const vaultMemory = await this.getVaultMemory(id, userId);

    await this.prisma.vaultMemory.delete({
      where: { id },
    });

    await this.createAuditLog(userId, {
      action: 'vault_delete',
      entityType: 'vault_memory',
      entityId: id,
    });

    return { message: 'Vault memory deleted successfully' };
  }

  async accessVaultMemory(id: string, userId: string, dto: AccessVaultMemoryDto) {
    const vaultMemory = await this.getVaultMemory(id, userId);

    // Check view count limit
    if (vaultMemory.maxViews && vaultMemory.viewCount >= vaultMemory.maxViews) {
      await this.destroyVaultMemory(id, userId);
      throw new ForbiddenException('Memory has reached maximum view limit');
    }

    // Log access
    await this.prisma.vaultAccessLog.create({
      data: {
        user: { connect: { id: userId } },
        vaultMemoryId: id,
        accessMethod: dto.accessMethod,
        success: true,
      },
    });

    // Increment view count
    const updated = await this.prisma.vaultMemory.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    // Auto-destroy if max views reached
    if (vaultMemory.maxViews && updated.viewCount >= vaultMemory.maxViews) {
      await this.destroyVaultMemory(id, userId);
    }

    await this.createAuditLog(userId, {
      action: 'vault_access',
      entityType: 'vault_memory',
      entityId: id,
    });

    return updated;
  }

  async destroyVaultMemory(id: string, userId: string) {
    const vaultMemory = await this.prisma.vaultMemory.update({
      where: { id },
      data: {
        isDestroyed: true,
        destroyedAt: new Date(),
      },
    });

    await this.createAuditLog(userId, {
      action: 'vault_destroy',
      entityType: 'vault_memory',
      entityId: id,
    });

    return vaultMemory;
  }

  // ==================== Audit Logs ====================

  async createAuditLog(userId: string, dto: CreateAuditLogDto) {
    // Get previous hash for cryptographic chain
    const lastLog = await this.prisma.auditLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const previousHash = lastLog?.currentHash || null;

    // Create hash for current log
    const logData = JSON.stringify({
      userId,
      action: dto.action,
      entityType: dto.entityType,
      entityId: dto.entityId,
      timestamp: new Date().toISOString(),
      previousHash,
    });

    const currentHash = crypto.createHash('sha256').update(logData).digest('hex');

    return this.prisma.auditLog.create({
      data: {
        user: { connect: { id: userId } },
        action: dto.action,
        entityType: dto.entityType,
        entityId: dto.entityId,
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
        metadata: dto.metadata,
        previousHash,
        currentHash,
      },
    });
  }

  async getAuditLogs(userId: string, dto: GetAuditLogsDto) {
    const where: any = { userId };

    if (dto.action) {
      where.action = dto.action;
    }

    if (dto.startDate || dto.endDate) {
      where.createdAt = {};
      if (dto.startDate) where.createdAt.gte = new Date(dto.startDate);
      if (dto.endDate) where.createdAt.lte = new Date(dto.endDate);
    }

    return this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async verifyAuditLogIntegrity(userId: string) {
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const results = [];
    let previousHash = null;

    for (const log of logs) {
      const isValid = log.previousHash === previousHash;
      results.push({
        id: log.id,
        action: log.action,
        isValid,
        previousHash: log.previousHash,
        currentHash: log.currentHash,
      });
      previousHash = log.currentHash;
    }

    const allValid = results.every((r) => r.isValid);

    return { allValid, results };
  }

  // ==================== Duress Password ====================

  async createDuressPassword(userId: string, dto: CreateDuressPasswordDto) {
    const passwordHash = crypto
      .createHash('sha256')
      .update(dto.password)
      .digest('hex');

    return this.prisma.duressPassword.create({
      data: {
        user: { connect: { id: userId } },
        passwordHash,
        isEmergency: dto.isEmergency ?? false,
        alertContacts: JSON.stringify(dto.alertContacts || []),
      },
    });
  }

  async verifyDuressPassword(userId: string, dto: VerifyDuressPasswordDto) {
    const passwordHash = crypto
      .createHash('sha256')
      .update(dto.password)
      .digest('hex');

    const duressPassword = await this.prisma.duressPassword.findFirst({
      where: {
        userId,
        passwordHash,
      },
    });

    if (!duressPassword) {
      return { isDuress: false, isEmergency: false };
    }

    // Update last used
    await this.prisma.duressPassword.update({
      where: { id: duressPassword.id },
      data: { lastUsedAt: new Date() },
    });

    // Log the duress password usage
    await this.createAuditLog(userId, {
      action: 'duress_password_used',
      entityType: 'user',
      entityId: userId,
      metadata: JSON.stringify({ isEmergency: duressPassword.isEmergency }),
    });

    // Send alert if emergency password
    if (duressPassword.isEmergency && !duressPassword.alertSent) {
      await this.prisma.duressPassword.update({
        where: { id: duressPassword.id },
        data: { alertSent: true },
      });

      // In production, send actual alerts to contacts
      console.log('Emergency alert sent to:', JSON.parse(duressPassword.alertContacts));
    }

    return {
      isDuress: true,
      isEmergency: duressPassword.isEmergency,
      alertContacts: JSON.parse(duressPassword.alertContacts),
    };
  }

  async getDuressPasswords(userId: string) {
    return this.prisma.duressPassword.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDuressPassword(id: string, userId: string) {
    const duressPassword = await this.prisma.duressPassword.findUnique({
      where: { id },
    });

    if (!duressPassword) {
      throw new NotFoundException('Duress password not found');
    }

    if (duressPassword.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.duressPassword.delete({
      where: { id },
    });

    return { message: 'Duress password deleted successfully' };
  }

  // ==================== Emergency Kill Switch ====================

  async triggerEmergencyKillSwitch(userId: string) {
    // Revoke all sessions
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    // Destroy all vault memories
    await this.prisma.vaultMemory.updateMany({
      where: { userId },
      data: {
        isDestroyed: true,
        destroyedAt: new Date(),
      },
    });

    // Log the emergency action
    await this.createAuditLog(userId, {
      action: 'emergency_kill_switch',
      entityType: 'user',
      entityId: userId,
    });

    return { message: 'Emergency kill switch triggered successfully' };
  }

  // ==================== Coordinate Fuzzing ====================

  async fuzzCoordinates(lat: number, lng: number, radiusMeters: number = 500) {
    // Generate random offset within radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusMeters;

    // Convert meters to degrees (approximate)
    const latOffset = (distance * Math.cos(angle)) / 111320;
    const lngOffset = (distance * Math.sin(angle)) / (111320 * Math.cos(lat * (Math.PI / 180)));

    return {
      lat: lat + latOffset,
      lng: lng + lngOffset,
    };
  }

  // ==================== Calculator Camouflage ====================

  async createCalculatorCamouflage(userId: string, dto: CreateCalculatorCamouflageDto) {
    return this.prisma.calculatorCamouflage.create({
      data: {
        user: { connect: { id: userId } },
        secretPin: dto.secretPin,
        decoyName: dto.decoyName,
        customIcon: dto.customIcon,
        isEnabled: dto.isEnabled ?? false,
      },
    });
  }

  async getCalculatorCamouflage(userId: string) {
    return this.prisma.calculatorCamouflage.findUnique({
      where: { userId },
    });
  }

  async updateCalculatorCamouflage(userId: string, dto: UpdateCalculatorCamouflageDto) {
    const camouflage = await this.getCalculatorCamouflage(userId);

    if (!camouflage) {
      throw new NotFoundException('Calculator camouflage not found');
    }

    return this.prisma.calculatorCamouflage.update({
      where: { userId },
      data: {
        ...(dto.secretPin && { secretPin: dto.secretPin }),
        ...(dto.decoyName && { decoyName: dto.decoyName }),
        ...(dto.customIcon && { customIcon: dto.customIcon }),
        ...(dto.isEnabled !== undefined && { isEnabled: dto.isEnabled }),
      },
    });
  }

  async deleteCalculatorCamouflage(userId: string) {
    const camouflage = await this.getCalculatorCamouflage(userId);

    if (!camouflage) {
      throw new NotFoundException('Calculator camouflage not found');
    }

    await this.prisma.calculatorCamouflage.delete({
      where: { userId },
    });

    return { message: 'Calculator camouflage deleted successfully' };
  }

  async verifySecretPin(userId: string, pin: string) {
    const camouflage = await this.getCalculatorCamouflage(userId);

    if (!camouflage) {
      throw new NotFoundException('Calculator camouflage not configured');
    }

    if (camouflage.secretPin !== pin) {
      throw new ForbiddenException('Invalid PIN');
    }

    return { valid: true, decoyName: camouflage.decoyName };
  }

  // ==================== Zero-Knowledge E2EE ====================

  async createZeroKnowledgeE2EE(userId: string, dto: CreateZeroKnowledgeE2EEDto) {
    return this.prisma.zeroKnowledgeE2EE.create({
      data: {
        user: { connect: { id: userId } },
        masterKey: dto.masterKey,
        algorithm: dto.algorithm || 'AES-256-GCM',
        keyDerivation: dto.keyDerivation || 'Argon2id',
        isEnabled: dto.isEnabled ?? false,
      },
    });
  }

  async getZeroKnowledgeE2EE(userId: string) {
    return this.prisma.zeroKnowledgeE2EE.findUnique({
      where: { userId },
    });
  }

  async updateZeroKnowledgeE2EE(userId: string, dto: UpdateZeroKnowledgeE2EEDto) {
    const e2ee = await this.getZeroKnowledgeE2EE(userId);

    if (!e2ee) {
      throw new NotFoundException('Zero-knowledge E2EE not configured');
    }

    return this.prisma.zeroKnowledgeE2EE.update({
      where: { userId },
      data: {
        ...(dto.masterKey && { masterKey: dto.masterKey }),
        ...(dto.algorithm && { algorithm: dto.algorithm }),
        ...(dto.keyDerivation && { keyDerivation: dto.keyDerivation }),
        ...(dto.isEnabled !== undefined && { isEnabled: dto.isEnabled }),
      },
    });
  }

  async rotateMasterKey(userId: string, newMasterKey: string) {
    const e2ee = await this.getZeroKnowledgeE2EE(userId);

    if (!e2ee) {
      throw new NotFoundException('Zero-knowledge E2EE not configured');
    }

    return this.prisma.zeroKnowledgeE2EE.update({
      where: { userId },
      data: {
        masterKey: newMasterKey,
        lastRotated: new Date(),
      },
    });
  }

  async deleteZeroKnowledgeE2EE(userId: string) {
    const e2ee = await this.getZeroKnowledgeE2EE(userId);

    if (!e2ee) {
      throw new NotFoundException('Zero-knowledge E2EE not configured');
    }

    await this.prisma.zeroKnowledgeE2EE.delete({
      where: { userId },
    });

    return { message: 'Zero-knowledge E2EE deleted successfully' };
  }

  // ==================== EXIF Sanitizer ====================

  async createExifSanitizer(userId: string, dto: CreateExifSanitizerDto) {
    // Simulate EXIF sanitization
    const originalExif = dto.originalExif || JSON.stringify({ camera: 'Canon', lens: '50mm', serial: '12345' });
    const sanitizedExif = JSON.stringify({
      date: dto.stripDate ? null : '2024-01-01',
      gps: dto.stripGPS ? null : { lat: 21.0285, lng: 105.8542 },
    });

    return this.prisma.exifSanitizer.create({
      data: {
        user: { connect: { id: userId } },
        photoId: dto.photoId,
        originalExif,
        sanitizedExif,
        stripDate: dto.stripDate ?? false,
        stripGPS: dto.stripGPS ?? false,
        stripCamera: dto.stripCamera ?? true,
        stripDevice: dto.stripDevice ?? true,
        stripNetwork: dto.stripNetwork ?? true,
      },
    });
  }

  async getExifSanitizers(userId: string) {
    return this.prisma.exifSanitizer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getExifSanitizer(id: string, userId: string) {
    const sanitizer = await this.prisma.exifSanitizer.findUnique({
      where: { id },
    });

    if (!sanitizer) {
      throw new NotFoundException('EXIF sanitizer not found');
    }

    if (sanitizer.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return sanitizer;
  }

  async updateExifSanitizer(id: string, userId: string, dto: UpdateExifSanitizerDto) {
    const sanitizer = await this.getExifSanitizer(id, userId);

    return this.prisma.exifSanitizer.update({
      where: { id },
      data: {
        ...(dto.sanitizedExif && { sanitizedExif: dto.sanitizedExif }),
        ...(dto.stripDate !== undefined && { stripDate: dto.stripDate }),
        ...(dto.stripGPS !== undefined && { stripGPS: dto.stripGPS }),
        ...(dto.stripCamera !== undefined && { stripCamera: dto.stripCamera }),
        ...(dto.stripDevice !== undefined && { stripDevice: dto.stripDevice }),
        ...(dto.stripNetwork !== undefined && { stripNetwork: dto.stripNetwork }),
      },
    });
  }

  async deleteExifSanitizer(id: string, userId: string) {
    const sanitizer = await this.getExifSanitizer(id, userId);

    await this.prisma.exifSanitizer.delete({
      where: { id },
    });

    return { message: 'EXIF sanitizer deleted successfully' };
  }

  // ==================== Screenshot Prevention ====================

  async createScreenshotPrevention(userId: string, dto: CreateScreenshotPreventionDto) {
    return this.prisma.screenshotPrevention.create({
      data: {
        user: { connect: { id: userId } },
        isEnabled: dto.isEnabled,
        watermarkEnabled: dto.watermarkEnabled ?? false,
        watermarkText: dto.watermarkText,
        blurPreview: dto.blurPreview ?? true,
        platform: dto.platform,
      },
    });
  }

  async getScreenshotPrevention(userId: string) {
    return this.prisma.screenshotPrevention.findUnique({
      where: { userId },
    });
  }

  async updateScreenshotPrevention(userId: string, dto: UpdateScreenshotPreventionDto) {
    const prevention = await this.getScreenshotPrevention(userId);

    if (!prevention) {
      throw new NotFoundException('Screenshot prevention not configured');
    }

    return this.prisma.screenshotPrevention.update({
      where: { userId },
      data: {
        ...(dto.isEnabled !== undefined && { isEnabled: dto.isEnabled }),
        ...(dto.watermarkEnabled !== undefined && { watermarkEnabled: dto.watermarkEnabled }),
        ...(dto.watermarkText && { watermarkText: dto.watermarkText }),
        ...(dto.blurPreview !== undefined && { blurPreview: dto.blurPreview }),
      },
    });
  }

  async deleteScreenshotPrevention(userId: string) {
    const prevention = await this.getScreenshotPrevention(userId);

    if (!prevention) {
      throw new NotFoundException('Screenshot prevention not configured');
    }

    await this.prisma.screenshotPrevention.delete({
      where: { userId },
    });

    return { message: 'Screenshot prevention deleted successfully' };
  }
}
