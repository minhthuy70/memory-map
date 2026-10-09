import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCalculatorCamouflageDto {
  @IsString()
  secretPin: string;

  @IsString()
  decoyName: string;

  @IsOptional()
  @IsString()
  customIcon?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

export class UpdateCalculatorCamouflageDto {
  @IsOptional()
  @IsString()
  secretPin?: string;

  @IsOptional()
  @IsString()
  decoyName?: string;

  @IsOptional()
  @IsString()
  customIcon?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
