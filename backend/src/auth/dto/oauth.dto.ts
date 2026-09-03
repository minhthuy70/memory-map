import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class OAuthDto {
  @IsIn(['google', 'facebook'], { message: 'Provider phải là google hoặc facebook' })
  provider: 'google' | 'facebook';

  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsString({ message: 'providerId là bắt buộc' })
  providerId: string;
}
