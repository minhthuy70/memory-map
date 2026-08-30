import { IsString, IsNumber, IsDate, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { Mood } from '@prisma/client';
import { PartialType } from '@nestjs/mapped-types';
import { CreateMemoryDto } from './create-memory.dto';

export class UpdateMemoryDto extends PartialType(CreateMemoryDto) {}
