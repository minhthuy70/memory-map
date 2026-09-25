'use client';

import { useState } from 'react';
import { Timer, X, RefreshCw, Info, CheckCircle, Star, Zap, Play, Download, Clock, Calendar } from 'lucide-react';

interface TimeLapseCreationProps {
  onCancel?: () => void;
}

interface TimeLapseVideo {
  id: string;
  title: string;
  sourceCount: number;
  originalDuration: number;
  timeLapseDuration: number;
  interval: number;
  frameRate: number;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

interface TimeLapseSettings {
  autoCreate: boolean;
  defaultInterval: number;
  defaultFrameRate: number;
  smoothTransitions: boolean;
  includeTimestamp: boolean;
}

export default function TimeLapseCreation({ onCancel }: TimeLapseCreationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTimeLapseEnabled, setIsTimeLapseEnabled] = useState(true);

  const [timeLapseVideos, setTimeLapseVideos] = useState<TimeLapseVideo[]>([
    { id: '1', title: 'Sunset Time-lapse', sourceCount: 120, originalDuration: 7200, timeLapseDuration: 30, interval: 60, frameRate: 24, createdAt: '2024-01-15', status: 'completed' },
    { id: '2', title: 'Plant Growth', sourceCount: 60, originalDuration: 14400, timeLapseDuration: 15, interval: 240, frameRate: 30, createdAt: '2024-02-20', status: 'completed' },
  ]);

  const [timeLapseSettings, setTimeLapseSettings] = useState<TimeLapseSettings>({
    autoCreate: false,
    defaultInterval: 60,
    defaultFrameRate: 24,
    smoothTransitions: true,
    includeTimestamp: false,
  });

  const createTimeLapse = () => {
    const newTimeLapse: TimeLapseVideo = {
      id: Date.now().toString(),
      title: `Time-lapse ${timeLapseVideos.length + 1}`,
      sourceCount: Math.floor(Math.random() * 100) + 30,
      originalDuration: Math.floor(Math.random() * 10000) + 1000,
      timeLapseDuration: Math.floor(Math.random() * 30) + 10,
      interval: timeLapseSettings.defaultInterval,
      frameRate: timeLapseSettings.defaultFrameRate,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setTimeLapseVideos([...timeLapseVideos, newTimeLapse]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl">
            <Timer className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Time-lapse Creation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create time-lapse videos from photos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isTimeLapseEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isTimeLapseEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Time-lapses</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{timeLapseVideos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Interval</p>
            <p className="text-lg font-bold text-lime-600 dark:text-lime-400">{(timeLapseVideos.reduce((acc, v) => acc + v.interval, 0) / timeLapseVideos.length).toFixed(0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Sources</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{timeLapseVideos.reduce((acc, v) => acc + v.sourceCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Frame Rate</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{(timeLapseVideos.reduce((acc, v) => acc + v.frameRate, 0) / timeLapseVideos.length).toFixed(0)}fps</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isTimeLapseEnabled}
              onChange={(e) => setIsTimeLapseEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Time-lapse</span>
          </div>
          <button
            type="button"
            onClick={createTimeLapse}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Timer className="h-3 w-3" />
            Create Time-lapse
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Time-lapse Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-lime-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Create</span>
              </div>
              <input
                type="checkbox"
                checked={timeLapseSettings.autoCreate}
                onChange={(e) => setTimeLapseSettings({ ...timeLapseSettings, autoCreate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Interval</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="3600"
                  value={timeLapseSettings.defaultInterval}
                  onChange={(e) => setTimeLapseSettings({ ...timeLapseSettings, defaultInterval: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{timeLapseSettings.defaultInterval}s</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Timer className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Frame Rate</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="12"
                  max="60"
                  value={timeLapseSettings.defaultFrameRate}
                  onChange={(e) => setTimeLapseSettings({ ...timeLapseSettings, defaultFrameRate: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{timeLapseSettings.defaultFrameRate}fps</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Smooth Transitions</span>
              </div>
              <input
                type="checkbox"
                checked={timeLapseSettings.smoothTransitions}
                onChange={(e) => setTimeLapseSettings({ ...timeLapseSettings, smoothTransitions: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Timestamp</span>
              </div>
              <input
                type="checkbox"
                checked={timeLapseSettings.includeTimestamp}
                onChange={(e) => setTimeLapseSettings({ ...timeLapseSettings, includeTimestamp: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Time-lapse Videos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {timeLapseVideos.map((video) => (
              <div key={video.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Timer className="h-4 w-4 text-lime-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{video.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(video.status)}`}>
                          {video.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{video.sourceCount} sources • {video.originalDuration}s → {video.timeLapseDuration}s • {video.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Interval: {video.interval}s</span>
                    <span>•</span>
                    <span>Frame Rate: {video.frameRate}fps</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Play
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    Adjust Interval
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Time-lapse Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create time-lapse videos from photo sequences</li>
              <li>• Adjustable interval: 1s to 3600s</li>
              <li>• Frame rate: 12fps to 60fps</li>
              <li>• Smooth transitions and timestamp options</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
