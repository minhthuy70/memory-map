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
exports.TripPlanningService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TripPlanningService = class TripPlanningService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRouteOptimizations(userId) {
        return this.prisma.routeOptimization.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createRouteOptimization(userId, dto) {
        return this.prisma.routeOptimization.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateRouteOptimization(id, userId, dto) {
        const route = await this.prisma.routeOptimization.findUnique({
            where: { id },
        });
        if (!route) {
            throw new common_1.NotFoundException('Route optimization not found');
        }
        if (route.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.routeOptimization.update({
            where: { id },
            data: dto,
        });
    }
    async deleteRouteOptimization(id, userId) {
        const route = await this.prisma.routeOptimization.findUnique({
            where: { id },
        });
        if (!route) {
            throw new common_1.NotFoundException('Route optimization not found');
        }
        if (route.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.routeOptimization.delete({
            where: { id },
        });
    }
    async getNavigationRoutes(userId) {
        return this.prisma.navigationRoute.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createNavigationRoute(userId, dto) {
        return this.prisma.navigationRoute.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateNavigationRoute(id, userId, dto) {
        const route = await this.prisma.navigationRoute.findUnique({
            where: { id },
        });
        if (!route) {
            throw new common_1.NotFoundException('Navigation route not found');
        }
        if (route.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.navigationRoute.update({
            where: { id },
            data: dto,
        });
    }
    async deleteNavigationRoute(id, userId) {
        const route = await this.prisma.navigationRoute.findUnique({
            where: { id },
        });
        if (!route) {
            throw new common_1.NotFoundException('Navigation route not found');
        }
        if (route.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.navigationRoute.delete({
            where: { id },
        });
    }
    async getOfflineGuides(userId) {
        return this.prisma.offlineGuide.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createOfflineGuide(userId, dto) {
        return this.prisma.offlineGuide.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateOfflineGuide(id, userId, dto) {
        const guide = await this.prisma.offlineGuide.findUnique({
            where: { id },
        });
        if (!guide) {
            throw new common_1.NotFoundException('Offline guide not found');
        }
        if (guide.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.offlineGuide.update({
            where: { id },
            data: dto,
        });
    }
    async deleteOfflineGuide(id, userId) {
        const guide = await this.prisma.offlineGuide.findUnique({
            where: { id },
        });
        if (!guide) {
            throw new common_1.NotFoundException('Offline guide not found');
        }
        if (guide.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.offlineGuide.delete({
            where: { id },
        });
    }
    async getFlightTrainStatuses(userId) {
        return this.prisma.flightTrainStatus.findMany({
            where: { userId },
            orderBy: { departureTime: 'asc' },
        });
    }
    async createFlightTrainStatus(userId, dto) {
        return this.prisma.flightTrainStatus.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
                departureTime: new Date(dto.departureTime),
                arrivalTime: new Date(dto.arrivalTime),
            },
        });
    }
    async updateFlightTrainStatus(id, userId, dto) {
        const status = await this.prisma.flightTrainStatus.findUnique({
            where: { id },
        });
        if (!status) {
            throw new common_1.NotFoundException('Flight/train status not found');
        }
        if (status.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.flightTrainStatus.update({
            where: { id },
            data: dto,
        });
    }
    async deleteFlightTrainStatus(id, userId) {
        const status = await this.prisma.flightTrainStatus.findUnique({
            where: { id },
        });
        if (!status) {
            throw new common_1.NotFoundException('Flight/train status not found');
        }
        if (status.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.flightTrainStatus.delete({
            where: { id },
        });
    }
    async getVisitedCountries(userId) {
        return this.prisma.visitedCountry.findMany({
            where: { userId },
            orderBy: { visitDate: 'desc' },
        });
    }
    async createVisitedCountry(userId, dto) {
        return this.prisma.visitedCountry.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
                visitDate: new Date(dto.visitDate),
                visaExpiryDate: dto.visaExpiryDate ? new Date(dto.visaExpiryDate) : null,
            },
        });
    }
    async updateVisitedCountry(id, userId, dto) {
        const country = await this.prisma.visitedCountry.findUnique({
            where: { id },
        });
        if (!country) {
            throw new common_1.NotFoundException('Visited country not found');
        }
        if (country.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.visitedCountry.update({
            where: { id },
            data: {
                ...dto,
                visaExpiryDate: dto.visaExpiryDate ? new Date(dto.visaExpiryDate) : undefined,
            },
        });
    }
    async deleteVisitedCountry(id, userId) {
        const country = await this.prisma.visitedCountry.findUnique({
            where: { id },
        });
        if (!country) {
            throw new common_1.NotFoundException('Visited country not found');
        }
        if (country.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.visitedCountry.delete({
            where: { id },
        });
    }
    async getCarbonFootprints(userId) {
        return this.prisma.carbonFootprint.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createCarbonFootprint(userId, dto) {
        return this.prisma.carbonFootprint.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateCarbonFootprint(id, userId, dto) {
        const footprint = await this.prisma.carbonFootprint.findUnique({
            where: { id },
        });
        if (!footprint) {
            throw new common_1.NotFoundException('Carbon footprint not found');
        }
        if (footprint.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.carbonFootprint.update({
            where: { id },
            data: dto,
        });
    }
    async deleteCarbonFootprint(id, userId) {
        const footprint = await this.prisma.carbonFootprint.findUnique({
            where: { id },
        });
        if (!footprint) {
            throw new common_1.NotFoundException('Carbon footprint not found');
        }
        if (footprint.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.carbonFootprint.delete({
            where: { id },
        });
    }
    async getEmergencyContacts(userId) {
        return this.prisma.emergencyContact.findMany({
            where: { userId },
            orderBy: { isPrimary: 'desc' },
        });
    }
    async createEmergencyContact(userId, dto) {
        return this.prisma.emergencyContact.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateEmergencyContact(id, userId, dto) {
        const contact = await this.prisma.emergencyContact.findUnique({
            where: { id },
        });
        if (!contact) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        if (contact.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.emergencyContact.update({
            where: { id },
            data: dto,
        });
    }
    async deleteEmergencyContact(id, userId) {
        const contact = await this.prisma.emergencyContact.findUnique({
            where: { id },
        });
        if (!contact) {
            throw new common_1.NotFoundException('Emergency contact not found');
        }
        if (contact.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.emergencyContact.delete({
            where: { id },
        });
    }
    async getSafetyHub(userId) {
        return this.prisma.safetyHub.findUnique({
            where: { userId },
        });
    }
    async createSafetyHub(userId) {
        return this.prisma.safetyHub.create({
            data: {
                user: { connect: { id: userId } },
            },
        });
    }
    async updateSafetyHub(userId, dto) {
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
};
exports.TripPlanningService = TripPlanningService;
exports.TripPlanningService = TripPlanningService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TripPlanningService);
//# sourceMappingURL=trip-planning.service.js.map