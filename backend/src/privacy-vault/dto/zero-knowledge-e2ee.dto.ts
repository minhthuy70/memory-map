import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateZeroKnowledgeE2EEDto {
  @IsString()
  masterKey: string;

  @IsOptional()
  @IsString()
  algorithm?: string;

  @IsOptional()
  @IsString()
  keyDerivation?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

export class UpdateZeroKnowledgeE2EEDto {
  @IsOptional()
  @IsString()
  masterKey?: string;

  @IsOptional()
  @IsString()
  algorithm?: string;

  @IsOptional()
  @IsString()
  keyDerivation?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}
