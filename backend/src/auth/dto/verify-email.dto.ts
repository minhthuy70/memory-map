import { IsEmail, IsString, Length } from 'class-validator';

export class SendVerificationCodeDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
}

export class VerifyEmailDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString({ message: 'Mã xác thực phải là chuỗi ký tự' })
  @Length(6, 6, { message: 'Mã xác thực phải gồm đúng 6 chữ số' })
  code: string;
}
