import { Mood } from '@prisma/client';
export declare class CreateMemoryDto {
    title: string;
    content?: string;
    latitude: number;
    longitude: number;
    locationName?: string;
    memoryDate: Date;
    mood: Mood;
    categoryId: string;
}
