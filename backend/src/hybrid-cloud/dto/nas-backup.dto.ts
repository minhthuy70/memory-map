import { IsString, IsEnum, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export enum NASProvider {
  WEBDAV = 'webdav',
  S3 = 's3',
  DROPBOX = 'dropbox',
  ONEDRIVE = 'onedrive',
}

export enum BackupSchedule {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class CreateNASBackupDto {
  @IsEnum(NASProvider)
  provider: NASProvider;

  @IsString()
  backupPath: string;

  @IsEnum(BackupSchedule)
  @IsOptional()
  schedule?: BackupSchedule;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateNASBackupDto {
  @IsEnum(NASProvider)
  @IsOptional()
  provider?: NASProvider;

  @IsString()
  @IsOptional()
  backupPath?: string;

  @IsEnum(BackupSchedule)
  @IsOptional()
  schedule?: BackupSchedule;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class TriggerBackupDto {
  @IsString()
  backupId: string;
}

export class NASConfigDto {
  @IsString()
  provider: NASProvider;

  @IsString()
  endpoint?: string;

  @IsString()
  username?: string;

  @IsString()
  password?: string;

  @IsString()
  bucket?: string;

  @IsString()
  accessKey?: string;

  @IsString()
  secretKey?: string;
}
