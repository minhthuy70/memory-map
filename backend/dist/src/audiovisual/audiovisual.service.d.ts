import { PrismaService } from '../prisma/prisma.service';
export declare class AudiovisualService {
    private prisma;
    constructor(prisma: PrismaService);
    getScrapbookProjects(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isPublic: boolean;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
    }[]>;
    getScrapbookProject(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isPublic: boolean;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
    }>;
    createScrapbookProject(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isPublic: boolean;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
    }>;
    updateScrapbookProject(userId: string, id: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isPublic: boolean;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
    }>;
    deleteScrapbookProject(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        updatedAt: Date;
        isPublic: boolean;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
    }>;
    getSoundscapeMixes(userId: string): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }[]>;
    getSoundscapeMix(userId: string, id: string): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    createSoundscapeMix(userId: string, data: any): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    updateSoundscapeMix(userId: string, id: string, data: any): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    deleteSoundscapeMix(userId: string, id: string): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
}
