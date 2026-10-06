import { IsString, IsBoolean, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

export enum VaultType {
  STANDARD = 'standard',
  DOUBLE_LOCK = 'double-lock',
  EPHEMERAL = 'ephemeral',
}

export class CreateVaultMemoryDto {
  @IsString()
  memoryId: string;

  @IsEnum(VaultType)
  vaultType: VaultType;

  @IsString()
  @IsOptional()
  encryptionKey?: string;

  @IsNumber()
  @IsOptional()
  maxViews?: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class UpdateVaultMemoryDto {
  @IsEnum(VaultType)
  @IsOptional()
  vaultType?: VaultType;

  @IsBoolean()
  @IsOptional()
  isEncrypted?: boolean;

  @IsNumber()
  @IsOptional()
  maxViews?: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class AccessVaultMemoryDto {
  @IsString()
  accessMethod: string; // biometric, password, both
}
