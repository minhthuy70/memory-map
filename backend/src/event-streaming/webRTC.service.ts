import { Injectable } from '@nestjs/common';
import { EventStreamingGateway } from './event-streaming.gateway';

interface WebRTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate';
  from: string;
  to: string;
  data: any;
}

@Injectable()
export class WebRTCService {
  constructor(private gateway: EventStreamingGateway) {}

  sendSignal(roomCode: string, signal: WebRTCSignal) {
    this.gateway.server.to(`watch-party:${roomCode}`).emit('webrtc-signal', signal);
  }

  handleJoinCall(roomCode: string, userId: string) {
    this.gateway.server.to(`watch-party:${roomCode}`).emit('user-joined-call', userId);
  }

  handleLeaveCall(roomCode: string, userId: string) {
    this.gateway.server.to(`watch-party:${roomCode}`).emit('user-left-call', userId);
  }

  toggleMute(roomCode: string, userId: string, muted: boolean) {
    this.gateway.server.to(`watch-party:${roomCode}`).emit('user-muted', { userId, muted });
  }

  toggleVideo(roomCode: string, userId: string, videoOff: boolean) {
    this.gateway.server.to(`watch-party:${roomCode}`).emit('user-video-off', { userId, videoOff });
  }
}
