import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateBinauralSoundTherapyDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  frequency: string; // alpha, theta, delta, 432hz

  @IsInt()
  duration: number; // in minutes

  @IsOptional()
  @IsString()
  natureSound?: string; // rain, ocean, forest, birds

  @IsOptional()
  @IsString()
  moodBefore?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateBinauralSoundTherapyDto {
  @IsOptional()
  @IsString()
  moodAfter?: string;
}
