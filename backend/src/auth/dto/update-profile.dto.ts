import { IsString, IsOptional, IsUrl, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  avatar?: string;
}
