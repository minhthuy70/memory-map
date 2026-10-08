import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';

export enum Platform {
  WINDOWS = 'windows',
  MACOS = 'macos',
  LINUX = 'linux',
}

export class CreateDesktopAppDto {
  @IsEnum(Platform)
  platform: Platform;

  @IsString()
  version: string;

  @IsOptional()
  @IsString()
  installPath?: string;

  @IsOptional()
  @IsBoolean()
  systemTray?: boolean;

  @IsOptional()
  @IsString()
  shortcuts?: string; // JSON config

  @IsOptional()
  @IsBoolean()
  autoStart?: boolean;
}

export class UpdateDesktopAppDto {
  @IsOptional()
  @IsString()
  version?: string;

  @IsOptional()
  @IsString()
  installPath?: string;

  @IsOptional()
  @IsBoolean()
  systemTray?: boolean;

  @IsOptional()
  @IsString()
  shortcuts?: string;

  @IsOptional()
  @IsBoolean()
  autoStart?: boolean;
}
