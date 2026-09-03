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
    findOne(id: string, userId: string): Promise<{
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
    delete(id: string, userId: string): Promise<{
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
    addImage(memoryId: string, userId: string, imageUrl: string): Promise<{
        id: string;
        createdAt: Date;
        order: number;
        memoryId: string;
        imageUrl: string;
    }>;
    deleteImage(imageId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        order: number;
        memoryId: string;
        imageUrl: string;
    }>;
    updateImageOrder(imageId: string, userId: string, order: number): Promise<{
        id: string;
        createdAt: Date;
        order: number;
        memoryId: string;
        imageUrl: string;
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
