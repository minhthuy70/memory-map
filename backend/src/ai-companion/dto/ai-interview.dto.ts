import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateAIInterviewDto {
  @IsString()
  question: string;
}

export class UpdateAIInterviewDto {
  @IsString()
  @IsOptional()
  answer?: string;

  @IsString()
  @IsOptional()
  audioUrl?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;
}

export class GenerateQuestionDto {
  @IsString()
  @IsOptional()
  topic?: string;
}
