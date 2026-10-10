import { IsBoolean, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateZenReflectionDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsString()
  theme?: string; // monochrome, warm, nature

  @IsOptional()
  @IsBoolean()
  hideMetrics?: boolean;

  @IsOptional()
  @IsBoolean()
  breathingReminder?: boolean;

  @IsOptional()
  @IsInt()
  breathingInterval?: number; // in minutes
}

export class UpdateZenReflectionDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsBoolean()
  hideMetrics?: boolean;

  @IsOptional()
  @IsBoolean()
  breathingReminder?: boolean;

  @IsOptional()
  @IsInt()
  breathingInterval?: number;
}
