import { PrismaService } from '../prisma/prisma.service';
import { Mood } from '@prisma/client';
export interface ExportMemory {
    id: string;
    title: string;
    content?: string;
    latitude: number;
    longitude: number;
    locationName?: string;
    memoryDate: string;
    mood: string;
    category: {
        name: string;
        icon: string;
        color: string;
    };
    images: {
        imageUrl: string;
        order: number;
    }[];
    createdAt: string;
    updatedAt: string;
}
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
        reminderDate?: Date;
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
            color: string;
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
        isPublic: boolean;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        reminderDate: Date | null;
        reminderSent: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
        categoryId: string;
    }>;
    findAll(userId: string, filters?: {
        categoryId?: string;
        mood?: string;
        from?: Date;
        to?: Date;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        memories: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                color: string;
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
            isPublic: boolean;
            title: string;
            content: string | null;
            latitude: number;
            longitude: number;
            locationName: string | null;
            memoryDate: Date;
            mood: import(".prisma/client").$Enums.Mood;
            reminderDate: Date | null;
            reminderSent: boolean;
            publicExpiresAt: Date | null;
            publicSlug: string | null;
            categoryId: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
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
            color: string;
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
        isPublic: boolean;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        reminderDate: Date | null;
        reminderSent: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
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
        reminderDate?: Date;
    }): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            color: string;
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
        isPublic: boolean;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        reminderDate: Date | null;
        reminderSent: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
        categoryId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isPublic: boolean;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        reminderDate: Date | null;
        reminderSent: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
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
    getUpcomingReminders(userId: string): Promise<any[]>;
    markReminderSent(memoryId: string, userId: string): Promise<void>;
    exportMemories(userId: string): Promise<ExportMemory[]>;
    importMemories(userId: string, memories: ExportMemory[]): Promise<{
        imported: number;
        errors: string[];
    }>;
    generatePublicSlug(memoryId: string, userId: string): Promise<{
        slug: string;
        expiresAt: Date;
        publicUrl: string;
    }>;
    makeMemoryPrivate(memoryId: string, userId: string): Promise<{
        message: string;
    }>;
    getPublicMemoryBySlug(slug: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            color: string;
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
        isPublic: boolean;
        title: string;
        content: string | null;
        latitude: number;
        longitude: number;
        locationName: string | null;
        memoryDate: Date;
        mood: import(".prisma/client").$Enums.Mood;
        reminderDate: Date | null;
        reminderSent: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
        categoryId: string;
    }>;
    private generateSlug;
    getTravelStatistics(userId: string): Promise<{
        totalDistance: number;
        averageDistance: number;
        longestDistance: number;
        shortestDistance: number;
        travelDays: number;
        uniqueLocations: number;
    }>;
    getLocationFrequency(userId: string): Promise<{
        key: string;
        count: number;
        lat: number;
        lng: number;
        name: string;
    }[]>;
    private calculateDistance;
}
