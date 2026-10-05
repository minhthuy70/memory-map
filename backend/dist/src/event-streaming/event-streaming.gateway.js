"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStreamingGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let EventStreamingGateway = class EventStreamingGateway {
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoinBroadcast(broadcastId, client) {
        client.join(`broadcast:${broadcastId}`);
        client.emit('joined-broadcast', broadcastId);
    }
    handleLeaveBroadcast(broadcastId, client) {
        client.leave(`broadcast:${broadcastId}`);
        client.emit('left-broadcast', broadcastId);
    }
    handleLocationUpdate(data, client) {
        this.server.to(`broadcast:${data.broadcastId}`).emit('location-update', {
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: new Date().toISOString(),
        });
    }
    handleJoinWatchParty(roomCode, client) {
        client.join(`watch-party:${roomCode}`);
        client.emit('joined-watch-party', roomCode);
    }
    handleLeaveWatchParty(roomCode, client) {
        client.leave(`watch-party:${roomCode}`);
        client.emit('left-watch-party', roomCode);
    }
    handlePartyMessage(data, client) {
        this.server.to(`watch-party:${data.roomCode}`).emit('party-message', {
            message: data.message,
            userId: data.userId,
            timestamp: new Date().toISOString(),
        });
    }
    handleGuestWallUpdate(data, client) {
        this.server.to(`guest-wall:${data.wallId}`).emit('new-contribution', data.contribution);
    }
    broadcastLocationUpdate(broadcastId, location) {
        this.server.to(`broadcast:${broadcastId}`).emit('location-update', location);
    }
    broadcastWatchPartyMessage(roomCode, message) {
        this.server.to(`watch-party:${roomCode}`).emit('party-message', message);
    }
    broadcastGuestContribution(wallId, contribution) {
        this.server.to(`guest-wall:${wallId}`).emit('new-contribution', contribution);
    }
};
exports.EventStreamingGateway = EventStreamingGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventStreamingGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-broadcast'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventStreamingGateway.prototype, "handleJoinBroadcast", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-broadcast'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventStreamingGateway.prototype, "handleLeaveBroadcast", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('location-update'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventStreamingGateway.prototype, "handleLocationUpdate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-watch-party'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventStreamingGateway.prototype, "handleJoinWatchParty", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-watch-party'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventStreamingGateway.prototype, "handleLeaveWatchParty", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('party-message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventStreamingGateway.prototype, "handlePartyMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('guest-wall-update'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], EventStreamingGateway.prototype, "handleGuestWallUpdate", null);
exports.EventStreamingGateway = EventStreamingGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], EventStreamingGateway);
//# sourceMappingURL=event-streaming.gateway.js.map