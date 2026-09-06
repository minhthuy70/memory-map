import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        id: string;
        name: string;
        icon: string;
        color: string;
        createdAt: Date;
        usageCount: number;
    }[]>;
    seed(): Promise<any[]>;
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
