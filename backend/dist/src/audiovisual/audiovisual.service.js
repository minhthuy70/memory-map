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
    async getHandwritingCanvases(userId) {
        return this.prisma.handwritingCanvas.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createHandwritingCanvas(userId, dto) {
        return this.prisma.handwritingCanvas.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateHandwritingCanvas(id, userId, dto) {
        const canvas = await this.prisma.handwritingCanvas.findUnique({
            where: { id },
        });
        if (!canvas) {
            throw new common_1.NotFoundException('Handwriting canvas not found');
        }
        if (canvas.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.handwritingCanvas.update({
            where: { id },
            data: dto,
        });
    }
    async deleteHandwritingCanvas(id, userId) {
        const canvas = await this.prisma.handwritingCanvas.findUnique({
            where: { id },
        });
        if (!canvas) {
            throw new common_1.NotFoundException('Handwriting canvas not found');
        }
        if (canvas.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.handwritingCanvas.delete({
            where: { id },
        });
    }
    async getVintageFilms(userId) {
        return this.prisma.vintageFilmEmulation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createVintageFilm(userId, dto) {
        return this.prisma.vintageFilmEmulation.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateVintageFilm(id, userId, dto) {
        const film = await this.prisma.vintageFilmEmulation.findUnique({
            where: { id },
        });
        if (!film) {
            throw new common_1.NotFoundException('Vintage film not found');
        }
        if (film.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.vintageFilmEmulation.update({
            where: { id },
            data: dto,
        });
    }
    async deleteVintageFilm(id, userId) {
        const film = await this.prisma.vintageFilmEmulation.findUnique({
            where: { id },
        });
        if (!film) {
            throw new common_1.NotFoundException('Vintage film not found');
        }
        if (film.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.vintageFilmEmulation.delete({
            where: { id },
        });
    }
    async getLivePhotos(userId) {
        return this.prisma.livePhotoMotionViewer.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createLivePhoto(userId, dto) {
        return this.prisma.livePhotoMotionViewer.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateLivePhoto(id, userId, dto) {
        const livePhoto = await this.prisma.livePhotoMotionViewer.findUnique({
            where: { id },
        });
        if (!livePhoto) {
            throw new common_1.NotFoundException('Live photo not found');
        }
        if (livePhoto.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.livePhotoMotionViewer.update({
            where: { id },
            data: dto,
        });
    }
    async deleteLivePhoto(id, userId) {
        const livePhoto = await this.prisma.livePhotoMotionViewer.findUnique({
            where: { id },
        });
        if (!livePhoto) {
            throw new common_1.NotFoundException('Live photo not found');
        }
        if (livePhoto.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.livePhotoMotionViewer.delete({
            where: { id },
        });
    }
    async getBeforeAfterSliders(userId) {
        return this.prisma.beforeAfterSlider.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createBeforeAfterSlider(userId, dto) {
        return this.prisma.beforeAfterSlider.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateBeforeAfterSlider(id, userId, dto) {
        const slider = await this.prisma.beforeAfterSlider.findUnique({
            where: { id },
        });
        if (!slider) {
            throw new common_1.NotFoundException('Before/after slider not found');
        }
        if (slider.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.beforeAfterSlider.update({
            where: { id },
            data: dto,
        });
    }
    async deleteBeforeAfterSlider(id, userId) {
        const slider = await this.prisma.beforeAfterSlider.findUnique({
            where: { id },
        });
        if (!slider) {
            throw new common_1.NotFoundException('Before/after slider not found');
        }
        if (slider.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.beforeAfterSlider.delete({
            where: { id },
        });
    }
    async getTypographyStamps(userId) {
        return this.prisma.typographyStampStudio.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createTypographyStamp(userId, dto) {
        return this.prisma.typographyStampStudio.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateTypographyStamp(id, userId, dto) {
        const stamp = await this.prisma.typographyStampStudio.findUnique({
            where: { id },
        });
        if (!stamp) {
            throw new common_1.NotFoundException('Typography stamp not found');
        }
        if (stamp.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.typographyStampStudio.update({
            where: { id },
            data: dto,
        });
    }
    async deleteTypographyStamp(id, userId) {
        const stamp = await this.prisma.typographyStampStudio.findUnique({
            where: { id },
        });
        if (!stamp) {
            throw new common_1.NotFoundException('Typography stamp not found');
        }
        if (stamp.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.typographyStampStudio.delete({
            where: { id },
        });
    }
    async getBeatSyncVideos(userId) {
        return this.prisma.beatSyncVideoGenerator.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createBeatSyncVideo(userId, dto) {
        return this.prisma.beatSyncVideoGenerator.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateBeatSyncVideo(id, userId, dto) {
        const video = await this.prisma.beatSyncVideoGenerator.findUnique({
            where: { id },
        });
        if (!video) {
            throw new common_1.NotFoundException('Beat sync video not found');
        }
        if (video.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.beatSyncVideoGenerator.update({
            where: { id },
            data: dto,
        });
    }
    async deleteBeatSyncVideo(id, userId) {
        const video = await this.prisma.beatSyncVideoGenerator.findUnique({
            where: { id },
        });
        if (!video) {
            throw new common_1.NotFoundException('Beat sync video not found');
        }
        if (video.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.beatSyncVideoGenerator.delete({
            where: { id },
        });
    }
    async getAIVoiceovers(userId) {
        return this.prisma.aIVoiceoverCommentary.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createAIVoiceover(userId, dto) {
        return this.prisma.aIVoiceoverCommentary.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateAIVoiceover(id, userId, dto) {
        const voiceover = await this.prisma.aIVoiceoverCommentary.findUnique({
            where: { id },
        });
        if (!voiceover) {
            throw new common_1.NotFoundException('AI voiceover not found');
        }
        if (voiceover.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.aIVoiceoverCommentary.update({
            where: { id },
            data: dto,
        });
    }
    async deleteAIVoiceover(id, userId) {
        const voiceover = await this.prisma.aIVoiceoverCommentary.findUnique({
            where: { id },
        });
        if (!voiceover) {
            throw new common_1.NotFoundException('AI voiceover not found');
        }
        if (voiceover.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.aIVoiceoverCommentary.delete({
            where: { id },
        });
    }
    async getMemorySoundtracks(userId) {
        return this.prisma.memorySoundtrackMashup.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createMemorySoundtrack(userId, dto) {
        return this.prisma.memorySoundtrackMashup.create({
            data: {
                user: { connect: { id: userId } },
                ...dto,
            },
        });
    }
    async updateMemorySoundtrack(id, userId, dto) {
        const soundtrack = await this.prisma.memorySoundtrackMashup.findUnique({
            where: { id },
        });
        if (!soundtrack) {
            throw new common_1.NotFoundException('Memory soundtrack not found');
        }
        if (soundtrack.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.memorySoundtrackMashup.update({
            where: { id },
            data: dto,
        });
    }
    async deleteMemorySoundtrack(id, userId) {
        const soundtrack = await this.prisma.memorySoundtrackMashup.findUnique({
            where: { id },
        });
        if (!soundtrack) {
            throw new common_1.NotFoundException('Memory soundtrack not found');
        }
        if (soundtrack.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return this.prisma.memorySoundtrackMashup.delete({
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