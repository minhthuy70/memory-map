import { PrismaService } from '../prisma/prisma.service';
export declare class AudiovisualService {
    private prisma;
    constructor(prisma: PrismaService);
    getScrapbookProjects(userId: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        title: string;
        description: string | null;
        isPublic: boolean;
        thumbnailUrl: string | null;
        layoutData: string;
    }[]>;
    getScrapbookProject(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        title: string;
        description: string | null;
        isPublic: boolean;
        thumbnailUrl: string | null;
        layoutData: string;
    }>;
    createScrapbookProject(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        title: string;
        description: string | null;
        isPublic: boolean;
        thumbnailUrl: string | null;
        layoutData: string;
    }>;
    updateScrapbookProject(userId: string, id: string, data: any): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        title: string;
        description: string | null;
        isPublic: boolean;
        thumbnailUrl: string | null;
        layoutData: string;
    }>;
    deleteScrapbookProject(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        updatedAt: Date;
        createdAt: Date;
        title: string;
        description: string | null;
        isPublic: boolean;
        thumbnailUrl: string | null;
        layoutData: string;
    }>;
    getSoundscapeMixes(userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }[]>;
    getSoundscapeMix(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    createSoundscapeMix(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    updateSoundscapeMix(userId: string, id: string, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    deleteSoundscapeMix(userId: string, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
}
