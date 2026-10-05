import { IsString, IsArray, IsEnum, IsOptional, IsNumber } from 'class-validator';

export enum SearchEntityType {
  MEMORY = 'memory',
  IMAGE = 'image',
  ALL = 'all',
}

export class SemanticSearchDto {
  @IsString()
  query: string;

  @IsEnum(SearchEntityType)
  @IsOptional()
  entityType?: SearchEntityType;

  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class IndexEntityDto {
  @IsString()
  entityType: string;

  @IsString()
  entityId: string;

  @IsArray()
  embedding: number[];

  @IsString()
  @IsOptional()
  metadata?: string;
}
