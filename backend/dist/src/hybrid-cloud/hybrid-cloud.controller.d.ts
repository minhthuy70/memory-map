import { HybridCloudService } from './hybrid-cloud.service';
import { CreateOfflineSyncDto, SyncOfflineChangesDto } from './dto/offline-sync.dto';
import { CreateNASBackupDto, UpdateNASBackupDto, TriggerBackupDto } from './dto/nas-backup.dto';
import { CreateVaultExportDto, DownloadVaultExportDto } from './dto/vault-export.dto';
import { CreateUserWidgetDto, UpdateUserWidgetDto, GetWidgetsDto } from './dto/widget.dto';
import { CreateClipboardSyncDto } from './dto/clipboard-sync.dto';
export declare class HybridCloudController {
    private readonly hybridCloudService;
    constructor(hybridCloudService: HybridCloudService);
    createOfflineSync(req: any, dto: CreateOfflineSyncDto): Promise<{
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
    getPendingSyncs(req: any): Promise<{
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
    syncOfflineChanges(req: any, dto: SyncOfflineChangesDto): Promise<{
        message: string;
        syncedCount: number;
    }>;
    markSynced(id: string): Promise<{
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
    createNASBackup(req: any, dto: CreateNASBackupDto): Promise<{
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
    getNASBackups(req: any): Promise<{
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
    getNASBackup(id: string, req: any): Promise<{
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
    updateNASBackup(id: string, req: any, dto: UpdateNASBackupDto): Promise<{
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
    deleteNASBackup(id: string, req: any): Promise<{
        message: string;
    }>;
    triggerBackup(id: string, req: any, dto: TriggerBackupDto): Promise<{
        message: string;
        status: string;
    }>;
    createVaultExport(req: any, dto: CreateVaultExportDto): Promise<{
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
    getVaultExports(req: any): Promise<{
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
    getVaultExport(id: string, req: any): Promise<{
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
    verifyVaultExportAccess(dto: DownloadVaultExportDto): Promise<{
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
    deleteVaultExport(id: string, req: any): Promise<{
        message: string;
    }>;
    createUserWidget(req: any, dto: CreateUserWidgetDto): Promise<{
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
    getUserWidgets(req: any, query: GetWidgetsDto): Promise<{
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
    getUserWidget(id: string, req: any): Promise<{
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
    updateUserWidget(id: string, req: any, dto: UpdateUserWidgetDto): Promise<{
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
    deleteUserWidget(id: string, req: any): Promise<{
        message: string;
    }>;
    createClipboardSync(req: any, dto: CreateClipboardSyncDto): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        clipboardId: string;
        dataType: string;
        sourceDevice: string;
    }>;
    getClipboardSync(clipboardId: string, req: any): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        clipboardId: string;
        dataType: string;
        sourceDevice: string;
    }>;
    getClipboardSyncs(req: any): Promise<{
        data: string;
        id: string;
        userId: string;
        createdAt: Date;
        expiresAt: Date;
        clipboardId: string;
        dataType: string;
        sourceDevice: string;
    }[]>;
    deleteClipboardSync(clipboardId: string, req: any): Promise<{
        message: string;
    }>;
    cleanupExpiredClipboardSyncs(): Promise<{
        deletedCount: number;
    }>;
}
