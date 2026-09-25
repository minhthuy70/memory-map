'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Battery,
  Bookmark,
  BookmarkCheck,
  Calendar,
  CalendarIcon,
  Check,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Filter,
  Layers,
  Locate,
  Map,
  MapIcon,
  MapPin,
  Maximize2,
  Navigation,
  Pause,
  PauseCircle,
  Play,
  PlayCircle,
  Plus,
  RefreshCw,
  RotateCw,
  Settings,
  SettingsIcon,
  Share2,
  Signal,
  SkipBack,
  SkipForward,
  Trash2,
  Volume2,
  Wifi,
  Zap,
  ZapIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface ARReplay {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video' | 'audio';
  location: string;
  coordinates: { lat: number; lng: number };
  originalDate: Date;
  isPlaying: boolean;
  isFavorite: boolean;
  progress: number;
  duration: number;
  volume: number;
}

interface ARMemoryReplayProps {
  onCancel?: () => void;
  onPlay?: (replayId: string) => Promise<void>;
  onPause?: (replayId: string) => Promise<void>;
  onSeek?: (replayId: string, progress: number) => Promise<void>;
  onFavorite?: (replayId: string) => Promise<void>;
}

const DEFAULT_REPLAYS: ARReplay[] = [
  {
    id: 'replay-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Morning',
    description: 'Beautiful morning at Đà Lạt',
    mediaUrl: '/replay-1.mp4',
    mediaType: 'video',
    location: 'Đà Lạt, Vietnam',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    originalDate: new Date('2024-01-12'),
    isPlaying: false,
    isFavorite: true,
    progress: 0,
    duration: 300,
    volume: 80,
  },
  {
    id: 'replay-2',
    memoryId: 'mem-2',
    title: 'Beach Sunset',
    description: 'Sunset at the beach',
    mediaUrl: '/replay-2.jpg',
    mediaType: 'image',
    location: 'Nha Trang, Vietnam',
    coordinates: { lat: 12.2380, lng: 109.1967 },
    originalDate: new Date('2024-02-15'),
    isPlaying: false,
    isFavorite: false,
    progress: 0,
    duration: 0,
    volume: 80,
  },
];

export default function ARMemoryReplay({ onCancel, onPlay, onPause, onSeek, onFavorite }: ARMemoryReplayProps) {
  const [replays, setReplays] = useState<ARReplay[]>(DEFAULT_REPLAYS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedReplay, setSelectedReplay] = useState<ARReplay | null>(DEFAULT_REPLAYS[0]);
  const [isAtLocation, setIsAtLocation] = useState(false);
  const [autoPlayAtLocation, setAutoPlayAtLocation] = useState(true);
  const [loopPlayback, setLoopPlayback] = useState(false);

  const totalReplays = replays.length;
  const favoriteReplays = replays.filter(r => r.isFavorite).length;
  const playingReplays = replays.filter(r => r.isPlaying).length;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = async (replayId: string) => {
    await onPlay?.(replayId);
    setReplays(replays.map(r => 
      r.id === replayId ? { ...r, isPlaying: true } : { ...r, isPlaying: false }
    ));
  };

  const handlePause = async (replayId: string) => {
    await onPause?.(replayId);
    setReplays(replays.map(r => 
      r.id === replayId ? { ...r, isPlaying: false } : r
    ));
  };

  const handleSeek = async (replayId: string, progress: number) => {
    await onSeek?.(replayId, progress);
    setReplays(replays.map(r => 
      r.id === replayId ? { ...r, progress } : r
    ));
  };

  const handleFavorite = async (replayId: string) => {
    await onFavorite?.(replayId);
    setReplays(replays.map(r => 
      r.id === replayId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  const handleVolumeChange = (replayId: string, volume: number) => {
    setReplays(replays.map(r => 
      r.id === replayId ? { ...r, volume } : r
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <PlayCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phát lại kỷ niệm bằng AR tại địa điểm gốc
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalReplays} replays
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
        <div className="mb-4 p-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt AR memory replay
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-play at location
              </span>
              <button
                type="button"
                onClick={() => setAutoPlayAtLocation(!autoPlayAtLocation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoPlayAtLocation ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoPlayAtLocation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Loop playback
              </span>
              <button
                type="button"
                onClick={() => setLoopPlayback(!loopPlayback)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  loopPlayback ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    loopPlayback ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Location detection
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
            <PlayCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Replays</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalReplays}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <BookmarkCheck className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Favorites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {favoriteReplays}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Playing</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {playingReplays}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Locate className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">At Location</span>
          </div>
          <div className={`text-lg font-bold ${isAtLocation ? 'text-green-500' : 'text-slate-500'}`}>
            {isAtLocation ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      {/* Location Status */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Location Status
            </span>
            {isAtLocation && (
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full">
                At Memory Location
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {isAtLocation ? 'You are at a memory location. AR replay available.' : 'Move to a memory location to enable AR replay.'}
            </span>
          </div>
        </div>
      </div>

      {/* AR Replay Player */}
      {selectedReplay && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                AR Replay Player
              </span>
              {selectedReplay.isPlaying && (
                <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-semibold rounded-full">
                  Playing
                </span>
              )}
            </div>

            {/* Media Display */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {selectedReplay.mediaType === 'video' ? (
                    <PlayCircle className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  ) : (
                    <Bookmark className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  )}
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedReplay.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    {selectedReplay.location}
                  </p>
                </div>
              </div>

              {/* AR Overlay */}
              {isAtLocation && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-violet-500/80 backdrop-blur-sm rounded-lg">
                  <span className="text-xs text-white font-semibold">AR Active</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {selectedReplay.mediaType === 'video' && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {formatDuration(selectedReplay.progress)}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {formatDuration(selectedReplay.duration)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={selectedReplay.duration}
                  value={selectedReplay.progress}
                  onChange={(e) => handleSeek(selectedReplay.id, parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-violet-500"
                />
              </div>
            )}

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <button
                type="button"
                className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors"
              >
                <SkipBack className="h-4 w-4 text-slate-500" />
              </button>
              <button
                type="button"
                onClick={() => selectedReplay.isPlaying ? handlePause(selectedReplay.id) : handlePlay(selectedReplay.id)}
                className="p-3 bg-violet-500 hover:bg-violet-600 rounded-full transition-colors"
              >
                {selectedReplay.isPlaying ? (
                  <PauseCircle className="h-5 w-5 text-white" />
                ) : (
                  <PlayCircle className="h-5 w-5 text-white" />
                )}
              </button>
              <button
                type="button"
                className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors"
              >
                <SkipForward className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* Volume Control */}
            {selectedReplay.mediaType === 'video' && (
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-slate-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedReplay.volume}
                  onChange={(e) => handleVolumeChange(selectedReplay.id, parseInt(e.target.value))}
                  className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-violet-500"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedReplay.volume}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Replay List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          AR Memory Replays
        </h4>
        <div className="space-y-2">
          {replays.map((replay) => (
            <div
              key={replay.id}
              className={`p-4 rounded-lg border-2 ${
                replay.isPlaying
                  ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    {replay.mediaType === 'video' ? (
                      <PlayCircle className="h-6 w-6 text-slate-400" />
                    ) : (
                      <Bookmark className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {replay.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {replay.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {replay.isPlaying && (
                    <Activity className="h-4 w-4 text-violet-500" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleFavorite(replay.id)}
                    className="p-1"
                  >
                    {replay.isFavorite ? (
                      <BookmarkCheck className="h-3 w-3 text-yellow-500" />
                    ) : (
                      <Bookmark className="h-3 w-3 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Original Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {replay.originalDate.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {replay.mediaType === 'video' ? formatDuration(replay.duration) : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Type</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {replay.mediaType}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedReplay(replay);
                  if (!replay.isPlaying) {
                    handlePlay(replay.id);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <PlayCircle className="h-3 w-3" />
                {replay.isPlaying ? 'Pause' : 'Play'} AR Replay
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 rounded-lg">
        <p className="text-[10px] text-violet-700 dark:text-violet-400">
          <strong>Lưu ý:</strong> Phát lại kỷ niệm bằng AR tại địa điểm gốc với location detection, auto-play at location, AR overlay when at location, playback controls (play/pause/skip), progress tracking, volume adjustment, favorite system, loop playback, media type support (image/video/audio), và comprehensive AR memory replay system.
        </p>
      </div>
    </div>
  );
}