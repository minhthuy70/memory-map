import { Module } from '@nestjs/common';
import { EventStreamingService } from './event-streaming.service';
import { EventStreamingController } from './event-streaming.controller';
import { WebRTCService } from './webRTC.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EventStreamingController],
  providers: [EventStreamingService, WebRTCService],
  exports: [EventStreamingService],
})
export class EventStreamingModule {}
