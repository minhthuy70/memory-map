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
    async getItineraries(userId) {
        return this.prisma.itinerary.findMany({
            where: { userId },
            orderBy: { startDate: 'desc' },
        });
    }
    async getItinerary(userId, id) {
        const itinerary = await this.prisma.itinerary.findUnique({
            where: { id },
        });
        if (!itinerary) {
            throw new common_1.NotFoundException('Itinerary not found');
        }
        if (itinerary.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return itinerary;
    }
    async createItinerary(userId, data) {
        return this.prisma.itinerary.create({
            data: {
                user: { connect: { id: userId } },
                title: data.title,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                destination: data.destination,
                itineraryData: JSON.stringify(data.itineraryData || {}),
                isShared: data.isShared ?? false,
            },
        });
    }
    async updateItinerary(userId, id, data) {
        const itinerary = await this.prisma.itinerary.findUnique({
            where: { id },
        });
        if (!itinerary) {
            throw new common_1.NotFoundException('Itinerary not found');
        }
        if (itinerary.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.itinerary.update({
            where: { id },
            data: {
                title: data.title,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                destination: data.destination,
                itineraryData: data.itineraryData ? JSON.stringify(data.itineraryData) : undefined,
                isShared: data.isShared,
            },
        });
    }
    async deleteItinerary(userId, id) {
        const itinerary = await this.prisma.itinerary.findUnique({
            where: { id },
        });
        if (!itinerary) {
            throw new common_1.NotFoundException('Itinerary not found');
        }
        if (itinerary.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.itinerary.delete({
            where: { id },
        });
    }
    async getTripExpenses(userId, itineraryId) {
        const where = { userId };
        if (itineraryId)
            where.itineraryId = itineraryId;
        return this.prisma.tripExpense.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    }
    async createTripExpense(userId, data) {
        return this.prisma.tripExpense.create({
            data: {
                user: { connect: { id: userId } },
                itineraryId: data.itineraryId,
                memoryId: data.memoryId,
                title: data.title,
                amount: data.amount,
                currency: data.currency,
                category: data.category,
                date: new Date(data.date),
                notes: data.notes,
            },
        });
    }
    async deleteTripExpense(userId, id) {
        const expense = await this.prisma.tripExpense.findUnique({
            where: { id },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        if (expense.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.tripExpense.delete({
            where: { id },
        });
    }
    async getPackingLists(userId, itineraryId) {
        const where = { userId };
        if (itineraryId)
            where.itineraryId = itineraryId;
        return this.prisma.packingList.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async createPackingList(userId, data) {
        return this.prisma.packingList.create({
            data: {
                user: { connect: { id: userId } },
                itineraryId: data.itineraryId,
                title: data.title,
                items: JSON.stringify(data.items || []),
                isCompleted: data.isCompleted ?? false,
            },
        });
    }
    async updatePackingList(userId, id, data) {
        const list = await this.prisma.packingList.findUnique({
            where: { id },
        });
        if (!list) {
            throw new common_1.NotFoundException('Packing list not found');
        }
        if (list.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.packingList.update({
            where: { id },
            data: {
                title: data.title,
                items: data.items ? JSON.stringify(data.items) : undefined,
                isCompleted: data.isCompleted,
            },
        });
    }
    async deletePackingList(userId, id) {
        const list = await this.prisma.packingList.findUnique({
            where: { id },
        });
        if (!list) {
            throw new common_1.NotFoundException('Packing list not found');
        }
        if (list.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.packingList.delete({
            where: { id },
        });
    }
    async getTravelDocuments(userId, itineraryId) {
        const where = { userId };
        if (itineraryId)
            where.itineraryId = itineraryId;
        return this.prisma.travelDocument.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async createTravelDocument(userId, data) {
        return this.prisma.travelDocument.create({
            data: {
                user: { connect: { id: userId } },
                itineraryId: data.itineraryId,
                documentType: data.documentType,
                title: data.title,
                documentNumber: data.documentNumber,
                expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
                fileUrl: data.fileUrl,
                notes: data.notes,
            },
        });
    }
    async deleteTravelDocument(userId, id) {
        const doc = await this.prisma.travelDocument.findUnique({
            where: { id },
        });
        if (!doc) {
            throw new common_1.NotFoundException('Document not found');
        }
        if (doc.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.travelDocument.delete({
            where: { id },
        });
    }
};
exports.TripPlanningService = TripPlanningService;
exports.TripPlanningService = TripPlanningService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TripPlanningService);
//# sourceMappingURL=trip-planning.service.js.map