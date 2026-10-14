import { IsString, IsOptional, IsInt, IsNumber, IsBoolean } from 'class-validator';

// Terrain Elevation
export class CreateTerrainElevationDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  locationName: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  elevation: number; // meters

  @IsOptional()
  @IsNumber()
  steepness?: number; // gradient percentage

  @IsOptional()
  @IsString()
  demData?: string; // JSON of elevation grid
}

export class UpdateTerrainElevationDto {
  @IsOptional()
  @IsNumber()
  elevation?: number;

  @IsOptional()
  @IsNumber()
  steepness?: number;

  @IsOptional()
  @IsString()
  demData?: string;
}

// Flight Path 3D
export class CreateFlightPath3DDto {
  @IsOptional()
  @IsString()
  itineraryId?: string;

  @IsString()
  fromLocation: string;

  @IsString()
  toLocation: string;

  @IsString()
  waypoints: string; // JSON of coordinates

  @IsInt()
  duration: number; // seconds

  @IsOptional()
  @IsBoolean()
  cloudsEffect?: boolean;
}

export class UpdateFlightPath3DDto {
  @IsOptional()
  @IsString()
  flightPath?: string;

  @IsOptional()
  @IsBoolean()
  cloudsEffect?: boolean;
}

// Landmark 3D
export class CreateLandmark3DDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  modelUrl: string; // glTF/GLB file

  @IsString()
  modelType: string; // gltf, glb

  @IsOptional()
  @IsNumber()
  scale?: number;

  @IsOptional()
  @IsNumber()
  rotation?: number;
}

export class UpdateLandmark3DDto {
  @IsOptional()
  @IsString()
  modelUrl?: string;

  @IsOptional()
  @IsNumber()
  scale?: number;

  @IsOptional()
  @IsNumber()
  rotation?: number;
}

// Weather Simulation 3D
export class CreateWeatherSimulation3DDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  location: string;

  @IsString()
  date: string;

  @IsString()
  weatherType: string; // sunny, rainy, snowy, foggy

  @IsNumber()
  temperature: number;

  @IsOptional()
  @IsBoolean()
  isDay?: boolean;

  @IsOptional()
  @IsString()
  solarPosition?: string; // JSON of sun position

  @IsOptional()
  @IsString()
  particleData?: string; // JSON of rain/snow/fog particles
}

export class UpdateWeatherSimulation3DDto {
  @IsOptional()
  @IsString()
  weatherType?: string;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsBoolean()
  isDay?: boolean;

  @IsOptional()
  @IsString()
  particleData?: string;
}

// Spatial Media
export class CreateSpatialMediaDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  mediaType: string; // spatial_video, spatial_photo

  @IsString()
  mediaUrl: string;

  @IsOptional()
  @IsString()
  depthMapUrl?: string;

  @IsOptional()
  @IsBoolean()
  stereoscopic?: boolean;

  @IsOptional()
  @IsBoolean()
  isSpatial?: boolean;
}

export class UpdateSpatialMediaDto {
  @IsOptional()
  @IsString()
  depthMapUrl?: string;

  @IsOptional()
  @IsBoolean()
  stereoscopic?: boolean;
}

// Gaussian Splatting
export class CreateGaussianSplattingDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  location: string;

  @IsString()
  modelUrl: string; // .splat or .ply file

  @IsOptional()
  @IsString()
  splatData?: string; // JSON of point cloud

  @IsOptional()
  @IsString()
  tags?: string; // JSON of annotation tags
}

export class UpdateGaussianSplattingDto {
  @IsOptional()
  @IsString()
  splatData?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}

// Photogrammetry Reconstruction
export class CreatePhotogrammetryReconstructionDto {
  @IsOptional()
  @IsString()
  memoryId?: string;

  @IsString()
  title: string;

  @IsString()
  photoUrls: string; // JSON array
}

export class UpdatePhotogrammetryReconstructionDto {
  @IsOptional()
  @IsString()
  modelUrl?: string;

  @IsOptional()
  @IsString()
  meshData?: string;

  @IsOptional()
  @IsString()
  textureUrl?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

// Memory Diorama Box
export class CreateMemoryDioramaBoxDto {
  @IsString()
  title: string;

  @IsString()
  layoutData: string; // JSON of 2.5D photos, stickers, furniture

  @IsOptional()
  @IsString()
  furnitureItems?: string; // JSON

  @IsOptional()
  @IsString()
  soundBoxUrl?: string;
}

export class UpdateMemoryDioramaBoxDto {
  @IsOptional()
  @IsString()
  layoutData?: string;

  @IsOptional()
  @IsString()
  furnitureItems?: string;

  @IsOptional()
  @IsString()
  soundBoxUrl?: string;

  @IsOptional()
  @IsString()
  exportUrl?: string;
}

// Virtual Street Tour
export class CreateVirtualStreetTourDto {
  @IsString()
  title: string;

  @IsString()
  panoramaIds: string; // JSON array of 360 photo IDs

  @IsString()
  hotspots: string; // JSON of directional hotspots

  @IsOptional()
  @IsString()
  floorPlan?: string; // JSON

  @IsOptional()
  @IsString()
  audioTransitions?: string; // JSON
}

export class UpdateVirtualStreetTourDto {
  @IsOptional()
  @IsString()
  panoramaIds?: string;

  @IsOptional()
  @IsString()
  hotspots?: string;

  @IsOptional()
  @IsString()
  floorPlan?: string;

  @IsOptional()
  @IsString()
  audioTransitions?: string;
}
