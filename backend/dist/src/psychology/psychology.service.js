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
exports.PsychologyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PsychologyService = class PsychologyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGratitudeEntries(userId) {
        return this.prisma.gratitudeEntry.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createGratitudeEntry(userId, data) {
        return this.prisma.gratitudeEntry.create({
            data: {
                user: { connect: { id: userId } },
                content: data.content,
                category: data.category,
                memoryId: data.memoryId,
                isShared: data.isShared ?? false,
            },
        });
    }
    async getResilienceMoments(userId) {
        return this.prisma.resilienceMoment.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
    }
    async createResilienceMoment(userId, data) {
        return this.prisma.resilienceMoment.create({
            data: {
                user: { connect: { id: userId } },
                title: data.title,
                description: data.description,
                date: new Date(data.date),
                difficulty: data.difficulty,
                selfEncouragement: data.selfEncouragement,
            },
        });
    }
    async getDailySerendipity(userId) {
        let serendipity = await this.prisma.dailySerendipity.findUnique({
            where: { userId },
        });
        if (!serendipity) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const randomMemory = await this.prisma.memory.findFirst({
                where: { userId },
            });
            if (randomMemory) {
                serendipity = await this.prisma.dailySerendipity.create({
                    data: {
                        user: { connect: { id: userId } },
                        memoryId: randomMemory.id,
                        date: today,
                    },
                });
            }
        }
        return serendipity;
    }
    async markViewed(userId, moodBefore, moodAfter) {
        const serendipity = await this.prisma.dailySerendipity.findUnique({
            where: { userId },
        });
        if (!serendipity) {
            throw new common_1.NotFoundException('Daily serendipity not found');
        }
        return this.prisma.dailySerendipity.update({
            where: { userId },
            data: {
                isViewed: true,
                viewedAt: new Date(),
                moodBefore,
                moodAfter,
            },
        });
    }
    async getEmotionalWaveforms(userId, startDate, endDate) {
        const where = { userId };
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = startDate;
            if (endDate)
                where.date.lte = endDate;
        }
        return this.prisma.emotionalWaveform.findMany({
            where,
            orderBy: { date: 'asc' },
        });
    }
    async createEmotionalWaveform(userId, data) {
        return this.prisma.emotionalWaveform.create({
            data: {
                user: { connect: { id: userId } },
                date: new Date(data.date),
                mood: data.mood,
                stressLevel: data.stressLevel,
                notes: data.notes,
            },
        });
    }
    async getDreamJournals(userId) {
        return this.prisma.dreamJournal.findMany({
            where: { userId },
            orderBy: { dreamDate: 'desc' },
        });
    }
    async createDreamJournal(userId, data) {
        return this.prisma.dreamJournal.create({
            data: {
                user: { connect: { id: userId } },
                title: data.title,
                description: data.description,
                dreamDate: new Date(data.dreamDate),
                isLucid: data.isLucid ?? false,
                symbols: JSON.stringify(data.symbols || []),
                locationLatitude: data.locationLatitude,
                locationLongitude: data.locationLongitude,
                locationName: data.locationName,
            },
        });
    }
};
exports.PsychologyService = PsychologyService;
exports.PsychologyService = PsychologyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PsychologyService);
//# sourceMappingURL=psychology.service.js.map