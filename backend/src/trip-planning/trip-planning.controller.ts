import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TripPlanningService } from './trip-planning.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('trip-planning')
@UseGuards(JwtAuthGuard)
export class TripPlanningController {
  constructor(private readonly tripPlanningService: TripPlanningService) {}

  // ==================== Itineraries ====================

  @Get('itineraries')
  async getItineraries(@Request() req) {
    return this.tripPlanningService.getItineraries(req.user.userId);
  }

  @Get('itineraries/:id')
  async getItinerary(@Request() req, @Param('id') id: string) {
    return this.tripPlanningService.getItinerary(req.user.userId, id);
  }

  @Post('itineraries')
  async createItinerary(@Request() req, @Body() data: any) {
    return this.tripPlanningService.createItinerary(req.user.userId, data);
  }

  @Put('itineraries/:id')
  async updateItinerary(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.tripPlanningService.updateItinerary(req.user.userId, id, data);
  }

  @Delete('itineraries/:id')
  async deleteItinerary(@Request() req, @Param('id') id: string) {
    return this.tripPlanningService.deleteItinerary(req.user.userId, id);
  }

  // ==================== Trip Expenses ====================

  @Get('expenses')
  async getTripExpenses(@Request() req, @Query('itineraryId') itineraryId?: string) {
    return this.tripPlanningService.getTripExpenses(req.user.userId, itineraryId);
  }

  @Post('expenses')
  async createTripExpense(@Request() req, @Body() data: any) {
    return this.tripPlanningService.createTripExpense(req.user.userId, data);
  }

  @Delete('expenses/:id')
  async deleteTripExpense(@Request() req, @Param('id') id: string) {
    return this.tripPlanningService.deleteTripExpense(req.user.userId, id);
  }

  // ==================== Packing Lists ====================

  @Get('packing-lists')
  async getPackingLists(@Request() req, @Query('itineraryId') itineraryId?: string) {
    return this.tripPlanningService.getPackingLists(req.user.userId, itineraryId);
  }

  @Post('packing-lists')
  async createPackingList(@Request() req, @Body() data: any) {
    return this.tripPlanningService.createPackingList(req.user.userId, data);
  }

  @Put('packing-lists/:id')
  async updatePackingList(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.tripPlanningService.updatePackingList(req.user.userId, id, data);
  }

  @Delete('packing-lists/:id')
  async deletePackingList(@Request() req, @Param('id') id: string) {
    return this.tripPlanningService.deletePackingList(req.user.userId, id);
  }

  // ==================== Travel Documents ====================

  @Get('documents')
  async getTravelDocuments(@Request() req, @Query('itineraryId') itineraryId?: string) {
    return this.tripPlanningService.getTravelDocuments(req.user.userId, itineraryId);
  }

  @Post('documents')
  async createTravelDocument(@Request() req, @Body() data: any) {
    return this.tripPlanningService.createTravelDocument(req.user.userId, data);
  }

  @Delete('documents/:id')
  async deleteTravelDocument(@Request() req, @Param('id') id: string) {
    return this.tripPlanningService.deleteTravelDocument(req.user.userId, id);
  }
}
