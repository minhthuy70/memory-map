import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        icon: string;
    }[]>;
    seed(): Promise<any[]>;
}
