export declare class CreateTravelPortfolioDto {
    title: string;
    customDomain?: string;
    bio?: string;
    isPublic?: boolean;
}
export declare class UpdateTravelPortfolioDto {
    title?: string;
    customDomain?: string;
    bio?: string;
    isPublic?: boolean;
}
export declare class AddPortfolioMemoryDto {
    memoryId: string;
    isFeatured?: boolean;
}
