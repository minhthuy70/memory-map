import { IsString, IsOptional, IsInt, IsNumber, IsBoolean } from 'class-validator';

// Handwriting Canvas
export class CreateHandwritingCanvasDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsString()
  drawingData: string; // JSON of stroke paths

  @IsString()
  brushType: string; // pen, pencil, highlighter

  @IsString()
  brushColor: string;

  @IsInt()
  brushSize: number;
}

export class UpdateHandwritingCanvasDto {
  @IsOptional()
  @IsString()
  drawingData?: string;

  @IsOptional()
  @IsString()
  brushType?: string;

  @IsOptional()
  @IsString()
  brushColor?: string;

  @IsOptional()
  @IsInt()
  brushSize?: number;
}

// Vintage Film Emulation
export class CreateVintageFilmDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  originalImageUrl: string;

  @IsString()
  filterType: string; // kodak_portra, fuji_velvia, ilford_bw, polaroid, vhs

  @IsNumber()
  intensity: number; // 0-1

  @IsNumber()
  grainAmount: number; // 0-1

  @IsOptional()
  @IsString()
  lightLeak?: string; // JSON color and position

  @IsOptional()
  @IsString()
  dateStamp?: string; // overlay text
}

export class UpdateVintageFilmDto {
  @IsOptional()
  @IsString()
  filterType?: string;

  @IsOptional()
  @IsNumber()
  intensity?: number;

  @IsOptional()
  @IsNumber()
  grainAmount?: number;

  @IsOptional()
  @IsString()
  lightLeak?: string;

  @IsOptional()
  @IsString()
  dateStamp?: string;

  @IsOptional()
  @IsString()
  processedImageUrl?: string;
}

// Live Photo Motion Viewer
export class CreateLivePhotoDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  photoUrl: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsString()
  platform: string; // ios, android

  @IsOptional()
  @IsInt()
  duration?: number; // seconds

  @IsOptional()
  @IsBoolean()
  isLoop?: boolean;
}

export class UpdateLivePhotoDto {
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  keyframeUrl?: string;

  @IsOptional()
  @IsBoolean()
  isLoop?: boolean;
}

// Before/After Slider
export class CreateBeforeAfterSliderDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  beforeImageUrl: string;

  @IsString()
  afterImageUrl: string;

  @IsOptional()
  @IsString()
  orientation?: string; // horizontal, vertical

  @IsOptional()
  @IsNumber()
  sliderPosition?: number; // 0-1

  @IsOptional()
  @IsString()
  blendMode?: string; // normal, multiply, screen, overlay
}

export class UpdateBeforeAfterSliderDto {
  @IsOptional()
  @IsString()
  beforeImageUrl?: string;

  @IsOptional()
  @IsString()
  afterImageUrl?: string;

  @IsOptional()
  @IsString()
  orientation?: string;

  @IsOptional()
  @IsNumber()
  sliderPosition?: number;

  @IsOptional()
  @IsString()
  blendMode?: string;
}

// Typography Stamp Studio
export class CreateTypographyStampDto {
  @IsString()
  text: string;

  @IsString()
  fontName: string;

  @IsInt()
  fontSize: number;

  @IsString()
  fontColor: string;

  @IsString()
  stampType: string; // postmark, wax_seal, watermark

  @IsInt()
  positionX: number;

  @IsInt()
  positionY: number;

  @IsOptional()
  @IsInt()
  rotation?: number;

  @IsOptional()
  @IsString()
  memoryId?: string;
}

export class UpdateTypographyStampDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  fontName?: string;

  @IsOptional()
  @IsInt()
  fontSize?: number;

  @IsOptional()
  @IsString()
  fontColor?: string;

  @IsOptional()
  @IsString()
  stampType?: string;

  @IsOptional()
  @IsInt()
  positionX?: number;

  @IsOptional()
  @IsInt()
  positionY?: number;

  @IsOptional()
  @IsInt()
  rotation?: number;
}

// Beat Sync Video Generator
export class CreateBeatSyncVideoDto {
  @IsString()
  memoryIds: string; // JSON array

  @IsString()
  audioUrl: string;

  @IsString()
  beatPattern: string; // JSON of beat timestamps

  @IsOptional()
  @IsString()
  pacing?: string; // energetic, chill, custom

  @IsOptional()
  @IsString()
  transitionStyle?: string; // fade, slide, zoom, wipe
}

export class UpdateBeatSyncVideoDto {
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

// AI Voiceover Commentary
export class CreateAIVoiceoverDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  audioUrl: string;

  @IsInt()
  duration: number; // seconds

  @IsOptional()
  @IsString()
  transcript?: string;

  @IsString()
  timestamps: string; // JSON of photo timestamps

  @IsNumber()
  noiseLevel: number; // 0-1

  @IsString()
  vocalFilter: string; // broadcast, warm, natural
}

export class UpdateAIVoiceoverDto {
  @IsOptional()
  @IsString()
  transcript?: string;

  @IsOptional()
  @IsNumber()
  noiseLevel?: number;

  @IsOptional()
  @IsString()
  vocalFilter?: string;
}

// Memory Soundtrack Mashup
export class CreateMemorySoundtrackDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsOptional()
  @IsString()
  spotifyTrackId?: string;

  @IsOptional()
  @IsString()
  fieldRecordingUrl?: string;

  @IsString()
  mixSettings: string; // JSON of volume levels, ducking, fade

  @IsInt()
  duration: number; // seconds
}

export class UpdateMemorySoundtrackDto {
  @IsOptional()
  @IsString()
  spotifyTrackId?: string;

  @IsOptional()
  @IsString()
  fieldRecordingUrl?: string;

  @IsOptional()
  @IsString()
  mixSettings?: string;

  @IsOptional()
  @IsString()
  outputUrl?: string;
}
