import { IsOptional, IsString } from 'class-validator';

export class CreateQRCodeStickerDto {
  @IsString()
  memoryId: string;

  @IsOptional()
  @IsString()
  description?: string;
}
