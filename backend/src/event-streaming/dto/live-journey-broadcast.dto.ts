import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLiveJourneyBroadcastDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  beaconMode?: boolean;
}

export class UpdateLiveJourneyBroadcastDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  batteryLevel?: number;

  @IsOptional()
  @IsNumber()
  elevation?: number;
}

export class CreateLocationUpdateDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
