import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateInnerChildDialogueDto {
  @IsOptional()
  @IsString()
  childhoodPhotoUrl?: string;

  @IsInt()
  age: number;

  @IsString()
  prompt: string;

  @IsString()
  response: string;

  @IsOptional()
  @IsString()
  emotionalTone?: string; // compassionate, curious, sad, hopeful

  @IsOptional()
  @IsString()
  reflectionType?: string; // healing, milestone, gratitude
}
