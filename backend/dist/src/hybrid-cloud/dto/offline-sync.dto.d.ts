export declare enum OfflineSyncOperation {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete"
}
export declare class CreateOfflineSyncDto {
    entityType: string;
    entityId: string;
    operation: OfflineSyncOperation;
    data: string;
}
export declare class SyncOfflineChangesDto {
    userId: string;
    forceSync?: boolean;
}
export declare class GetPendingSyncsDto {
    userId: string;
}
