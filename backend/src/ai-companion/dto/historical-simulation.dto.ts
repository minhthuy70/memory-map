import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateHistoricalSimulationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  memoryId?: string;
}

export class UpdateHistoricalSimulationDto {
  @IsOptional()
  @IsString()
  simulatedImageUrl?: string;

  @IsOptional()
  @IsString()
  historicalContext?: string;
}
