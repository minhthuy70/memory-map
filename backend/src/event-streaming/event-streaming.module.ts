import { Module } from '@nestjs/common';
import { EventStreamingService } from './event-streaming.service';
import { EventStreamingController } from './event-streaming.controller';
import { EventStreamingGateway } from './event-streaming.gateway';
import { WebRTCService } from './webRTC.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventStreamingController],
  providers: [EventStreamingService, EventStreamingGateway, WebRTCService],
  exports: [EventStreamingService],
})
export class EventStreamingModule {}
