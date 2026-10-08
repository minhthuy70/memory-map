import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum SynthesisTone {
  HUMOROUS = 'humorous',
  POETIC = 'poetic',
  ADVENTUROUS = 'adventurous',
  NEUTRAL = 'neutral',
}

export class CreateMemorySynthesisDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  participantIds: string; // JSON array of user IDs

  @IsString()
  memoryIds: string; // JSON array of memory IDs

  @IsEnum(SynthesisTone)
  tone: SynthesisTone;
}

export class UpdateMemorySynthesisDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  participantIds?: string;

  @IsOptional()
  @IsString()
  memoryIds?: string;

  @IsOptional()
  @IsEnum(SynthesisTone)
  tone?: SynthesisTone;

  @IsOptional()
  @IsString()
  chapters?: string;
}
