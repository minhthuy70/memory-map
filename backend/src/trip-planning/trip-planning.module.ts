import { Module } from '@nestjs/common';
import { TripPlanningService } from './trip-planning.service';
import { TripPlanningController } from './trip-planning.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TripPlanningController],
  providers: [TripPlanningService],
  exports: [TripPlanningService],
})
export class TripPlanningModule {}
