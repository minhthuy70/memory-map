import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventStreamingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-broadcast')
  handleJoinBroadcast(@MessageBody() broadcastId: string, @ConnectedSocket() client: Socket) {
    client.join(`broadcast:${broadcastId}`);
    client.emit('joined-broadcast', broadcastId);
  }

  @SubscribeMessage('leave-broadcast')
  handleLeaveBroadcast(@MessageBody() broadcastId: string, @ConnectedSocket() client: Socket) {
    client.leave(`broadcast:${broadcastId}`);
    client.emit('left-broadcast', broadcastId);
  }

  @SubscribeMessage('location-update')
  handleLocationUpdate(
    @MessageBody() data: { broadcastId: string; latitude: number; longitude: number },
    @ConnectedSocket() client: Socket
  ) {
    this.server.to(`broadcast:${data.broadcastId}`).emit('location-update', {
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('join-watch-party')
  handleJoinWatchParty(@MessageBody() roomCode: string, @ConnectedSocket() client: Socket) {
    client.join(`watch-party:${roomCode}`);
    client.emit('joined-watch-party', roomCode);
  }

  @SubscribeMessage('leave-watch-party')
  handleLeaveWatchParty(@MessageBody() roomCode: string, @ConnectedSocket() client: Socket) {
    client.leave(`watch-party:${roomCode}`);
    client.emit('left-watch-party', roomCode);
  }

  @SubscribeMessage('party-message')
  handlePartyMessage(
    @MessageBody() data: { roomCode: string; message: string; userId: string },
    @ConnectedSocket() client: Socket
  ) {
    this.server.to(`watch-party:${data.roomCode}`).emit('party-message', {
      message: data.message,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('guest-wall-update')
  handleGuestWallUpdate(
    @MessageBody() data: { wallId: string; contribution: any },
    @ConnectedSocket() client: Socket
  ) {
    this.server.to(`guest-wall:${data.wallId}`).emit('new-contribution', data.contribution);
  }

  // Broadcast location update to all clients in a broadcast room
  broadcastLocationUpdate(broadcastId: string, location: any) {
    this.server.to(`broadcast:${broadcastId}`).emit('location-update', location);
  }

  // Broadcast watch party message
  broadcastWatchPartyMessage(roomCode: string, message: any) {
    this.server.to(`watch-party:${roomCode}`).emit('party-message', message);
  }

  // Broadcast guest wall contribution
  broadcastGuestContribution(wallId: string, contribution: any) {
    this.server.to(`guest-wall:${wallId}`).emit('new-contribution', contribution);
  }
}
