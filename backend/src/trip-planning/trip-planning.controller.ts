import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TripPlanningService } from './trip-planning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateRouteOptimizationDto,
  UpdateRouteOptimizationDto,
  CreateNavigationRouteDto,
  UpdateNavigationRouteDto,
  CreateOfflineGuideDto,
  UpdateOfflineGuideDto,
  CreateFlightTrainStatusDto,
  UpdateFlightTrainStatusDto,
  CreateVisitedCountryDto,
  UpdateVisitedCountryDto,
  CreateCarbonFootprintDto,
  UpdateCarbonFootprintDto,
  CreateEmergencyContactDto,
  UpdateEmergencyContactDto,
  UpdateSafetyHubDto,
} from './dto/trip-planning.dto';

@Controller('trip-planning')
@UseGuards(JwtAuthGuard)
export class TripPlanningController {
  constructor(private readonly tripPlanningService: TripPlanningService) {}

  // ==================== Route Optimization ====================

  @Get('route-optimizations')
  async getRouteOptimizations(@Request() req) {
    return this.tripPlanningService.getRouteOptimizations(req.user.userId);
  }

  @Post('route-optimizations')
  async createRouteOptimization(@Request() req, @Body() dto: CreateRouteOptimizationDto) {
    return this.tripPlanningService.createRouteOptimization(req.user.userId, dto);
  }

  @Put('route-optimizations/:id')
  async updateRouteOptimization(@Param('id') id: string, @Request() req, @Body() dto: UpdateRouteOptimizationDto) {
    return this.tripPlanningService.updateRouteOptimization(id, req.user.userId, dto);
  }

  @Delete('route-optimizations/:id')
  async deleteRouteOptimization(@Param('id') id: string, @Request() req) {
    return this.tripPlanningService.deleteRouteOptimization(id, req.user.userId);
  }

  // ==================== Navigation Route ====================

  @Get('navigation-routes')
  async getNavigationRoutes(@Request() req) {
    return this.tripPlanningService.getNavigationRoutes(req.user.userId);
  }

  @Post('navigation-routes')
  async createNavigationRoute(@Request() req, @Body() dto: CreateNavigationRouteDto) {
    return this.tripPlanningService.createNavigationRoute(req.user.userId, dto);
  }

  @Put('navigation-routes/:id')
  async updateNavigationRoute(@Param('id') id: string, @Request() req, @Body() dto: UpdateNavigationRouteDto) {
    return this.tripPlanningService.updateNavigationRoute(id, req.user.userId, dto);
  }

  @Delete('navigation-routes/:id')
  async deleteNavigationRoute(@Param('id') id: string, @Request() req) {
    return this.tripPlanningService.deleteNavigationRoute(id, req.user.userId);
  }

  // ==================== Offline Guide ====================

  @Get('offline-guides')
  async getOfflineGuides(@Request() req) {
    return this.tripPlanningService.getOfflineGuides(req.user.userId);
  }

  @Post('offline-guides')
  async createOfflineGuide(@Request() req, @Body() dto: CreateOfflineGuideDto) {
    return this.tripPlanningService.createOfflineGuide(req.user.userId, dto);
  }

  @Put('offline-guides/:id')
  async updateOfflineGuide(@Param('id') id: string, @Request() req, @Body() dto: UpdateOfflineGuideDto) {
    return this.tripPlanningService.updateOfflineGuide(id, req.user.userId, dto);
  }

  @Delete('offline-guides/:id')
  async deleteOfflineGuide(@Param('id') id: string, @Request() req) {
    return this.tripPlanningService.deleteOfflineGuide(id, req.user.userId);
  }

  // ==================== Flight/Train Status ====================

  @Get('flight-train-statuses')
  async getFlightTrainStatuses(@Request() req) {
    return this.tripPlanningService.getFlightTrainStatuses(req.user.userId);
  }

  @Post('flight-train-statuses')
  async createFlightTrainStatus(@Request() req, @Body() dto: CreateFlightTrainStatusDto) {
    return this.tripPlanningService.createFlightTrainStatus(req.user.userId, dto);
  }

  @Put('flight-train-statuses/:id')
  async updateFlightTrainStatus(@Param('id') id: string, @Request() req, @Body() dto: UpdateFlightTrainStatusDto) {
    return this.tripPlanningService.updateFlightTrainStatus(id, req.user.userId, dto);
  }

  @Delete('flight-train-statuses/:id')
  async deleteFlightTrainStatus(@Param('id') id: string, @Request() req) {
    return this.tripPlanningService.deleteFlightTrainStatus(id, req.user.userId);
  }

  // ==================== Visited Country ====================

  @Get('visited-countries')
  async getVisitedCountries(@Request() req) {
    return this.tripPlanningService.getVisitedCountries(req.user.userId);
  }

  @Post('visited-countries')
  async createVisitedCountry(@Request() req, @Body() dto: CreateVisitedCountryDto) {
    return this.tripPlanningService.createVisitedCountry(req.user.userId, dto);
  }

  @Put('visited-countries/:id')
  async updateVisitedCountry(@Param('id') id: string, @Request() req, @Body() dto: UpdateVisitedCountryDto) {
    return this.tripPlanningService.updateVisitedCountry(id, req.user.userId, dto);
  }

  @Delete('visited-countries/:id')
  async deleteVisitedCountry(@Param('id') id: string, @Request() req) {
    return this.tripPlanningService.deleteVisitedCountry(id, req.user.userId);
  }

  // ==================== Carbon Footprint ====================

  @Get('carbon-footprints')
  async getCarbonFootprints(@Request() req) {
    return this.tripPlanningService.getCarbonFootprints(req.user.userId);
  }

  @Post('carbon-footprints')
  async createCarbonFootprint(@Request() req, @Body() dto: CreateCarbonFootprintDto) {
    return this.tripPlanningService.createCarbonFootprint(req.user.userId, dto);
  }

  @Put('carbon-footprints/:id')
  async updateCarbonFootprint(@Param('id') id: string, @Request() req, @Body() dto: UpdateCarbonFootprintDto) {
    return this.tripPlanningService.updateCarbonFootprint(id, req.user.userId, dto);
  }

  @Delete('carbon-footprints/:id')
  async deleteCarbonFootprint(@Param('id') id: string, @Request() req) {
    return this.tripPlanningService.deleteCarbonFootprint(id, req.user.userId);
  }

  // ==================== Emergency Contact ====================

  @Get('emergency-contacts')
  async getEmergencyContacts(@Request() req) {
    return this.tripPlanningService.getEmergencyContacts(req.user.userId);
  }

  @Post('emergency-contacts')
  async createEmergencyContact(@Request() req, @Body() dto: CreateEmergencyContactDto) {
    return this.tripPlanningService.createEmergencyContact(req.user.userId, dto);
  }

  @Put('emergency-contacts/:id')
  async updateEmergencyContact(@Param('id') id: string, @Request() req, @Body() dto: UpdateEmergencyContactDto) {
    return this.tripPlanningService.updateEmergencyContact(id, req.user.userId, dto);
  }

  @Delete('emergency-contacts/:id')
  async deleteEmergencyContact(@Param('id') id: string, @Request() req) {
    return this.tripPlanningService.deleteEmergencyContact(id, req.user.userId);
  }

  // ==================== Safety Hub ====================

  @Get('safety-hub')
  async getSafetyHub(@Request() req) {
    return this.tripPlanningService.getSafetyHub(req.user.userId);
  }

  @Post('safety-hub')
  async createSafetyHub(@Request() req) {
    return this.tripPlanningService.createSafetyHub(req.user.userId);
  }

  @Put('safety-hub')
  async updateSafetyHub(@Request() req, @Body() dto: UpdateSafetyHubDto) {
    return this.tripPlanningService.updateSafetyHub(req.user.userId, dto);
  }
}
