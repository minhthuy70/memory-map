import { EventStreamingGateway } from './event-streaming.gateway';
interface WebRTCSignal {
    type: 'offer' | 'answer' | 'ice-candidate';
    from: string;
    to: string;
    data: any;
}
export declare class WebRTCService {
    private gateway;
    constructor(gateway: EventStreamingGateway);
    sendSignal(roomCode: string, signal: WebRTCSignal): void;
    handleJoinCall(roomCode: string, userId: string): void;
    handleLeaveCall(roomCode: string, userId: string): void;
    toggleMute(roomCode: string, userId: string, muted: boolean): void;
    toggleVideo(roomCode: string, userId: string, videoOff: boolean): void;
}
export {};
