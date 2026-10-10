import { PrismaService } from '../prisma/prisma.service';
import { CreateAIJournalEntryDto, UpdateAIJournalEntryDto, GenerateJournalEntryDto } from './dto/ai-journal.dto';
import { CreateAIInterviewDto, UpdateAIInterviewDto, GenerateQuestionDto } from './dto/ai-interview.dto';
import { CreatePhotoCurationDto, UpdatePhotoCurationDto, BatchCurationDto } from './dto/photo-curation.dto';
import { SemanticSearchDto, IndexEntityDto } from './dto/semantic-search.dto';
import { CreateVoiceCloneModelDto, GenerateVoiceNarrationDto, VoiceCloneStatus } from './dto/voice-clone.dto';
import { CreateTravelNarrationDto, UpdateTravelNarrationDto } from './dto/travel-narration.dto';
import { CreateHistoricalSimulationDto, UpdateHistoricalSimulationDto } from './dto/historical-simulation.dto';
import { CreateAgeProgressionDto, UpdateAgeProgressionDto } from './dto/age-progression.dto';
import { CreateMemorySynthesisDto, UpdateMemorySynthesisDto } from './dto/memory-synthesis.dto';
import { CreatePredictiveResurfacingDto, UpdatePredictiveResurfacingDto } from './dto/predictive-resurfacing.dto';
export declare class AICompanionService {
    private prisma;
    constructor(prisma: PrismaService);
    createAIJournalEntry(userId: string, dto: CreateAIJournalEntryDto): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string;
        memoryId: string | null;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }>;
    getAIJournalEntries(userId: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string;
        memoryId: string | null;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }[]>;
    getAIJournalEntry(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string;
        memoryId: string | null;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }>;
    updateAIJournalEntry(id: string, userId: string, dto: UpdateAIJournalEntryDto): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string;
        memoryId: string | null;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }>;
    deleteAIJournalEntry(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateJournalEntry(userId: string, dto: GenerateJournalEntryDto): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string;
        memoryId: string | null;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }>;
    createAIInterview(userId: string, dto: CreateAIInterviewDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    getAIInterviews(userId: string, completedOnly?: boolean): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }[]>;
    getAIInterview(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    updateAIInterview(id: string, userId: string, dto: UpdateAIInterviewDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    deleteAIInterview(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateQuestion(userId: string, dto: GenerateQuestionDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    createPhotoCuration(userId: string, dto: CreatePhotoCurationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        photoId: string;
        aestheticScore: number;
        focusScore: number;
        smileScore: number;
        overallScore: number;
        isHighlighted: boolean;
        isRejected: boolean;
        reasons: string | null;
    }>;
    getPhotoCurations(userId: string, memoryId?: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        photoId: string;
        aestheticScore: number;
        focusScore: number;
        smileScore: number;
        overallScore: number;
        isHighlighted: boolean;
        isRejected: boolean;
        reasons: string | null;
    }[]>;
    getPhotoCuration(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        photoId: string;
        aestheticScore: number;
        focusScore: number;
        smileScore: number;
        overallScore: number;
        isHighlighted: boolean;
        isRejected: boolean;
        reasons: string | null;
    }>;
    updatePhotoCuration(id: string, userId: string, dto: UpdatePhotoCurationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        photoId: string;
        aestheticScore: number;
        focusScore: number;
        smileScore: number;
        overallScore: number;
        isHighlighted: boolean;
        isRejected: boolean;
        reasons: string | null;
    }>;
    deletePhotoCuration(id: string, userId: string): Promise<{
        message: string;
    }>;
    batchCuration(userId: string, dto: BatchCurationDto): Promise<any[]>;
    indexEntity(userId: string, dto: IndexEntityDto): Promise<{
        id: string;
        userId: string;
        entityType: string;
        entityId: string;
        embedding: string;
        metadata: string;
        indexedAt: Date;
    }>;
    semanticSearch(userId: string, dto: SemanticSearchDto): Promise<{
        entityType: string;
        entityId: string;
        similarity: number;
        metadata: any;
    }[]>;
    getSearchIndices(userId: string, entityType?: string): Promise<{
        id: string;
        userId: string;
        entityType: string;
        entityId: string;
        embedding: string;
        metadata: string;
        indexedAt: Date;
    }[]>;
    deleteSearchIndex(id: string, userId: string): Promise<{
        message: string;
    }>;
    createVoiceCloneModel(userId: string, dto: CreateVoiceCloneModelDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        errorMessage: string | null;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        trainingProgress: number;
        readyAt: Date | null;
    }>;
    getVoiceCloneModels(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        errorMessage: string | null;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        trainingProgress: number;
        readyAt: Date | null;
    }[]>;
    getVoiceCloneModel(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        errorMessage: string | null;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        trainingProgress: number;
        readyAt: Date | null;
    }>;
    updateVoiceCloneModel(id: string, userId: string, status: VoiceCloneStatus, progress: number): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        status: string;
        errorMessage: string | null;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        trainingProgress: number;
        readyAt: Date | null;
    }>;
    deleteVoiceCloneModel(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateVoiceNarration(userId: string, dto: GenerateVoiceNarrationDto): Promise<{
        audioUrl: string;
        duration: number;
        text: string;
    }>;
    createTravelNarration(userId: string, dto: CreateTravelNarrationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string | null;
        status: string;
        generatedAt: Date | null;
        tripId: string | null;
        routeData: string;
        tone: string;
        wordCount: number;
    }>;
    getTravelNarrations(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string | null;
        status: string;
        generatedAt: Date | null;
        tripId: string | null;
        routeData: string;
        tone: string;
        wordCount: number;
    }[]>;
    getTravelNarration(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string | null;
        status: string;
        generatedAt: Date | null;
        tripId: string | null;
        routeData: string;
        tone: string;
        wordCount: number;
    }>;
    updateTravelNarration(id: string, userId: string, dto: UpdateTravelNarrationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        content: string | null;
        status: string;
        generatedAt: Date | null;
        tripId: string | null;
        routeData: string;
        tone: string;
        wordCount: number;
    }>;
    deleteTravelNarration(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateTravelNarration(id: string, userId: string): Promise<{
        message: string;
        status: string;
    }>;
    private generateSampleNarration;
    createHistoricalSimulation(userId: string, dto: CreateHistoricalSimulationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        year: number;
        latitude: number;
        longitude: number;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        simulatedImageUrl: string | null;
        historicalContext: string | null;
    }>;
    getHistoricalSimulations(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        year: number;
        latitude: number;
        longitude: number;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        simulatedImageUrl: string | null;
        historicalContext: string | null;
    }[]>;
    getHistoricalSimulation(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        year: number;
        latitude: number;
        longitude: number;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        simulatedImageUrl: string | null;
        historicalContext: string | null;
    }>;
    updateHistoricalSimulation(id: string, userId: string, dto: UpdateHistoricalSimulationDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        year: number;
        latitude: number;
        longitude: number;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        simulatedImageUrl: string | null;
        historicalContext: string | null;
    }>;
    deleteHistoricalSimulation(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateHistoricalSimulation(id: string, userId: string): Promise<{
        message: string;
        status: string;
    }>;
    createAgeProgression(userId: string, dto: CreateAgeProgressionDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        originalPhotoUrl: string;
        youngerPhotoUrl: string | null;
        olderPhotoUrl: string | null;
        ageAdjustment: number;
    }>;
    getAgeProgressions(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        originalPhotoUrl: string;
        youngerPhotoUrl: string | null;
        olderPhotoUrl: string | null;
        ageAdjustment: number;
    }[]>;
    getAgeProgression(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        originalPhotoUrl: string;
        youngerPhotoUrl: string | null;
        olderPhotoUrl: string | null;
        ageAdjustment: number;
    }>;
    updateAgeProgression(id: string, userId: string, dto: UpdateAgeProgressionDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        originalPhotoUrl: string;
        youngerPhotoUrl: string | null;
        olderPhotoUrl: string | null;
        ageAdjustment: number;
    }>;
    deleteAgeProgression(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateAgeProgression(id: string, userId: string): Promise<{
        message: string;
        status: string;
    }>;
    createMemorySynthesis(userId: string, dto: CreateMemorySynthesisDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string;
        status: string;
        generatedAt: Date | null;
        tone: string;
        participantIds: string;
        memoryIds: string;
        chapters: string | null;
    }>;
    getMemorySyntheses(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string;
        status: string;
        generatedAt: Date | null;
        tone: string;
        participantIds: string;
        memoryIds: string;
        chapters: string | null;
    }[]>;
    getMemorySynthesis(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string;
        status: string;
        generatedAt: Date | null;
        tone: string;
        participantIds: string;
        memoryIds: string;
        chapters: string | null;
    }>;
    updateMemorySynthesis(id: string, userId: string, dto: UpdateMemorySynthesisDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        title: string;
        description: string;
        status: string;
        generatedAt: Date | null;
        tone: string;
        participantIds: string;
        memoryIds: string;
        chapters: string | null;
    }>;
    deleteMemorySynthesis(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateMemorySynthesis(id: string, userId: string): Promise<{
        message: string;
        status: string;
    }>;
    createPredictiveResurfacing(userId: string, dto: CreatePredictiveResurfacingDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }>;
    getPredictiveResurfacings(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }[]>;
    getPredictiveResurfacing(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }>;
    updatePredictiveResurfacing(id: string, userId: string, dto: UpdatePredictiveResurfacingDto): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }>;
    deletePredictiveResurfacing(id: string, userId: string): Promise<{
        message: string;
    }>;
    getScheduledResurfacings(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }[]>;
}
