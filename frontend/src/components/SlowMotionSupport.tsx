'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Download,
  Gauge,
  Info,
  Play,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface SlowMotionSupportProps {
  onCancel?: () => void;
}

interface SlowMotionVideo {
  id: string;
  originalName: string;
  slowMoName: string;
  originalDuration: number;
  slowMoDuration: number;
  speedFactor: number;
  quality: 'high' | 'medium' | 'low';
  frameInterpolation: boolean;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

interface SlowMotionSettings {
  autoSlowMo: boolean;
  defaultSpeed: number;
  defaultQuality: 'high' | 'medium' | 'low';
  frameInterpolation: boolean;
  preserveAudio: boolean;
}

export default function SlowMotionSupport({ onCancel }: SlowMotionSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSlowMoEnabled, setIsSlowMoEnabled] = useState(true);

  const [slowMotionVideos, setSlowMotionVideos] = useState<SlowMotionVideo[]>([
    { id: '1', originalName: 'action_shot.mp4', slowMoName: 'slow_motion_action.mp4', originalDuration: 10, slowMoDuration: 30, speedFactor: 0.33, quality: 'high', frameInterpolation: true, createdAt: '2024-01-15', status: 'completed' },
    { id: '2', originalName: 'sports_clip.mp4', slowMoName: 'slow_motion_sports.mp4', originalDuration: 15, slowMoDuration: 45, speedFactor: 0.33, quality: 'medium', frameInterpolation: true, createdAt: '2024-02-20', status: 'completed' },
  ]);

  const [slowMotionSettings, setSlowMotionSettings] = useState<SlowMotionSettings>({
    autoSlowMo: false,
    defaultSpeed: 0.5,
    defaultQuality: 'high',
    frameInterpolation: true,
    preserveAudio: true,
  });

  const createSlowMotion = () => {
    const qualities: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
    const newSlowMo: SlowMotionVideo = {
      id: Date.now().toString(),
      originalName: `video_${Date.now()}.mp4`,
      slowMoName: `slow_motion_${Date.now()}.mp4`,
      originalDuration: Math.floor(Math.random() * 20) + 5,
      slowMoDuration: Math.floor(Math.random() * 60) + 15,
      speedFactor: slowMotionSettings.defaultSpeed,
      quality: slowMotionSettings.defaultQuality,
      frameInterpolation: slowMotionSettings.frameInterpolation,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setSlowMotionVideos([...slowMotionVideos, newSlowMo]);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
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
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Slow Motion Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create slow motion videos with adjustable speed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSlowMoEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSlowMoEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Slow Mo Videos</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{slowMotionVideos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Speed</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{(slowMotionVideos.reduce((acc, v) => acc + v.speedFactor, 0) / slowMotionVideos.length).toFixed(2)}x</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Duration</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{(slowMotionVideos.reduce((acc, v) => acc + v.slowMoDuration, 0) / 60).toFixed(1)}m</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Interpolated</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{slowMotionVideos.filter(v => v.frameInterpolation).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSlowMoEnabled}
              onChange={(e) => setIsSlowMoEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Slow Mo</span>
          </div>
          <button
            type="button"
            onClick={createSlowMotion}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Create Slow Motion
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Slow Motion Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Slow Mo</span>
              </div>
              <input
                type="checkbox"
                checked={slowMotionSettings.autoSlowMo}
                onChange={(e) => setSlowMotionSettings({ ...slowMotionSettings, autoSlowMo: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Gauge className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Speed</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={slowMotionSettings.defaultSpeed}
                  onChange={(e) => setSlowMotionSettings({ ...slowMotionSettings, defaultSpeed: parseFloat(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{slowMotionSettings.defaultSpeed}x</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Gauge</span>
              </div>
              <select
                value={slowMotionSettings.defaultQuality}
                onChange={(e) => setSlowMotionSettings({ ...slowMotionSettings, defaultQuality: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Frame Interpolation</span>
              </div>
              <input
                type="checkbox"
                checked={slowMotionSettings.frameInterpolation}
                onChange={(e) => setSlowMotionSettings({ ...slowMotionSettings, frameInterpolation: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Preserve Audio</span>
              </div>
              <input
                type="checkbox"
                checked={slowMotionSettings.preserveAudio}
                onChange={(e) => setSlowMotionSettings({ ...slowMotionSettings, preserveAudio: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Slow Motion Videos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {slowMotionVideos.map((video) => (
              <div key={video.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{video.originalName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{video.slowMoName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getQualityColor(video.quality)}`}>
                          {video.quality}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(video.status)}`}>
                          {video.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{video.originalDuration}s → {video.slowMoDuration}s • {video.speedFactor}x speed • {video.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {video.frameInterpolation && <span>Frame Interpolated</span>}
                    <span>• Gauge: {video.quality}</span>
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
                    <Gauge className="h-3 w-3" />
                    Adjust Speed
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Slow Motion Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create slow motion videos with adjustable speed</li>
              <li>• Speed range: 0.1x to 1x (slow motion)</li>
              <li>• Frame interpolation for smooth playback</li>
              <li>• Gauge options: high, medium, low</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
