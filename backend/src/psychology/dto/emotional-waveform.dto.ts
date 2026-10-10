import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateEmotionalWaveformDto {
  @IsString()
  date: string; // ISO date string

  @IsString()
  mood: string; // happiness, sadness, anger, peace, stress, excitement

  @IsNumber()
  intensity: number; // 0-1

  @IsOptional()
  @IsString()
  lifeChapter?: string; // college, travel, marriage, career

  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateEmotionalWaveformDto {
  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @IsNumber()
  intensity?: number;

  @IsOptional()
  @IsString()
  lifeChapter?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
