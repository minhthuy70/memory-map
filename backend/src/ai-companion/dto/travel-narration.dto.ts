import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';

export enum NarrationTone {
  HUMOROUS = 'humorous',
  POETIC = 'poetic',
  ADVENTUROUS = 'adventurous',
  NEUTRAL = 'neutral',
}

export class CreateTravelNarrationDto {
  @IsString()
  routeData: string; // JSON array of map pins and timestamps

  @IsEnum(NarrationTone)
  tone: NarrationTone;

  @IsOptional()
  @IsString()
  tripId?: string;
}

export class UpdateTravelNarrationDto {
  @IsOptional()
  @IsString()
  routeData?: string;

  @IsOptional()
  @IsEnum(NarrationTone)
  tone?: NarrationTone;

  @IsOptional()
  @IsString()
  content?: string;
}
