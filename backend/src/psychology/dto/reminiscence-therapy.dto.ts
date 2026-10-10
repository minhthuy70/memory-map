import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateReminiscenceTherapyDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  prompt: string;

  @IsOptional()
  @IsString()
  sensoryCue?: string; // song, smell, location

  @IsOptional()
  @IsString()
  moodBefore?: string; // happy, sad, neutral
}

export class UpdateReminiscenceTherapyDto {
  @IsOptional()
  @IsString()
  response?: string;

  @IsOptional()
  @IsString()
  moodAfter?: string;
}
