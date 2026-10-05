import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';

export class CreateClipboardSyncDto {
  @IsString()
  dataType: string; // location, photo, text

  @IsString()
  data: string; // JSON payload

  @IsString()
  sourceDevice: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class GetClipboardSyncDto {
  @IsString()
  clipboardId: string;
}

export class GetClipboardSyncsDto {
  @IsString()
  userId: string;
}
