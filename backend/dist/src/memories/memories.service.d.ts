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
        category: {
            id: string;
            createdAt: Date;
            name: string;
            color: string;
            icon: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string;
        };
        images: {
            id: string;
            memoryId: string;
            createdAt: Date;
            order: number;
            imageUrl: string;
        }[];
    } & {
        id: string;
        userId: string;
        content: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        mood: import(".prisma/client").$Enums.Mood;
        locationName: string | null;
        latitude: number;
        longitude: number;
        memoryDate: Date;
        categoryId: string;
        reminderDate: Date | null;
        reminderSent: boolean;
        isPublic: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
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
                createdAt: Date;
                name: string;
                color: string;
                icon: string;
            };
            images: {
                id: string;
                memoryId: string;
                createdAt: Date;
                order: number;
                imageUrl: string;
            }[];
        } & {
            id: string;
            userId: string;
            content: string | null;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            mood: import(".prisma/client").$Enums.Mood;
            locationName: string | null;
            latitude: number;
            longitude: number;
            memoryDate: Date;
            categoryId: string;
            reminderDate: Date | null;
            reminderSent: boolean;
            isPublic: boolean;
            publicExpiresAt: Date | null;
            publicSlug: string | null;
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
        category: {
            id: string;
            createdAt: Date;
            name: string;
            color: string;
            icon: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
            avatar: string;
        };
        images: {
            id: string;
            memoryId: string;
            createdAt: Date;
            order: number;
            imageUrl: string;
        }[];
    } & {
        id: string;
        userId: string;
        content: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        mood: import(".prisma/client").$Enums.Mood;
        locationName: string | null;
        latitude: number;
        longitude: number;
        memoryDate: Date;
        categoryId: string;
        reminderDate: Date | null;
        reminderSent: boolean;
        isPublic: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
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
            createdAt: Date;
            name: string;
            color: string;
            icon: string;
        };
        images: {
            id: string;
            memoryId: string;
            createdAt: Date;
            order: number;
            imageUrl: string;
        }[];
    } & {
        id: string;
        userId: string;
        content: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        mood: import(".prisma/client").$Enums.Mood;
        locationName: string | null;
        latitude: number;
        longitude: number;
        memoryDate: Date;
        categoryId: string;
        reminderDate: Date | null;
        reminderSent: boolean;
        isPublic: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        content: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        mood: import(".prisma/client").$Enums.Mood;
        locationName: string | null;
        latitude: number;
        longitude: number;
        memoryDate: Date;
        categoryId: string;
        reminderDate: Date | null;
        reminderSent: boolean;
        isPublic: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
    }>;
    addImage(memoryId: string, userId: string, imageUrl: string): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        order: number;
        imageUrl: string;
    }>;
    deleteImage(imageId: string, userId: string): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        order: number;
        imageUrl: string;
    }>;
    updateImageOrder(imageId: string, userId: string, order: number): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        order: number;
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
            createdAt: Date;
            name: string;
            color: string;
            icon: string;
        };
        images: {
            id: string;
            memoryId: string;
            createdAt: Date;
            order: number;
            imageUrl: string;
        }[];
    } & {
        id: string;
        userId: string;
        content: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        mood: import(".prisma/client").$Enums.Mood;
        locationName: string | null;
        latitude: number;
        longitude: number;
        memoryDate: Date;
        categoryId: string;
        reminderDate: Date | null;
        reminderSent: boolean;
        isPublic: boolean;
        publicExpiresAt: Date | null;
        publicSlug: string | null;
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
