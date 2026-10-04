import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateEmbeddableMapWidgetDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsBoolean()
  showControls?: boolean;

  @IsOptional()
  @IsBoolean()
  showLabels?: boolean;

  @IsOptional()
  @IsString()
  customCSS?: string;
}

export class UpdateEmbeddableMapWidgetDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsBoolean()
  showControls?: boolean;

  @IsOptional()
  @IsBoolean()
  showLabels?: boolean;

  @IsOptional()
  @IsString()
  customCSS?: string;
}
