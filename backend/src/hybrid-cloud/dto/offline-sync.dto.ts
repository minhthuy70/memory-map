import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export enum OfflineSyncOperation {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export class CreateOfflineSyncDto {
  @IsString()
  entityType: string;

  @IsString()
  entityId: string;

  @IsEnum(OfflineSyncOperation)
  operation: OfflineSyncOperation;

  @IsString()
  data: string; // JSON payload
}

export class SyncOfflineChangesDto {
  @IsString()
  userId: string;

  @IsBoolean()
  @IsOptional()
  forceSync?: boolean;
}

export class GetPendingSyncsDto {
  @IsString()
  userId: string;
}
