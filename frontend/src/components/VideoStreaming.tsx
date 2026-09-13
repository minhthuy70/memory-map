'use client';

import { useState } from 'react';
import { Video, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, PlayCircle, SkipBack, SkipForward, Volume2, Maximize2, Subtitles, Quality, Zap as ZapIcon, Gauge, RefreshCw, Check, Wifi, Film, Users, Eye } from 'lucide-react';

interface StreamQuality {
  id: string;
  name: string;
  resolution: string;
  bitrate: number;
  auto: boolean;
}

interface StreamSession {
  id: string;
  videoId: string;
  videoName: string;
  quality: string;
  duration: number;
  watched: number;
  bufferHealth: number;
  bandwidth: number;
  startedAt: Date;
  isActive: boolean;
}

interface VideoStreamingProps {
  onCancel?: () => void;
  onQualityChange?: (quality: string) => Promise<void>;
  onSeek?: (time: number) => Promise<void>;
}

const DEFAULT_QUALITIES: StreamQuality[] = [
  {
    id: 'quality-1',
    name: 'Auto',
    resolution: 'Auto',
    bitrate: 0,
    auto: true,
  },
  {
    id: 'quality-2',
    name: '4K',
    resolution: '3840x2160',
    bitrate: 15000,
    auto: false,
  },
  {
    id: 'quality-3',
    name: '1080p',
    resolution: '1920x1080',
    bitrate: 5000,
    auto: false,
  },
  {
    id: 'quality-4',
    name: '720p',
    resolution: '1280x720',
    bitrate: 2500,
    auto: false,
  },
  {
    id: 'quality-5',
    name: '480p',
    resolution: '854x480',
    bitrate: 1000,
    auto: false,
  },
];

const DEFAULT_SESSIONS: StreamSession[] = [
  {
    id: 'session-1',
    videoId: 'video-1',
    videoName: 'family-vacation.mp4',
    quality: '1080p',
    duration: 120,
    watched: 60,
    bufferHealth: 30,
    bandwidth: 5000,
    startedAt: new Date('2024-01-12'),
    isActive: true,
  },
];

export default function VideoStreaming({ onCancel, onQualityChange, onSeek }: VideoStreamingProps) {
  const [sessions, setSessions] = useState<StreamSession[]>(DEFAULT_SESSIONS);
  const [qualities, setQualities] = useState<StreamQuality[]>(DEFAULT_QUALITIES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('quality-3');
  const [currentTime, setCurrentTime] = useState(60);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(100);
  const [autoQuality, setAutoQuality] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const activeSession = sessions.find(s => s.isActive);
  const avgBandwidth = sessions.reduce((sum, s) => sum + s.bandwidth, 0) / sessions.length;
  const avgBufferHealth = sessions.reduce((sum, s) => sum + s.bufferHealth, 0) / sessions.length;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatBandwidth = (kbps: number) => {
    if (kbps >= 1000) return (kbps / 1000).toFixed(1) + ' Mbps';
    return kbps + ' Kbps';
  };

  const handleQualityChange = async (qualityId: string) => {
    setSelectedQuality(qualityId);
    await onQualityChange?.(qualityId);
  };

  const handleSeek = async (time: number) => {
    setCurrentTime(time);
    await onSeek?.(time);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <PlayCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Stream video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sessions.length} sessions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt streaming
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto quality selection
              </span>
              <button
                type="button"
                onClick={() => setAutoQuality(!autoQuality)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoQuality ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoQuality ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Adaptive bitrate
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Buffer optimization
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Bandwidth</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatBandwidth(avgBandwidth)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Buffer</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgBufferHealth.toFixed(0)}s
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Film className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Sessions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {sessions.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Quality</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {qualities.find(q => q.id === selectedQuality)?.name}
          </div>
        </div>
      </div>

      {/* Video Player */}
      {activeSession && (
        <div className="mb-4">
          <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="h-16 w-16 text-slate-600" />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white">
                    {formatDuration(currentTime)}
                  </span>
                  <span className="text-xs text-white">
                    {formatDuration(activeSession.duration)}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${(currentTime / activeSession.duration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 text-white" />
                    ) : (
                      <Play className="h-5 w-5 text-white" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <SkipBack className="h-4 w-4 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSeek(Math.min(activeSession.duration, currentTime + 10))}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <SkipForward className="h-4 w-4 text-white" />
                  </button>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-white" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                      className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Subtitles className="h-4 w-4 text-white" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Maximize2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quality Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Stream Quality
        </h4>
        <div className="grid grid-cols-5 gap-2">
          {qualities.map((quality) => (
            <button
              key={quality.id}
              type="button"
              onClick={() => handleQualityChange(quality.id)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedQuality === quality.id
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {quality.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {quality.resolution}
              </div>
              {quality.bitrate > 0 && (
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {formatBandwidth(quality.bitrate)}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stream Sessions */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Stream Sessions
        </h4>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border-2 ${
                session.isActive
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <PlayCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {session.videoName}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {session.quality}
                    </div>
                  </div>
                </div>
                {session.isActive && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full">
                    Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Watched</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(session.watched)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Buffer</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {session.bufferHealth}s
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Bandwidth</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatBandwidth(session.bandwidth)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Started</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {session.startedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Stream video không cần tải toàn bộ với adaptive bitrate streaming, quality selection (Auto/4K/1080p/720p/480p), buffer health monitoring, bandwidth tracking, video player controls (play/pause/seek/volume/fullscreen), stream session management, auto quality selection, và buffer optimization.
        </p>
      </div>
    </div>
  );
}