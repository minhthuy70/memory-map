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
exports.AudiovisualService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AudiovisualService = class AudiovisualService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getScrapbookProjects(userId) {
        return this.prisma.scrapbookProject.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async getScrapbookProject(userId, id) {
        const project = await this.prisma.scrapbookProject.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Scrapbook project not found');
        }
        if (project.userId !== userId && !project.isPublic) {
            throw new common_1.NotFoundException('Access denied');
        }
        return project;
    }
    async createScrapbookProject(userId, data) {
        return this.prisma.scrapbookProject.create({
            data: {
                user: { connect: { id: userId } },
                title: data.title,
                description: data.description,
                thumbnailUrl: data.thumbnailUrl,
                layoutData: JSON.stringify(data.layoutData || {}),
                isPublic: data.isPublic ?? false,
            },
        });
    }
    async updateScrapbookProject(userId, id, data) {
        const project = await this.prisma.scrapbookProject.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Scrapbook project not found');
        }
        if (project.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.scrapbookProject.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                thumbnailUrl: data.thumbnailUrl,
                layoutData: data.layoutData ? JSON.stringify(data.layoutData) : undefined,
                isPublic: data.isPublic,
            },
        });
    }
    async deleteScrapbookProject(userId, id) {
        const project = await this.prisma.scrapbookProject.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException('Scrapbook project not found');
        }
        if (project.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.scrapbookProject.delete({
            where: { id },
        });
    }
    async getSoundscapeMixes(userId) {
        return this.prisma.soundscapeMix.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getSoundscapeMix(userId, id) {
        const mix = await this.prisma.soundscapeMix.findUnique({
            where: { id },
        });
        if (!mix) {
            throw new common_1.NotFoundException('Soundscape mix not found');
        }
        if (mix.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return mix;
    }
    async createSoundscapeMix(userId, data) {
        return this.prisma.soundscapeMix.create({
            data: {
                user: { connect: { id: userId } },
                title: data.title,
                memoryId: data.memoryId,
                mixData: JSON.stringify(data.mixData || {}),
                duration: data.duration || 60,
                audioUrl: data.audioUrl,
            },
        });
    }
    async updateSoundscapeMix(userId, id, data) {
        const mix = await this.prisma.soundscapeMix.findUnique({
            where: { id },
        });
        if (!mix) {
            throw new common_1.NotFoundException('Soundscape mix not found');
        }
        if (mix.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.soundscapeMix.update({
            where: { id },
            data: {
                title: data.title,
                mixData: data.mixData ? JSON.stringify(data.mixData) : undefined,
                duration: data.duration,
                audioUrl: data.audioUrl,
            },
        });
    }
    async deleteSoundscapeMix(userId, id) {
        const mix = await this.prisma.soundscapeMix.findUnique({
            where: { id },
        });
        if (!mix) {
            throw new common_1.NotFoundException('Soundscape mix not found');
        }
        if (mix.userId !== userId) {
            throw new common_1.NotFoundException('Access denied');
        }
        return this.prisma.soundscapeMix.delete({
            where: { id },
        });
    }
};
exports.AudiovisualService = AudiovisualService;
exports.AudiovisualService = AudiovisualService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AudiovisualService);
//# sourceMappingURL=audiovisual.service.js.map