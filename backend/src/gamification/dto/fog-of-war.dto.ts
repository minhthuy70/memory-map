import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateFogOfWarDto {
  @IsOptional()
  @IsString()
  exploredAreas?: string; // JSON array of {lat, lng, radius}

  @IsOptional()
  @IsNumber()
  totalAreaExplored?: number;

  @IsOptional()
  @IsNumber()
  worldPercentage?: number;
}

export class UpdateFogOfWarDto {
  @IsOptional()
  @IsString()
  exploredAreas?: string;

  @IsOptional()
  @IsNumber()
  totalAreaExplored?: number;

  @IsOptional()
  @IsNumber()
  worldPercentage?: number;

  @IsOptional()
  @IsString()
  lastExploreLocation?: string; // JSON {lat, lng}
}

export class ExploreAreaDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsNumber()
  radius?: number; // in meters, default 500
}
