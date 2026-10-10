import { AudiovisualService } from './audiovisual.service';
export declare class AudiovisualController {
    private readonly audiovisualService;
    constructor(audiovisualService: AudiovisualService);
    getScrapbookProjects(req: any): Promise<{
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
    getScrapbookProject(req: any, id: string): Promise<{
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
    createScrapbookProject(req: any, data: any): Promise<{
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
    updateScrapbookProject(req: any, id: string, data: any): Promise<{
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
    deleteScrapbookProject(req: any, id: string): Promise<{
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
    getSoundscapeMixes(req: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }[]>;
    getSoundscapeMix(req: any, id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    createSoundscapeMix(req: any, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    updateSoundscapeMix(req: any, id: string, data: any): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        title: string;
        memoryId: string | null;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    deleteSoundscapeMix(req: any, id: string): Promise<{
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
