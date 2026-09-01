import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        icon: string;
    }[]>;
    seed(): Promise<any[]>;
}
