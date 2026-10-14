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
exports.ThreeDSpatialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ThreeDSpatialService = class ThreeDSpatialService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTerrainElevations(userId) {
        return this.prisma.terrainElevation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async createTerrainElevation(userId, dto) {
        return this.prisma.terrainElevation.create({ data: { user: { connect: { id: userId } }, ...dto } });
    }
    async updateTerrainElevation(id, userId, dto) {
        const item = await this.prisma.terrainElevation.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.terrainElevation.update({ where: { id }, data: dto });
    }
    async deleteTerrainElevation(id, userId) {
        const item = await this.prisma.terrainElevation.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.terrainElevation.delete({ where: { id } });
    }
    async getFlightPaths3D(userId) {
        return this.prisma.flightPath3D.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async createFlightPath3D(userId, dto) {
        return this.prisma.flightPath3D.create({ data: { user: { connect: { id: userId } }, ...dto } });
    }
    async updateFlightPath3D(id, userId, dto) {
        const item = await this.prisma.flightPath3D.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.flightPath3D.update({ where: { id }, data: dto });
    }
    async deleteFlightPath3D(id, userId) {
        const item = await this.prisma.flightPath3D.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.flightPath3D.delete({ where: { id } });
    }
    async getLandmarks3D(userId) {
        return this.prisma.landmark3D.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async createLandmark3D(userId, dto) {
        return this.prisma.landmark3D.create({ data: { user: { connect: { id: userId } }, ...dto } });
    }
    async updateLandmark3D(id, userId, dto) {
        const item = await this.prisma.landmark3D.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.landmark3D.update({ where: { id }, data: dto });
    }
    async deleteLandmark3D(id, userId) {
        const item = await this.prisma.landmark3D.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.landmark3D.delete({ where: { id } });
    }
    async getWeatherSimulations3D(userId) {
        return this.prisma.weatherSimulation3D.findMany({ where: { userId }, orderBy: { date: 'desc' } });
    }
    async createWeatherSimulation3D(userId, dto) {
        return this.prisma.weatherSimulation3D.create({ data: { user: { connect: { id: userId } }, ...dto, date: new Date(dto.date) } });
    }
    async updateWeatherSimulation3D(id, userId, dto) {
        const item = await this.prisma.weatherSimulation3D.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.weatherSimulation3D.update({ where: { id }, data: dto });
    }
    async deleteWeatherSimulation3D(id, userId) {
        const item = await this.prisma.weatherSimulation3D.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.weatherSimulation3D.delete({ where: { id } });
    }
    async getSpatialMedia(userId) {
        return this.prisma.spatialMedia.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async createSpatialMedia(userId, dto) {
        return this.prisma.spatialMedia.create({ data: { user: { connect: { id: userId } }, ...dto } });
    }
    async updateSpatialMedia(id, userId, dto) {
        const item = await this.prisma.spatialMedia.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.spatialMedia.update({ where: { id }, data: dto });
    }
    async deleteSpatialMedia(id, userId) {
        const item = await this.prisma.spatialMedia.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.spatialMedia.delete({ where: { id } });
    }
    async getGaussianSplattings(userId) {
        return this.prisma.gaussianSplatting.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async createGaussianSplatting(userId, dto) {
        return this.prisma.gaussianSplatting.create({ data: { user: { connect: { id: userId } }, ...dto } });
    }
    async updateGaussianSplatting(id, userId, dto) {
        const item = await this.prisma.gaussianSplatting.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.gaussianSplatting.update({ where: { id }, data: dto });
    }
    async deleteGaussianSplatting(id, userId) {
        const item = await this.prisma.gaussianSplatting.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.gaussianSplatting.delete({ where: { id } });
    }
    async getPhotogrammetryReconstructions(userId) {
        return this.prisma.photogrammetryReconstruction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async createPhotogrammetryReconstruction(userId, dto) {
        return this.prisma.photogrammetryReconstruction.create({ data: { user: { connect: { id: userId } }, ...dto, status: 'processing' } });
    }
    async updatePhotogrammetryReconstruction(id, userId, dto) {
        const item = await this.prisma.photogrammetryReconstruction.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.photogrammetryReconstruction.update({ where: { id }, data: { ...dto, processedAt: dto.status === 'completed' ? new Date() : undefined } });
    }
    async deletePhotogrammetryReconstruction(id, userId) {
        const item = await this.prisma.photogrammetryReconstruction.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.photogrammetryReconstruction.delete({ where: { id } });
    }
    async getMemoryDioramas(userId) {
        return this.prisma.memoryDioramaBox.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async createMemoryDiorama(userId, dto) {
        return this.prisma.memoryDioramaBox.create({ data: { user: { connect: { id: userId } }, ...dto } });
    }
    async updateMemoryDiorama(id, userId, dto) {
        const item = await this.prisma.memoryDioramaBox.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.memoryDioramaBox.update({ where: { id }, data: dto });
    }
    async deleteMemoryDiorama(id, userId) {
        const item = await this.prisma.memoryDioramaBox.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.memoryDioramaBox.delete({ where: { id } });
    }
    async getVirtualStreetTours(userId) {
        return this.prisma.virtualStreetTour.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    }
    async createVirtualStreetTour(userId, dto) {
        return this.prisma.virtualStreetTour.create({ data: { user: { connect: { id: userId } }, ...dto } });
    }
    async updateVirtualStreetTour(id, userId, dto) {
        const item = await this.prisma.virtualStreetTour.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.virtualStreetTour.update({ where: { id }, data: dto });
    }
    async deleteVirtualStreetTour(id, userId) {
        const item = await this.prisma.virtualStreetTour.findUnique({ where: { id } });
        if (!item || item.userId !== userId)
            throw new common_1.NotFoundException('Not found');
        return this.prisma.virtualStreetTour.delete({ where: { id } });
    }
};
exports.ThreeDSpatialService = ThreeDSpatialService;
exports.ThreeDSpatialService = ThreeDSpatialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ThreeDSpatialService);
//# sourceMappingURL=three-d-spatial.service.js.map