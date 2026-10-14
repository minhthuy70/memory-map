export declare class CreateTerrainElevationDto {
    memoryId?: string;
    locationName: string;
    latitude: number;
    longitude: number;
    elevation: number;
    steepness?: number;
    demData?: string;
}
export declare class UpdateTerrainElevationDto {
    elevation?: number;
    steepness?: number;
    demData?: string;
}
export declare class CreateFlightPath3DDto {
    itineraryId?: string;
    fromLocation: string;
    toLocation: string;
    waypoints: string;
    duration: number;
    cloudsEffect?: boolean;
}
export declare class UpdateFlightPath3DDto {
    flightPath?: string;
    cloudsEffect?: boolean;
}
export declare class CreateLandmark3DDto {
    memoryId?: string;
    name: string;
    location: string;
    latitude: number;
    longitude: number;
    modelUrl: string;
    modelType: string;
    scale?: number;
    rotation?: number;
}
export declare class UpdateLandmark3DDto {
    modelUrl?: string;
    scale?: number;
    rotation?: number;
}
export declare class CreateWeatherSimulation3DDto {
    memoryId?: string;
    location: string;
    date: string;
    weatherType: string;
    temperature: number;
    isDay?: boolean;
    solarPosition?: string;
    particleData?: string;
}
export declare class UpdateWeatherSimulation3DDto {
    weatherType?: string;
    temperature?: number;
    isDay?: boolean;
    particleData?: string;
}
export declare class CreateSpatialMediaDto {
    memoryId?: string;
    mediaType: string;
    mediaUrl: string;
    depthMapUrl?: string;
    stereoscopic?: boolean;
    isSpatial?: boolean;
}
export declare class UpdateSpatialMediaDto {
    depthMapUrl?: string;
    stereoscopic?: boolean;
}
export declare class CreateGaussianSplattingDto {
    memoryId?: string;
    location: string;
    modelUrl: string;
    splatData?: string;
    tags?: string;
}
export declare class UpdateGaussianSplattingDto {
    splatData?: string;
    tags?: string;
}
export declare class CreatePhotogrammetryReconstructionDto {
    memoryId?: string;
    title: string;
    photoUrls: string;
}
export declare class UpdatePhotogrammetryReconstructionDto {
    modelUrl?: string;
    meshData?: string;
    textureUrl?: string;
    status?: string;
}
export declare class CreateMemoryDioramaBoxDto {
    title: string;
    layoutData: string;
    furnitureItems?: string;
    soundBoxUrl?: string;
}
export declare class UpdateMemoryDioramaBoxDto {
    layoutData?: string;
    furnitureItems?: string;
    soundBoxUrl?: string;
    exportUrl?: string;
}
export declare class CreateVirtualStreetTourDto {
    title: string;
    panoramaIds: string;
    hotspots: string;
    floorPlan?: string;
    audioTransitions?: string;
}
export declare class UpdateVirtualStreetTourDto {
    panoramaIds?: string;
    hotspots?: string;
    floorPlan?: string;
    audioTransitions?: string;
}
