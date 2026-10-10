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
    async getEmotionalGeographyPoints(userId) {
        return this.prisma.emotionalGeographyPoint.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createEmotionalGeographyPoint(userId, memoryId, latitude, longitude, emotionType, intensity) {
        return this.prisma.emotionalGeographyPoint.create({
            data: {
                user: { connect: { id: userId } },
                memoryId,
                latitude,
                longitude,
                emotionType,
                intensity,
            },
        });
    }
    async getReminiscenceSessions(userId) {
        return this.prisma.reminiscenceTherapySession.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createReminiscenceSession(userId, dto) {
        return this.prisma.reminiscenceTherapySession.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateReminiscenceSession(id, userId, dto) {
        const session = await this.prisma.reminiscenceTherapySession.findUnique({
            where: { id },
        });
        if (!session) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (session.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.reminiscenceTherapySession.update({
            where: { id },
            data: {
                ...dto,
                completedAt: dto.response ? new Date() : null,
            },
        });
    }
    async getInnerChildDialogues(userId) {
        return this.prisma.innerChildDialogue.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createInnerChildDialogue(userId, dto) {
        return this.prisma.innerChildDialogue.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async getBinauralTherapies(userId) {
        return this.prisma.binauralSoundTherapy.findMany({
            where: { userId },
            orderBy: { playedAt: 'desc' },
        });
    }
    async createBinauralTherapy(userId, dto) {
        return this.prisma.binauralSoundTherapy.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateBinauralTherapy(id, userId, dto) {
        const therapy = await this.prisma.binauralSoundTherapy.findUnique({
            where: { id },
        });
        if (!therapy) {
            throw new common_1.NotFoundException('Therapy session not found');
        }
        if (therapy.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.binauralSoundTherapy.update({
            where: { id },
            data: dto,
        });
    }
    async getZenReflectionMode(userId) {
        let zenMode = await this.prisma.zenReflectionMode.findUnique({
            where: { userId },
        });
        if (!zenMode) {
            zenMode = await this.prisma.zenReflectionMode.create({
                data: {
                    userId,
                    isEnabled: false,
                    theme: 'monochrome',
                    hideMetrics: true,
                    breathingReminder: false,
                    breathingInterval: 5,
                },
            });
        }
        return zenMode;
    }
    async updateZenReflectionMode(userId, dto) {
        const zenMode = await this.getZenReflectionMode(userId);
        return this.prisma.zenReflectionMode.update({
            where: { id: zenMode.id },
            data: dto,
        });
    }
    async getEmotionalWaveforms(userId) {
        return this.prisma.emotionalWaveform.findMany({
            where: { userId },
            orderBy: { date: 'asc' },
        });
    }
    async createEmotionalWaveform(userId, dto) {
        return this.prisma.emotionalWaveform.create({
            data: {
                user: { connect: { id: userId } },
                date: new Date(dto.date),
                ...dto,
            },
        });
    }
    async updateEmotionalWaveform(id, userId, dto) {
        const waveform = await this.prisma.emotionalWaveform.findUnique({
            where: { id },
        });
        if (!waveform) {
            throw new common_1.NotFoundException('Waveform entry not found');
        }
        if (waveform.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.emotionalWaveform.update({
            where: { id },
            data: dto,
        });
    }
    async deleteEmotionalWaveform(id, userId) {
        const waveform = await this.prisma.emotionalWaveform.findUnique({
            where: { id },
        });
        if (!waveform) {
            throw new common_1.NotFoundException('Waveform entry not found');
        }
        if (waveform.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.emotionalWaveform.delete({
            where: { id },
        });
    }
    async getDreamJournals(userId) {
        return this.prisma.dreamJournal.findMany({
            where: { userId },
            orderBy: { dreamDate: 'desc' },
        });
    }
    async createDreamJournal(userId, dto) {
        return this.prisma.dreamJournal.create({
            data: {
                user: { connect: { id: userId } },
                dreamDate: new Date(dto.dreamDate),
                ...dto,
            },
        });
    }
    async updateDreamJournal(id, userId, dto) {
        const journal = await this.prisma.dreamJournal.findUnique({
            where: { id },
        });
        if (!journal) {
            throw new common_1.NotFoundException('Dream journal not found');
        }
        if (journal.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.dreamJournal.update({
            where: { id },
            data: {
                ...dto,
                dreamDate: dto.dreamDate ? new Date(dto.dreamDate) : undefined,
            },
        });
    }
    async deleteDreamJournal(id, userId) {
        const journal = await this.prisma.dreamJournal.findUnique({
            where: { id },
        });
        if (!journal) {
            throw new common_1.NotFoundException('Dream journal not found');
        }
        if (journal.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.dreamJournal.delete({
            where: { id },
        });
    }
};
exports.PsychologyService = PsychologyService;
exports.PsychologyService = PsychologyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PsychologyService);
//# sourceMappingURL=psychology.service.js.map