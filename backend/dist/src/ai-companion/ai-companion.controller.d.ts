import { AICompanionService } from './ai-companion.service';
import { CreateAIJournalEntryDto, UpdateAIJournalEntryDto, GenerateJournalEntryDto } from './dto/ai-journal.dto';
import { CreateAIInterviewDto, UpdateAIInterviewDto, GenerateQuestionDto } from './dto/ai-interview.dto';
import { CreatePhotoCurationDto, UpdatePhotoCurationDto, BatchCurationDto } from './dto/photo-curation.dto';
import { SemanticSearchDto, IndexEntityDto } from './dto/semantic-search.dto';
import { CreateVoiceCloneModelDto, GenerateVoiceNarrationDto } from './dto/voice-clone.dto';
export declare class AICompanionController {
    private readonly aiCompanionService;
    constructor(aiCompanionService: AICompanionService);
    createAIJournalEntry(req: any, dto: CreateAIJournalEntryDto): Promise<{
        id: string;
        memoryId: string | null;
        userId: string;
        title: string;
        content: string;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }>;
    getAIJournalEntries(req: any, startDate?: string, endDate?: string): Promise<{
        id: string;
        memoryId: string | null;
        userId: string;
        title: string;
        content: string;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }[]>;
    getAIJournalEntry(id: string, req: any): Promise<{
        id: string;
        memoryId: string | null;
        userId: string;
        title: string;
        content: string;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }>;
    updateAIJournalEntry(id: string, req: any, dto: UpdateAIJournalEntryDto): Promise<{
        id: string;
        memoryId: string | null;
        userId: string;
        title: string;
        content: string;
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
        memoryId: string | null;
        userId: string;
        title: string;
        content: string;
        date: Date;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
    }>;
    createAIInterview(req: any, dto: CreateAIInterviewDto): Promise<{
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
    getAIInterviews(req: any, completedOnly?: string): Promise<{
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
    getAIInterview(id: string, req: any): Promise<{
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
    updateAIInterview(id: string, req: any, dto: UpdateAIInterviewDto): Promise<{
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
    deleteAIInterview(id: string, req: any): Promise<{
        message: string;
    }>;
    generateQuestion(req: any, dto: GenerateQuestionDto): Promise<{
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
    createPhotoCuration(req: any, dto: CreatePhotoCurationDto): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        userId: string;
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
        memoryId: string;
        createdAt: Date;
        userId: string;
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
        memoryId: string;
        createdAt: Date;
        userId: string;
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
        memoryId: string;
        createdAt: Date;
        userId: string;
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
        entityType: string;
        entityId: string;
        metadata: string;
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
        entityType: string;
        entityId: string;
        metadata: string;
        embedding: string;
        indexedAt: Date;
    }[]>;
    deleteSearchIndex(id: string, req: any): Promise<{
        message: string;
    }>;
    createVoiceCloneModel(req: any, dto: CreateVoiceCloneModelDto): Promise<{
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
    getVoiceCloneModels(req: any): Promise<{
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
    getVoiceCloneModel(id: string, req: any): Promise<{
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
    deleteVoiceCloneModel(id: string, req: any): Promise<{
        message: string;
    }>;
    generateVoiceNarration(req: any, dto: GenerateVoiceNarrationDto): Promise<{
        audioUrl: string;
        duration: number;
        text: string;
    }>;
}
