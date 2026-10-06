import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenealogyService {
  constructor(private prisma: PrismaService) {}

  // ==================== Time Locked Capsules ====================

  async getTimeLockedCapsules(userId: string) {
    return this.prisma.timeLockedCapsule.findMany({
      where: { userId },
      orderBy: { unlockDate: 'asc' },
    });
  }

  async createTimeLockedCapsule(userId: string, data: any) {
    return this.prisma.timeLockedCapsule.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        description: data.description,
        memoryIds: JSON.stringify(data.memoryIds || []),
        unlockDate: new Date(data.unlockDate),
      },
    });
  }

  async unlockTimeLockedCapsule(userId: string, id: string) {
    const capsule = await this.prisma.timeLockedCapsule.findUnique({
      where: { id },
    });

    if (!capsule) {
      throw new NotFoundException('Capsule not found');
    }

    if (capsule.userId !== userId) {
      throw new NotFoundException('Access denied');
    }

    if (new Date() < capsule.unlockDate) {
      throw new NotFoundException('Capsule is still locked');
    }

    return this.prisma.timeLockedCapsule.update({
      where: { id },
      data: {
        isUnlocked: true,
        unlockedAt: new Date(),
      },
    });
  }

  // ==================== Geofenced Capsules ====================

  async getGeofencedCapsules(userId: string) {
    return this.prisma.geofencedCapsule.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGeofencedCapsule(userId: string, data: any) {
    return this.prisma.geofencedCapsule.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        description: data.description,
        memoryIds: JSON.stringify(data.memoryIds || []),
        latitude: data.latitude,
        longitude: data.longitude,
        radiusMeters: data.radiusMeters || 50,
      },
    });
  }

  async checkGeofencedUnlock(userId: string, latitude: number, longitude: number) {
    const capsules = await this.prisma.geofencedCapsule.findMany({
      where: { userId, isUnlocked: false },
    });

    const unlocked = [];

    for (const capsule of capsules) {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        capsule.latitude,
        capsule.longitude,
      );

      if (distance <= capsule.radiusMeters) {
        await this.prisma.geofencedCapsule.update({
          where: { id: capsule.id },
          data: {
            isUnlocked: true,
            unlockedAt: new Date(),
          },
        });
        unlocked.push(capsule);
      }
    }

    return unlocked;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // ==================== Legacy Letters ====================

  async getLegacyLetters(userId: string) {
    return this.prisma.legacyLetter.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLegacyLetter(userId: string, data: any) {
    return this.prisma.legacyLetter.create({
      data: {
        user: { connect: { id: userId } },
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail,
        recipientBirthday: data.recipientBirthday ? new Date(data.recipientBirthday) : null,
        milestoneAge: data.milestoneAge,
        title: data.title,
        content: data.content,
      },
    });
  }

  // ==================== Digital Memorials ====================

  async getDigitalMemorials(userId: string) {
    return this.prisma.digitalMemorial.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDigitalMemorial(userId: string, data: any) {
    return this.prisma.digitalMemorial.create({
      data: {
        user: { connect: { id: userId } },
        deceasedName: data.deceasedName,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        deathDate: data.deathDate ? new Date(data.deathDate) : null,
        biography: data.biography,
        photoUrl: data.photoUrl,
        isPublic: data.isPublic ?? false,
        accessCode: data.accessCode,
      },
    });
  }

  async addCondolence(accessCode: string, message: string) {
    const memorial = await this.prisma.digitalMemorial.findUnique({
      where: { accessCode },
    });

    if (!memorial) {
      throw new NotFoundException('Memorial not found');
    }

    const condolences = JSON.parse(memorial.condolences || '[]');
    condolences.push({
      message,
      date: new Date().toISOString(),
    });

    return this.prisma.digitalMemorial.update({
      where: { accessCode },
      data: {
        condolences: JSON.stringify(condolences),
      },
    });
  }

  async addCandle(accessCode: string) {
    const memorial = await this.prisma.digitalMemorial.findUnique({
      where: { accessCode },
    });

    if (!memorial) {
      throw new NotFoundException('Memorial not found');
    }

    return this.prisma.digitalMemorial.update({
      where: { accessCode },
      data: {
        candles: memorial.candles + 1,
      },
    });
  }

  async addFlower(accessCode: string) {
    const memorial = await this.prisma.digitalMemorial.findUnique({
      where: { accessCode },
    });

    if (!memorial) {
      throw new NotFoundException('Memorial not found');
    }

    return this.prisma.digitalMemorial.update({
      where: { accessCode },
      data: {
        flowers: memorial.flowers + 1,
      },
    });
  }

  // ==================== Family Heirlooms ====================

  async getFamilyHeirlooms(userId: string) {
    return this.prisma.familyHeirloom.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFamilyHeirloom(userId: string, data: any) {
    return this.prisma.familyHeirloom.create({
      data: {
        user: { connect: { id: userId } },
        name: data.name,
        description: data.description,
        photoUrl: data.photoUrl,
        year: data.year,
        category: data.category,
        provenance: data.provenance,
      },
    });
  }

  // ==================== Family Recipes ====================

  async getFamilyRecipes(userId: string) {
    return this.prisma.familyRecipe.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFamilyRecipe(userId: string, data: any) {
    return this.prisma.familyRecipe.create({
      data: {
        user: { connect: { id: userId } },
        title: data.title,
        description: data.description,
        ingredients: JSON.stringify(data.ingredients || []),
        steps: JSON.stringify(data.steps || []),
        originator: data.originator,
        memoryId: data.memoryId,
        voiceNoteUrl: data.voiceNoteUrl,
      },
    });
  }
}
