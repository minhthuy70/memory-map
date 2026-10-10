import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateTravelLeaderboardDto {
  @IsString()
  circleId: string;

  @IsString()
  name: string;

  @IsString()
  type: string; // km_traversed, provinces_unlocked, steps_taken

  @IsString()
  period: string; // weekly, monthly, yearly

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateTravelLeaderboardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  period?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateLeaderboardEntryDto {
  @IsString()
  leaderboardId: string;

  @IsNumber()
  score: number;

  @IsOptional()
  @IsString()
  period?: string; // weekly, monthly, yearly
}

export class UpdateLeaderboardEntryDto {
  @IsOptional()
  @IsNumber()
  score?: number;
}
