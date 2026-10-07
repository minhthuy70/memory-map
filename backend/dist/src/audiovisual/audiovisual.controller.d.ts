import { AudiovisualService } from './audiovisual.service';
export declare class AudiovisualController {
    private readonly audiovisualService;
    constructor(audiovisualService: AudiovisualService);
    getScrapbookProjects(req: any): Promise<{
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
    getScrapbookProject(req: any, id: string): Promise<{
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
    createScrapbookProject(req: any, data: any): Promise<{
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
    updateScrapbookProject(req: any, id: string, data: any): Promise<{
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
    deleteScrapbookProject(req: any, id: string): Promise<{
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
    getSoundscapeMixes(req: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }[]>;
    getSoundscapeMix(req: any, id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }>;
    createSoundscapeMix(req: any, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }>;
    updateSoundscapeMix(req: any, id: string, data: any): Promise<{
        id: string;
        userId: string;
        title: string;
        createdAt: Date;
        memoryId: string | null;
        mixData: string;
        duration: number;
        audioUrl: string | null;
    }>;
    deleteSoundscapeMix(req: any, id: string): Promise<{
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
