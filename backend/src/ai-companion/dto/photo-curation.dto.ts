import { IsString, IsBoolean, IsOptional, IsNumber, IsArray, IsEnum } from 'class-validator';

export class CreatePhotoCurationDto {
  @IsString()
  memoryId: string;

  @IsString()
  photoId: string;

  @IsNumber()
  aestheticScore: number;

  @IsNumber()
  focusScore: number;

  @IsNumber()
  smileScore: number;

  @IsNumber()
  overallScore: number;

  @IsBoolean()
  @IsOptional()
  isHighlighted?: boolean;

  @IsBoolean()
  @IsOptional()
  isRejected?: boolean;

  @IsArray()
  @IsOptional()
  reasons?: string[];
}

export class UpdatePhotoCurationDto {
  @IsBoolean()
  @IsOptional()
  isHighlighted?: boolean;

  @IsBoolean()
  @IsOptional()
  isRejected?: boolean;
}

export class BatchCurationDto {
  @IsString()
  memoryId: string;

  @IsArray()
  photoIds: string[];
}
