import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateExifSanitizerDto {
  @IsString()
  photoId: string;

  @IsOptional()
  @IsString()
  originalExif?: string; // JSON

  @IsOptional()
  @IsBoolean()
  stripDate?: boolean;

  @IsOptional()
  @IsBoolean()
  stripGPS?: boolean;

  @IsOptional()
  @IsBoolean()
  stripCamera?: boolean;

  @IsOptional()
  @IsBoolean()
  stripDevice?: boolean;

  @IsOptional()
  @IsBoolean()
  stripNetwork?: boolean;
}

export class UpdateExifSanitizerDto {
  @IsOptional()
  @IsString()
  sanitizedExif?: string;

  @IsOptional()
  @IsBoolean()
  stripDate?: boolean;

  @IsOptional()
  @IsBoolean()
  stripGPS?: boolean;

  @IsOptional()
  @IsBoolean()
  stripCamera?: boolean;

  @IsOptional()
  @IsBoolean()
  stripDevice?: boolean;

  @IsOptional()
  @IsBoolean()
  stripNetwork?: boolean;
}
