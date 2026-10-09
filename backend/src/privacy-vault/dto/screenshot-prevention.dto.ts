import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios',
}

export class CreateScreenshotPreventionDto {
  @IsBoolean()
  isEnabled: boolean;

  @IsOptional()
  @IsBoolean()
  watermarkEnabled?: boolean;

  @IsOptional()
  @IsString()
  watermarkText?: string;

  @IsOptional()
  @IsBoolean()
  blurPreview?: boolean;

  @IsEnum(Platform)
  platform: Platform;
}

export class UpdateScreenshotPreventionDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  watermarkEnabled?: boolean;

  @IsOptional()
  @IsString()
  watermarkText?: string;

  @IsOptional()
  @IsBoolean()
  blurPreview?: boolean;
}
