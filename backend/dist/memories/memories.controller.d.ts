import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
export declare class MemoriesController {
    private memoriesService;
    constructor(memoriesService: MemoriesService);
    create(req: any, createMemoryDto: CreateMemoryDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
        category: {
            id: string;
            name: string;
            createdAt: Date;
            icon: string;
        };
        images: {
            id: string;
            createdAt: Date;
            order: number;
            memoryId: string;
            imageUrl: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
    }>;
    findAll(req: any, categoryId?: string, mood?: string, from?: string, to?: string, search?: string): Promise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            icon: string;
        };
        images: {
            id: string;
            createdAt: Date;
            order: number;
            memoryId: string;
            imageUrl: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
    })[]>;
    getStatistics(req: any): Promise<{
        totalMemories: number;
        placesVisited: number;
        uniqueLocations: number;
        uniqueCategories: number;
        memoriesThisYear: number;
        mostCommonMood: string;
        mostUsedCategory: string;
        memoriesByMonth: Record<string, number>;
        monthlyActivity: Record<string, number>;
        memoriesByCategory: Record<string, number>;
        categoryDistribution: Record<string, number>;
        memoriesByMood: Record<string, number>;
        moodDistribution: Record<string, number>;
    }>;
    findOne(id: string, req: any): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
        };
        category: {
            id: string;
            name: string;
            createdAt: Date;
            icon: string;
        };
        images: {
            id: string;
            createdAt: Date;
            order: number;
            memoryId: string;
            imageUrl: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
    }>;
    update(id: string, req: any, updateMemoryDto: UpdateMemoryDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            icon: string;
        };
        images: {
            id: string;
            createdAt: Date;
            order: number;
            memoryId: string;
            imageUrl: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
    }>;
    delete(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
    }>;
    addImage(id: string, req: any, imageUrl: string): Promise<{
        id: string;
        createdAt: Date;
        order: number;
        memoryId: string;
        imageUrl: string;
    }>;
    deleteImage(memoryId: string, imageId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        order: number;
        memoryId: string;
        imageUrl: string;
    }>;
    updateImageOrder(memoryId: string, imageId: string, req: any, order: number): Promise<{
        id: string;
        createdAt: Date;
        order: number;
        memoryId: string;
        imageUrl: string;
    }>;
}
