"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreeDSpatialController = void 0;
const common_1 = require("@nestjs/common");
const three_d_spatial_service_1 = require("./three-d-spatial.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const dto = __importStar(require("./dto/three-d-spatial.dto"));
let ThreeDSpatialController = class ThreeDSpatialController {
    constructor(service) {
        this.service = service;
    }
    getTerrainElevations(req) { return this.service.getTerrainElevations(req.user.userId); }
    createTerrainElevation(req, dto) { return this.service.createTerrainElevation(req.user.userId, dto); }
    updateTerrainElevation(id, req, dto) { return this.service.updateTerrainElevation(id, req.user.userId, dto); }
    deleteTerrainElevation(id, req) { return this.service.deleteTerrainElevation(id, req.user.userId); }
    getFlightPaths3D(req) { return this.service.getFlightPaths3D(req.user.userId); }
    createFlightPath3D(req, dto) { return this.service.createFlightPath3D(req.user.userId, dto); }
    updateFlightPath3D(id, req, dto) { return this.service.updateFlightPath3D(id, req.user.userId, dto); }
    deleteFlightPath3D(id, req) { return this.service.deleteFlightPath3D(id, req.user.userId); }
    getLandmarks3D(req) { return this.service.getLandmarks3D(req.user.userId); }
    createLandmark3D(req, dto) { return this.service.createLandmark3D(req.user.userId, dto); }
    updateLandmark3D(id, req, dto) { return this.service.updateLandmark3D(id, req.user.userId, dto); }
    deleteLandmark3D(id, req) { return this.service.deleteLandmark3D(id, req.user.userId); }
    getWeatherSimulations3D(req) { return this.service.getWeatherSimulations3D(req.user.userId); }
    createWeatherSimulation3D(req, dto) { return this.service.createWeatherSimulation3D(req.user.userId, dto); }
    updateWeatherSimulation3D(id, req, dto) { return this.service.updateWeatherSimulation3D(id, req.user.userId, dto); }
    deleteWeatherSimulation3D(id, req) { return this.service.deleteWeatherSimulation3D(id, req.user.userId); }
    getSpatialMedia(req) { return this.service.getSpatialMedia(req.user.userId); }
    createSpatialMedia(req, dto) { return this.service.createSpatialMedia(req.user.userId, dto); }
    updateSpatialMedia(id, req, dto) { return this.service.updateSpatialMedia(id, req.user.userId, dto); }
    deleteSpatialMedia(id, req) { return this.service.deleteSpatialMedia(id, req.user.userId); }
    getGaussianSplattings(req) { return this.service.getGaussianSplattings(req.user.userId); }
    createGaussianSplatting(req, dto) { return this.service.createGaussianSplatting(req.user.userId, dto); }
    updateGaussianSplatting(id, req, dto) { return this.service.updateGaussianSplatting(id, req.user.userId, dto); }
    deleteGaussianSplatting(id, req) { return this.service.deleteGaussianSplatting(id, req.user.userId); }
    getPhotogrammetryReconstructions(req) { return this.service.getPhotogrammetryReconstructions(req.user.userId); }
    createPhotogrammetryReconstruction(req, dto) { return this.service.createPhotogrammetryReconstruction(req.user.userId, dto); }
    updatePhotogrammetryReconstruction(id, req, dto) { return this.service.updatePhotogrammetryReconstruction(id, req.user.userId, dto); }
    deletePhotogrammetryReconstruction(id, req) { return this.service.deletePhotogrammetryReconstruction(id, req.user.userId); }
    getMemoryDioramas(req) { return this.service.getMemoryDioramas(req.user.userId); }
    createMemoryDiorama(req, dto) { return this.service.createMemoryDiorama(req.user.userId, dto); }
    updateMemoryDiorama(id, req, dto) { return this.service.updateMemoryDiorama(id, req.user.userId, dto); }
    deleteMemoryDiorama(id, req) { return this.service.deleteMemoryDiorama(id, req.user.userId); }
    getVirtualStreetTours(req) { return this.service.getVirtualStreetTours(req.user.userId); }
    createVirtualStreetTour(req, dto) { return this.service.createVirtualStreetTour(req.user.userId, dto); }
    updateVirtualStreetTour(id, req, dto) { return this.service.updateVirtualStreetTour(id, req.user.userId, dto); }
    deleteVirtualStreetTour(id, req) { return this.service.deleteVirtualStreetTour(id, req.user.userId); }
};
exports.ThreeDSpatialController = ThreeDSpatialController;
__decorate([
    (0, common_1.Get)('terrain-elevations'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getTerrainElevations", null);
__decorate([
    (0, common_1.Post)('terrain-elevations'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateTerrainElevationDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createTerrainElevation", null);
__decorate([
    (0, common_1.Put)('terrain-elevations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdateTerrainElevationDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updateTerrainElevation", null);
__decorate([
    (0, common_1.Delete)('terrain-elevations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deleteTerrainElevation", null);
__decorate([
    (0, common_1.Get)('flight-paths-3d'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getFlightPaths3D", null);
__decorate([
    (0, common_1.Post)('flight-paths-3d'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateFlightPath3DDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createFlightPath3D", null);
__decorate([
    (0, common_1.Put)('flight-paths-3d/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdateFlightPath3DDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updateFlightPath3D", null);
__decorate([
    (0, common_1.Delete)('flight-paths-3d/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deleteFlightPath3D", null);
__decorate([
    (0, common_1.Get)('landmarks-3d'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getLandmarks3D", null);
__decorate([
    (0, common_1.Post)('landmarks-3d'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateLandmark3DDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createLandmark3D", null);
__decorate([
    (0, common_1.Put)('landmarks-3d/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdateLandmark3DDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updateLandmark3D", null);
__decorate([
    (0, common_1.Delete)('landmarks-3d/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deleteLandmark3D", null);
__decorate([
    (0, common_1.Get)('weather-simulations-3d'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getWeatherSimulations3D", null);
__decorate([
    (0, common_1.Post)('weather-simulations-3d'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateWeatherSimulation3DDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createWeatherSimulation3D", null);
__decorate([
    (0, common_1.Put)('weather-simulations-3d/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdateWeatherSimulation3DDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updateWeatherSimulation3D", null);
__decorate([
    (0, common_1.Delete)('weather-simulations-3d/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deleteWeatherSimulation3D", null);
__decorate([
    (0, common_1.Get)('spatial-media'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getSpatialMedia", null);
__decorate([
    (0, common_1.Post)('spatial-media'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateSpatialMediaDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createSpatialMedia", null);
__decorate([
    (0, common_1.Put)('spatial-media/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdateSpatialMediaDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updateSpatialMedia", null);
__decorate([
    (0, common_1.Delete)('spatial-media/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deleteSpatialMedia", null);
__decorate([
    (0, common_1.Get)('gaussian-splattings'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getGaussianSplattings", null);
__decorate([
    (0, common_1.Post)('gaussian-splattings'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateGaussianSplattingDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createGaussianSplatting", null);
__decorate([
    (0, common_1.Put)('gaussian-splattings/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdateGaussianSplattingDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updateGaussianSplatting", null);
__decorate([
    (0, common_1.Delete)('gaussian-splattings/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deleteGaussianSplatting", null);
__decorate([
    (0, common_1.Get)('photogrammetry-reconstructions'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getPhotogrammetryReconstructions", null);
__decorate([
    (0, common_1.Post)('photogrammetry-reconstructions'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreatePhotogrammetryReconstructionDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createPhotogrammetryReconstruction", null);
__decorate([
    (0, common_1.Put)('photogrammetry-reconstructions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdatePhotogrammetryReconstructionDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updatePhotogrammetryReconstruction", null);
__decorate([
    (0, common_1.Delete)('photogrammetry-reconstructions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deletePhotogrammetryReconstruction", null);
__decorate([
    (0, common_1.Get)('memory-dioramas'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getMemoryDioramas", null);
__decorate([
    (0, common_1.Post)('memory-dioramas'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateMemoryDioramaBoxDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createMemoryDiorama", null);
__decorate([
    (0, common_1.Put)('memory-dioramas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdateMemoryDioramaBoxDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updateMemoryDiorama", null);
__decorate([
    (0, common_1.Delete)('memory-dioramas/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deleteMemoryDiorama", null);
__decorate([
    (0, common_1.Get)('virtual-street-tours'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "getVirtualStreetTours", null);
__decorate([
    (0, common_1.Post)('virtual-street-tours'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto.CreateVirtualStreetTourDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "createVirtualStreetTour", null);
__decorate([
    (0, common_1.Put)('virtual-street-tours/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto.UpdateVirtualStreetTourDto]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "updateVirtualStreetTour", null);
__decorate([
    (0, common_1.Delete)('virtual-street-tours/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ThreeDSpatialController.prototype, "deleteVirtualStreetTour", null);
exports.ThreeDSpatialController = ThreeDSpatialController = __decorate([
    (0, common_1.Controller)('three-d-spatial'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [three_d_spatial_service_1.ThreeDSpatialService])
], ThreeDSpatialController);
//# sourceMappingURL=three-d-spatial.controller.js.map