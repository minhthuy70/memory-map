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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebRTCService = void 0;
const common_1 = require("@nestjs/common");
const event_streaming_gateway_1 = require("./event-streaming.gateway");
let WebRTCService = class WebRTCService {
    constructor(gateway) {
        this.gateway = gateway;
    }
    sendSignal(roomCode, signal) {
        this.gateway.server.to(`watch-party:${roomCode}`).emit('webrtc-signal', signal);
    }
    handleJoinCall(roomCode, userId) {
        this.gateway.server.to(`watch-party:${roomCode}`).emit('user-joined-call', userId);
    }
    handleLeaveCall(roomCode, userId) {
        this.gateway.server.to(`watch-party:${roomCode}`).emit('user-left-call', userId);
    }
    toggleMute(roomCode, userId, muted) {
        this.gateway.server.to(`watch-party:${roomCode}`).emit('user-muted', { userId, muted });
    }
    toggleVideo(roomCode, userId, videoOff) {
        this.gateway.server.to(`watch-party:${roomCode}`).emit('user-video-off', { userId, videoOff });
    }
};
exports.WebRTCService = WebRTCService;
exports.WebRTCService = WebRTCService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_streaming_gateway_1.EventStreamingGateway])
], WebRTCService);
//# sourceMappingURL=webRTC.service.js.map