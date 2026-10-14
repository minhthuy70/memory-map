"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVirtualStreetTourDto = exports.CreateVirtualStreetTourDto = exports.UpdateMemoryDioramaBoxDto = exports.CreateMemoryDioramaBoxDto = exports.UpdatePhotogrammetryReconstructionDto = exports.CreatePhotogrammetryReconstructionDto = exports.UpdateGaussianSplattingDto = exports.CreateGaussianSplattingDto = exports.UpdateSpatialMediaDto = exports.CreateSpatialMediaDto = exports.UpdateWeatherSimulation3DDto = exports.CreateWeatherSimulation3DDto = exports.UpdateLandmark3DDto = exports.CreateLandmark3DDto = exports.UpdateFlightPath3DDto = exports.CreateFlightPath3DDto = exports.UpdateTerrainElevationDto = exports.CreateTerrainElevationDto = void 0;
const class_validator_1 = require("class-validator");
class CreateTerrainElevationDto {
}
exports.CreateTerrainElevationDto = CreateTerrainElevationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTerrainElevationDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTerrainElevationDto.prototype, "locationName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTerrainElevationDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTerrainElevationDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTerrainElevationDto.prototype, "elevation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTerrainElevationDto.prototype, "steepness", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTerrainElevationDto.prototype, "demData", void 0);
class UpdateTerrainElevationDto {
}
exports.UpdateTerrainElevationDto = UpdateTerrainElevationDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTerrainElevationDto.prototype, "elevation", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateTerrainElevationDto.prototype, "steepness", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTerrainElevationDto.prototype, "demData", void 0);
class CreateFlightPath3DDto {
}
exports.CreateFlightPath3DDto = CreateFlightPath3DDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightPath3DDto.prototype, "itineraryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightPath3DDto.prototype, "fromLocation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightPath3DDto.prototype, "toLocation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateFlightPath3DDto.prototype, "waypoints", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateFlightPath3DDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateFlightPath3DDto.prototype, "cloudsEffect", void 0);
class UpdateFlightPath3DDto {
}
exports.UpdateFlightPath3DDto = UpdateFlightPath3DDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateFlightPath3DDto.prototype, "flightPath", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateFlightPath3DDto.prototype, "cloudsEffect", void 0);
class CreateLandmark3DDto {
}
exports.CreateLandmark3DDto = CreateLandmark3DDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLandmark3DDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLandmark3DDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLandmark3DDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLandmark3DDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLandmark3DDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLandmark3DDto.prototype, "modelUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLandmark3DDto.prototype, "modelType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLandmark3DDto.prototype, "scale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateLandmark3DDto.prototype, "rotation", void 0);
class UpdateLandmark3DDto {
}
exports.UpdateLandmark3DDto = UpdateLandmark3DDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLandmark3DDto.prototype, "modelUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLandmark3DDto.prototype, "scale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateLandmark3DDto.prototype, "rotation", void 0);
class CreateWeatherSimulation3DDto {
}
exports.CreateWeatherSimulation3DDto = CreateWeatherSimulation3DDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeatherSimulation3DDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeatherSimulation3DDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeatherSimulation3DDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeatherSimulation3DDto.prototype, "weatherType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateWeatherSimulation3DDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateWeatherSimulation3DDto.prototype, "isDay", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeatherSimulation3DDto.prototype, "solarPosition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateWeatherSimulation3DDto.prototype, "particleData", void 0);
class UpdateWeatherSimulation3DDto {
}
exports.UpdateWeatherSimulation3DDto = UpdateWeatherSimulation3DDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWeatherSimulation3DDto.prototype, "weatherType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateWeatherSimulation3DDto.prototype, "temperature", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateWeatherSimulation3DDto.prototype, "isDay", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWeatherSimulation3DDto.prototype, "particleData", void 0);
class CreateSpatialMediaDto {
}
exports.CreateSpatialMediaDto = CreateSpatialMediaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpatialMediaDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpatialMediaDto.prototype, "mediaType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpatialMediaDto.prototype, "mediaUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSpatialMediaDto.prototype, "depthMapUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSpatialMediaDto.prototype, "stereoscopic", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateSpatialMediaDto.prototype, "isSpatial", void 0);
class UpdateSpatialMediaDto {
}
exports.UpdateSpatialMediaDto = UpdateSpatialMediaDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSpatialMediaDto.prototype, "depthMapUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSpatialMediaDto.prototype, "stereoscopic", void 0);
class CreateGaussianSplattingDto {
}
exports.CreateGaussianSplattingDto = CreateGaussianSplattingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGaussianSplattingDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGaussianSplattingDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGaussianSplattingDto.prototype, "modelUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGaussianSplattingDto.prototype, "splatData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGaussianSplattingDto.prototype, "tags", void 0);
class UpdateGaussianSplattingDto {
}
exports.UpdateGaussianSplattingDto = UpdateGaussianSplattingDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGaussianSplattingDto.prototype, "splatData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateGaussianSplattingDto.prototype, "tags", void 0);
class CreatePhotogrammetryReconstructionDto {
}
exports.CreatePhotogrammetryReconstructionDto = CreatePhotogrammetryReconstructionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhotogrammetryReconstructionDto.prototype, "memoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhotogrammetryReconstructionDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePhotogrammetryReconstructionDto.prototype, "photoUrls", void 0);
class UpdatePhotogrammetryReconstructionDto {
}
exports.UpdatePhotogrammetryReconstructionDto = UpdatePhotogrammetryReconstructionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePhotogrammetryReconstructionDto.prototype, "modelUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePhotogrammetryReconstructionDto.prototype, "meshData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePhotogrammetryReconstructionDto.prototype, "textureUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePhotogrammetryReconstructionDto.prototype, "status", void 0);
class CreateMemoryDioramaBoxDto {
}
exports.CreateMemoryDioramaBoxDto = CreateMemoryDioramaBoxDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryDioramaBoxDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryDioramaBoxDto.prototype, "layoutData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryDioramaBoxDto.prototype, "furnitureItems", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMemoryDioramaBoxDto.prototype, "soundBoxUrl", void 0);
class UpdateMemoryDioramaBoxDto {
}
exports.UpdateMemoryDioramaBoxDto = UpdateMemoryDioramaBoxDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryDioramaBoxDto.prototype, "layoutData", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryDioramaBoxDto.prototype, "furnitureItems", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryDioramaBoxDto.prototype, "soundBoxUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMemoryDioramaBoxDto.prototype, "exportUrl", void 0);
class CreateVirtualStreetTourDto {
}
exports.CreateVirtualStreetTourDto = CreateVirtualStreetTourDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVirtualStreetTourDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVirtualStreetTourDto.prototype, "panoramaIds", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVirtualStreetTourDto.prototype, "hotspots", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVirtualStreetTourDto.prototype, "floorPlan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVirtualStreetTourDto.prototype, "audioTransitions", void 0);
class UpdateVirtualStreetTourDto {
}
exports.UpdateVirtualStreetTourDto = UpdateVirtualStreetTourDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVirtualStreetTourDto.prototype, "panoramaIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVirtualStreetTourDto.prototype, "hotspots", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVirtualStreetTourDto.prototype, "floorPlan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateVirtualStreetTourDto.prototype, "audioTransitions", void 0);
//# sourceMappingURL=three-d-spatial.dto.js.map