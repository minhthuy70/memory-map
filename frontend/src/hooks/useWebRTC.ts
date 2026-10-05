import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebRTCConfig {
  serverUrl: string;
  roomCode: string;
  userId: string;
  onRemoteStream?: (stream: MediaStream) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
  onUserMuted?: (userId: string, muted: boolean) => void;
  onUserVideoOff?: (userId: string, videoOff: boolean) => void;
}

export function useWebRTC(config: WebRTCConfig) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    const newSocket = io(config.serverUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      newSocket.emit('join-watch-party', config.roomCode);
    });

    newSocket.on('webrtc-signal', async (signal: any) => {
      if (signal.to === config.userId) {
        await handleSignal(signal);
      }
    });

    newSocket.on('user-joined-call', (userId: string) => {
      config.onUserJoined?.(userId);
    });

    newSocket.on('user-left-call', (userId: string) => {
      config.onUserLeft?.(userId);
    });

    newSocket.on('user-muted', ({ userId, muted }: { userId: string; muted: boolean }) => {
      config.onUserMuted?.(userId, muted);
    });

    newSocket.on('user-video-off', ({ userId, videoOff }: { userId: string; videoOff: boolean }) => {
      config.onUserVideoOff?.(userId, videoOff);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [config.serverUrl, config.roomCode, config.userId]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection(configuration);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemoteStream(remoteStream);
        config.onRemoteStream?.(remoteStream);

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit('webrtc-signal', {
            roomCode: config.roomCode,
            signal: {
              type: 'ice-candidate',
              data: event.candidate,
            },
            from: config.userId,
            to: 'all',
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket?.emit('webrtc-signal', {
        roomCode: config.roomCode,
        signal: {
          type: 'offer',
          data: offer,
        },
        from: config.userId,
        to: 'all',
      });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const handleSignal = async (signal: any) => {
    const pc = peerConnectionRef.current;
    if (!pc) return;

    if (signal.type === 'offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket?.emit('webrtc-signal', {
        roomCode: config.roomCode,
        signal: {
          type: 'answer',
          data: answer,
        },
        from: config.userId,
        to: signal.from,
      });
    } else if (signal.type === 'answer') {
      await pc.setRemoteDescription(new RTCSessionDescription(signal.data));
    } else if (signal.type === 'ice-candidate') {
      await pc.addIceCandidate(new RTCIceCandidate(signal.data));
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);

        socket?.emit('webrtc/toggle-mute', {
          roomCode: config.roomCode,
          userId: config.userId,
          muted: !audioTrack.enabled,
        });
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);

        socket?.emit('webrtc/toggle-video', {
          roomCode: config.roomCode,
          userId: config.userId,
          videoOff: !videoTrack.enabled,
        });
      }
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    setRemoteStream(null);

    socket?.emit('webrtc/leave-call', {
      roomCode: config.roomCode,
      userId: config.userId,
    });
  };

  return {
    localStream,
    remoteStream,
    isMuted,
    isVideoOff,
    localVideoRef,
    remoteVideoRef,
    startCall,
    toggleMute,
    toggleVideo,
    endCall,
  };
}
