import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  newPassword: string;
}
