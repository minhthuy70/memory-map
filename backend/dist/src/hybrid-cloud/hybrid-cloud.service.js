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
exports.HybridCloudService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const nas_backup_dto_1 = require("./dto/nas-backup.dto");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let HybridCloudService = class HybridCloudService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOfflineSync(userId, dto) {
        return this.prisma.offlineSyncState.create({
            data: {
                user: { connect: { id: userId } },
                entityType: dto.entityType,
                entityId: dto.entityId,
                operation: dto.operation,
                data: dto.data,
            },
        });
    }
    async getPendingSyncs(userId) {
        return this.prisma.offlineSyncState.findMany({
            where: {
                userId,
                isSynced: false,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
    async syncOfflineChanges(userId, forceSync = false) {
        const pendingChanges = await this.getPendingSyncs(userId);
        if (pendingChanges.length === 0) {
            return { message: 'No pending changes to sync', syncedCount: 0 };
        }
        const syncedCount = pendingChanges.length;
        await this.prisma.offlineSyncState.updateMany({
            where: {
                userId,
                isSynced: false,
            },
            data: {
                isSynced: true,
                syncedAt: new Date(),
            },
        });
        return { message: 'Sync completed', syncedCount };
    }
    async markSynced(syncId) {
        return this.prisma.offlineSyncState.update({
            where: { id: syncId },
            data: {
                isSynced: true,
                syncedAt: new Date(),
            },
        });
    }
    async createNASBackup(userId, dto) {
        return this.prisma.nASBackup.create({
            data: {
                user: { connect: { id: userId } },
                provider: dto.provider,
                backupPath: dto.backupPath,
                backupSize: BigInt(0),
                schedule: dto.schedule || nas_backup_dto_1.BackupSchedule.DAILY,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async getNASBackups(userId) {
        return this.prisma.nASBackup.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getNASBackup(id, userId) {
        const backup = await this.prisma.nASBackup.findUnique({
            where: { id },
        });
        if (!backup) {
            throw new common_1.NotFoundException('Backup not found');
        }
        if (backup.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return backup;
    }
    async updateNASBackup(id, userId, dto) {
        const backup = await this.getNASBackup(id, userId);
        return this.prisma.nASBackup.update({
            where: { id },
            data: {
                ...(dto.provider && { provider: dto.provider }),
                ...(dto.backupPath && { backupPath: dto.backupPath }),
                ...(dto.schedule && { schedule: dto.schedule }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
            },
        });
    }
    async deleteNASBackup(id, userId) {
        const backup = await this.getNASBackup(id, userId);
        await this.prisma.nASBackup.delete({
            where: { id },
        });
        return { message: 'Backup deleted successfully' };
    }
    async triggerBackup(id, userId) {
        const backup = await this.getNASBackup(id, userId);
        await this.prisma.nASBackup.update({
            where: { id },
            data: {
                status: 'running',
            },
        });
        setTimeout(async () => {
            await this.prisma.nASBackup.update({
                where: { id },
                data: {
                    status: 'success',
                    lastBackupAt: new Date(),
                    backupSize: BigInt(Math.floor(Math.random() * 1000000000)),
                },
            });
        }, 5000);
        return { message: 'Backup triggered', status: 'running' };
    }
    async createVaultExport(userId, dto) {
        const accessCode = dto.isPublic ? crypto.randomBytes(16).toString('hex') : null;
        const exportData = await this.prisma.vaultExport.create({
            data: {
                user: { connect: { id: userId } },
                fileName: dto.fileName,
                filePath: `/exports/${userId}/${dto.fileName}.html`,
                fileSize: BigInt(0),
                isPublic: dto.isPublic ?? false,
                accessCode,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
            },
        });
        return exportData;
    }
    async getVaultExports(userId) {
        return this.prisma.vaultExport.findMany({
            where: { userId },
            orderBy: { exportDate: 'desc' },
        });
    }
    async getVaultExport(id, userId) {
        const vaultExport = await this.prisma.vaultExport.findUnique({
            where: { id },
        });
        if (!vaultExport) {
            throw new common_1.NotFoundException('Vault export not found');
        }
        if (vaultExport.userId !== userId && !vaultExport.isPublic) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return vaultExport;
    }
    async verifyVaultExportAccess(accessCode) {
        const vaultExport = await this.prisma.vaultExport.findUnique({
            where: { accessCode },
        });
        if (!vaultExport) {
            throw new common_1.NotFoundException('Invalid access code');
        }
        if (vaultExport.expiresAt && vaultExport.expiresAt < new Date()) {
            throw new common_1.ForbiddenException('Export has expired');
        }
        await this.prisma.vaultExport.update({
            where: { id: vaultExport.id },
            data: {
                downloadCount: { increment: 1 },
            },
        });
        return vaultExport;
    }
    async deleteVaultExport(id, userId) {
        const vaultExport = await this.getVaultExport(id, userId);
        try {
            await fs.unlink(path.join(process.cwd(), vaultExport.filePath));
        }
        catch (error) {
        }
        await this.prisma.vaultExport.delete({
            where: { id },
        });
        return { message: 'Vault export deleted successfully' };
    }
    async createUserWidget(userId, dto) {
        return this.prisma.userWidget.create({
            data: {
                user: { connect: { id: userId } },
                widgetType: dto.widgetType,
                widgetId: dto.widgetId,
                widgetName: dto.widgetName,
                config: dto.config,
                isEnabled: dto.isEnabled ?? true,
                position: dto.position ?? 0,
            },
        });
    }
    async getUserWidgets(userId, widgetType) {
        return this.prisma.userWidget.findMany({
            where: {
                userId,
                ...(widgetType && { widgetType }),
            },
            orderBy: { position: 'asc' },
        });
    }
    async getUserWidget(id, userId) {
        const widget = await this.prisma.userWidget.findUnique({
            where: { id },
        });
        if (!widget) {
            throw new common_1.NotFoundException('Widget not found');
        }
        if (widget.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return widget;
    }
    async updateUserWidget(id, userId, dto) {
        const widget = await this.getUserWidget(id, userId);
        return this.prisma.userWidget.update({
            where: { id },
            data: {
                ...(dto.widgetName && { widgetName: dto.widgetName }),
                ...(dto.config && { config: dto.config }),
                ...(dto.isEnabled !== undefined && { isEnabled: dto.isEnabled }),
                ...(dto.position !== undefined && { position: dto.position }),
            },
        });
    }
    async deleteUserWidget(id, userId) {
        const widget = await this.getUserWidget(id, userId);
        await this.prisma.userWidget.delete({
            where: { id },
        });
        return { message: 'Widget deleted successfully' };
    }
    async createClipboardSync(userId, dto) {
        const clipboardId = crypto.randomBytes(8).toString('hex');
        const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : new Date(Date.now() + 5 * 60 * 1000);
        return this.prisma.clipboardSync.create({
            data: {
                user: { connect: { id: userId } },
                clipboardId,
                dataType: dto.dataType,
                data: dto.data,
                sourceDevice: dto.sourceDevice,
                expiresAt,
            },
        });
    }
    async getClipboardSync(clipboardId, userId) {
        const clipboard = await this.prisma.clipboardSync.findUnique({
            where: { clipboardId },
        });
        if (!clipboard) {
            throw new common_1.NotFoundException('Clipboard sync not found');
        }
        if (clipboard.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        if (clipboard.expiresAt < new Date()) {
            throw new common_1.ForbiddenException('Clipboard sync has expired');
        }
        return clipboard;
    }
    async getClipboardSyncs(userId) {
        return this.prisma.clipboardSync.findMany({
            where: {
                userId,
                expiresAt: { gte: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async deleteClipboardSync(clipboardId, userId) {
        const clipboard = await this.getClipboardSync(clipboardId, userId);
        await this.prisma.clipboardSync.delete({
            where: { clipboardId },
        });
        return { message: 'Clipboard sync deleted successfully' };
    }
    async cleanupExpiredClipboardSyncs() {
        const result = await this.prisma.clipboardSync.deleteMany({
            where: {
                expiresAt: { lt: new Date() },
            },
        });
        return { deletedCount: result.count };
    }
};
exports.HybridCloudService = HybridCloudService;
exports.HybridCloudService = HybridCloudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HybridCloudService);
//# sourceMappingURL=hybrid-cloud.service.js.map