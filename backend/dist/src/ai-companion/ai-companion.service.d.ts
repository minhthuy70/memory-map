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
        memoryId: string | null;
        date: Date;
        title: string;
        content: string;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
        userId: string;
    }>;
    getAIJournalEntries(userId: string, startDate?: Date, endDate?: Date): Promise<{
        id: string;
        memoryId: string | null;
        date: Date;
        title: string;
        content: string;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
        userId: string;
    }[]>;
    getAIJournalEntry(id: string, userId: string): Promise<{
        id: string;
        memoryId: string | null;
        date: Date;
        title: string;
        content: string;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
        userId: string;
    }>;
    updateAIJournalEntry(id: string, userId: string, dto: UpdateAIJournalEntryDto): Promise<{
        id: string;
        memoryId: string | null;
        date: Date;
        title: string;
        content: string;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
        userId: string;
    }>;
    deleteAIJournalEntry(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateJournalEntry(userId: string, dto: GenerateJournalEntryDto): Promise<{
        id: string;
        memoryId: string | null;
        date: Date;
        title: string;
        content: string;
        photos: string;
        locations: string;
        isDraft: boolean;
        isReviewed: boolean;
        generatedAt: Date;
        userId: string;
    }>;
    createAIInterview(userId: string, dto: CreateAIInterviewDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        question: string;
        answer: string | null;
        audioUrl: string | null;
        duration: number | null;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    getAIInterviews(userId: string, completedOnly?: boolean): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        question: string;
        answer: string | null;
        audioUrl: string | null;
        duration: number | null;
        isCompleted: boolean;
        completedAt: Date | null;
    }[]>;
    getAIInterview(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        question: string;
        answer: string | null;
        audioUrl: string | null;
        duration: number | null;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    updateAIInterview(id: string, userId: string, dto: UpdateAIInterviewDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        question: string;
        answer: string | null;
        audioUrl: string | null;
        duration: number | null;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    deleteAIInterview(id: string, userId: string): Promise<{
        message: string;
    }>;
    generateQuestion(userId: string, dto: GenerateQuestionDto): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        question: string;
        answer: string | null;
        audioUrl: string | null;
        duration: number | null;
        isCompleted: boolean;
        completedAt: Date | null;
    }>;
    createPhotoCuration(userId: string, dto: CreatePhotoCurationDto): Promise<{
        id: string;
        memoryId: string;
        userId: string;
        createdAt: Date;
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
        memoryId: string;
        userId: string;
        createdAt: Date;
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
        memoryId: string;
        userId: string;
        createdAt: Date;
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
        memoryId: string;
        userId: string;
        createdAt: Date;
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
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        status: string;
        trainingProgress: number;
        errorMessage: string | null;
        readyAt: Date | null;
    }>;
    getVoiceCloneModels(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        status: string;
        trainingProgress: number;
        errorMessage: string | null;
        readyAt: Date | null;
    }[]>;
    getVoiceCloneModel(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        status: string;
        trainingProgress: number;
        errorMessage: string | null;
        readyAt: Date | null;
    }>;
    updateVoiceCloneModel(id: string, userId: string, status: VoiceCloneStatus, progress: number): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        modelName: string;
        sampleAudioUrl: string;
        modelPath: string;
        status: string;
        trainingProgress: number;
        errorMessage: string | null;
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
