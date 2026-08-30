import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';

@Controller('memories')
@UseGuards(JwtAuthGuard)
export class MemoriesController {
  constructor(private memoriesService: MemoriesService) {}

  @Post()
  async create(@Request() req, @Body() createMemoryDto: CreateMemoryDto) {
    return this.memoriesService.create(req.user.id, createMemoryDto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('categoryId') categoryId?: string,
    @Query('mood') mood?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('search') search?: string,
  ) {
    const filters: any = {};
    if (categoryId) filters.categoryId = categoryId;
    if (mood) filters.mood = mood;
    if (from) filters.from = new Date(from);
    if (to) filters.to = new Date(to);
    if (search) filters.search = search;

    return this.memoriesService.findAll(req.user.id, filters);
  }

  @Get('statistics')
  async getStatistics(@Request() req) {
    return this.memoriesService.getStatistics(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.memoriesService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateMemoryDto: UpdateMemoryDto,
  ) {
    return this.memoriesService.update(id, req.user.id, updateMemoryDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.memoriesService.delete(id, req.user.id);
  }

  @Post(':id/images')
  async addImage(
    @Param('id') id: string,
    @Request() req,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.memoriesService.addImage(id, req.user.id, imageUrl);
  }

  @Delete(':memoryId/images/:imageId')
  async deleteImage(
    @Param('memoryId') memoryId: string,
    @Param('imageId') imageId: string,
    @Request() req,
  ) {
    return this.memoriesService.deleteImage(imageId, req.user.id);
  }
}
