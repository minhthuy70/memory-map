import { Module } from '@nestjs/common';
import { EventStreamingService } from './event-streaming.service';
import { EventStreamingController } from './event-streaming.controller';
import { WebRTCService } from './webRTC.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventStreamingController],
  providers: [EventStreamingService, WebRTCService],
  exports: [EventStreamingService],
})
export class EventStreamingModule {}
