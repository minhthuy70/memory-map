import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
export declare class MemoriesController {
    private memoriesService;
    constructor(memoriesService: MemoriesService);
    create(req: any, createMemoryDto: CreateMemoryDto): Promise<{
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
    findAll(req: any, categoryId?: string, mood?: string, from?: string, to?: string, search?: string, page?: string, limit?: string): Promise<{
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
    findOne(id: string, req: any): Promise<{
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
    markReminderSent(id: string, req: any): Promise<void>;
    update(id: string, req: any, updateMemoryDto: UpdateMemoryDto): Promise<{
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
    delete(id: string, req: any): Promise<{
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
    addImage(id: string, req: any, imageUrl: string): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        order: number;
        imageUrl: string;
    }>;
    deleteImage(memoryId: string, imageId: string, req: any): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        order: number;
        imageUrl: string;
    }>;
    updateImageOrder(memoryId: string, imageId: string, req: any, order: number): Promise<{
        id: string;
        memoryId: string;
        createdAt: Date;
        order: number;
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
