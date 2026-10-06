import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateDuressPasswordDto {
  @IsString()
  password: string;

  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;

  @IsArray()
  @IsOptional()
  alertContacts?: string[];
}

export class VerifyDuressPasswordDto {
  @IsString()
  password: string;
}
