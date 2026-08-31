
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Mood } from '@prisma/client';

export class CreateMemoryDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsString()
  @IsOptional()
  locationName?: string;

  @IsDate()
  memoryDate: Date;

  @IsEnum(Mood)
  mood: Mood;

  @IsString()
  categoryId: string;
}