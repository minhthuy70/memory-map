import { Module } from '@nestjs/common';
import { TripPlanningController } from './trip-planning.controller';
import { TripPlanningService } from './trip-planning.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TripPlanningController],
  providers: [TripPlanningService],
  exports: [TripPlanningService],
})
export class TripPlanningModule {}
