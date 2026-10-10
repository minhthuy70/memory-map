export declare class CreateFamilyMemberDto {
    name: string;
    relationship: string;
    birthDate?: string;
    deathDate?: string;
    birthplace?: string;
    photoUrl?: string;
    biography?: string;
    parentId?: string;
    spouseId?: string;
}
export declare class UpdateFamilyMemberDto {
    name?: string;
    relationship?: string;
    birthDate?: string;
    deathDate?: string;
    birthplace?: string;
    photoUrl?: string;
    biography?: string;
    parentId?: string;
    spouseId?: string;
}
export declare class CreateAncestralMigrationDto {
    fromLocation: string;
    toLocation: string;
    moveDate: string;
    familyMemberId?: string;
    reason?: string;
    description?: string;
}
export declare class UpdateAncestralMigrationDto {
    fromLocation?: string;
    toLocation?: string;
    moveDate?: string;
    reason?: string;
    description?: string;
}
export declare class CreateOralHistoryDto {
    title: string;
    speakerName: string;
    relationship: string;
    dialect?: string;
    audioUrl?: string;
    transcription?: string;
    transcriptionPhonetics?: string;
    recordedAt: string;
}
export declare class UpdateOralHistoryDto {
    title?: string;
    transcription?: string;
    transcriptionPhonetics?: string;
}
export declare class CreateGenerationalComparisonDto {
    parentPhotoUrl: string;
    childPhotoUrl: string;
    parentAge: number;
    childAge: number;
    similarityScore?: number;
    traits?: string;
}
export declare class UpdateGenerationalComparisonDto {
    similarityScore?: number;
    traits?: string;
}
export declare class CreateGeofencedCapsuleDto {
    title: string;
    description: string;
    memoryIds: string;
    latitude: number;
    longitude: number;
    radiusMeters?: number;
}
export declare class UpdateGeofencedCapsuleDto {
    title?: string;
    description?: string;
    memoryIds?: string;
    latitude?: number;
    longitude?: number;
    radiusMeters?: number;
}
export declare class CreateLegacyLetterDto {
    recipientName: string;
    recipientEmail?: string;
    recipientBirthday?: string;
    milestoneAge?: number;
    title: string;
    content: string;
}
export declare class UpdateLegacyLetterDto {
    recipientName?: string;
    recipientEmail?: string;
    recipientBirthday?: string;
    milestoneAge?: number;
    title?: string;
    content?: string;
}
export declare class CreateDigitalMemorialDto {
    deceasedName: string;
    birthDate?: string;
    deathDate?: string;
    biography: string;
    photoUrl?: string;
    isPublic?: boolean;
    accessCode?: string;
}
export declare class UpdateDigitalMemorialDto {
    deceasedName?: string;
    birthDate?: string;
    deathDate?: string;
    biography?: string;
    photoUrl?: string;
    isPublic?: boolean;
}
