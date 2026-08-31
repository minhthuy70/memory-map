import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
export declare class MemoriesController {
    private memoriesService;
    constructor(memoriesService: MemoriesService);
    create(req: any, createMemoryDto: CreateMemoryDto): Promise<{
        category: {
            id: string;
            name: string;
            icon: string;
            createdAt: Date;
        };
        images: {
            id: string;
            memoryId: string;
            imageUrl: string;
            createdAt: Date;
        }[];
        user: {
            avatar: string;
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(req: any, categoryId?: string, mood?: string, from?: string, to?: string, search?: string): Promise<({
        category: {
            id: string;
            name: string;
            icon: string;
            createdAt: Date;
        };
        images: {
            id: string;
            memoryId: string;
            imageUrl: string;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
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
        category: {
            id: string;
            name: string;
            icon: string;
            createdAt: Date;
        };
        images: {
            id: string;
            memoryId: string;
            imageUrl: string;
            createdAt: Date;
        }[];
        user: {
            avatar: string;
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, req: any, updateMemoryDto: UpdateMemoryDto): Promise<{
        category: {
            id: string;
            name: string;
            icon: string;
            createdAt: Date;
        };
        images: {
            id: string;
            memoryId: string;
            imageUrl: string;
            createdAt: Date;
        }[];
    } & {
        id: string;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string, req: any): Promise<{
        id: string;
        userId: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        categoryId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addImage(id: string, req: any, imageUrl: string): Promise<{
        id: string;
        memoryId: string;
        imageUrl: string;
        createdAt: Date;
    }>;
    deleteImage(memoryId: string, imageId: string, req: any): Promise<{
        id: string;
        memoryId: string;
        imageUrl: string;
        createdAt: Date;
    }>;
}
