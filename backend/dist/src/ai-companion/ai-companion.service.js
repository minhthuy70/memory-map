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
exports.AICompanionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const semantic_search_dto_1 = require("./dto/semantic-search.dto");
const voice_clone_dto_1 = require("./dto/voice-clone.dto");
let AICompanionService = class AICompanionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createAIJournalEntry(userId, dto) {
        return this.prisma.aIJournalEntry.create({
            data: {
                user: { connect: { id: userId } },
                date: new Date(dto.date),
                title: dto.title,
                content: dto.content,
                photos: JSON.stringify(dto.photos || []),
                locations: JSON.stringify(dto.locations || []),
                isDraft: dto.isDraft ?? true,
            },
        });
    }
    async getAIJournalEntries(userId, startDate, endDate) {
        const where = { userId };
        if (startDate || endDate) {
            where.date = {};
            if (startDate)
                where.date.gte = startDate;
            if (endDate)
                where.date.lte = endDate;
        }
        return this.prisma.aIJournalEntry.findMany({
            where,
            orderBy: { date: 'desc' },
        });
    }
    async getAIJournalEntry(id, userId) {
        const entry = await this.prisma.aIJournalEntry.findUnique({
            where: { id },
        });
        if (!entry) {
            throw new common_1.NotFoundException('Journal entry not found');
        }
        if (entry.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return entry;
    }
    async updateAIJournalEntry(id, userId, dto) {
        const entry = await this.getAIJournalEntry(id, userId);
        return this.prisma.aIJournalEntry.update({
            where: { id },
            data: {
                ...(dto.title && { title: dto.title }),
                ...(dto.content && { content: dto.content }),
                ...(dto.isDraft !== undefined && { isDraft: dto.isDraft }),
                ...(dto.isReviewed !== undefined && { isReviewed: dto.isReviewed }),
            },
        });
    }
    async deleteAIJournalEntry(id, userId) {
        const entry = await this.getAIJournalEntry(id, userId);
        await this.prisma.aIJournalEntry.delete({
            where: { id },
        });
        return { message: 'Journal entry deleted successfully' };
    }
    async generateJournalEntry(userId, dto) {
        const photos = dto.photoIds || [];
        const locations = [];
        const generatedContent = `Today was a beautiful day. I visited several memorable places and captured ${photos.length} special moments. The weather was perfect, and I felt truly present in each moment.`;
        const entry = await this.prisma.aIJournalEntry.create({
            data: {
                user: { connect: { id: userId } },
                date: new Date(dto.date),
                title: 'AI-Generated Journal Entry',
                content: generatedContent,
                photos: JSON.stringify(photos),
                locations: JSON.stringify(locations),
                isDraft: true,
                isReviewed: false,
            },
        });
        return entry;
    }
    async createAIInterview(userId, dto) {
        return this.prisma.aIInterview.create({
            data: {
                user: { connect: { id: userId } },
                question: dto.question,
            },
        });
    }
    async getAIInterviews(userId, completedOnly = false) {
        const where = { userId };
        if (completedOnly) {
            where.isCompleted = true;
        }
        return this.prisma.aIInterview.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAIInterview(id, userId) {
        const interview = await this.prisma.aIInterview.findUnique({
            where: { id },
        });
        if (!interview) {
            throw new common_1.NotFoundException('Interview not found');
        }
        if (interview.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return interview;
    }
    async updateAIInterview(id, userId, dto) {
        const interview = await this.getAIInterview(id, userId);
        return this.prisma.aIInterview.update({
            where: { id },
            data: {
                ...(dto.answer && { answer: dto.answer }),
                ...(dto.audioUrl && { audioUrl: dto.audioUrl }),
                ...(dto.duration && { duration: dto.duration }),
                ...(dto.isCompleted !== undefined && {
                    isCompleted: dto.isCompleted,
                    completedAt: dto.isCompleted ? new Date() : null,
                }),
            },
        });
    }
    async deleteAIInterview(id, userId) {
        const interview = await this.getAIInterview(id, userId);
        await this.prisma.aIInterview.delete({
            where: { id },
        });
        return { message: 'Interview deleted successfully' };
    }
    async generateQuestion(userId, dto) {
        const questions = [
            'What was your biggest dream that year?',
            'What moment made you feel most alive?',
            'Who influenced you the most during this time?',
            'What would you tell your younger self?',
            'What are you most grateful for?',
            'What challenges did you overcome?',
            'What memory brings you the most joy?',
            'How did you change during this period?',
        ];
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        const interview = await this.prisma.aIInterview.create({
            data: {
                user: { connect: { id: userId } },
                question: randomQuestion,
            },
        });
        return interview;
    }
    async createPhotoCuration(userId, dto) {
        return this.prisma.photoCuration.create({
            data: {
                user: { connect: { id: userId } },
                memoryId: dto.memoryId,
                photoId: dto.photoId,
                aestheticScore: dto.aestheticScore,
                focusScore: dto.focusScore,
                smileScore: dto.smileScore,
                overallScore: dto.overallScore,
                isHighlighted: dto.isHighlighted ?? false,
                isRejected: dto.isRejected ?? false,
                reasons: dto.reasons ? JSON.stringify(dto.reasons) : null,
            },
        });
    }
    async getPhotoCurations(userId, memoryId) {
        const where = { userId };
        if (memoryId) {
            where.memoryId = memoryId;
        }
        return this.prisma.photoCuration.findMany({
            where,
            orderBy: { overallScore: 'desc' },
        });
    }
    async getPhotoCuration(id, userId) {
        const curation = await this.prisma.photoCuration.findUnique({
            where: { id },
        });
        if (!curation) {
            throw new common_1.NotFoundException('Photo curation not found');
        }
        if (curation.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return curation;
    }
    async updatePhotoCuration(id, userId, dto) {
        const curation = await this.getPhotoCuration(id, userId);
        return this.prisma.photoCuration.update({
            where: { id },
            data: {
                ...(dto.isHighlighted !== undefined && { isHighlighted: dto.isHighlighted }),
                ...(dto.isRejected !== undefined && { isRejected: dto.isRejected }),
            },
        });
    }
    async deletePhotoCuration(id, userId) {
        const curation = await this.getPhotoCuration(id, userId);
        await this.prisma.photoCuration.delete({
            where: { id },
        });
        return { message: 'Photo curation deleted successfully' };
    }
    async batchCuration(userId, dto) {
        const results = [];
        for (const photoId of dto.photoIds) {
            const aestheticScore = Math.random() * 10;
            const focusScore = Math.random() * 10;
            const smileScore = Math.random() * 10;
            const overallScore = (aestheticScore + focusScore + smileScore) / 3;
            const curation = await this.prisma.photoCuration.create({
                data: {
                    user: { connect: { id: userId } },
                    memoryId: dto.memoryId,
                    photoId,
                    aestheticScore,
                    focusScore,
                    smileScore,
                    overallScore,
                    isHighlighted: overallScore > 7,
                    isRejected: overallScore < 4,
                },
            });
            results.push(curation);
        }
        return results;
    }
    async indexEntity(userId, dto) {
        return this.prisma.semanticSearchIndex.create({
            data: {
                user: { connect: { id: userId } },
                entityType: dto.entityType,
                entityId: dto.entityId,
                embedding: JSON.stringify(dto.embedding),
                metadata: dto.metadata || '{}',
            },
        });
    }
    async semanticSearch(userId, dto) {
        const where = { userId };
        if (dto.entityType && dto.entityType !== semantic_search_dto_1.SearchEntityType.ALL) {
            where.entityType = dto.entityType;
        }
        const indices = await this.prisma.semanticSearchIndex.findMany({
            where,
            take: dto.limit || 10,
        });
        return indices.map((index) => ({
            entityType: index.entityType,
            entityId: index.entityId,
            similarity: Math.random(),
            metadata: JSON.parse(index.metadata),
        }));
    }
    async getSearchIndices(userId, entityType) {
        const where = { userId };
        if (entityType) {
            where.entityType = entityType;
        }
        return this.prisma.semanticSearchIndex.findMany({
            where,
            orderBy: { indexedAt: 'desc' },
        });
    }
    async deleteSearchIndex(id, userId) {
        const index = await this.prisma.semanticSearchIndex.findUnique({
            where: { id },
        });
        if (!index) {
            throw new common_1.NotFoundException('Search index not found');
        }
        if (index.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        await this.prisma.semanticSearchIndex.delete({
            where: { id },
        });
        return { message: 'Search index deleted successfully' };
    }
    async createVoiceCloneModel(userId, dto) {
        return this.prisma.voiceCloneModel.create({
            data: {
                user: { connect: { id: userId } },
                modelName: dto.modelName,
                sampleAudioUrl: dto.sampleAudioUrl,
                modelPath: `/voice-models/${userId}/${dto.modelName}`,
                status: voice_clone_dto_1.VoiceCloneStatus.TRAINING,
                trainingProgress: 0,
            },
        });
    }
    async getVoiceCloneModels(userId) {
        return this.prisma.voiceCloneModel.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getVoiceCloneModel(id, userId) {
        const model = await this.prisma.voiceCloneModel.findUnique({
            where: { id },
        });
        if (!model) {
            throw new common_1.NotFoundException('Voice clone model not found');
        }
        if (model.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return model;
    }
    async updateVoiceCloneModel(id, userId, status, progress) {
        const model = await this.getVoiceCloneModel(id, userId);
        const updateData = {
            status,
            trainingProgress: progress,
        };
        if (status === voice_clone_dto_1.VoiceCloneStatus.READY) {
            updateData.readyAt = new Date();
        }
        return this.prisma.voiceCloneModel.update({
            where: { id },
            data: updateData,
        });
    }
    async deleteVoiceCloneModel(id, userId) {
        const model = await this.getVoiceCloneModel(id, userId);
        await this.prisma.voiceCloneModel.delete({
            where: { id },
        });
        return { message: 'Voice clone model deleted successfully' };
    }
    async generateVoiceNarration(userId, dto) {
        const model = await this.getVoiceCloneModel(dto.modelId, userId);
        if (model.status !== voice_clone_dto_1.VoiceCloneStatus.READY) {
            throw new common_1.ForbiddenException('Model is not ready for narration');
        }
        const audioUrl = `/voice-narrations/${userId}/${Date.now()}.mp3`;
        return {
            audioUrl,
            duration: Math.floor(dto.text.length / 10),
            text: dto.text,
        };
    }
};
exports.AICompanionService = AICompanionService;
exports.AICompanionService = AICompanionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AICompanionService);
//# sourceMappingURL=ai-companion.service.js.map