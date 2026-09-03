import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên không được vượt quá 255 ký tự' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Avatar phải là chuỗi ký tự hoặc Data URL hợp lệ' })
  avatar?: string;
}
