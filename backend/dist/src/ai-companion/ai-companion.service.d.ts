import { PrismaService } from '../prisma/prisma.service';
import { CreateAIJournalEntryDto, UpdateAIJournalEntryDto, GenerateJournalEntryDto } from './dto/ai-journal.dto';
import { CreateAIInterviewDto, UpdateAIInterviewDto, GenerateQuestionDto } from './dto/ai-interview.dto';
import { CreatePhotoCurationDto, UpdatePhotoCurationDto, BatchCurationDto } from './dto/photo-curation.dto';
import { SemanticSearchDto, IndexEntityDto } from './dto/semantic-search.dto';
import { CreateVoiceCloneModelDto, GenerateVoiceNarrationDto, VoiceCloneStatus } from './dto/voice-clone.dto';
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
        userId: string;
        createdAt: Date;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    getAIInterviews(userId: string, completedOnly?: boolean): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }[]>;
    getAIInterview(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    updateAIInterview(id: string, userId: string, dto: UpdateAIInterviewDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
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
        userId: string;
        createdAt: Date;
        duration: number | null;
        completedAt: Date | null;
        audioUrl: string | null;
        answer: string | null;
        question: string;
        isCompleted: boolean;
    }>;
    createPhotoCuration(userId: string, dto: CreatePhotoCurationDto): Promise<{
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
    getPhotoCurations(userId: string, memoryId?: string): Promise<{
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
    getPhotoCuration(id: string, userId: string): Promise<{
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
    updatePhotoCuration(id: string, userId: string, dto: UpdatePhotoCurationDto): Promise<{
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
    getVoiceCloneModels(userId: string): Promise<{
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
    getVoiceCloneModel(id: string, userId: string): Promise<{
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
    updateVoiceCloneModel(id: string, userId: string, status: VoiceCloneStatus, progress: number): Promise<{
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
    deleteVoiceCloneModel(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateVoiceNarration(userId: string, dto: GenerateVoiceNarrationDto): Promise<{
        audioUrl: string;
        duration: number;
        text: string;
    }>;
}
