"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyVaultService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let PrivacyVaultService = class PrivacyVaultService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createVaultMemory(userId, dto) {
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
        await this.createAuditLog(userId, {
            action: 'vault_create',
            entityType: 'vault_memory',
            entityId: vaultMemory.id,
        });
        return vaultMemory;
    }
    async getVaultMemories(userId, vaultType) {
        const where = { userId, isDestroyed: false };
        if (vaultType) {
            where.vaultType = vaultType;
        }
        return this.prisma.vaultMemory.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getVaultMemory(id, userId) {
        const vaultMemory = await this.prisma.vaultMemory.findUnique({
            where: { id },
        });
        if (!vaultMemory) {
            throw new common_1.NotFoundException('Vault memory not found');
        }
        if (vaultMemory.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (vaultMemory.isDestroyed) {
            throw new common_1.NotFoundException('Memory has been destroyed');
        }
        if (vaultMemory.expiresAt && vaultMemory.expiresAt < new Date()) {
            await this.destroyVaultMemory(id, userId);
            throw new common_1.NotFoundException('Memory has expired');
        }
        return vaultMemory;
    }
    async updateVaultMemory(id, userId, dto) {
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
    async deleteVaultMemory(id, userId) {
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
    async accessVaultMemory(id, userId, dto) {
        const vaultMemory = await this.getVaultMemory(id, userId);
        if (vaultMemory.maxViews && vaultMemory.viewCount >= vaultMemory.maxViews) {
            await this.destroyVaultMemory(id, userId);
            throw new common_1.ForbiddenException('Memory has reached maximum view limit');
        }
        await this.prisma.vaultAccessLog.create({
            data: {
                user: { connect: { id: userId } },
                vaultMemoryId: id,
                accessMethod: dto.accessMethod,
                success: true,
            },
        });
        const updated = await this.prisma.vaultMemory.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
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
    async destroyVaultMemory(id, userId) {
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
    async createAuditLog(userId, dto) {
        const lastLog = await this.prisma.auditLog.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        const previousHash = lastLog?.currentHash || null;
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
    async getAuditLogs(userId, dto) {
        const where = { userId };
        if (dto.action) {
            where.action = dto.action;
        }
        if (dto.startDate || dto.endDate) {
            where.createdAt = {};
            if (dto.startDate)
                where.createdAt.gte = new Date(dto.startDate);
            if (dto.endDate)
                where.createdAt.lte = new Date(dto.endDate);
        }
        return this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    }
    async verifyAuditLogIntegrity(userId) {
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
    async createDuressPassword(userId, dto) {
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
    async verifyDuressPassword(userId, dto) {
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
        await this.prisma.duressPassword.update({
            where: { id: duressPassword.id },
            data: { lastUsedAt: new Date() },
        });
        await this.createAuditLog(userId, {
            action: 'duress_password_used',
            entityType: 'user',
            entityId: userId,
            metadata: JSON.stringify({ isEmergency: duressPassword.isEmergency }),
        });
        if (duressPassword.isEmergency && !duressPassword.alertSent) {
            await this.prisma.duressPassword.update({
                where: { id: duressPassword.id },
                data: { alertSent: true },
            });
            console.log('Emergency alert sent to:', JSON.parse(duressPassword.alertContacts));
        }
        return {
            isDuress: true,
            isEmergency: duressPassword.isEmergency,
            alertContacts: JSON.parse(duressPassword.alertContacts),
        };
    }
    async getDuressPasswords(userId) {
        return this.prisma.duressPassword.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteDuressPassword(id, userId) {
        const duressPassword = await this.prisma.duressPassword.findUnique({
            where: { id },
        });
        if (!duressPassword) {
            throw new common_1.NotFoundException('Duress password not found');
        }
        if (duressPassword.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.duressPassword.delete({
            where: { id },
        });
        return { message: 'Duress password deleted successfully' };
    }
    async triggerEmergencyKillSwitch(userId) {
        await this.prisma.session.deleteMany({
            where: { userId },
        });
        await this.prisma.vaultMemory.updateMany({
            where: { userId },
            data: {
                isDestroyed: true,
                destroyedAt: new Date(),
            },
        });
        await this.createAuditLog(userId, {
            action: 'emergency_kill_switch',
            entityType: 'user',
            entityId: userId,
        });
        return { message: 'Emergency kill switch triggered successfully' };
    }
    async fuzzCoordinates(lat, lng, radiusMeters = 500) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radiusMeters;
        const latOffset = (distance * Math.cos(angle)) / 111320;
        const lngOffset = (distance * Math.sin(angle)) / (111320 * Math.cos(lat * (Math.PI / 180)));
        return {
            lat: lat + latOffset,
            lng: lng + lngOffset,
        };
    }
    async createCalculatorCamouflage(userId, dto) {
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
    async getCalculatorCamouflage(userId) {
        return this.prisma.calculatorCamouflage.findUnique({
            where: { userId },
        });
    }
    async updateCalculatorCamouflage(userId, dto) {
        const camouflage = await this.getCalculatorCamouflage(userId);
        if (!camouflage) {
            throw new common_1.NotFoundException('Calculator camouflage not found');
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
    async deleteCalculatorCamouflage(userId) {
        const camouflage = await this.getCalculatorCamouflage(userId);
        if (!camouflage) {
            throw new common_1.NotFoundException('Calculator camouflage not found');
        }
        await this.prisma.calculatorCamouflage.delete({
            where: { userId },
        });
        return { message: 'Calculator camouflage deleted successfully' };
    }
    async verifySecretPin(userId, pin) {
        const camouflage = await this.getCalculatorCamouflage(userId);
        if (!camouflage) {
            throw new common_1.NotFoundException('Calculator camouflage not configured');
        }
        if (camouflage.secretPin !== pin) {
            throw new common_1.ForbiddenException('Invalid PIN');
        }
        return { valid: true, decoyName: camouflage.decoyName };
    }
    async createZeroKnowledgeE2EE(userId, dto) {
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
    async getZeroKnowledgeE2EE(userId) {
        return this.prisma.zeroKnowledgeE2EE.findUnique({
            where: { userId },
        });
    }
    async updateZeroKnowledgeE2EE(userId, dto) {
        const e2ee = await this.getZeroKnowledgeE2EE(userId);
        if (!e2ee) {
            throw new common_1.NotFoundException('Zero-knowledge E2EE not configured');
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
    async rotateMasterKey(userId, newMasterKey) {
        const e2ee = await this.getZeroKnowledgeE2EE(userId);
        if (!e2ee) {
            throw new common_1.NotFoundException('Zero-knowledge E2EE not configured');
        }
        return this.prisma.zeroKnowledgeE2EE.update({
            where: { userId },
            data: {
                masterKey: newMasterKey,
                lastRotated: new Date(),
            },
        });
    }
    async deleteZeroKnowledgeE2EE(userId) {
        const e2ee = await this.getZeroKnowledgeE2EE(userId);
        if (!e2ee) {
            throw new common_1.NotFoundException('Zero-knowledge E2EE not configured');
        }
        await this.prisma.zeroKnowledgeE2EE.delete({
            where: { userId },
        });
        return { message: 'Zero-knowledge E2EE deleted successfully' };
    }
    async createExifSanitizer(userId, dto) {
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
    async getExifSanitizers(userId) {
        return this.prisma.exifSanitizer.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getExifSanitizer(id, userId) {
        const sanitizer = await this.prisma.exifSanitizer.findUnique({
            where: { id },
        });
        if (!sanitizer) {
            throw new common_1.NotFoundException('EXIF sanitizer not found');
        }
        if (sanitizer.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return sanitizer;
    }
    async updateExifSanitizer(id, userId, dto) {
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
    async deleteExifSanitizer(id, userId) {
        const sanitizer = await this.getExifSanitizer(id, userId);
        await this.prisma.exifSanitizer.delete({
            where: { id },
        });
        return { message: 'EXIF sanitizer deleted successfully' };
    }
    async createScreenshotPrevention(userId, dto) {
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
    async getScreenshotPrevention(userId) {
        return this.prisma.screenshotPrevention.findUnique({
            where: { userId },
        });
    }
    async updateScreenshotPrevention(userId, dto) {
        const prevention = await this.getScreenshotPrevention(userId);
        if (!prevention) {
            throw new common_1.NotFoundException('Screenshot prevention not configured');
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
    async deleteScreenshotPrevention(userId) {
        const prevention = await this.getScreenshotPrevention(userId);
        if (!prevention) {
            throw new common_1.NotFoundException('Screenshot prevention not configured');
        }
        await this.prisma.screenshotPrevention.delete({
            where: { userId },
        });
        return { message: 'Screenshot prevention deleted successfully' };
    }
};
exports.PrivacyVaultService = PrivacyVaultService;
exports.PrivacyVaultService = PrivacyVaultService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrivacyVaultService);
//# sourceMappingURL=privacy-vault.service.js.map