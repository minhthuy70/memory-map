'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface StoryExport {
  id: string;
  memoryId: string;
  videoUrl?: string;
  resolution: string;
  format: string;
  duration?: number;
  status: string;
  createdAt: string;
  completedAt?: string;
}

export default function VerticalStoryExport() {
  const { token } = useAuth();
  const [exports, setExports] = useState<StoryExport[]>([]);

  const fetchExports = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/vertical-story', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setExports(data);
    } catch (error) {
      console.error('Error fetching exports:', error);
    }
  };

  const createExport = async (memoryId: string, resolution?: string, format?: string) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/vertical-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ memoryId, resolution, format }),
      });
      const data = await response.json();
      setExports([data, ...exports]);
      return data;
    } catch (error) {
      console.error('Error creating export:', error);
      throw error;
    }
  };

  const downloadVideo = (videoUrl: string) => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = 'memory-story.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  useEffect(() => {
    fetchExports();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchExports, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Vertical Story Export
      </h2>

      <div className="mb-6">
        <button
          onClick={() => {
            const memoryId = prompt('Enter memory ID:');
            if (memoryId) {
              const resolution = prompt('Enter resolution (1080p/720p/480p, optional):');
              const format = prompt('Enter format (mp4/webm, optional):');
              createExport(
                memoryId,
                resolution || undefined,
                format || undefined
              );
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Export Vertical Story
        </button>
      </div>

      <div className="space-y-4">
        {exports.map((exp) => (
          <div
            key={exp.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Memory: {exp.memoryId}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Resolution: {exp.resolution}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Format: {exp.format}
                </p>
                {exp.duration && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Duration: {exp.duration}s
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created: {new Date(exp.createdAt).toLocaleString()}
                </p>
                {exp.completedAt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completed: {new Date(exp.completedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(exp.status)}`}
                >
                  {exp.status}
                </span>
                {exp.status === 'completed' && exp.videoUrl && (
                  <button
                    onClick={() => downloadVideo(exp.videoUrl!)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
