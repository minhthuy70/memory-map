import { IsString, IsOptional, IsInt, IsBoolean, IsNumber } from 'class-validator';

// Memory Stories
export class CreateMemoryStoryDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  mediaUrl: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  privacy?: string; // public, close_friends, private

  @IsOptional()
  @IsString()
  stickers?: string; // JSON

  @IsOptional()
  @IsString()
  musicUrl?: string;
}

export class UpdateMemoryStoryDto {
  @IsOptional()
  @IsString()
  privacy?: string;

  @IsOptional()
  @IsString()
  stickers?: string;
}

// Community Map Feed
export class CreateCommunityMapFeedDto {
  @IsString()
  memoryId: string;

  @IsString()
  location: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  mood?: string;
}

export class UpdateCommunityMapFeedDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  mood?: string;

  @IsOptional()
  @IsBoolean()
  isSafe?: boolean;
}

// Nearby Friends Ping
export class CreateNearbyFriendsPingDto {
  @IsString()
  friendId: string;

  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsNumber()
  distance: number;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  threshold?: number; // meters
}

export class UpdateNearbyFriendsPingDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsInt()
  threshold?: number;
}

// Co-presence Suggestion
export class CreateCoPresenceSuggestionDto {
  @IsString()
  location: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  detectedUsers: string; // JSON
}

// Exploration Challenge
export class CreateExplorationChallengeDto {
  @IsString()
  challengeType: string; // vietnam_provinces, lighthouses, extreme_poles

  @IsInt()
  targetCount: number;
}

export class UpdateExplorationChallengeDto {
  @IsOptional()
  @IsInt()
  progress?: number;

  @IsOptional()
  @IsString()
  badgeUrl?: string;
}

// Memory Contest
export class CreateMemoryContestDto {
  @IsString()
  title: string;

  @IsString()
  theme: string;

  @IsString()
  description: string;

  @IsString()
  submissionIds: string; // JSON

  @IsString()
  deadline: string;

  @IsString()
  votingEndsAt: string;
}

export class UpdateMemoryContestDto {
  @IsOptional()
  @IsString()
  winnerId?: string;

  @IsOptional()
  @IsString()
  badgeUrl?: string;
}

// Digital Postcard
export class CreateDigitalPostcardDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  recipientEmail: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  stampUrl?: string;

  @IsString()
  postcardUrl: string;
}

// Memory Penpal
export class CreateMemoryPenpalDto {
  @IsString()
  penpalId: string;

  @IsString()
  language: string;

  @IsString()
  interests: string; // JSON

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class UpdateMemoryPenpalDto {
  @IsOptional()
  @IsString()
  status?: string; // pending, active, ended
}
