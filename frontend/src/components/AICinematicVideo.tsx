'use client';

import { useState } from 'react';
import {
  Camera,
  CheckCircle,
  Clock,
  Download,
  Info,
  Play,
  RefreshCw,
  Star,
  Video,
  Zap
} from 'lucide-react';

interface AICinematicVideoProps {
  onCancel?: () => void;
}

interface CinematicVideo {
  id: string;
  title: string;
  duration: number;
  photoCount: number;
  cameraMovement: 'pan' | 'zoom' | 'rotate' | 'parallax';
  transitionStyle: 'fade' | 'slide' | 'warp' | 'morph';
  music: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  quality: '720p' | '1080p' | '4K';
}

interface CinematicSettings {
  autoGenerate: boolean;
  defaultMovement: 'pan' | 'zoom' | 'rotate' | 'parallax';
  defaultTransition: 'fade' | 'slide' | 'warp' | 'morph';
  defaultQuality: '720p' | '1080p' | '4K';
  includeMusic: boolean;
  aiEnhancement: boolean;
}

export default function AICinematicVideo({ onCancel }: AICinematicVideoProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCinematicEnabled, setIsCinematicEnabled] = useState(true);

  const [cinematicVideos, setCinematicVideos] = useState<CinematicVideo[]>([
    { id: '1', title: 'Sunset Cinematic', duration: 120, photoCount: 8, cameraMovement: 'pan', transitionStyle: 'fade', music: 'cinematic', createdAt: '2024-01-15', status: 'completed', quality: '1080p' },
    { id: '2', title: 'Mountain Panorama', duration: 180, photoCount: 12, cameraMovement: 'zoom', transitionStyle: 'warp', music: 'epic', createdAt: '2024-02-20', status: 'completed', quality: '4K' },
  ]);

  const [cinematicSettings, setCinematicSettings] = useState<CinematicSettings>({
    autoGenerate: false,
    defaultMovement: 'pan',
    defaultTransition: 'fade',
    defaultQuality: '1080p',
    includeMusic: true,
    aiEnhancement: true,
  });

  const generateCinematic = () => {
    const movements: Array<'pan' | 'zoom' | 'rotate' | 'parallax'> = ['pan', 'zoom', 'rotate', 'parallax'];
    const transitions: Array<'fade' | 'slide' | 'warp' | 'morph'> = ['fade', 'slide', 'warp', 'morph'];
    const qualities: Array<'720p' | '1080p' | '4K'> = ['720p', '1080p', '4K'];
    const newCinematic: CinematicVideo = {
      id: Date.now().toString(),
      title: `Cinematic ${cinematicVideos.length + 1}`,
      duration: Math.floor(Math.random() * 120) + 90,
      photoCount: Math.floor(Math.random() * 10) + 5,
      cameraMovement: cinematicSettings.defaultMovement,
      transitionStyle: cinematicSettings.defaultTransition,
      music: 'cinematic',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
      quality: cinematicSettings.defaultQuality,
    };
    setCinematicVideos([...cinematicVideos, newCinematic]);
  };

  const getMovementColor = (movement: string) => {
    switch (movement) {
      case 'pan': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'zoom': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'rotate': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'parallax': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTransitionColor = (transition: string) => {
    switch (transition) {
      case 'fade': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'slide': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
      case 'warp': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'morph': return 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case '720p': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case '1080p': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case '4K': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
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
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Cinematic Video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cinematic video from static photos using AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCinematicEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCinematicEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Videos</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{cinematicVideos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Duration</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(cinematicVideos.reduce((acc, v) => acc + v.duration, 0) / cinematicVideos.length).toFixed(0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Photos</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{cinematicVideos.reduce((acc, v) => acc + v.photoCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Movements</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{4}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCinematicEnabled}
              onChange={(e) => setIsCinematicEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Cinematic</span>
          </div>
          <button
            type="button"
            onClick={generateCinematic}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Video className="h-3 w-3" />
            Generate Cinematic
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Cinematic Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-violet-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={cinematicSettings.autoGenerate}
                onChange={(e) => setCinematicSettings({ ...cinematicSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Camera className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Movement</span>
              </div>
              <select
                value={cinematicSettings.defaultMovement}
                onChange={(e) => setCinematicSettings({ ...cinematicSettings, defaultMovement: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="pan">Pan</option>
                <option value="zoom">Zoom</option>
                <option value="rotate">Rotate</option>
                <option value="parallax">Parallax</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Transition</span>
              </div>
              <select
                value={cinematicSettings.defaultTransition}
                onChange={(e) => setCinematicSettings({ ...cinematicSettings, defaultTransition: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="fade">Fade</option>
                <option value="slide">Slide</option>
                <option value="warp">Warp</option>
                <option value="morph">Morph</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Gauge</span>
              </div>
              <select
                value={cinematicSettings.defaultQuality}
                onChange={(e) => setCinematicSettings({ ...cinematicSettings, defaultQuality: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="4K">4K</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Music</span>
              </div>
              <input
                type="checkbox"
                checked={cinematicSettings.includeMusic}
                onChange={(e) => setCinematicSettings({ ...cinematicSettings, includeMusic: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">AI Enhancement</span>
              </div>
              <input
                type="checkbox"
                checked={cinematicSettings.aiEnhancement}
                onChange={(e) => setCinematicSettings({ ...cinematicSettings, aiEnhancement: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Cinematic Videos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cinematicVideos.map((video) => (
              <div key={video.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Video className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{video.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getMovementColor(video.cameraMovement)}`}>
                          {video.cameraMovement}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTransitionColor(video.transitionStyle)}`}>
                          {video.transitionStyle}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getQualityColor(video.quality)}`}>
                          {video.quality}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(video.status)}`}>
                          {video.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{video.photoCount} photos • {video.duration}s • {video.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Music: {video.music}</span>
                    <span>•</span>
                    <span>AI Enhanced</span>
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
                    <Camera className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">AI Cinematic Video Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI creates cinematic videos from static photos</li>
              <li>• Camera movements: pan, zoom, rotate, parallax</li>
              <li>• Transitions: fade, slide, warp, morph</li>
              <li>• Gauge options: 720p, 1080p, 4K</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
