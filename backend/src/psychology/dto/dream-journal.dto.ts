import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateDreamJournalDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  dreamDate: string; // ISO date string

  @IsOptional()
  @IsBoolean()
  isLucid?: boolean;

  @IsOptional()
  @IsString()
  symbols?: string; // JSON array of dream symbols

  @IsOptional()
  @IsNumber()
  locationLatitude?: number;

  @IsOptional()
  @IsNumber()
  locationLongitude?: number;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsString()
  mood?: string; // happy, scary, confusing, peaceful
}

export class UpdateDreamJournalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  dreamDate?: string;

  @IsOptional()
  @IsBoolean()
  isLucid?: boolean;

  @IsOptional()
  @IsString()
  symbols?: string;

  @IsOptional()
  @IsNumber()
  locationLatitude?: number;

  @IsOptional()
  @IsNumber()
  locationLongitude?: number;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsString()
  mood?: string;
}
