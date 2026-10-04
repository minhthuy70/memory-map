import { IsOptional, IsString } from 'class-validator';

export class CreateVerticalStoryExportDto {
  @IsString()
  memoryId: string;

  @IsOptional()
  @IsString()
  resolution?: string;

  @IsOptional()
  @IsString()
  format?: string;
}
