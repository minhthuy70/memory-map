import { PrismaService } from '../prisma/prisma.service';
import { CreateOfflineSyncDto } from './dto/offline-sync.dto';
import { CreateNASBackupDto, UpdateNASBackupDto } from './dto/nas-backup.dto';
import { CreateVaultExportDto } from './dto/vault-export.dto';
import { CreateUserWidgetDto, UpdateUserWidgetDto, WidgetType } from './dto/widget.dto';
import { CreateClipboardSyncDto } from './dto/clipboard-sync.dto';
export declare class HybridCloudService {
    private prisma;
    constructor(prisma: PrismaService);
    createOfflineSync(userId: string, dto: CreateOfflineSyncDto): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        entityType: string;
        entityId: string;
        operation: string;
        syncedAt: Date | null;
        isSynced: boolean;
    }>;
    getPendingSyncs(userId: string): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        entityType: string;
        entityId: string;
        operation: string;
        syncedAt: Date | null;
        isSynced: boolean;
    }[]>;
    syncOfflineChanges(userId: string, forceSync?: boolean): Promise<{
        message: string;
        syncedCount: number;
    }>;
    markSynced(syncId: string): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        entityType: string;
        entityId: string;
        operation: string;
        syncedAt: Date | null;
        isSynced: boolean;
    }>;
    createNASBackup(userId: string, dto: CreateNASBackupDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        status: string;
        errorMessage: string | null;
        provider: string;
        backupPath: string;
        backupSize: bigint;
        lastBackupAt: Date | null;
        schedule: string;
    }>;
    getNASBackups(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        status: string;
        errorMessage: string | null;
        provider: string;
        backupPath: string;
        backupSize: bigint;
        lastBackupAt: Date | null;
        schedule: string;
    }[]>;
    getNASBackup(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        status: string;
        errorMessage: string | null;
        provider: string;
        backupPath: string;
        backupSize: bigint;
        lastBackupAt: Date | null;
        schedule: string;
    }>;
    updateNASBackup(id: string, userId: string, dto: UpdateNASBackupDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        status: string;
        errorMessage: string | null;
        provider: string;
        backupPath: string;
        backupSize: bigint;
        lastBackupAt: Date | null;
        schedule: string;
    }>;
    deleteNASBackup(id: string, userId: string): Promise<{
        message: string;
    }>;
    triggerBackup(id: string, userId: string): Promise<{
        message: string;
        status: string;
    }>;
    createVaultExport(userId: string, dto: CreateVaultExportDto): Promise<{
        id: string;
        userId: string;
        expiresAt: Date | null;
        isPublic: boolean;
        fileName: string;
        filePath: string;
        fileSize: bigint;
        exportDate: Date;
        downloadCount: number;
        accessCode: string | null;
    }>;
    getVaultExports(userId: string): Promise<{
        id: string;
        userId: string;
        expiresAt: Date | null;
        isPublic: boolean;
        fileName: string;
        filePath: string;
        fileSize: bigint;
        exportDate: Date;
        downloadCount: number;
        accessCode: string | null;
    }[]>;
    getVaultExport(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        expiresAt: Date | null;
        isPublic: boolean;
        fileName: string;
        filePath: string;
        fileSize: bigint;
        exportDate: Date;
        downloadCount: number;
        accessCode: string | null;
    }>;
    verifyVaultExportAccess(accessCode: string): Promise<{
        id: string;
        userId: string;
        expiresAt: Date | null;
        isPublic: boolean;
        fileName: string;
        filePath: string;
        fileSize: bigint;
        exportDate: Date;
        downloadCount: number;
        accessCode: string | null;
    }>;
    deleteVaultExport(id: string, userId: string): Promise<{
        message: string;
    }>;
    createUserWidget(userId: string, dto: CreateUserWidgetDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        widgetId: string;
        widgetType: string;
        widgetName: string;
        config: string;
        isEnabled: boolean;
        position: number;
    }>;
    getUserWidgets(userId: string, widgetType?: WidgetType): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        widgetId: string;
        widgetType: string;
        widgetName: string;
        config: string;
        isEnabled: boolean;
        position: number;
    }[]>;
    getUserWidget(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        widgetId: string;
        widgetType: string;
        widgetName: string;
        config: string;
        isEnabled: boolean;
        position: number;
    }>;
    updateUserWidget(id: string, userId: string, dto: UpdateUserWidgetDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        widgetId: string;
        widgetType: string;
        widgetName: string;
        config: string;
        isEnabled: boolean;
        position: number;
    }>;
    deleteUserWidget(id: string, userId: string): Promise<{
        message: string;
    }>;
    createClipboardSync(userId: string, dto: CreateClipboardSyncDto): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        clipboardId: string;
        dataType: string;
        sourceDevice: string;
    }>;
    getClipboardSync(clipboardId: string, userId: string): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        clipboardId: string;
        dataType: string;
        sourceDevice: string;
    }>;
    getClipboardSyncs(userId: string): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        clipboardId: string;
        dataType: string;
        sourceDevice: string;
    }[]>;
    deleteClipboardSync(clipboardId: string, userId: string): Promise<{
        message: string;
    }>;
    cleanupExpiredClipboardSyncs(): Promise<{
        deletedCount: number;
    }>;
}
