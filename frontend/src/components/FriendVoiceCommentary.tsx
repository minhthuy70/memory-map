'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface VoiceCommentary {
  id: string;
  memoryId: string;
  commentatorName: string;
  audioUrl: string;
  duration?: number;
  createdAt: string;
}

export default function FriendVoiceCommentary() {
  const { token } = useAuth();
  const [commentaries, setCommentaries] = useState<VoiceCommentary[]>([]);
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [memoryCommentaries, setMemoryCommentaries] = useState<VoiceCommentary[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchCommentaries = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/voice-commentary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCommentaries(data);
    } catch (error) {
      console.error('Error fetching commentaries:', error);
    }
  };

  const fetchMemoryCommentaries = async (memoryId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/event-streaming/voice-commentary/memory/${memoryId}`
      );
      const data = await response.json();
      setMemoryCommentaries(data);
    } catch (error) {
      console.error('Error fetching memory commentaries:', error);
    }
  };

  const createCommentary = async (
    memoryId: string,
    commentatorName: string,
    audioUrl: string,
    duration?: number
  ) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/voice-commentary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memoryId, commentatorName, audioUrl, duration }),
      });
      const data = await response.json();
      setCommentaries([data, ...commentaries]);
      if (selectedMemoryId === memoryId) {
        setMemoryCommentaries([data, ...memoryCommentaries]);
      }
      return data;
    } catch (error) {
      console.error('Error creating commentary:', error);
      throw error;
    }
  };

  const playAudio = (audioUrl: string) => {
    if (currentAudio === audioUrl && isPlaying) {
      setIsPlaying(false);
      setCurrentAudio(null);
    } else {
      setCurrentAudio(audioUrl);
      setIsPlaying(true);
    }
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
    setCurrentAudio(null);
  };

  useEffect(() => {
    fetchCommentaries();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Friend Voice Commentary
      </h2>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => {
            const memoryId = prompt('Enter memory ID:');
            if (memoryId) {
              const commentatorName = prompt('Enter commentator name:');
              const audioUrl = prompt('Enter audio URL:');
              const duration = prompt('Enter duration in seconds (optional):');
              if (commentatorName && audioUrl) {
                createCommentary(
                  memoryId,
                  commentatorName,
                  audioUrl,
                  duration ? parseInt(duration) : undefined
                );
              }
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Commentary
        </button>
        <button
          onClick={() => {
            const memoryId = prompt('Enter memory ID to view commentaries:');
            if (memoryId) {
              setSelectedMemoryId(memoryId);
              fetchMemoryCommentaries(memoryId);
            }
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          View Memory Commentaries
        </button>
      </div>

      {selectedMemoryId && (
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-purple-800 dark:text-purple-200">
                Commentaries for Memory: {selectedMemoryId}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total: {memoryCommentaries.length}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedMemoryId(null);
                setMemoryCommentaries([]);
              }}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            {memoryCommentaries.map((commentary) => (
              <div
                key={commentary.id}
                className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {commentary.commentatorName}
                  </div>
                  {commentary.duration && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {commentary.duration}s
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => playAudio(commentary.audioUrl)}
                    className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    {currentAudio === commentary.audioUrl && isPlaying ? 'Pause' : 'Play'}
                  </button>
                  {currentAudio === commentary.audioUrl && (
                    <audio
                      src={commentary.audioUrl}
                      autoPlay
                      onEnded={handleAudioEnd}
                      className="hidden"
                    />
                  )}
                  <a
                    href={commentary.audioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Open Audio
                  </a>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {new Date(commentary.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
            {memoryCommentaries.length === 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                No commentaries yet for this memory
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          All Commentaries ({commentaries.length})
        </h3>
        {commentaries.map((commentary) => (
          <div
            key={commentary.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {commentary.commentatorName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Memory: {commentary.memoryId}
                </p>
                {commentary.duration && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: {commentary.duration}s
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {new Date(commentary.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playAudio(commentary.audioUrl)}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
              >
                {currentAudio === commentary.audioUrl && isPlaying ? 'Pause' : 'Play'}
              </button>
              {currentAudio === commentary.audioUrl && (
                <audio
                  src={commentary.audioUrl}
                  autoPlay
                  onEnded={handleAudioEnd}
                  className="hidden"
                />
              )}
              <a
                href={commentary.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Open Audio
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
