'use client';

import { useState } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useAuth } from '@/hooks/useAuth';

interface WatchPartyVideoCallProps {
  roomCode: string;
  onEndCall: () => void;
}

export default function WatchPartyVideoCall({ roomCode, onEndCall }: WatchPartyVideoCallProps) {
  const { userId } = useAuth();
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);

  const {
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
  } = useWebRTC({
    serverUrl: 'http://localhost:3001',
    roomCode,
    userId: userId || 'default-user',
    onRemoteStream: (stream) => {
      console.log('Remote stream received:', stream);
    },
    onUserJoined: (newUserId) => {
      setParticipants((prev) => [...prev, newUserId]);
    },
    onUserLeft: (leftUserId) => {
      setParticipants((prev) => prev.filter((id) => id !== leftUserId));
    },
    onUserMuted: (mutedUserId, muted) => {
      console.log(`User ${mutedUserId} muted: ${muted}`);
    },
    onUserVideoOff: (videoOffUserId, videoOff) => {
      console.log(`User ${videoOffUserId} video off: ${videoOff}`);
    },
  });

  const handleStartCall = async () => {
    await startCall();
    setIsCallStarted(true);
  };

  const handleEndCall = () => {
    endCall();
    setIsCallStarted(false);
    setParticipants([]);
    onEndCall();
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Video Call - Room: {roomCode}
      </h2>

      {!isCallStarted ? (
        <div className="text-center py-8">
          <button
            onClick={handleStartCall}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-semibold"
          >
            📹 Start Video Call
          </button>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Participants in room: {participants.length}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Video */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                You
              </div>
              {isMuted && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  Muted
                </div>
              )}
              {isVideoOff && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  Video Off
                </div>
              )}
            </div>

            {/* Remote Video */}
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              {remoteStream ? (
                <>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    Remote
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Waiting for remote stream...
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 py-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${
                isMuted
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full ${
                isVideoOff
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
              title={isVideoOff ? 'Turn on video' : 'Turn off video'}
            >
              {isVideoOff ? '📵' : '📹'}
            </button>

            <button
              onClick={handleEndCall}
              className="p-3 rounded-full bg-red-500 text-white"
              title="End call"
            >
              📞
            </button>
          </div>

          {/* Participants */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Participants: {participants.length + 1} (including you)
          </div>
        </div>
      )}
    </div>
  );
}
