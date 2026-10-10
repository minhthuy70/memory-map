import { AICompanionService } from './ai-companion.service';
import { CreateAIJournalEntryDto, UpdateAIJournalEntryDto, GenerateJournalEntryDto } from './dto/ai-journal.dto';
import { CreateAIInterviewDto, UpdateAIInterviewDto, GenerateQuestionDto } from './dto/ai-interview.dto';
import { CreatePhotoCurationDto, UpdatePhotoCurationDto, BatchCurationDto } from './dto/photo-curation.dto';
import { SemanticSearchDto, IndexEntityDto } from './dto/semantic-search.dto';
import { CreateVoiceCloneModelDto, GenerateVoiceNarrationDto } from './dto/voice-clone.dto';
import { CreateTravelNarrationDto, UpdateTravelNarrationDto } from './dto/travel-narration.dto';
import { CreateHistoricalSimulationDto, UpdateHistoricalSimulationDto } from './dto/historical-simulation.dto';
import { CreateAgeProgressionDto, UpdateAgeProgressionDto } from './dto/age-progression.dto';
import { CreateMemorySynthesisDto, UpdateMemorySynthesisDto } from './dto/memory-synthesis.dto';
import { CreatePredictiveResurfacingDto, UpdatePredictiveResurfacingDto } from './dto/predictive-resurfacing.dto';
export declare class AICompanionController {
    private readonly aiCompanionService;
    constructor(aiCompanionService: AICompanionService);
    createAIJournalEntry(req: any, dto: CreateAIJournalEntryDto): Promise<{
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
    getAIJournalEntries(req: any, startDate?: string, endDate?: string): Promise<{
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
    getAIJournalEntry(id: string, req: any): Promise<{
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
    updateAIJournalEntry(id: string, req: any, dto: UpdateAIJournalEntryDto): Promise<{
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
    deleteAIJournalEntry(id: string, req: any): Promise<{
        message: string;
    }>;
    generateJournalEntry(req: any, dto: GenerateJournalEntryDto): Promise<{
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
    createAIInterview(req: any, dto: CreateAIInterviewDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        completedAt: Date | null;
        duration: number | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    getAIInterviews(req: any, completedOnly?: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        completedAt: Date | null;
        duration: number | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }[]>;
    getAIInterview(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        completedAt: Date | null;
        duration: number | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    updateAIInterview(id: string, req: any, dto: UpdateAIInterviewDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        completedAt: Date | null;
        duration: number | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    deleteAIInterview(id: string, req: any): Promise<{
        message: string;
    }>;
    generateQuestion(req: any, dto: GenerateQuestionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        completedAt: Date | null;
        duration: number | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    createPhotoCuration(req: any, dto: CreatePhotoCurationDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    getPhotoCurations(req: any, memoryId?: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    getPhotoCuration(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    updatePhotoCuration(id: string, req: any, dto: UpdatePhotoCurationDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
    deletePhotoCuration(id: string, req: any): Promise<{
        message: string;
    }>;
    batchCuration(req: any, dto: BatchCurationDto): Promise<any[]>;
    indexEntity(req: any, dto: IndexEntityDto): Promise<{
        id: string;
        userId: string;
        metadata: string;
        entityType: string;
        entityId: string;
        embedding: string;
        indexedAt: Date;
    }>;
    semanticSearch(req: any, dto: SemanticSearchDto): Promise<{
        entityType: string;
        entityId: string;
        similarity: number;
        metadata: any;
    }[]>;
    getSearchIndices(req: any, entityType?: string): Promise<{
        id: string;
        userId: string;
        metadata: string;
        entityType: string;
        entityId: string;
        embedding: string;
        indexedAt: Date;
    }[]>;
    deleteSearchIndex(id: string, req: any): Promise<{
        message: string;
    }>;
    createVoiceCloneModel(req: any, dto: CreateVoiceCloneModelDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        status: string;
        errorMessage: string | null;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        trainingProgress: number;
        readyAt: Date | null;
    }>;
    getVoiceCloneModels(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        status: string;
        errorMessage: string | null;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        trainingProgress: number;
        readyAt: Date | null;
    }[]>;
    getVoiceCloneModel(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        status: string;
        errorMessage: string | null;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        trainingProgress: number;
        readyAt: Date | null;
    }>;
    deleteVoiceCloneModel(id: string, req: any): Promise<{
        message: string;
    }>;
    generateVoiceNarration(req: any, dto: GenerateVoiceNarrationDto): Promise<{
        audioUrl: string;
        duration: number;
        text: string;
    }>;
    createTravelNarration(req: any, dto: CreateTravelNarrationDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        content: string | null;
        status: string;
        generatedAt: Date | null;
        tripId: string | null;
        routeData: string;
        tone: string;
        wordCount: number;
    }>;
    getTravelNarrations(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        content: string | null;
        status: string;
        generatedAt: Date | null;
        tripId: string | null;
        routeData: string;
        tone: string;
        wordCount: number;
    }[]>;
    getTravelNarration(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        content: string | null;
        status: string;
        generatedAt: Date | null;
        tripId: string | null;
        routeData: string;
        tone: string;
        wordCount: number;
    }>;
    updateTravelNarration(id: string, req: any, dto: UpdateTravelNarrationDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        content: string | null;
        status: string;
        generatedAt: Date | null;
        tripId: string | null;
        routeData: string;
        tone: string;
        wordCount: number;
    }>;
    deleteTravelNarration(id: string, req: any): Promise<{
        message: string;
    }>;
    generateTravelNarration(id: string, req: any): Promise<{
        message: string;
        status: string;
    }>;
    createHistoricalSimulation(req: any, dto: CreateHistoricalSimulationDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        year: number;
        latitude: number;
        longitude: number;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        simulatedImageUrl: string | null;
        historicalContext: string | null;
    }>;
    getHistoricalSimulations(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        year: number;
        latitude: number;
        longitude: number;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        simulatedImageUrl: string | null;
        historicalContext: string | null;
    }[]>;
    getHistoricalSimulation(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        year: number;
        latitude: number;
        longitude: number;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        simulatedImageUrl: string | null;
        historicalContext: string | null;
    }>;
    updateHistoricalSimulation(id: string, req: any, dto: UpdateHistoricalSimulationDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        year: number;
        latitude: number;
        longitude: number;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        simulatedImageUrl: string | null;
        historicalContext: string | null;
    }>;
    deleteHistoricalSimulation(id: string, req: any): Promise<{
        message: string;
    }>;
    generateHistoricalSimulation(id: string, req: any): Promise<{
        message: string;
        status: string;
    }>;
    createAgeProgression(req: any, dto: CreateAgeProgressionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        originalPhotoUrl: string;
        youngerPhotoUrl: string | null;
        olderPhotoUrl: string | null;
        ageAdjustment: number;
    }>;
    getAgeProgressions(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        originalPhotoUrl: string;
        youngerPhotoUrl: string | null;
        olderPhotoUrl: string | null;
        ageAdjustment: number;
    }[]>;
    getAgeProgression(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        originalPhotoUrl: string;
        youngerPhotoUrl: string | null;
        olderPhotoUrl: string | null;
        ageAdjustment: number;
    }>;
    updateAgeProgression(id: string, req: any, dto: UpdateAgeProgressionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string | null;
        status: string;
        generatedAt: Date | null;
        originalPhotoUrl: string;
        youngerPhotoUrl: string | null;
        olderPhotoUrl: string | null;
        ageAdjustment: number;
    }>;
    deleteAgeProgression(id: string, req: any): Promise<{
        message: string;
    }>;
    generateAgeProgression(id: string, req: any): Promise<{
        message: string;
        status: string;
    }>;
    createMemorySynthesis(req: any, dto: CreateMemorySynthesisDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        description: string;
        status: string;
        generatedAt: Date | null;
        tone: string;
        participantIds: string;
        memoryIds: string;
        chapters: string | null;
    }>;
    getMemorySyntheses(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        description: string;
        status: string;
        generatedAt: Date | null;
        tone: string;
        participantIds: string;
        memoryIds: string;
        chapters: string | null;
    }[]>;
    getMemorySynthesis(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        description: string;
        status: string;
        generatedAt: Date | null;
        tone: string;
        participantIds: string;
        memoryIds: string;
        chapters: string | null;
    }>;
    updateMemorySynthesis(id: string, req: any, dto: UpdateMemorySynthesisDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        description: string;
        status: string;
        generatedAt: Date | null;
        tone: string;
        participantIds: string;
        memoryIds: string;
        chapters: string | null;
    }>;
    deleteMemorySynthesis(id: string, req: any): Promise<{
        message: string;
    }>;
    generateMemorySynthesis(id: string, req: any): Promise<{
        message: string;
        status: string;
    }>;
    createPredictiveResurfacing(req: any, dto: CreatePredictiveResurfacingDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }>;
    getPredictiveResurfacings(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }[]>;
    getScheduledResurfacings(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }[]>;
    getPredictiveResurfacing(id: string, req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }>;
    updatePredictiveResurfacing(id: string, req: any, dto: UpdatePredictiveResurfacingDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        memoryId: string;
        sentimentScore: number;
        stressLevel: string;
        scheduledAt: Date;
        shownAt: Date | null;
        wasViewed: boolean;
        userFeedback: string | null;
    }>;
    deletePredictiveResurfacing(id: string, req: any): Promise<{
        message: string;
    }>;
}
