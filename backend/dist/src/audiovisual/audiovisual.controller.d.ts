import { AudiovisualService } from './audiovisual.service';
export declare class AudiovisualController {
    private readonly audiovisualService;
    constructor(audiovisualService: AudiovisualService);
    getScrapbookProjects(req: any): Promise<{
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
    getScrapbookProject(req: any, id: string): Promise<{
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
    createScrapbookProject(req: any, data: any): Promise<{
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
    updateScrapbookProject(req: any, id: string, data: any): Promise<{
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
    deleteScrapbookProject(req: any, id: string): Promise<{
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
    getSoundscapeMixes(req: any): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }[]>;
    getSoundscapeMix(req: any, id: string): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    createSoundscapeMix(req: any, data: any): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    updateSoundscapeMix(req: any, id: string, data: any): Promise<{
        id: string;
        memoryId: string | null;
        createdAt: Date;
        userId: string;
        title: string;
        duration: number;
        audioUrl: string | null;
        mixData: string;
    }>;
    deleteSoundscapeMix(req: any, id: string): Promise<{
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
