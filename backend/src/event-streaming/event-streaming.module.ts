import { Module } from '@nestjs/common';
import { EventStreamingService } from './event-streaming.service';
import { EventStreamingController } from './event-streaming.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventStreamingController],
  providers: [EventStreamingService],
  exports: [EventStreamingService],
})
export class EventStreamingModule {}
