import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Mã token không hợp lệ' })
  token: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự' })
  newPassword: string;
}
