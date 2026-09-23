import { IsEmail, IsString, Length } from 'class-validator';

export class RequestEmailChangeDto {
  @IsEmail({}, { message: 'Email mới không đúng định dạng' })
  newEmail: string;
}

/** Note: newEmail is intentionally removed — the backend reads it from DB (pendingEmail) to prevent email-swap attacks. */
export class ConfirmEmailChangeDto {
  @IsString({ message: 'Mã xác thực phải là chuỗi ký tự' })
  @Length(6, 6, { message: 'Mã xác nhận phải gồm đúng 6 chữ số' })
  code: string;
}
