import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as dto from './dto/three-d-spatial.dto';

@Injectable()
export class ThreeDSpatialService {
  constructor(private prisma: PrismaService) {}

  async getTerrainElevations(userId: string) {
    return this.prisma.terrainElevation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createTerrainElevation(userId: string, dto: dto.CreateTerrainElevationDto) {
    return this.prisma.terrainElevation.create({ data: { user: { connect: { id: userId } }, ...dto } });
  }

  async updateTerrainElevation(id: string, userId: string, dto: dto.UpdateTerrainElevationDto) {
    const item = await this.prisma.terrainElevation.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.terrainElevation.update({ where: { id }, data: dto });
  }

  async deleteTerrainElevation(id: string, userId: string) {
    const item = await this.prisma.terrainElevation.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.terrainElevation.delete({ where: { id } });
  }

  async getFlightPaths3D(userId: string) {
    return this.prisma.flightPath3D.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createFlightPath3D(userId: string, dto: dto.CreateFlightPath3DDto) {
    return this.prisma.flightPath3D.create({ data: { user: { connect: { id: userId } }, ...dto } });
  }

  async updateFlightPath3D(id: string, userId: string, dto: dto.UpdateFlightPath3DDto) {
    const item = await this.prisma.flightPath3D.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.flightPath3D.update({ where: { id }, data: dto });
  }

  async deleteFlightPath3D(id: string, userId: string) {
    const item = await this.prisma.flightPath3D.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.flightPath3D.delete({ where: { id } });
  }

  async getLandmarks3D(userId: string) {
    return this.prisma.landmark3D.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createLandmark3D(userId: string, dto: dto.CreateLandmark3DDto) {
    return this.prisma.landmark3D.create({ data: { user: { connect: { id: userId } }, ...dto } });
  }

  async updateLandmark3D(id: string, userId: string, dto: dto.UpdateLandmark3DDto) {
    const item = await this.prisma.landmark3D.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.landmark3D.update({ where: { id }, data: dto });
  }

  async deleteLandmark3D(id: string, userId: string) {
    const item = await this.prisma.landmark3D.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.landmark3D.delete({ where: { id } });
  }

  async getWeatherSimulations3D(userId: string) {
    return this.prisma.weatherSimulation3D.findMany({ where: { userId }, orderBy: { date: 'desc' } });
  }

  async createWeatherSimulation3D(userId: string, dto: dto.CreateWeatherSimulation3DDto) {
    return this.prisma.weatherSimulation3D.create({ data: { user: { connect: { id: userId } }, ...dto, date: new Date(dto.date) } });
  }

  async updateWeatherSimulation3D(id: string, userId: string, dto: dto.UpdateWeatherSimulation3DDto) {
    const item = await this.prisma.weatherSimulation3D.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.weatherSimulation3D.update({ where: { id }, data: dto });
  }

  async deleteWeatherSimulation3D(id: string, userId: string) {
    const item = await this.prisma.weatherSimulation3D.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.weatherSimulation3D.delete({ where: { id } });
  }

  async getSpatialMedia(userId: string) {
    return this.prisma.spatialMedia.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createSpatialMedia(userId: string, dto: dto.CreateSpatialMediaDto) {
    return this.prisma.spatialMedia.create({ data: { user: { connect: { id: userId } }, ...dto } });
  }

  async updateSpatialMedia(id: string, userId: string, dto: dto.UpdateSpatialMediaDto) {
    const item = await this.prisma.spatialMedia.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.spatialMedia.update({ where: { id }, data: dto });
  }

  async deleteSpatialMedia(id: string, userId: string) {
    const item = await this.prisma.spatialMedia.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.spatialMedia.delete({ where: { id } });
  }

  async getGaussianSplattings(userId: string) {
    return this.prisma.gaussianSplatting.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createGaussianSplatting(userId: string, dto: dto.CreateGaussianSplattingDto) {
    return this.prisma.gaussianSplatting.create({ data: { user: { connect: { id: userId } }, ...dto } });
  }

  async updateGaussianSplatting(id: string, userId: string, dto: dto.UpdateGaussianSplattingDto) {
    const item = await this.prisma.gaussianSplatting.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.gaussianSplatting.update({ where: { id }, data: dto });
  }

  async deleteGaussianSplatting(id: string, userId: string) {
    const item = await this.prisma.gaussianSplatting.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.gaussianSplatting.delete({ where: { id } });
  }

  async getPhotogrammetryReconstructions(userId: string) {
    return this.prisma.photogrammetryReconstruction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createPhotogrammetryReconstruction(userId: string, dto: dto.CreatePhotogrammetryReconstructionDto) {
    return this.prisma.photogrammetryReconstruction.create({ data: { user: { connect: { id: userId } }, ...dto, status: 'processing' } });
  }

  async updatePhotogrammetryReconstruction(id: string, userId: string, dto: dto.UpdatePhotogrammetryReconstructionDto) {
    const item = await this.prisma.photogrammetryReconstruction.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.photogrammetryReconstruction.update({ where: { id }, data: { ...dto, processedAt: dto.status === 'completed' ? new Date() : undefined } });
  }

  async deletePhotogrammetryReconstruction(id: string, userId: string) {
    const item = await this.prisma.photogrammetryReconstruction.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.photogrammetryReconstruction.delete({ where: { id } });
  }

  async getMemoryDioramas(userId: string) {
    return this.prisma.memoryDioramaBox.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createMemoryDiorama(userId: string, dto: dto.CreateMemoryDioramaBoxDto) {
    return this.prisma.memoryDioramaBox.create({ data: { user: { connect: { id: userId } }, ...dto } });
  }

  async updateMemoryDiorama(id: string, userId: string, dto: dto.UpdateMemoryDioramaBoxDto) {
    const item = await this.prisma.memoryDioramaBox.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.memoryDioramaBox.update({ where: { id }, data: dto });
  }

  async deleteMemoryDiorama(id: string, userId: string) {
    const item = await this.prisma.memoryDioramaBox.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.memoryDioramaBox.delete({ where: { id } });
  }

  async getVirtualStreetTours(userId: string) {
    return this.prisma.virtualStreetTour.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async createVirtualStreetTour(userId: string, dto: dto.CreateVirtualStreetTourDto) {
    return this.prisma.virtualStreetTour.create({ data: { user: { connect: { id: userId } }, ...dto } });
  }

  async updateVirtualStreetTour(id: string, userId: string, dto: dto.UpdateVirtualStreetTourDto) {
    const item = await this.prisma.virtualStreetTour.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.virtualStreetTour.update({ where: { id }, data: dto });
  }

  async deleteVirtualStreetTour(id: string, userId: string) {
    const item = await this.prisma.virtualStreetTour.findUnique({ where: { id } });
    if (!item || item.userId !== userId) throw new NotFoundException('Not found');
    return this.prisma.virtualStreetTour.delete({ where: { id } });
  }
}
