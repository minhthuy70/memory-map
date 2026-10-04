import { IsOptional, IsString } from 'class-validator';

export class CreateTravelPortfolioDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  customDomain?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  isPublic?: boolean;
}

export class UpdateTravelPortfolioDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  customDomain?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  isPublic?: boolean;
}

export class AddPortfolioMemoryDto {
  @IsString()
  memoryId: string;

  @IsOptional()
  isFeatured?: boolean;
}
