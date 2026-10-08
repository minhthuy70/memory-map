import { IsString, IsNumber, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum StressLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class CreatePredictiveResurfacingDto {
  @IsString()
  memoryId: string;

  @IsNumber()
  sentimentScore: number; // -1.0 to 1.0

  @IsEnum(StressLevel)
  stressLevel: StressLevel;

  @IsString()
  scheduledAt: string; // ISO date string
}

export class UpdatePredictiveResurfacingDto {
  @IsOptional()
  @IsBoolean()
  wasViewed?: boolean;

  @IsOptional()
  @IsString()
  userFeedback?: string; // helpful, not-helpful
}
