import { IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEventGuestWallDto {
  @IsString()
  title: string;

  @IsString()
  eventType: string;

  @Type(() => Date)
  @IsDate()
  eventDate: Date;
}

export class CreateGuestContributionDto {
  @IsString()
  guestName: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
