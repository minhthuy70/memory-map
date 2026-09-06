import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        icon: string;
        color: string;
        createdAt: Date;
        usageCount: number;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        icon: string;
        color: string;
        createdAt: Date;
        usageCount: number;
    }>;
    seedCategories(): Promise<any[]>;
    create(createCategoryDto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        icon: string;
        color: string;
        createdAt: Date;
        usageCount: number;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        id: string;
        name: string;
        icon: string;
        color: string;
        createdAt: Date;
        usageCount: number;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
