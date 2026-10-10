import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateARTreasureChestDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  locationName: string;

  @IsString()
  contentType: string; // souvenir, coupon, filter

  @IsString()
  contentData: string; // JSON content
}

export class UpdateARTreasureChestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsString()
  contentType?: string;

  @IsOptional()
  @IsString()
  contentData?: string;
}

export class UnlockARTreasureChestDto {
  @IsString()
  chestId: string;
}
