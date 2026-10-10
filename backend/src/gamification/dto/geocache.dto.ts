import { IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';

export class CreateGeocacheDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  difficulty?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  terrain?: number;

  @IsOptional()
  @IsString()
  size?: string; // micro, small, regular, large

  @IsOptional()
  @IsString()
  riddle?: string;

  @IsOptional()
  @IsString()
  hint?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class UpdateGeocacheDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  difficulty?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  terrain?: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  riddle?: string;

  @IsOptional()
  @IsString()
  hint?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

export class CreateGeocacheLogDto {
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsString()
  logType: string; // found, not_found, note
}
