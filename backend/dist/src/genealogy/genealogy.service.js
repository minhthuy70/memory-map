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
exports.GenealogyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GenealogyService = class GenealogyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTimeLockedCapsules(userId) {
        return this.prisma.timeLockedCapsule.findMany({
            where: { userId },
            orderBy: { unlockDate: 'asc' },
        });
    }
    async createTimeLockedCapsule(userId, data) {
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
    async unlockTimeLockedCapsule(userId, id) {
        const capsule = await this.prisma.timeLockedCapsule.findUnique({
            where: { id },
        });
        if (!capsule) {
            throw new common_1.NotFoundException('Capsule not found');
        }
        if (capsule.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        if (new Date() < capsule.unlockDate) {
            throw new common_1.NotFoundException('Capsule is still locked');
        }
        return this.prisma.timeLockedCapsule.update({
            where: { id },
            data: {
                isUnlocked: true,
                unlockedAt: new Date(),
            },
        });
    }
    async getGeofencedCapsules(userId) {
        return this.prisma.geofencedCapsule.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createGeofencedCapsule(userId, data) {
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
    async checkGeofencedUnlock(userId, latitude, longitude) {
        const capsules = await this.prisma.geofencedCapsule.findMany({
            where: { userId, isUnlocked: false },
        });
        const unlocked = [];
        for (const capsule of capsules) {
            const distance = this.calculateDistance(latitude, longitude, capsule.latitude, capsule.longitude);
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
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3;
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    async getLegacyLetters(userId) {
        return this.prisma.legacyLetter.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createLegacyLetter(userId, data) {
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
    async getDigitalMemorials(userId) {
        return this.prisma.digitalMemorial.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createDigitalMemorial(userId, data) {
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
    async addCondolence(accessCode, message) {
        const memorial = await this.prisma.digitalMemorial.findUnique({
            where: { accessCode },
        });
        if (!memorial) {
            throw new common_1.NotFoundException('Memorial not found');
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
    async addCandle(accessCode) {
        const memorial = await this.prisma.digitalMemorial.findUnique({
            where: { accessCode },
        });
        if (!memorial) {
            throw new common_1.NotFoundException('Memorial not found');
        }
        return this.prisma.digitalMemorial.update({
            where: { accessCode },
            data: {
                candles: memorial.candles + 1,
            },
        });
    }
    async addFlower(accessCode) {
        const memorial = await this.prisma.digitalMemorial.findUnique({
            where: { accessCode },
        });
        if (!memorial) {
            throw new common_1.NotFoundException('Memorial not found');
        }
        return this.prisma.digitalMemorial.update({
            where: { accessCode },
            data: {
                flowers: memorial.flowers + 1,
            },
        });
    }
    async getFamilyHeirlooms(userId) {
        return this.prisma.familyHeirloom.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createFamilyHeirloom(userId, data) {
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
    async getFamilyRecipes(userId) {
        return this.prisma.familyRecipe.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createFamilyRecipe(userId, data) {
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
    async getFamilyMembers(userId) {
        return this.prisma.familyMember.findMany({
            where: { userId },
            orderBy: { birthDate: 'asc' },
        });
    }
    async createFamilyMember(userId, dto) {
        return this.prisma.familyMember.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
                birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
                deathDate: dto.deathDate ? new Date(dto.deathDate) : null,
            },
        });
    }
    async updateFamilyMember(id, userId, dto) {
        const member = await this.prisma.familyMember.findUnique({
            where: { id },
        });
        if (!member) {
            throw new common_1.NotFoundException('Family member not found');
        }
        if (member.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async deleteFamilyMember(id, userId) {
        const member = await this.prisma.familyMember.findUnique({
            where: { id },
        });
        if (!member) {
            throw new common_1.NotFoundException('Family member not found');
        }
        if (member.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.familyMember.delete({
            where: { id },
        });
    }
    async getAncestralMigrations(userId) {
        return this.prisma.ancestralMigration.findMany({
            where: { userId },
            orderBy: { moveDate: 'asc' },
        });
    }
    async createAncestralMigration(userId, dto) {
        return this.prisma.ancestralMigration.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
                moveDate: new Date(dto.moveDate),
            },
        });
    }
    async updateAncestralMigration(id, userId, dto) {
        const migration = await this.prisma.ancestralMigration.findUnique({
            where: { id },
        });
        if (!migration) {
            throw new common_1.NotFoundException('Migration not found');
        }
        if (migration.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.ancestralMigration.update({
            where: { id },
            data: {
                ...dto,
                moveDate: dto.moveDate ? new Date(dto.moveDate) : undefined,
            },
        });
    }
    async deleteAncestralMigration(id, userId) {
        const migration = await this.prisma.ancestralMigration.findUnique({
            where: { id },
        });
        if (!migration) {
            throw new common_1.NotFoundException('Migration not found');
        }
        if (migration.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.ancestralMigration.delete({
            where: { id },
        });
    }
    async getOralHistories(userId) {
        return this.prisma.oralHistory.findMany({
            where: { userId },
            orderBy: { recordedAt: 'desc' },
        });
    }
    async createOralHistory(userId, dto) {
        return this.prisma.oralHistory.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
                recordedAt: new Date(dto.recordedAt),
            },
        });
    }
    async updateOralHistory(id, userId, dto) {
        const history = await this.prisma.oralHistory.findUnique({
            where: { id },
        });
        if (!history) {
            throw new common_1.NotFoundException('Oral history not found');
        }
        if (history.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.oralHistory.update({
            where: { id },
            data: dto,
        });
    }
    async deleteOralHistory(id, userId) {
        const history = await this.prisma.oralHistory.findUnique({
            where: { id },
        });
        if (!history) {
            throw new common_1.NotFoundException('Oral history not found');
        }
        if (history.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.oralHistory.delete({
            where: { id },
        });
    }
    async getGenerationalComparisons(userId) {
        return this.prisma.generationalComparison.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createGenerationalComparison(userId, dto) {
        return this.prisma.generationalComparison.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateGenerationalComparison(id, userId, dto) {
        const comparison = await this.prisma.generationalComparison.findUnique({
            where: { id },
        });
        if (!comparison) {
            throw new common_1.NotFoundException('Comparison not found');
        }
        if (comparison.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.generationalComparison.update({
            where: { id },
            data: dto,
        });
    }
    async deleteGenerationalComparison(id, userId) {
        const comparison = await this.prisma.generationalComparison.findUnique({
            where: { id },
        });
        if (!comparison) {
            throw new common_1.NotFoundException('Comparison not found');
        }
        if (comparison.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.generationalComparison.delete({
            where: { id },
        });
    }
    async updateGeofencedCapsule(id, userId, dto) {
        const capsule = await this.prisma.geofencedCapsule.findUnique({
            where: { id },
        });
        if (!capsule) {
            throw new common_1.NotFoundException('Capsule not found');
        }
        if (capsule.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.geofencedCapsule.update({
            where: { id },
            data: {
                ...dto,
                memoryIds: dto.memoryIds !== undefined ? dto.memoryIds : undefined,
            },
        });
    }
    async deleteGeofencedCapsule(id, userId) {
        const capsule = await this.prisma.geofencedCapsule.findUnique({
            where: { id },
        });
        if (!capsule) {
            throw new common_1.NotFoundException('Capsule not found');
        }
        if (capsule.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.geofencedCapsule.delete({
            where: { id },
        });
    }
    async updateLegacyLetter(id, userId, dto) {
        const letter = await this.prisma.legacyLetter.findUnique({
            where: { id },
        });
        if (!letter) {
            throw new common_1.NotFoundException('Letter not found');
        }
        if (letter.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.legacyLetter.update({
            where: { id },
            data: {
                ...dto,
                recipientBirthday: dto.recipientBirthday ? new Date(dto.recipientBirthday) : undefined,
            },
        });
    }
    async deleteLegacyLetter(id, userId) {
        const letter = await this.prisma.legacyLetter.findUnique({
            where: { id },
        });
        if (!letter) {
            throw new common_1.NotFoundException('Letter not found');
        }
        if (letter.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.legacyLetter.delete({
            where: { id },
        });
    }
    async updateDigitalMemorial(id, userId, dto) {
        const memorial = await this.prisma.digitalMemorial.findUnique({
            where: { id },
        });
        if (!memorial) {
            throw new common_1.NotFoundException('Memorial not found');
        }
        if (memorial.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
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
    async deleteDigitalMemorial(id, userId) {
        const memorial = await this.prisma.digitalMemorial.findUnique({
            where: { id },
        });
        if (!memorial) {
            throw new common_1.NotFoundException('Memorial not found');
        }
        if (memorial.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.digitalMemorial.delete({
            where: { id },
        });
    }
};
exports.GenealogyService = GenealogyService;
exports.GenealogyService = GenealogyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GenealogyService);
//# sourceMappingURL=genealogy.service.js.map