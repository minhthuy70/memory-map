import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVirtualWatchPartyDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  memoryId?: string;
}

export class JoinWatchPartyDto {
  @IsString()
  roomCode: string;
}
