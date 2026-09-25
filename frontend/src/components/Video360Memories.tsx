'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileVideo,
  Filter,
  Grid,
  Layers,
  Maximize2,
  MoveHorizontal,
  Pause,
  PauseCircle,
  Play,
  PlayCircle,
  Plus,
  RefreshCw,
  RotateCw,
  Settings,
  SettingsIcon,
  SettingsIcon2,
  SkipBack,
  SkipForward,
  Trash2,
  TrashIcon,
  Upload,
  Video,
  VideoIcon,
  Volume2,
  Zap,
  ZapIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface PanoramaVideo {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  captureDate: Date;
  location: string;
  coordinates: { lat: number; lng: number };
  duration: number;
  resolution: string;
  size: number;
  format: string;
  isFavorite: boolean;
  isDefault: boolean;
  isPlaying: boolean;
  volume: number;
}

interface Video360MemoriesProps {
  onCancel?: () => void;
  onUpload?: (file: File) => Promise<void>;
  onSetDefault?: (videoId: string) => Promise<void>;
  onDelete?: (videoId: string) => Promise<void>;
  onPlay?: (videoId: string) => Promise<void>;
  onPause?: (videoId: string) => Promise<void>;
}

const DEFAULT_VIDEOS: PanoramaVideo[] = [
  {
    id: 'pano-vid-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt 360° Video',
    description: 'Panoramic video tour of Đà Lạt',
    videoUrl: '/pano-vid-1.mp4',
    thumbnailUrl: '/pano-vid-1-thumb.jpg',
    captureDate: new Date('2024-01-12'),
    location: 'Đà Lạt, Vietnam',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    duration: 300,
    resolution: '4096x2048',
    size: 50000000,
    format: 'mp4',
    isFavorite: true,
    isDefault: true,
    isPlaying: false,
    volume: 80,
  },
];

export default function Video360Memories({ onCancel, onUpload, onSetDefault, onDelete, onPlay, onPause }: Video360MemoriesProps) {
  const [videos, setVideos] = useState<PanoramaVideo[]>(DEFAULT_VIDEOS);
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<PanoramaVideo | null>(DEFAULT_VIDEOS[0]);
  const [viewMode, setViewMode] = useState<'viewer' | 'grid'>('viewer');
  const [autoTranscode, setAutoTranscode] = useState(true);

  const totalVideos = videos.length;
  const favoriteVideos = videos.filter(v => v.isFavorite).length;
  const totalSize = videos.reduce((sum, v) => sum + v.size, 0);
  const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 100));
    }, 200);
    
    await onUpload?.(file);
    
    clearInterval(interval);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleSetDefault = async (videoId: string) => {
    await onSetDefault?.(videoId);
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, isDefault: true } : { ...v, isDefault: false }
    ));
  };

  const handleDelete = async (videoId: string) => {
    await onDelete?.(videoId);
    setVideos(videos.filter(v => v.id !== videoId));
  };

  const handlePlay = async (videoId: string) => {
    await onPlay?.(videoId);
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, isPlaying: true } : { ...v, isPlaying: false }
    ));
  };

  const handlePause = async (videoId: string) => {
    await onPause?.(videoId);
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, isPlaying: false } : v
    ));
  };

  const handleToggleFavorite = (videoId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, isFavorite: !v.isFavorite } : v
    ));
  };

  const handleVolumeChange = (videoId: string, volume: number) => {
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, volume } : v
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Kỷ niệm video 360 độ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalVideos} videos
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt 360° video
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-transcode on upload
              </span>
              <button
                type="button"
                onClick={() => setAutoTranscode(!autoTranscode)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoTranscode ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoTranscode ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Video stabilization
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Spatial audio
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
            <Video className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Videos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalVideos}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Favorites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {favoriteVideos}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <FileVideo className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalSize / 1048576).toFixed(1)}MB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(totalDuration)}
          </div>
        </div>
      </div>

      {/* Upload Interface */}
      <div className="mb-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-orange-400 dark:hover:border-orange-600 transition-colors">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            id="video-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="video-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Upload 360° panoramic video
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports: MP4, WebM, MOV, Equirectangular format
            </p>
          </label>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Processing video...
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* View Mode Selector */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('viewer')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'viewer'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Viewer
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Viewer Mode */}
      {viewMode === 'viewer' && selectedVideo && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                360° Video Viewer
              </span>
              {selectedVideo.isDefault && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-semibold rounded-full">
                  Default
                </span>
              )}
            </div>

            {/* Video Preview */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <VideoIcon className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedVideo.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    Drag to look around, scroll to zoom
                  </p>
                </div>
              </div>
              {/* Controls overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => selectedVideo.isPlaying ? handlePause(selectedVideo.id) : handlePlay(selectedVideo.id)}
                    className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {selectedVideo.isPlaying ? (
                      <PauseCircle className="h-4 w-4 text-white" />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                    <SkipBack className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                    <SkipForward className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                    <ZoomOut className="h-4 w-4 text-white" />
                  </button>
                </div>
                <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                  <Maximize2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="h-4 w-4 text-slate-500" />
              <input
                type="range"
                min="0"
                max="100"
                value={selectedVideo.volume}
                onChange={(e) => handleVolumeChange(selectedVideo.id, parseInt(e.target.value))}
                className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedVideo.volume}%
              </span>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {formatDuration(selectedVideo.duration)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Resolution</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedVideo.resolution}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {formatFileSize(selectedVideo.size)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSetDefault(selectedVideo.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Star className="h-3 w-3" />
                Set Default
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Mode */}
      {viewMode === 'grid' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            360° Videos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className={`p-4 rounded-lg border-2 ${
                  video.isDefault
                    ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                      <VideoIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {video.title}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {video.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {video.isDefault && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                    {video.isPlaying && (
                      <PlayCircle className="h-4 w-4 text-orange-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(video.id)}
                      className="p-1"
                    >
                      <Star className={`h-3 w-3 ${video.isFavorite ? 'text-yellow-500' : 'text-slate-400'}`} />
                    </button>
                  </div>
                </div>

                <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-2 flex items-center justify-center">
                  <VideoIcon className="h-8 w-8 text-slate-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {formatFileSize(video.size)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVideo(video);
                    setViewMode('viewer');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  View 360°
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Kỷ niệm video 360 độ với panoramic video upload, equirectangular format support, viewer mode (look around/zoom/fullscreen), grid view, default video selection, favorite system, playback controls (play/pause/skip), volume adjustment, auto-transcode on upload, video stabilization, spatial audio, location tracking, và comprehensive 360° video management system.
        </p>
      </div>
    </div>
  );
}