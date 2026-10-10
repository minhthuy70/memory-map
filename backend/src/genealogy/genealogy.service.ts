import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFamilyMemberDto,
  UpdateFamilyMemberDto,
  CreateAncestralMigrationDto,
  UpdateAncestralMigrationDto,
  CreateOralHistoryDto,
  UpdateOralHistoryDto,
  CreateGenerationalComparisonDto,
  UpdateGenerationalComparisonDto,
  CreateGeofencedCapsuleDto,
  UpdateGeofencedCapsuleDto,
  CreateLegacyLetterDto,
  UpdateLegacyLetterDto,
  CreateDigitalMemorialDto,
  UpdateDigitalMemorialDto,
} from './dto/genealogy.dto';

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
        condolences: '[]',
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

  // ==================== Family Members ====================

  async getFamilyMembers(userId: string) {
    return this.prisma.familyMember.findMany({
      where: { userId },
      orderBy: { birthDate: 'asc' },
    });
  }

  async createFamilyMember(userId: string, dto: CreateFamilyMemberDto) {
    return this.prisma.familyMember.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        deathDate: dto.deathDate ? new Date(dto.deathDate) : null,
      },
    });
  }

  async updateFamilyMember(id: string, userId: string, dto: UpdateFamilyMemberDto) {
    const member = await this.prisma.familyMember.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException('Family member not found');
    }

    if (member.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.familyMember.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        deathDate: dto.deathDate ? new Date(dto.deathDate) : undefined,
      },
    });
  }

  async deleteFamilyMember(id: string, userId: string) {
    const member = await this.prisma.familyMember.findUnique({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException('Family member not found');
    }

    if (member.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.familyMember.delete({
      where: { id },
    });
  }

  // ==================== Ancestral Migrations ====================

  async getAncestralMigrations(userId: string) {
    return this.prisma.ancestralMigration.findMany({
      where: { userId },
      orderBy: { moveDate: 'asc' },
    });
  }

  async createAncestralMigration(userId: string, dto: CreateAncestralMigrationDto) {
    return this.prisma.ancestralMigration.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
        moveDate: new Date(dto.moveDate),
      },
    });
  }

  async updateAncestralMigration(id: string, userId: string, dto: UpdateAncestralMigrationDto) {
    const migration = await this.prisma.ancestralMigration.findUnique({
      where: { id },
    });

    if (!migration) {
      throw new NotFoundException('Migration not found');
    }

    if (migration.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.ancestralMigration.update({
      where: { id },
      data: {
        ...dto,
        moveDate: dto.moveDate ? new Date(dto.moveDate) : undefined,
      },
    });
  }

  async deleteAncestralMigration(id: string, userId: string) {
    const migration = await this.prisma.ancestralMigration.findUnique({
      where: { id },
    });

    if (!migration) {
      throw new NotFoundException('Migration not found');
    }

    if (migration.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.ancestralMigration.delete({
      where: { id },
    });
  }

  // ==================== Oral Histories ====================

  async getOralHistories(userId: string) {
    return this.prisma.oralHistory.findMany({
      where: { userId },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async createOralHistory(userId: string, dto: CreateOralHistoryDto) {
    return this.prisma.oralHistory.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
        recordedAt: new Date(dto.recordedAt),
      },
    });
  }

  async updateOralHistory(id: string, userId: string, dto: UpdateOralHistoryDto) {
    const history = await this.prisma.oralHistory.findUnique({
      where: { id },
    });

    if (!history) {
      throw new NotFoundException('Oral history not found');
    }

    if (history.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.oralHistory.update({
      where: { id },
      data: dto,
    });
  }

  async deleteOralHistory(id: string, userId: string) {
    const history = await this.prisma.oralHistory.findUnique({
      where: { id },
    });

    if (!history) {
      throw new NotFoundException('Oral history not found');
    }

    if (history.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.oralHistory.delete({
      where: { id },
    });
  }

  // ==================== Generational Comparisons ====================

  async getGenerationalComparisons(userId: string) {
    return this.prisma.generationalComparison.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGenerationalComparison(userId: string, dto: CreateGenerationalComparisonDto) {
    return this.prisma.generationalComparison.create({
      data: {
        user: { connect: { id: userId } },
        ...dto,
      },
    });
  }

  async updateGenerationalComparison(id: string, userId: string, dto: UpdateGenerationalComparisonDto) {
    const comparison = await this.prisma.generationalComparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    if (comparison.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.generationalComparison.update({
      where: { id },
      data: dto,
    });
  }

  async deleteGenerationalComparison(id: string, userId: string) {
    const comparison = await this.prisma.generationalComparison.findUnique({
      where: { id },
    });

    if (!comparison) {
      throw new NotFoundException('Comparison not found');
    }

    if (comparison.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.generationalComparison.delete({
      where: { id },
    });
  }

  // ==================== Update Geofenced Capsule ====================

  async updateGeofencedCapsule(id: string, userId: string, dto: UpdateGeofencedCapsuleDto) {
    const capsule = await this.prisma.geofencedCapsule.findUnique({
      where: { id },
    });

    if (!capsule) {
      throw new NotFoundException('Capsule not found');
    }

    if (capsule.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.geofencedCapsule.update({
      where: { id },
      data: {
        ...dto,
        memoryIds: dto.memoryIds !== undefined ? dto.memoryIds : undefined,
      },
    });
  }

  async deleteGeofencedCapsule(id: string, userId: string) {
    const capsule = await this.prisma.geofencedCapsule.findUnique({
      where: { id },
    });

    if (!capsule) {
      throw new NotFoundException('Capsule not found');
    }

    if (capsule.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.geofencedCapsule.delete({
      where: { id },
    });
  }

  // ==================== Update Legacy Letter ====================

  async updateLegacyLetter(id: string, userId: string, dto: UpdateLegacyLetterDto) {
    const letter = await this.prisma.legacyLetter.findUnique({
      where: { id },
    });

    if (!letter) {
      throw new NotFoundException('Letter not found');
    }

    if (letter.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.legacyLetter.update({
      where: { id },
      data: {
        ...dto,
        recipientBirthday: dto.recipientBirthday ? new Date(dto.recipientBirthday) : undefined,
      },
    });
  }

  async deleteLegacyLetter(id: string, userId: string) {
    const letter = await this.prisma.legacyLetter.findUnique({
      where: { id },
    });

    if (!letter) {
      throw new NotFoundException('Letter not found');
    }

    if (letter.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.legacyLetter.delete({
      where: { id },
    });
  }

  // ==================== Update Digital Memorial ====================

  async updateDigitalMemorial(id: string, userId: string, dto: UpdateDigitalMemorialDto) {
    const memorial = await this.prisma.digitalMemorial.findUnique({
      where: { id },
    });

    if (!memorial) {
      throw new NotFoundException('Memorial not found');
    }

    if (memorial.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.digitalMemorial.update({
      where: { id },
      data: {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        deathDate: dto.deathDate ? new Date(dto.deathDate) : undefined,
      },
    });
  }

  async deleteDigitalMemorial(id: string, userId: string) {
    const memorial = await this.prisma.digitalMemorial.findUnique({
      where: { id },
    });

    if (!memorial) {
      throw new NotFoundException('Memorial not found');
    }

    if (memorial.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.digitalMemorial.delete({
      where: { id },
    });
  }
}
