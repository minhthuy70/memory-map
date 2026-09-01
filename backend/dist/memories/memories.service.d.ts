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
            createdAt: Date;
            name: string;
            icon: string;
        };
        images: {
            id: string;
            createdAt: Date;
            memoryId: string;
            imageUrl: string;
            order: number;
        }[];
    } & {
        id: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
            createdAt: Date;
            name: string;
            icon: string;
        };
        images: {
            id: string;
            createdAt: Date;
            memoryId: string;
            imageUrl: string;
            order: number;
        }[];
    } & {
        id: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
            createdAt: Date;
            name: string;
            icon: string;
        };
        images: {
            id: string;
            createdAt: Date;
            memoryId: string;
            imageUrl: string;
            order: number;
        }[];
    } & {
        id: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
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
            createdAt: Date;
            name: string;
            icon: string;
        };
        images: {
            id: string;
            createdAt: Date;
            memoryId: string;
            imageUrl: string;
            order: number;
        }[];
    } & {
        id: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        categoryId: string;
    }>;
    addImage(memoryId: string, userId: string, imageUrl: string): Promise<{
        id: string;
        createdAt: Date;
        memoryId: string;
        imageUrl: string;
        order: number;
    }>;
    deleteImage(imageId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        memoryId: string;
        imageUrl: string;
        order: number;
    }>;
    updateImageOrder(imageId: string, userId: string, order: number): Promise<{
        id: string;
        createdAt: Date;
        memoryId: string;
        imageUrl: string;
        order: number;
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
