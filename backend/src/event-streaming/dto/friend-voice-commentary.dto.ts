import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFriendVoiceCommentaryDto {
  @IsString()
  memoryId: string;

  @IsString()
  commentatorName: string;

  @IsString()
  audioUrl: string;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
