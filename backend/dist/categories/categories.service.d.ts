import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        icon: string;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        icon: string;
    }>;
    seedCategories(): Promise<any[]>;
}
