export declare enum SearchEntityType {
    MEMORY = "memory",
    IMAGE = "image",
    ALL = "all"
}
export declare class SemanticSearchDto {
    query: string;
    entityType?: SearchEntityType;
    limit?: number;
}
export declare class IndexEntityDto {
    entityType: string;
    entityId: string;
    embedding: number[];
    metadata?: string;
}
