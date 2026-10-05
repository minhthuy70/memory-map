export declare enum NASProvider {
    WEBDAV = "webdav",
    S3 = "s3",
    DROPBOX = "dropbox",
    ONEDRIVE = "onedrive"
}
export declare enum BackupSchedule {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly"
}
export declare class CreateNASBackupDto {
    provider: NASProvider;
    backupPath: string;
    schedule?: BackupSchedule;
    isActive?: boolean;
}
export declare class UpdateNASBackupDto {
    provider?: NASProvider;
    backupPath?: string;
    schedule?: BackupSchedule;
    isActive?: boolean;
}
export declare class TriggerBackupDto {
    backupId: string;
}
export declare class NASConfigDto {
    provider: NASProvider;
    endpoint?: string;
    username?: string;
    password?: string;
    bucket?: string;
    accessKey?: string;
    secretKey?: string;
}
