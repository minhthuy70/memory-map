import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ThreeDSpatialService } from './three-d-spatial.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as dto from './dto/three-d-spatial.dto';

@Controller('three-d-spatial')
@UseGuards(JwtAuthGuard)
export class ThreeDSpatialController {
  constructor(private readonly service: ThreeDSpatialService) {}

  @Get('terrain-elevations')
  getTerrainElevations(@Request() req) { return this.service.getTerrainElevations(req.user.userId); }
  @Post('terrain-elevations') createTerrainElevation(@Request() req, @Body() dto: dto.CreateTerrainElevationDto) { return this.service.createTerrainElevation(req.user.userId, dto); }
  @Put('terrain-elevations/:id') updateTerrainElevation(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdateTerrainElevationDto) { return this.service.updateTerrainElevation(id, req.user.userId, dto); }
  @Delete('terrain-elevations/:id') deleteTerrainElevation(@Param('id') id: string, @Request() req) { return this.service.deleteTerrainElevation(id, req.user.userId); }

  @Get('flight-paths-3d')
  getFlightPaths3D(@Request() req) { return this.service.getFlightPaths3D(req.user.userId); }
  @Post('flight-paths-3d') createFlightPath3D(@Request() req, @Body() dto: dto.CreateFlightPath3DDto) { return this.service.createFlightPath3D(req.user.userId, dto); }
  @Put('flight-paths-3d/:id') updateFlightPath3D(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdateFlightPath3DDto) { return this.service.updateFlightPath3D(id, req.user.userId, dto); }
  @Delete('flight-paths-3d/:id') deleteFlightPath3D(@Param('id') id: string, @Request() req) { return this.service.deleteFlightPath3D(id, req.user.userId); }

  @Get('landmarks-3d')
  getLandmarks3D(@Request() req) { return this.service.getLandmarks3D(req.user.userId); }
  @Post('landmarks-3d') createLandmark3D(@Request() req, @Body() dto: dto.CreateLandmark3DDto) { return this.service.createLandmark3D(req.user.userId, dto); }
  @Put('landmarks-3d/:id') updateLandmark3D(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdateLandmark3DDto) { return this.service.updateLandmark3D(id, req.user.userId, dto); }
  @Delete('landmarks-3d/:id') deleteLandmark3D(@Param('id') id: string, @Request() req) { return this.service.deleteLandmark3D(id, req.user.userId); }

  @Get('weather-simulations-3d')
  getWeatherSimulations3D(@Request() req) { return this.service.getWeatherSimulations3D(req.user.userId); }
  @Post('weather-simulations-3d') createWeatherSimulation3D(@Request() req, @Body() dto: dto.CreateWeatherSimulation3DDto) { return this.service.createWeatherSimulation3D(req.user.userId, dto); }
  @Put('weather-simulations-3d/:id') updateWeatherSimulation3D(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdateWeatherSimulation3DDto) { return this.service.updateWeatherSimulation3D(id, req.user.userId, dto); }
  @Delete('weather-simulations-3d/:id') deleteWeatherSimulation3D(@Param('id') id: string, @Request() req) { return this.service.deleteWeatherSimulation3D(id, req.user.userId); }

  @Get('spatial-media')
  getSpatialMedia(@Request() req) { return this.service.getSpatialMedia(req.user.userId); }
  @Post('spatial-media') createSpatialMedia(@Request() req, @Body() dto: dto.CreateSpatialMediaDto) { return this.service.createSpatialMedia(req.user.userId, dto); }
  @Put('spatial-media/:id') updateSpatialMedia(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdateSpatialMediaDto) { return this.service.updateSpatialMedia(id, req.user.userId, dto); }
  @Delete('spatial-media/:id') deleteSpatialMedia(@Param('id') id: string, @Request() req) { return this.service.deleteSpatialMedia(id, req.user.userId); }

  @Get('gaussian-splattings')
  getGaussianSplattings(@Request() req) { return this.service.getGaussianSplattings(req.user.userId); }
  @Post('gaussian-splattings') createGaussianSplatting(@Request() req, @Body() dto: dto.CreateGaussianSplattingDto) { return this.service.createGaussianSplatting(req.user.userId, dto); }
  @Put('gaussian-splattings/:id') updateGaussianSplatting(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdateGaussianSplattingDto) { return this.service.updateGaussianSplatting(id, req.user.userId, dto); }
  @Delete('gaussian-splattings/:id') deleteGaussianSplatting(@Param('id') id: string, @Request() req) { return this.service.deleteGaussianSplatting(id, req.user.userId); }

  @Get('photogrammetry-reconstructions')
  getPhotogrammetryReconstructions(@Request() req) { return this.service.getPhotogrammetryReconstructions(req.user.userId); }
  @Post('photogrammetry-reconstructions') createPhotogrammetryReconstruction(@Request() req, @Body() dto: dto.CreatePhotogrammetryReconstructionDto) { return this.service.createPhotogrammetryReconstruction(req.user.userId, dto); }
  @Put('photogrammetry-reconstructions/:id') updatePhotogrammetryReconstruction(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdatePhotogrammetryReconstructionDto) { return this.service.updatePhotogrammetryReconstruction(id, req.user.userId, dto); }
  @Delete('photogrammetry-reconstructions/:id') deletePhotogrammetryReconstruction(@Param('id') id: string, @Request() req) { return this.service.deletePhotogrammetryReconstruction(id, req.user.userId); }

  @Get('memory-dioramas')
  getMemoryDioramas(@Request() req) { return this.service.getMemoryDioramas(req.user.userId); }
  @Post('memory-dioramas') createMemoryDiorama(@Request() req, @Body() dto: dto.CreateMemoryDioramaBoxDto) { return this.service.createMemoryDiorama(req.user.userId, dto); }
  @Put('memory-dioramas/:id') updateMemoryDiorama(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdateMemoryDioramaBoxDto) { return this.service.updateMemoryDiorama(id, req.user.userId, dto); }
  @Delete('memory-dioramas/:id') deleteMemoryDiorama(@Param('id') id: string, @Request() req) { return this.service.deleteMemoryDiorama(id, req.user.userId); }

  @Get('virtual-street-tours')
  getVirtualStreetTours(@Request() req) { return this.service.getVirtualStreetTours(req.user.userId); }
  @Post('virtual-street-tours') createVirtualStreetTour(@Request() req, @Body() dto: dto.CreateVirtualStreetTourDto) { return this.service.createVirtualStreetTour(req.user.userId, dto); }
  @Put('virtual-street-tours/:id') updateVirtualStreetTour(@Param('id') id: string, @Request() req, @Body() dto: dto.UpdateVirtualStreetTourDto) { return this.service.updateVirtualStreetTour(id, req.user.userId, dto); }
  @Delete('virtual-street-tours/:id') deleteVirtualStreetTour(@Param('id') id: string, @Request() req) { return this.service.deleteVirtualStreetTour(id, req.user.userId); }
}
