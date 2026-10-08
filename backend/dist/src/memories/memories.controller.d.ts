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
    findAll(req: any, categoryId?: string, mood?: string, from?: string, to?: string, search?: string, page?: string, limit?: string): Promise<{
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
    getTravelStatistics(req: any): Promise<{
        totalDistance: number;
        averageDistance: number;
        longestDistance: number;
        shortestDistance: number;
        travelDays: number;
        uniqueLocations: number;
    }>;
    getLocationFrequency(req: any): Promise<{
        key: string;
        count: number;
        lat: number;
        lng: number;
        name: string;
    }[]>;
    getUpcomingReminders(req: any): Promise<any[]>;
    importMemories(req: any, memories: any[]): Promise<{
        imported: number;
        errors: string[];
    }>;
    exportMemories(req: any): Promise<import("./memories.service").ExportMemory[]>;
    getPublicMemory(slug: string): Promise<{
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
    markReminderSent(id: string, req: any): Promise<void>;
    update(id: string, req: any, updateMemoryDto: UpdateMemoryDto): Promise<{
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
    delete(id: string, req: any): Promise<{
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
    generatePublicLink(id: string, req: any): Promise<{
        slug: string;
        expiresAt: Date;
        publicUrl: string;
    }>;
    makeMemoryPrivate(id: string, req: any): Promise<{
        message: string;
    }>;
}
