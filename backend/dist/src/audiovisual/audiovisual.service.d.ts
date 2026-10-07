import { PrismaService } from '../prisma/prisma.service';
export declare class AudiovisualService {
    private prisma;
    constructor(prisma: PrismaService);
    getScrapbookProjects(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getScrapbookProject(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    createScrapbookProject(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateScrapbookProject(userId: string, id: string, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteScrapbookProject(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        description: string | null;
        thumbnailUrl: string | null;
        layoutData: string;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getSoundscapeMixes(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }[]>;
    getSoundscapeMix(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }>;
    createSoundscapeMix(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }>;
    updateSoundscapeMix(userId: string, id: string, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }>;
    deleteSoundscapeMix(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }>;
}
