import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class TripPlanningService {
  constructor(private prisma: PrismaService) {}

  // ==================== Route Optimization ====================

  async getRouteOptimizations(userId: string) {
    return this.prisma.routeOptimization.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRouteOptimization(userId: string, dto: CreateRouteOptimizationDto) {
    return this.prisma.routeOptimization.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateRouteOptimization(id: string, userId: string, dto: UpdateRouteOptimizationDto) {
    const route = await this.prisma.routeOptimization.findUnique({
      where: { id },
    });

    if (!route) {
      throw new NotFoundException('Route optimization not found');
    }

    if (route.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.routeOptimization.update({
      where: { id },
      data: dto,
    });
  }

  async deleteRouteOptimization(id: string, userId: string) {
    const route = await this.prisma.routeOptimization.findUnique({
      where: { id },
    });

    if (!route) {
      throw new NotFoundException('Route optimization not found');
    }

    if (route.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.routeOptimization.delete({
      where: { id },
    });
  }

  // ==================== Navigation Route ====================

  async getNavigationRoutes(userId: string) {
    return this.prisma.navigationRoute.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createNavigationRoute(userId: string, dto: CreateNavigationRouteDto) {
    return this.prisma.navigationRoute.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateNavigationRoute(id: string, userId: string, dto: UpdateNavigationRouteDto) {
    const route = await this.prisma.navigationRoute.findUnique({
      where: { id },
    });

    if (!route) {
      throw new NotFoundException('Navigation route not found');
    }

    if (route.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.navigationRoute.update({
      where: { id },
      data: dto,
    });
  }

  async deleteNavigationRoute(id: string, userId: string) {
    const route = await this.prisma.navigationRoute.findUnique({
      where: { id },
    });

    if (!route) {
      throw new NotFoundException('Navigation route not found');
    }

    if (route.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.navigationRoute.delete({
      where: { id },
    });
  }

  // ==================== Offline Guide ====================

  async getOfflineGuides(userId: string) {
    return this.prisma.offlineGuide.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createOfflineGuide(userId: string, dto: CreateOfflineGuideDto) {
    return this.prisma.offlineGuide.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateOfflineGuide(id: string, userId: string, dto: UpdateOfflineGuideDto) {
    const guide = await this.prisma.offlineGuide.findUnique({
      where: { id },
    });

    if (!guide) {
      throw new NotFoundException('Offline guide not found');
    }

    if (guide.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.offlineGuide.update({
      where: { id },
      data: dto,
    });
  }

  async deleteOfflineGuide(id: string, userId: string) {
    const guide = await this.prisma.offlineGuide.findUnique({
      where: { id },
    });

    if (!guide) {
      throw new NotFoundException('Offline guide not found');
    }

    if (guide.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.offlineGuide.delete({
      where: { id },
    });
  }

  // ==================== Flight/Train Status ====================

  async getFlightTrainStatuses(userId: string) {
    return this.prisma.flightTrainStatus.findMany({
      where: { userId },
      orderBy: { departureTime: 'asc' },
    });
  }

  async createFlightTrainStatus(userId: string, dto: CreateFlightTrainStatusDto) {
    return this.prisma.flightTrainStatus.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
        departureTime: new Date(dto.departureTime),
        arrivalTime: new Date(dto.arrivalTime),
      },
    });
  }

  async updateFlightTrainStatus(id: string, userId: string, dto: UpdateFlightTrainStatusDto) {
    const status = await this.prisma.flightTrainStatus.findUnique({
      where: { id },
    });

    if (!status) {
      throw new NotFoundException('Flight/train status not found');
    }

    if (status.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.flightTrainStatus.update({
      where: { id },
      data: dto,
    });
  }

  async deleteFlightTrainStatus(id: string, userId: string) {
    const status = await this.prisma.flightTrainStatus.findUnique({
      where: { id },
    });

    if (!status) {
      throw new NotFoundException('Flight/train status not found');
    }

    if (status.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.flightTrainStatus.delete({
      where: { id },
    });
  }

  // ==================== Visited Country ====================

  async getVisitedCountries(userId: string) {
    return this.prisma.visitedCountry.findMany({
      where: { userId },
      orderBy: { visitDate: 'desc' },
    });
  }

  async createVisitedCountry(userId: string, dto: CreateVisitedCountryDto) {
    return this.prisma.visitedCountry.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
        visitDate: new Date(dto.visitDate),
        visaExpiryDate: dto.visaExpiryDate ? new Date(dto.visaExpiryDate) : null,
      },
    });
  }

  async updateVisitedCountry(id: string, userId: string, dto: UpdateVisitedCountryDto) {
    const country = await this.prisma.visitedCountry.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException('Visited country not found');
    }

    if (country.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.visitedCountry.update({
      where: { id },
      data: {
        ...dto,
        visaExpiryDate: dto.visaExpiryDate ? new Date(dto.visaExpiryDate) : undefined,
      },
    });
  }

  async deleteVisitedCountry(id: string, userId: string) {
    const country = await this.prisma.visitedCountry.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException('Visited country not found');
    }

    if (country.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.visitedCountry.delete({
      where: { id },
    });
  }

  // ==================== Carbon Footprint ====================

  async getCarbonFootprints(userId: string) {
    return this.prisma.carbonFootprint.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCarbonFootprint(userId: string, dto: CreateCarbonFootprintDto) {
    return this.prisma.carbonFootprint.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateCarbonFootprint(id: string, userId: string, dto: UpdateCarbonFootprintDto) {
    const footprint = await this.prisma.carbonFootprint.findUnique({
      where: { id },
    });

    if (!footprint) {
      throw new NotFoundException('Carbon footprint not found');
    }

    if (footprint.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.carbonFootprint.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCarbonFootprint(id: string, userId: string) {
    const footprint = await this.prisma.carbonFootprint.findUnique({
      where: { id },
    });

    if (!footprint) {
      throw new NotFoundException('Carbon footprint not found');
    }

    if (footprint.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.carbonFootprint.delete({
      where: { id },
    });
  }

  // ==================== Emergency Contact ====================

  async getEmergencyContacts(userId: string) {
    return this.prisma.emergencyContact.findMany({
      where: { userId },
      orderBy: { isPrimary: 'desc' },
    });
  }

  async createEmergencyContact(userId: string, dto: CreateEmergencyContactDto) {
    return this.prisma.emergencyContact.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateEmergencyContact(id: string, userId: string, dto: UpdateEmergencyContactDto) {
    const contact = await this.prisma.emergencyContact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }

    if (contact.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.emergencyContact.update({
      where: { id },
      data: dto,
    });
  }

  async deleteEmergencyContact(id: string, userId: string) {
    const contact = await this.prisma.emergencyContact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Emergency contact not found');
    }

    if (contact.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.emergencyContact.delete({
      where: { id },
    });
  }

  // ==================== Safety Hub ====================

  async getSafetyHub(userId: string) {
    return this.prisma.safetyHub.findUnique({
      where: { userId },
    });
  }

  async createSafetyHub(userId: string) {
    return this.prisma.safetyHub.create({
      data: {
        user: { connect: { id: userId } },
      },
    });
  }

  async updateSafetyHub(userId: string, dto: UpdateSafetyHubDto) {
    const hub = await this.prisma.safetyHub.findUnique({
      where: { userId },
    });

    if (!hub) {
      return this.prisma.safetyHub.create({
        data: {
          user: { connect: { id: userId } },
          ...dto,
          lastLocationTime: dto.lastLocationTime ? new Date(dto.lastLocationTime) : undefined,
          sosTriggeredAt: dto.sosTriggeredAt ? new Date(dto.sosTriggeredAt) : undefined,
        },
      });
    }

    return this.prisma.safetyHub.update({
      where: { userId },
      data: {
        ...dto,
        lastLocationTime: dto.lastLocationTime ? new Date(dto.lastLocationTime) : undefined,
        sosTriggeredAt: dto.sosTriggeredAt ? new Date(dto.sosTriggeredAt) : undefined,
      },
    });
  }
}
