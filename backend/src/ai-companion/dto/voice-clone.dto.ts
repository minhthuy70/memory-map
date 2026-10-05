import { IsString, IsEnum, IsOptional } from 'class-validator';

export enum VoiceCloneStatus {
  TRAINING = 'training',
  READY = 'ready',
  FAILED = 'failed',
}

export class CreateVoiceCloneModelDto {
  @IsString()
  modelName: string;

  @IsString()
  sampleAudioUrl: string;
}

export class GenerateVoiceNarrationDto {
  @IsString()
  modelId: string;

  @IsString()
  text: string;
}
