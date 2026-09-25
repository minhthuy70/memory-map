import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EnableTwoFactorDto {
  @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
  @IsString({ message: 'Mã xác thực phải là chuỗi ký tự' })
  code: string;
}

export class DisableTwoFactorDto {
  @IsOptional()
  @IsString({ message: 'Mã xác thực phải là chuỗi ký tự' })
  code?: string;

  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  password?: string;
}

export class VerifyTwoFactorLoginDto {
  @IsNotEmpty({ message: 'Token tạm thời không được để trống' })
  @IsString({ message: 'Token tạm thời phải là chuỗi ký tự' })
  tempToken: string;

  @IsNotEmpty({ message: 'Mã xác thực không được để trống' })
  @IsString({ message: 'Mã xác thực phải là chuỗi ký tự' })
  code: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
