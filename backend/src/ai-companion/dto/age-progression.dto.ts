import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAgeProgressionDto {
  @IsString()
  originalPhotoUrl: string;

  @IsNumber()
  ageAdjustment: number; // -10 for 10 years younger, +20 for 20 years older

  @IsOptional()
  @IsString()
  memoryId?: string;
}

export class UpdateAgeProgressionDto {
  @IsOptional()
  @IsString()
  youngerPhotoUrl?: string;

  @IsOptional()
  @IsString()
  olderPhotoUrl?: string;
}
