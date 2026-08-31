import { PrismaService } from '../prisma/prisma.service';
import { Mood } from '@prisma/client';
export declare class MemoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        title: string;
        content?: string;
        latitude: number;
        longitude: number;
        locationName?: string;
        memoryDate: Date;
        mood: Mood;
        categoryId: string;
    }): Promise<{
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
    findAll(userId: string, filters?: {
        categoryId?: string;
        mood?: string;
        from?: Date;
        to?: Date;
        search?: string;
    }): Promise<({
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, userId: string, data: {
        title?: string;
        content?: string;
        latitude?: number;
        longitude?: number;
        locationName?: string;
        memoryDate?: Date;
        mood?: Mood;
        categoryId?: string;
    }): Promise<{
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
    delete(id: string, userId: string): Promise<{
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
    addImage(memoryId: string, userId: string, imageUrl: string): Promise<{
        id: string;
        memoryId: string;
        imageUrl: string;
        createdAt: Date;
    }>;
    deleteImage(imageId: string, userId: string): Promise<{
        id: string;
        memoryId: string;
        imageUrl: string;
        createdAt: Date;
    }>;
    getStatistics(userId: string): Promise<{
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
}
