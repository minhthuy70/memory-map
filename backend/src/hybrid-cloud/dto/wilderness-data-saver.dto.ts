import { IsString, IsBoolean, IsOptional, IsEnum, IsInt } from 'class-validator';

export enum DataSaverMode {
  TWO_G = '2g',
  THREE_G = '3g',
  LOW_BANDWIDTH = 'low-bandwidth',
}

export enum CompressionLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export enum QualityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class CreateWildernessDataSaverDto {
  @IsBoolean()
  isEnabled: boolean;

  @IsEnum(DataSaverMode)
  mode: DataSaverMode;

  @IsEnum(CompressionLevel)
  compression: CompressionLevel;

  @IsEnum(QualityLevel)
  imageQuality: QualityLevel;

  @IsEnum(QualityLevel)
  videoQuality: QualityLevel;

  @IsOptional()
  @IsBoolean()
  vectorTiles?: boolean;

  @IsOptional()
  @IsBoolean()
  backgroundQueue?: boolean;

  @IsOptional()
  @IsInt()
  dataLimit?: number; // MB per day
}

export class UpdateWildernessDataSaverDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsEnum(DataSaverMode)
  mode?: DataSaverMode;

  @IsOptional()
  @IsEnum(CompressionLevel)
  compression?: CompressionLevel;

  @IsOptional()
  @IsEnum(QualityLevel)
  imageQuality?: QualityLevel;

  @IsOptional()
  @IsEnum(QualityLevel)
  videoQuality?: QualityLevel;

  @IsOptional()
  @IsBoolean()
  vectorTiles?: boolean;

  @IsOptional()
  @IsBoolean()
  backgroundQueue?: boolean;

  @IsOptional()
  @IsInt()
  dataLimit?: number;
}
