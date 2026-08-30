import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.categoriesService.findAll();
  }

  @Post('seed')
  async seed() {
    return this.categoriesService.seedCategories();
  }
}
