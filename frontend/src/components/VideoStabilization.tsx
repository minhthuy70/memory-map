'use client';

import { useState } from 'react';
import { Video, X, RefreshCw, Info, CheckCircle, Star, Zap, Play, Download, Clock, Share2 } from 'lucide-react';

interface VideoStabilizationProps {
  onCancel?: () => void;
}

interface StabilizedVideo {
  id: string;
  originalName: string;
  stabilizedName: string;
  originalDuration: number;
  stabilizedDuration: number;
  stabilityScore: number;
  shakeLevel: 'low' | 'medium' | 'high';
  algorithm: 'optical_flow' | 'feature_tracking' | 'motion_vectors';
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

interface StabilizationSettings {
  autoStabilize: boolean;
  defaultAlgorithm: 'optical_flow' | 'feature_tracking' | 'motion_vectors';
  intensity: number;
  cropToStabilize: boolean;
  smoothness: number;
}

export default function VideoStabilization({ onCancel }: VideoStabilizationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isStabilizationEnabled, setIsStabilizationEnabled] = useState(true);

  const [stabilizedVideos, setStabilizedVideos] = useState<StabilizedVideo[]>([
    { id: '1', originalName: 'shaky_video_1.mp4', stabilizedName: 'stabilized_video_1.mp4', originalDuration: 120, stabilizedDuration: 118, stabilityScore: 92, shakeLevel: 'high', algorithm: 'optical_flow', createdAt: '2024-01-15', status: 'completed' },
    { id: '2', originalName: 'walking_video.mp4', stabilizedName: 'stabilized_walking.mp4', originalDuration: 180, stabilizedDuration: 179, stabilityScore: 88, shakeLevel: 'medium', algorithm: 'feature_tracking', createdAt: '2024-02-20', status: 'completed' },
  ]);

  const [stabilizationSettings, setStabilizationSettings] = useState<StabilizationSettings>({
    autoStabilize: false,
    defaultAlgorithm: 'optical_flow',
    intensity: 70,
    cropToStabilize: true,
    smoothness: 50,
  });

  const stabilizeVideo = () => {
    const algorithms: Array<'optical_flow' | 'feature_tracking' | 'motion_vectors'> = ['optical_flow', 'feature_tracking', 'motion_vectors'];
    const shakeLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const newStabilized: StabilizedVideo = {
      id: Date.now().toString(),
      originalName: `video_${Date.now()}.mp4`,
      stabilizedName: `stabilized_${Date.now()}.mp4`,
      originalDuration: Math.floor(Math.random() * 120) + 60,
      stabilizedDuration: Math.floor(Math.random() * 120) + 58,
      stabilityScore: Math.floor(Math.random() * 15) + 85,
      shakeLevel: shakeLevels[Math.floor(Math.random() * shakeLevels.length)],
      algorithm: stabilizationSettings.defaultAlgorithm,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setStabilizedVideos([...stabilizedVideos, newStabilized]);
  };

  const getAlgorithmColor = (algorithm: string) => {
    switch (algorithm) {
      case 'optical_flow': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'feature_tracking': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'motion_vectors': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getShakeLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
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
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Shake className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Video Stabilization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto video stabilization for shaky footage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isStabilizationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isStabilizationEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Stabilized</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stabilizedVideos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Stability</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{(stabilizedVideos.reduce((acc, v) => acc + v.stabilityScore, 0) / stabilizedVideos.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Time</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(stabilizedVideos.reduce((acc, v) => acc + v.stabilizedDuration, 0) / 60).toFixed(1)}m</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Algorithms</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{3}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isStabilizationEnabled}
              onChange={(e) => setIsStabilizationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Stabilization</span>
          </div>
          <button
            type="button"
            onClick={stabilizeVideo}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Shake className="h-3 w-3" />
            Stabilize Video
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Stabilization Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-teal-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Stabilize</span>
              </div>
              <input
                type="checkbox"
                checked={stabilizationSettings.autoStabilize}
                onChange={(e) => setStabilizationSettings({ ...stabilizationSettings, autoStabilize: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Algorithm</span>
              </div>
              <select
                value={stabilizationSettings.defaultAlgorithm}
                onChange={(e) => setStabilizationSettings({ ...stabilizationSettings, defaultAlgorithm: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="optical_flow">Optical Flow</option>
                <option value="feature_tracking">Feature Tracking</option>
                <option value="motion_vectors">Motion Vectors</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Intensity</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={stabilizationSettings.intensity}
                  onChange={(e) => setStabilizationSettings({ ...stabilizationSettings, intensity: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{stabilizationSettings.intensity}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Crop to Stabilize</span>
              </div>
              <input
                type="checkbox"
                checked={stabilizationSettings.cropToStabilize}
                onChange={(e) => setStabilizationSettings({ ...stabilizationSettings, cropToStabilize: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Shake className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Smoothness</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={stabilizationSettings.smoothness}
                  onChange={(e) => setStabilizationSettings({ ...stabilizationSettings, smoothness: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{stabilizationSettings.smoothness}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Stabilized Videos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {stabilizedVideos.map((video) => (
              <div key={video.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-teal-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{video.originalName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{video.stabilizedName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getAlgorithmColor(video.algorithm)}`}>
                          {video.algorithm}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getShakeLevelColor(video.shakeLevel)}`}>
                          {video.shakeLevel}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(video.status)}`}>
                          {video.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{video.originalDuration}s → {video.stabilizedDuration}s • {video.stabilityScore}% stability • {video.createdAt}</p>
                    </div>
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
                    <Shake className="h-3 w-3" />
                    Compare
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Video Stabilization Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI stabilizes shaky video footage</li>
              <li>• Algorithms: optical flow, feature tracking, motion vectors</li>
              <li>• Adjustable intensity and smoothness</li>
              <li>• Crop to stabilize option for better results</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
