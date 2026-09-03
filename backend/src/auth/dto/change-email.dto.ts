import { IsEmail, IsString, Length } from 'class-validator';

export class RequestEmailChangeDto {
  @IsEmail({}, { message: 'Email mới không đúng định dạng' })
  newEmail: string;
}

export class ConfirmEmailChangeDto {
  @IsEmail({}, { message: 'Email mới không đúng định dạng' })
  newEmail: string;

  @IsString({ message: 'Mã xác thực phải là chuỗi ký tự' })
  @Length(6, 6, { message: 'Mã xác nhận phải gồm đúng 6 chữ số' })
  code: string;
}
