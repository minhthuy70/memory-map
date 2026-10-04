import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTemporarySharedLinkDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsOptional()
  @IsString()
  passcode?: string;

  @IsOptional()
  @IsNumber()
  maxViews?: number;

  @Type(() => Date)
  @IsDate()
  expiresAt: Date;
}

export class AccessSharedLinkDto {
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  passcode?: string;
}
