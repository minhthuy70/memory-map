import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventStreamingGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinBroadcast(broadcastId: string, client: Socket): void;
    handleLeaveBroadcast(broadcastId: string, client: Socket): void;
    handleLocationUpdate(data: {
        broadcastId: string;
        latitude: number;
        longitude: number;
    }, client: Socket): void;
    handleJoinWatchParty(roomCode: string, client: Socket): void;
    handleLeaveWatchParty(roomCode: string, client: Socket): void;
    handlePartyMessage(data: {
        roomCode: string;
        message: string;
        userId: string;
    }, client: Socket): void;
    handleGuestWallUpdate(data: {
        wallId: string;
        contribution: any;
    }, client: Socket): void;
    broadcastLocationUpdate(broadcastId: string, location: any): void;
    broadcastWatchPartyMessage(roomCode: string, message: any): void;
    broadcastGuestContribution(wallId: string, contribution: any): void;
}
