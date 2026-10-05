import { IsString, IsBoolean, IsOptional, IsDateString, IsArray, IsEnum } from 'class-validator';

export class CreateAIJournalEntryDto {
  @IsDateString()
  date: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  photos?: string[];

  @IsArray()
  @IsOptional()
  locations?: any[];

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean;
}

export class UpdateAIJournalEntryDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsBoolean()
  @IsOptional()
  isDraft?: boolean;

  @IsBoolean()
  @IsOptional()
  isReviewed?: boolean;
}

export class GenerateJournalEntryDto {
  @IsDateString()
  date: string;

  @IsArray()
  @IsOptional()
  photoIds?: string[];
}
