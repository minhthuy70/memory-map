import { IsString, IsBoolean, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateVaultExportDto {
  @IsString()
  fileName: string;

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class DownloadVaultExportDto {
  @IsString()
  accessCode: string;
}

export class GetVaultExportsDto {
  @IsString()
  userId: string;
}
