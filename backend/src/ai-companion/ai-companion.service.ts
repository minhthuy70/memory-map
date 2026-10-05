import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAIJournalEntryDto,
  UpdateAIJournalEntryDto,
  GenerateJournalEntryDto,
} from './dto/ai-journal.dto';
import {
  CreateAIInterviewDto,
  UpdateAIInterviewDto,
  GenerateQuestionDto,
} from './dto/ai-interview.dto';
import {
  CreatePhotoCurationDto,
  UpdatePhotoCurationDto,
  BatchCurationDto,
} from './dto/photo-curation.dto';
import {
  SemanticSearchDto,
  IndexEntityDto,
  SearchEntityType,
} from './dto/semantic-search.dto';
import {
  CreateVoiceCloneModelDto,
  GenerateVoiceNarrationDto,
  VoiceCloneStatus,
} from './dto/voice-clone.dto';

@Injectable()
export class AICompanionService {
  constructor(private prisma: PrismaService) {}

  // ==================== AI Journal Entries ====================

  async createAIJournalEntry(userId: string, dto: CreateAIJournalEntryDto) {
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

  async getAIJournalEntries(userId: string, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return this.prisma.aIJournalEntry.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  async getAIJournalEntry(id: string, userId: string) {
    const entry = await this.prisma.aIJournalEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException('Journal entry not found');
    }

    if (entry.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return entry;
  }

  async updateAIJournalEntry(id: string, userId: string, dto: UpdateAIJournalEntryDto) {
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

  async deleteAIJournalEntry(id: string, userId: string) {
    const entry = await this.getAIJournalEntry(id, userId);

    await this.prisma.aIJournalEntry.delete({
      where: { id },
    });

    return { message: 'Journal entry deleted successfully' };
  }

  async generateJournalEntry(userId: string, dto: GenerateJournalEntryDto) {
    // In production, this would use AI to analyze photos and generate content
    const photos = dto.photoIds || [];
    const locations = [];

    // Simulate AI generation
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

  // ==================== AI Interviews ====================

  async createAIInterview(userId: string, dto: CreateAIInterviewDto) {
    return this.prisma.aIInterview.create({
      data: {
        user: { connect: { id: userId } },
        question: dto.question,
      },
    });
  }

  async getAIInterviews(userId: string, completedOnly = false) {
    const where: any = { userId };
    if (completedOnly) {
      where.isCompleted = true;
    }

    return this.prisma.aIInterview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAIInterview(id: string, userId: string) {
    const interview = await this.prisma.aIInterview.findUnique({
      where: { id },
    });

    if (!interview) {
      throw new NotFoundException('Interview not found');
    }

    if (interview.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return interview;
  }

  async updateAIInterview(id: string, userId: string, dto: UpdateAIInterviewDto) {
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

  async deleteAIInterview(id: string, userId: string) {
    const interview = await this.getAIInterview(id, userId);

    await this.prisma.aIInterview.delete({
      where: { id },
    });

    return { message: 'Interview deleted successfully' };
  }

  async generateQuestion(userId: string, dto: GenerateQuestionDto) {
    // In production, this would use AI to generate thoughtful questions
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

  // ==================== Photo Curation ====================

  async createPhotoCuration(userId: string, dto: CreatePhotoCurationDto) {
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

  async getPhotoCurations(userId: string, memoryId?: string) {
    const where: any = { userId };
    if (memoryId) {
      where.memoryId = memoryId;
    }

    return this.prisma.photoCuration.findMany({
      where,
      orderBy: { overallScore: 'desc' },
    });
  }

  async getPhotoCuration(id: string, userId: string) {
    const curation = await this.prisma.photoCuration.findUnique({
      where: { id },
    });

    if (!curation) {
      throw new NotFoundException('Photo curation not found');
    }

    if (curation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return curation;
  }

  async updatePhotoCuration(id: string, userId: string, dto: UpdatePhotoCurationDto) {
    const curation = await this.getPhotoCuration(id, userId);

    return this.prisma.photoCuration.update({
      where: { id },
      data: {
        ...(dto.isHighlighted !== undefined && { isHighlighted: dto.isHighlighted }),
        ...(dto.isRejected !== undefined && { isRejected: dto.isRejected }),
      },
    });
  }

  async deletePhotoCuration(id: string, userId: string) {
    const curation = await this.getPhotoCuration(id, userId);

    await this.prisma.photoCuration.delete({
      where: { id },
    });

    return { message: 'Photo curation deleted successfully' };
  }

  async batchCuration(userId: string, dto: BatchCurationDto) {
    // In production, this would use AI to analyze all photos
    const results = [];

    for (const photoId of dto.photoIds) {
      // Simulate AI scoring
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

  // ==================== Semantic Search ====================

  async indexEntity(userId: string, dto: IndexEntityDto) {
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

  async semanticSearch(userId: string, dto: SemanticSearchDto) {
    // In production, this would use vector similarity search
    // For now, return mock results

    const where: any = { userId };
    if (dto.entityType && dto.entityType !== SearchEntityType.ALL) {
      where.entityType = dto.entityType;
    }

    const indices = await this.prisma.semanticSearchIndex.findMany({
      where,
      take: dto.limit || 10,
    });

    // Simulate semantic search by returning random results
    return indices.map((index) => ({
      entityType: index.entityType,
      entityId: index.entityId,
      similarity: Math.random(), // In production, actual cosine similarity
      metadata: JSON.parse(index.metadata),
    }));
  }

  async getSearchIndices(userId: string, entityType?: string) {
    const where: any = { userId };
    if (entityType) {
      where.entityType = entityType;
    }

    return this.prisma.semanticSearchIndex.findMany({
      where,
      orderBy: { indexedAt: 'desc' },
    });
  }

  async deleteSearchIndex(id: string, userId: string) {
    const index = await this.prisma.semanticSearchIndex.findUnique({
      where: { id },
    });

    if (!index) {
      throw new NotFoundException('Search index not found');
    }

    if (index.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.semanticSearchIndex.delete({
      where: { id },
    });

    return { message: 'Search index deleted successfully' };
  }

  // ==================== Voice Cloning ====================

  async createVoiceCloneModel(userId: string, dto: CreateVoiceCloneModelDto) {
    return this.prisma.voiceCloneModel.create({
      data: {
        user: { connect: { id: userId } },
        modelName: dto.modelName,
        sampleAudioUrl: dto.sampleAudioUrl,
        modelPath: `/voice-models/${userId}/${dto.modelName}`,
        status: VoiceCloneStatus.TRAINING,
        trainingProgress: 0,
      },
    });
  }

  async getVoiceCloneModels(userId: string) {
    return this.prisma.voiceCloneModel.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVoiceCloneModel(id: string, userId: string) {
    const model = await this.prisma.voiceCloneModel.findUnique({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException('Voice clone model not found');
    }

    if (model.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return model;
  }

  async updateVoiceCloneModel(id: string, userId: string, status: VoiceCloneStatus, progress: number) {
    const model = await this.getVoiceCloneModel(id, userId);

    const updateData: any = {
      status,
      trainingProgress: progress,
    };

    if (status === VoiceCloneStatus.READY) {
      updateData.readyAt = new Date();
    }

    return this.prisma.voiceCloneModel.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteVoiceCloneModel(id: string, userId: string) {
    const model = await this.getVoiceCloneModel(id, userId);

    await this.prisma.voiceCloneModel.delete({
      where: { id },
    });

    return { message: 'Voice clone model deleted successfully' };
  }

  async generateVoiceNarration(userId: string, dto: GenerateVoiceNarrationDto) {
    const model = await this.getVoiceCloneModel(dto.modelId, userId);

    if (model.status !== VoiceCloneStatus.READY) {
      throw new ForbiddenException('Model is not ready for narration');
    }

    // In production, this would use the voice model to generate audio
    const audioUrl = `/voice-narrations/${userId}/${Date.now()}.mp3`;

    return {
      audioUrl,
      duration: Math.floor(dto.text.length / 10), // Estimate duration
      text: dto.text,
    };
  }
}
