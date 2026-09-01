import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        icon: string;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        icon: string;
    }>;
    seedCategories(): Promise<any[]>;
}
