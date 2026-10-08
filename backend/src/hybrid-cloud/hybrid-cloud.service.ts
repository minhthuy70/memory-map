import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOfflineSyncDto,
  SyncOfflineChangesDto,
  GetPendingSyncsDto,
  OfflineSyncOperation,
} from './dto/offline-sync.dto';
import {
  CreateNASBackupDto,
  UpdateNASBackupDto,
  TriggerBackupDto,
  NASProvider,
  BackupSchedule,
} from './dto/nas-backup.dto';
import {
  CreateVaultExportDto,
  DownloadVaultExportDto,
  GetVaultExportsDto,
} from './dto/vault-export.dto';
import {
  CreateUserWidgetDto,
  UpdateUserWidgetDto,
  GetWidgetsDto,
  WidgetType,
} from './dto/widget.dto';
import {
  CreateClipboardSyncDto,
  GetClipboardSyncDto,
  GetClipboardSyncsDto,
} from './dto/clipboard-sync.dto';
import {
  CreateDesktopAppDto,
  UpdateDesktopAppDto,
  Platform,
} from './dto/desktop-app.dto';
import {
  CreateWildernessDataSaverDto,
  UpdateWildernessDataSaverDto,
  DataSaverMode,
  CompressionLevel,
  QualityLevel,
} from './dto/wilderness-data-saver.dto';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class HybridCloudService {
  constructor(private prisma: PrismaService) {}

  // ==================== Offline Sync ====================

  async createOfflineSync(userId: string, dto: CreateOfflineSyncDto) {
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

  async getPendingSyncs(userId: string) {
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

  async syncOfflineChanges(userId: string, forceSync = false) {
    const pendingChanges = await this.getPendingSyncs(userId);

    if (pendingChanges.length === 0) {
      return { message: 'No pending changes to sync', syncedCount: 0 };
    }

    // Simulate sync logic - in production, this would apply changes to the database
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

  async markSynced(syncId: string) {
    return this.prisma.offlineSyncState.update({
      where: { id: syncId },
      data: {
        isSynced: true,
        syncedAt: new Date(),
      },
    });
  }

  // ==================== NAS Backup ====================

  async createNASBackup(userId: string, dto: CreateNASBackupDto) {
    return this.prisma.nASBackup.create({
      data: {
        user: { connect: { id: userId } },
        provider: dto.provider,
        backupPath: dto.backupPath,
        backupSize: BigInt(0),
        schedule: dto.schedule || BackupSchedule.DAILY,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async getNASBackups(userId: string) {
    return this.prisma.nASBackup.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNASBackup(id: string, userId: string) {
    const backup = await this.prisma.nASBackup.findUnique({
      where: { id },
    });

    if (!backup) {
      throw new NotFoundException('Backup not found');
    }

    if (backup.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return backup;
  }

  async updateNASBackup(id: string, userId: string, dto: UpdateNASBackupDto) {
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

  async deleteNASBackup(id: string, userId: string) {
    const backup = await this.getNASBackup(id, userId);

    await this.prisma.nASBackup.delete({
      where: { id },
    });

    return { message: 'Backup deleted successfully' };
  }

  async triggerBackup(id: string, userId: string) {
    const backup = await this.getNASBackup(id, userId);

    // Update status to running
    await this.prisma.nASBackup.update({
      where: { id },
      data: {
        status: 'running',
      },
    });

    // Simulate backup process
    // In production, this would trigger actual backup to WebDAV/S3/Dropbox
    setTimeout(async () => {
      await this.prisma.nASBackup.update({
        where: { id },
        data: {
          status: 'success',
          lastBackupAt: new Date(),
          backupSize: BigInt(Math.floor(Math.random() * 1000000000)), // Simulated size
        },
      });
    }, 5000);

    return { message: 'Backup triggered', status: 'running' };
  }

  // ==================== Vault Export ====================

  async createVaultExport(userId: string, dto: CreateVaultExportDto) {
    const accessCode = dto.isPublic ? crypto.randomBytes(16).toString('hex') : null;

    // In production, this would generate the actual HTML file
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

  async getVaultExports(userId: string) {
    return this.prisma.vaultExport.findMany({
      where: { userId },
      orderBy: { exportDate: 'desc' },
    });
  }

  async getVaultExport(id: string, userId: string) {
    const vaultExport = await this.prisma.vaultExport.findUnique({
      where: { id },
    });

    if (!vaultExport) {
      throw new NotFoundException('Vault export not found');
    }

    if (vaultExport.userId !== userId && !vaultExport.isPublic) {
      throw new ForbiddenException('Access denied');
    }

    return vaultExport;
  }

  async verifyVaultExportAccess(accessCode: string) {
    const vaultExport = await this.prisma.vaultExport.findUnique({
      where: { accessCode },
    });

    if (!vaultExport) {
      throw new NotFoundException('Invalid access code');
    }

    if (vaultExport.expiresAt && vaultExport.expiresAt < new Date()) {
      throw new ForbiddenException('Export has expired');
    }

    // Increment download count
    await this.prisma.vaultExport.update({
      where: { id: vaultExport.id },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    return vaultExport;
  }

  async deleteVaultExport(id: string, userId: string) {
    const vaultExport = await this.getVaultExport(id, userId);

    // Delete file from filesystem
    try {
      await fs.unlink(path.join(process.cwd(), vaultExport.filePath));
    } catch (error) {
      // File might not exist, continue with deletion
    }

    await this.prisma.vaultExport.delete({
      where: { id },
    });

    return { message: 'Vault export deleted successfully' };
  }

  // ==================== Widgets ====================

  async createUserWidget(userId: string, dto: CreateUserWidgetDto) {
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

  async getUserWidgets(userId: string, widgetType?: WidgetType) {
    return this.prisma.userWidget.findMany({
      where: {
        userId,
        ...(widgetType && { widgetType }),
      },
      orderBy: { position: 'asc' },
    });
  }

  async getUserWidget(id: string, userId: string) {
    const widget = await this.prisma.userWidget.findUnique({
      where: { id },
    });

    if (!widget) {
      throw new NotFoundException('Widget not found');
    }

    if (widget.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return widget;
  }

  async updateUserWidget(id: string, userId: string, dto: UpdateUserWidgetDto) {
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

  async deleteUserWidget(id: string, userId: string) {
    const widget = await this.getUserWidget(id, userId);

    await this.prisma.userWidget.delete({
      where: { id },
    });

    return { message: 'Widget deleted successfully' };
  }

  // ==================== Clipboard Sync ====================

  async createClipboardSync(userId: string, dto: CreateClipboardSyncDto) {
    const clipboardId = crypto.randomBytes(8).toString('hex');
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : new Date(Date.now() + 5 * 60 * 1000); // Default 5 minutes

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

  async getClipboardSync(clipboardId: string, userId: string) {
    const clipboard = await this.prisma.clipboardSync.findUnique({
      where: { clipboardId },
    });

    if (!clipboard) {
      throw new NotFoundException('Clipboard sync not found');
    }

    if (clipboard.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (clipboard.expiresAt < new Date()) {
      throw new ForbiddenException('Clipboard sync has expired');
    }

    return clipboard;
  }

  async getClipboardSyncs(userId: string) {
    return this.prisma.clipboardSync.findMany({
      where: {
        userId,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteClipboardSync(clipboardId: string, userId: string) {
    const clipboard = await this.getClipboardSync(clipboardId, userId);

    await this.prisma.clipboardSync.delete({
      where: { clipboardId },
    });

    return { message: 'Clipboard sync deleted successfully' };
  }

  // ==================== Cleanup ====================

  async cleanupExpiredClipboardSyncs() {
    const result = await this.prisma.clipboardSync.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });

    return { deletedCount: result.count };
  }

  // ==================== Desktop App ====================

  async createDesktopApp(userId: string, dto: CreateDesktopAppDto) {
    return this.prisma.desktopApp.create({
      data: {
        user: { connect: { id: userId } },
        platform: dto.platform,
        version: dto.version,
        installPath: dto.installPath,
        systemTray: dto.systemTray ?? false,
        shortcuts: dto.shortcuts ? dto.shortcuts : '{}',
        autoStart: dto.autoStart ?? false,
      },
    });
  }

  async getDesktopApps(userId: string, platform?: Platform) {
    return this.prisma.desktopApp.findMany({
      where: {
        userId,
        ...(platform && { platform }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDesktopApp(id: string, userId: string) {
    const app = await this.prisma.desktopApp.findUnique({
      where: { id },
    });

    if (!app) {
      throw new NotFoundException('Desktop app not found');
    }

    if (app.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return app;
  }

  async updateDesktopApp(id: string, userId: string, dto: UpdateDesktopAppDto) {
    const app = await this.getDesktopApp(id, userId);

    return this.prisma.desktopApp.update({
      where: { id },
      data: {
        ...(dto.version && { version: dto.version }),
        ...(dto.installPath !== undefined && { installPath: dto.installPath }),
        ...(dto.systemTray !== undefined && { systemTray: dto.systemTray }),
        ...(dto.shortcuts && { shortcuts: dto.shortcuts }),
        ...(dto.autoStart !== undefined && { autoStart: dto.autoStart }),
      },
    });
  }

  async deleteDesktopApp(id: string, userId: string) {
    const app = await this.getDesktopApp(id, userId);

    await this.prisma.desktopApp.delete({
      where: { id },
    });

    return { message: 'Desktop app deleted successfully' };
  }

  async updateDesktopAppSync(id: string, userId: string) {
    const app = await this.getDesktopApp(id, userId);

    return this.prisma.desktopApp.update({
      where: { id },
      data: {
        lastSync: new Date(),
      },
    });
  }

  // ==================== Wilderness Data Saver ====================

  async createWildernessDataSaver(userId: string, dto: CreateWildernessDataSaverDto) {
    return this.prisma.wildernessDataSaver.create({
      data: {
        user: { connect: { id: userId } },
        isEnabled: dto.isEnabled,
        mode: dto.mode,
        compression: dto.compression,
        imageQuality: dto.imageQuality,
        videoQuality: dto.videoQuality,
        vectorTiles: dto.vectorTiles ?? true,
        backgroundQueue: dto.backgroundQueue ?? true,
        dataLimit: dto.dataLimit,
      },
    });
  }

  async getWildernessDataSaver(userId: string) {
    return this.prisma.wildernessDataSaver.findUnique({
      where: { userId },
    });
  }

  async updateWildernessDataSaver(userId: string, dto: UpdateWildernessDataSaverDto) {
    const saver = await this.getWildernessDataSaver(userId);

    if (!saver) {
      throw new NotFoundException('Wilderness data saver config not found');
    }

    return this.prisma.wildernessDataSaver.update({
      where: { userId },
      data: {
        ...(dto.isEnabled !== undefined && { isEnabled: dto.isEnabled }),
        ...(dto.mode && { mode: dto.mode }),
        ...(dto.compression && { compression: dto.compression }),
        ...(dto.imageQuality && { imageQuality: dto.imageQuality }),
        ...(dto.videoQuality && { videoQuality: dto.videoQuality }),
        ...(dto.vectorTiles !== undefined && { vectorTiles: dto.vectorTiles }),
        ...(dto.backgroundQueue !== undefined && { backgroundQueue: dto.backgroundQueue }),
        ...(dto.dataLimit !== undefined && { dataLimit: dto.dataLimit }),
      },
    });
  }

  async triggerWildernessMode(userId: string) {
    const saver = await this.getWildernessDataSaver(userId);

    if (!saver) {
      throw new NotFoundException('Wilderness data saver config not found');
    }

    return this.prisma.wildernessDataSaver.update({
      where: { userId },
      data: {
        isEnabled: true,
        lastTriggered: new Date(),
      },
    });
  }

  async disableWildernessMode(userId: string) {
    const saver = await this.getWildernessDataSaver(userId);

    if (!saver) {
      throw new NotFoundException('Wilderness data saver config not found');
    }

    return this.prisma.wildernessDataSaver.update({
      where: { userId },
      data: {
        isEnabled: false,
      },
    });
  }
}
