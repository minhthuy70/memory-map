import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        icon: string;
        createdAt: Date;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        icon: string;
        createdAt: Date;
    }>;
    seedCategories(): Promise<{
        id: string;
        name: string;
        icon: string;
        createdAt: Date;
    }[]>;
}
