import { Module } from '@nestjs/common';
import { TripPlanningService } from './trip-planning.service';
import { TripPlanningController } from './trip-planning.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TripPlanningController],
  providers: [TripPlanningService],
  exports: [TripPlanningService],
})
export class TripPlanningModule {}
