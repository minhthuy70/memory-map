import { IsString, IsNotEmpty, IsOptional, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9\s\u00C0-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]+$/, {
    message: 'Tên danh mục chỉ được chứa chữ cái, số và khoảng trắng'
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2)
  icon: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Màu phải theo định dạng hex (ví dụ: #FF5733)'
  })
  color?: string;
}