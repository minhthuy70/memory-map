import { IsString, IsOptional, IsInt, IsBoolean, IsNumber } from 'class-validator';

// Family Member
export class CreateFamilyMemberDto {
  @IsString()
  name: string;

  @IsString()
  relationship: string; // father, mother, spouse, child, grandparent

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  deathDate?: string;

  @IsOptional()
  @IsString()
  birthplace?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  spouseId?: string;
}

export class UpdateFamilyMemberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  deathDate?: string;

  @IsOptional()
  @IsString()
  birthplace?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  spouseId?: string;
}

// Ancestral Migration
export class CreateAncestralMigrationDto {
  @IsString()
  fromLocation: string;

  @IsString()
  toLocation: string;

  @IsString()
  moveDate: string;

  @IsOptional()
  @IsString()
  familyMemberId?: string;

  @IsOptional()
  @IsString()
  reason?: string; // war, work, marriage, education

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateAncestralMigrationDto {
  @IsOptional()
  @IsString()
  fromLocation?: string;

  @IsOptional()
  @IsString()
  toLocation?: string;

  @IsOptional()
  @IsString()
  moveDate?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// Oral History
export class CreateOralHistoryDto {
  @IsString()
  title: string;

  @IsString()
  speakerName: string;

  @IsString()
  relationship: string; // grandmother, grandfather, aunt, uncle

  @IsOptional()
  @IsString()
  dialect?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  transcription?: string;

  @IsOptional()
  @IsString()
  transcriptionPhonetics?: string;

  @IsString()
  recordedAt: string;
}

export class UpdateOralHistoryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  transcription?: string;

  @IsOptional()
  @IsString()
  transcriptionPhonetics?: string;
}

// Generational Comparison
export class CreateGenerationalComparisonDto {
  @IsString()
  parentPhotoUrl: string;

  @IsString()
  childPhotoUrl: string;

  @IsInt()
  parentAge: number;

  @IsInt()
  childAge: number;

  @IsOptional()
  @IsNumber()
  similarityScore?: number; // 0-1

  @IsOptional()
  @IsString()
  traits?: string; // JSON array
}

export class UpdateGenerationalComparisonDto {
  @IsOptional()
  @IsNumber()
  similarityScore?: number;

  @IsOptional()
  @IsString()
  traits?: string;
}

// Geofenced Capsule
export class CreateGeofencedCapsuleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  memoryIds: string; // JSON array

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsInt()
  radiusMeters?: number;
}

export class UpdateGeofencedCapsuleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  memoryIds?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsInt()
  radiusMeters?: number;
}

// Legacy Letter
export class CreateLegacyLetterDto {
  @IsString()
  recipientName: string;

  @IsOptional()
  @IsString()
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  recipientBirthday?: string;

  @IsOptional()
  @IsInt()
  milestoneAge?: number; // 18, 30, etc

  @IsString()
  title: string;

  @IsString()
  content: string;
}

export class UpdateLegacyLetterDto {
  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  recipientEmail?: string;

  @IsOptional()
  @IsString()
  recipientBirthday?: string;

  @IsOptional()
  @IsInt()
  milestoneAge?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}

// Digital Memorial
export class CreateDigitalMemorialDto {
  @IsString()
  deceasedName: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  deathDate?: string;

  @IsString()
  biography: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsString()
  accessCode?: string;
}

export class UpdateDigitalMemorialDto {
  @IsOptional()
  @IsString()
  deceasedName?: string;

  @IsOptional()
  @IsString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  deathDate?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
