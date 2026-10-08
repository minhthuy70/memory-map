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
import {
  CreateTravelNarrationDto,
  UpdateTravelNarrationDto,
  NarrationTone,
} from './dto/travel-narration.dto';
import {
  CreateHistoricalSimulationDto,
  UpdateHistoricalSimulationDto,
} from './dto/historical-simulation.dto';
import {
  CreateAgeProgressionDto,
  UpdateAgeProgressionDto,
} from './dto/age-progression.dto';
import {
  CreateMemorySynthesisDto,
  UpdateMemorySynthesisDto,
  SynthesisTone,
} from './dto/memory-synthesis.dto';
import {
  CreatePredictiveResurfacingDto,
  UpdatePredictiveResurfacingDto,
  StressLevel,
} from './dto/predictive-resurfacing.dto';

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

  // ==================== Travel Narration ====================

  async createTravelNarration(userId: string, dto: CreateTravelNarrationDto) {
    return this.prisma.travelNarration.create({
      data: {
        user: { connect: { id: userId } },
        routeData: dto.routeData,
        tone: dto.tone,
        tripId: dto.tripId,
        status: 'pending',
      },
    });
  }

  async getTravelNarrations(userId: string) {
    return this.prisma.travelNarration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTravelNarration(id: string, userId: string) {
    const narration = await this.prisma.travelNarration.findUnique({
      where: { id },
    });

    if (!narration) {
      throw new NotFoundException('Travel narration not found');
    }

    if (narration.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return narration;
  }

  async updateTravelNarration(id: string, userId: string, dto: UpdateTravelNarrationDto) {
    const narration = await this.getTravelNarration(id, userId);

    return this.prisma.travelNarration.update({
      where: { id },
      data: {
        ...(dto.routeData && { routeData: dto.routeData }),
        ...(dto.tone && { tone: dto.tone }),
        ...(dto.content && { content: dto.content }),
      },
    });
  }

  async deleteTravelNarration(id: string, userId: string) {
    const narration = await this.getTravelNarration(id, userId);

    await this.prisma.travelNarration.delete({
      where: { id },
    });

    return { message: 'Travel narration deleted successfully' };
  }

  async generateTravelNarration(id: string, userId: string) {
    const narration = await this.getTravelNarration(id, userId);

    // Update status to processing
    await this.prisma.travelNarration.update({
      where: { id },
      data: { status: 'processing' },
    });

    // Simulate AI generation
    setTimeout(async () => {
      const content = this.generateSampleNarration(narration.tone);
      await this.prisma.travelNarration.update({
        where: { id },
        data: {
          status: 'completed',
          content,
          wordCount: content.split(' ').length,
          generatedAt: new Date(),
        },
      });
    }, 5000);

    return { message: 'Travel narration generation started', status: 'processing' };
  }

  private generateSampleNarration(tone: string): string {
    const samples = {
      humorous: 'And then we went to that place, and let me tell you, it was absolutely wild! The coffee was so strong it could wake the dead.',
      poetic: 'As the sun dipped below the horizon, painting the sky in hues of gold and crimson, we found ourselves at a place that would forever change our journey.',
      adventurous: 'We embarked on a daring expedition through uncharted territories, each step bringing new challenges and breathtaking discoveries.',
      neutral: 'We visited several locations during our trip, including historical sites and natural landmarks. The journey covered multiple days.',
    };
    return samples[tone as keyof typeof samples] || samples.neutral;
  }

  // ==================== Historical Simulation ====================

  async createHistoricalSimulation(userId: string, dto: CreateHistoricalSimulationDto) {
    return this.prisma.historicalSimulation.create({
      data: {
        user: { connect: { id: userId } },
        latitude: dto.latitude,
        longitude: dto.longitude,
        year: dto.year,
        memoryId: dto.memoryId,
        status: 'pending',
      },
    });
  }

  async getHistoricalSimulations(userId: string) {
    return this.prisma.historicalSimulation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getHistoricalSimulation(id: string, userId: string) {
    const simulation = await this.prisma.historicalSimulation.findUnique({
      where: { id },
    });

    if (!simulation) {
      throw new NotFoundException('Historical simulation not found');
    }

    if (simulation.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return simulation;
  }

  async updateHistoricalSimulation(id: string, userId: string, dto: UpdateHistoricalSimulationDto) {
    const simulation = await this.getHistoricalSimulation(id, userId);

    return this.prisma.historicalSimulation.update({
      where: { id },
      data: {
        ...(dto.simulatedImageUrl && { simulatedImageUrl: dto.simulatedImageUrl }),
        ...(dto.historicalContext && { historicalContext: dto.historicalContext }),
      },
    });
  }

  async deleteHistoricalSimulation(id: string, userId: string) {
    const simulation = await this.getHistoricalSimulation(id, userId);

    await this.prisma.historicalSimulation.delete({
      where: { id },
    });

    return { message: 'Historical simulation deleted successfully' };
  }

  async generateHistoricalSimulation(id: string, userId: string) {
    const simulation = await this.getHistoricalSimulation(id, userId);

    await this.prisma.historicalSimulation.update({
      where: { id },
      data: { status: 'processing' },
    });

    // Simulate AI generation
    setTimeout(async () => {
      const context = JSON.stringify({
        era: simulation.year < 1900 ? '19th century' : 'early 20th century',
        description: `Historical reconstruction of coordinates ${simulation.latitude}, ${simulation.longitude} in ${simulation.year}`,
      });
      await this.prisma.historicalSimulation.update({
        where: { id },
        data: {
          status: 'completed',
          simulatedImageUrl: `/historical/${id}.jpg`,
          historicalContext: context,
          generatedAt: new Date(),
        },
      });
    }, 5000);

    return { message: 'Historical simulation generation started', status: 'processing' };
  }

  // ==================== Age Progression ====================

  async createAgeProgression(userId: string, dto: CreateAgeProgressionDto) {
    return this.prisma.ageProgression.create({
      data: {
        user: { connect: { id: userId } },
        originalPhotoUrl: dto.originalPhotoUrl,
        ageAdjustment: dto.ageAdjustment,
        memoryId: dto.memoryId,
        status: 'pending',
      },
    });
  }

  async getAgeProgressions(userId: string) {
    return this.prisma.ageProgression.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAgeProgression(id: string, userId: string) {
    const progression = await this.prisma.ageProgression.findUnique({
      where: { id },
    });

    if (!progression) {
      throw new NotFoundException('Age progression not found');
    }

    if (progression.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return progression;
  }

  async updateAgeProgression(id: string, userId: string, dto: UpdateAgeProgressionDto) {
    const progression = await this.getAgeProgression(id, userId);

    return this.prisma.ageProgression.update({
      where: { id },
      data: {
        ...(dto.youngerPhotoUrl && { youngerPhotoUrl: dto.youngerPhotoUrl }),
        ...(dto.olderPhotoUrl && { olderPhotoUrl: dto.olderPhotoUrl }),
      },
    });
  }

  async deleteAgeProgression(id: string, userId: string) {
    const progression = await this.getAgeProgression(id, userId);

    await this.prisma.ageProgression.delete({
      where: { id },
    });

    return { message: 'Age progression deleted successfully' };
  }

  async generateAgeProgression(id: string, userId: string) {
    const progression = await this.getAgeProgression(id, userId);

    await this.prisma.ageProgression.update({
      where: { id },
      data: { status: 'processing' },
    });

    // Simulate AI generation
    setTimeout(async () => {
      const youngerUrl = progression.ageAdjustment < 0 ? `/age-progress/${id}-younger.jpg` : null;
      const olderUrl = progression.ageAdjustment > 0 ? `/age-progress/${id}-older.jpg` : null;

      await this.prisma.ageProgression.update({
        where: { id },
        data: {
          status: 'completed',
          youngerPhotoUrl: youngerUrl,
          olderPhotoUrl: olderUrl,
          generatedAt: new Date(),
        },
      });
    }, 5000);

    return { message: 'Age progression generation started', status: 'processing' };
  }

  // ==================== Memory Synthesis ====================

  async createMemorySynthesis(userId: string, dto: CreateMemorySynthesisDto) {
    return this.prisma.memorySynthesis.create({
      data: {
        user: { connect: { id: userId } },
        title: dto.title,
        description: dto.description,
        participantIds: dto.participantIds,
        memoryIds: dto.memoryIds,
        tone: dto.tone,
        status: 'pending',
      },
    });
  }

  async getMemorySyntheses(userId: string) {
    return this.prisma.memorySynthesis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMemorySynthesis(id: string, userId: string) {
    const synthesis = await this.prisma.memorySynthesis.findUnique({
      where: { id },
    });

    if (!synthesis) {
      throw new NotFoundException('Memory synthesis not found');
    }

    if (synthesis.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return synthesis;
  }

  async updateMemorySynthesis(id: string, userId: string, dto: UpdateMemorySynthesisDto) {
    const synthesis = await this.getMemorySynthesis(id, userId);

    return this.prisma.memorySynthesis.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.participantIds && { participantIds: dto.participantIds }),
        ...(dto.memoryIds && { memoryIds: dto.memoryIds }),
        ...(dto.tone && { tone: dto.tone }),
        ...(dto.chapters && { chapters: dto.chapters }),
      },
    });
  }

  async deleteMemorySynthesis(id: string, userId: string) {
    const synthesis = await this.getMemorySynthesis(id, userId);

    await this.prisma.memorySynthesis.delete({
      where: { id },
    });

    return { message: 'Memory synthesis deleted successfully' };
  }

  async generateMemorySynthesis(id: string, userId: string) {
    const synthesis = await this.getMemorySynthesis(id, userId);

    await this.prisma.memorySynthesis.update({
      where: { id },
      data: { status: 'processing' },
    });

    // Simulate AI generation
    setTimeout(async () => {
      const chapters = JSON.stringify([
        { title: 'Chapter 1: The Beginning', content: 'Our journey started with...' },
        { title: 'Chapter 2: Adventures', content: 'We explored many places...' },
        { title: 'Chapter 3: Memories', content: 'Together we created unforgettable moments...' },
      ]);

      await this.prisma.memorySynthesis.update({
        where: { id },
        data: {
          status: 'completed',
          chapters,
          generatedAt: new Date(),
        },
      });
    }, 5000);

    return { message: 'Memory synthesis generation started', status: 'processing' };
  }

  // ==================== Predictive Resurfacing ====================

  async createPredictiveResurfacing(userId: string, dto: CreatePredictiveResurfacingDto) {
    return this.prisma.predictiveResurfacing.create({
      data: {
        user: { connect: { id: userId } },
        memoryId: dto.memoryId,
        sentimentScore: dto.sentimentScore,
        stressLevel: dto.stressLevel,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async getPredictiveResurfacings(userId: string) {
    return this.prisma.predictiveResurfacing.findMany({
      where: { userId },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async getPredictiveResurfacing(id: string, userId: string) {
    const resurfacing = await this.prisma.predictiveResurfacing.findUnique({
      where: { id },
    });

    if (!resurfacing) {
      throw new NotFoundException('Predictive resurfacing not found');
    }

    if (resurfacing.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return resurfacing;
  }

  async updatePredictiveResurfacing(id: string, userId: string, dto: UpdatePredictiveResurfacingDto) {
    const resurfacing = await this.getPredictiveResurfacing(id, userId);

    const updateData: any = {};
    if (dto.wasViewed !== undefined) {
      updateData.wasViewed = dto.wasViewed;
      if (dto.wasViewed) {
        updateData.shownAt = new Date();
      }
    }
    if (dto.userFeedback) {
      updateData.userFeedback = dto.userFeedback;
    }

    return this.prisma.predictiveResurfacing.update({
      where: { id },
      data: updateData,
    });
  }

  async deletePredictiveResurfacing(id: string, userId: string) {
    const resurfacing = await this.getPredictiveResurfacing(id, userId);

    await this.prisma.predictiveResurfacing.delete({
      where: { id },
    });

    return { message: 'Predictive resurfacing deleted successfully' };
  }

  async getScheduledResurfacings(userId: string) {
    const now = new Date();
    return this.prisma.predictiveResurfacing.findMany({
      where: {
        userId,
        scheduledAt: { lte: now },
        wasViewed: false,
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
