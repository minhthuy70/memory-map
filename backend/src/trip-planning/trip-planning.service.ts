import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TripPlanningService {
  constructor(private prisma: PrismaService) {}

  // ==================== Itineraries ====================

  async getItineraries(userId: string) {
    return this.prisma.itinerary.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async getItinerary(userId: string, id: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    if (itinerary.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return itinerary;
  }

  async createItinerary(userId: string, data: any) {
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

  async updateItinerary(userId: string, id: string, data: any) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    if (itinerary.userId !== userId) {
      throw new NotFoundException('Access denied');
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

  async deleteItinerary(userId: string, id: string) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id },
    });

    if (!itinerary) {
      throw new NotFoundException('Itinerary not found');
    }

    if (itinerary.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.itinerary.delete({
      where: { id },
    });
  }

  // ==================== Trip Expenses ====================

  async getTripExpenses(userId: string, itineraryId?: string) {
    const where: any = { userId };
    if (itineraryId) where.itineraryId = itineraryId;

    return this.prisma.tripExpense.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async createTripExpense(userId: string, data: any) {
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

  async deleteTripExpense(userId: string, id: string) {
    const expense = await this.prisma.tripExpense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.tripExpense.delete({
      where: { id },
    });
  }

  // ==================== Packing Lists ====================

  async getPackingLists(userId: string, itineraryId?: string) {
    const where: any = { userId };
    if (itineraryId) where.itineraryId = itineraryId;

    return this.prisma.packingList.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPackingList(userId: string, data: any) {
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

  async updatePackingList(userId: string, id: string, data: any) {
    const list = await this.prisma.packingList.findUnique({
      where: { id },
    });

    if (!list) {
      throw new NotFoundException('Packing list not found');
    }

    if (list.userId !== userId) {
      throw new NotFoundException('Access denied');
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

  async deletePackingList(userId: string, id: string) {
    const list = await this.prisma.packingList.findUnique({
      where: { id },
    });

    if (!list) {
      throw new NotFoundException('Packing list not found');
    }

    if (list.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.packingList.delete({
      where: { id },
    });
  }

  // ==================== Travel Documents ====================

  async getTravelDocuments(userId: string, itineraryId?: string) {
    const where: any = { userId };
    if (itineraryId) where.itineraryId = itineraryId;

    return this.prisma.travelDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createTravelDocument(userId: string, data: any) {
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

  async deleteTravelDocument(userId: string, id: string) {
    const doc = await this.prisma.travelDocument.findUnique({
      where: { id },
    });

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    if (doc.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    return this.prisma.travelDocument.delete({
      where: { id },
    });
  }
}
