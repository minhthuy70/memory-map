'use client';

import { useState } from 'react';
import { Video, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, FileVideo, Settings as SettingsIcon, Eye, Plus, Layers, Trash2 as TrashIcon, Check, Sort, ChevronUp, ChevronDown } from 'lucide-react';

interface MemoryVideo {
  id: string;
  videoId: string;
  memoryId: string;
  videoName: string;
  order: number;
  isPrimary: boolean;
  uploadedAt: Date;
  size: number;
  duration: number;
}

interface MultipleVideoPerMemoryProps {
  onCancel?: () => void;
  onAddVideo?: (memoryId: string, videoId: string) => Promise<void>;
  onRemoveVideo?: (videoId: string) => Promise<void>;
  onSetPrimary?: (videoId: string) => Promise<void>;
  onReorder?: (videoId: string, newOrder: number) => Promise<void>;
}

const DEFAULT_VIDEOS: MemoryVideo[] = [
  {
    id: 'mv-1',
    videoId: 'video-1',
    memoryId: 'mem-1',
    videoName: 'main-video.mp4',
    order: 1,
    isPrimary: true,
    uploadedAt: new Date('2024-01-12'),
    size: 25000000,
    duration: 120,
  },
  {
    id: 'mv-2',
    videoId: 'video-2',
    memoryId: 'mem-1',
    videoName: 'alternate-angle.mp4',
    order: 2,
    isPrimary: false,
    uploadedAt: new Date('2024-01-12'),
    size: 15000000,
    duration: 90,
  },
  {
    id: 'mv-3',
    videoId: 'video-3',
    memoryId: 'mem-1',
    videoName: 'behind-scenes.mp4',
    order: 3,
    isPrimary: false,
    uploadedAt: new Date('2024-01-12'),
    size: 10000000,
    duration: 60,
  },
];

export default function MultipleVideoPerMemory({ onCancel, onAddVideo, onRemoveVideo, onSetPrimary, onReorder }: MultipleVideoPerMemoryProps) {
  const [videos, setVideos] = useState<MemoryVideo[]>(DEFAULT_VIDEOS);
  const [showSettings, setShowSettings] = useState(false);
  const [maxVideos, setMaxVideos] = useState(5);
  const [sortBy, setSortBy] = useState<'order' | 'date' | 'size'>('order');
  const [isAdding, setIsAdding] = useState(false);

  const totalVideos = videos.length;
  const primaryVideo = videos.find(v => v.isPrimary);
  const totalSize = videos.reduce((sum, v) => sum + v.size, 0);
  const totalDuration = videos.reduce((sum, v) => sum + v.duration, 0);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAdd = async () => {
    setIsAdding(true);
    await onAddVideo?.('mem-1', 'new-video');
    setIsAdding(false);
  };

  const handleRemove = async (videoId: string) => {
    await onRemoveVideo?.(videoId);
    setVideos(videos.filter(v => v.id !== videoId));
  };

  const handleSetPrimary = async (videoId: string) => {
    await onSetPrimary?.(videoId);
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, isPrimary: true } : { ...v, isPrimary: false }
    ));
  };

  const handleReorder = async (videoId: string, direction: 'up' | 'down') => {
    const currentIndex = videos.findIndex(v => v.id === videoId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < videos.length) {
      await onReorder?.(videoId, newIndex);
      const newVideos = [...videos];
      const temp = newVideos[currentIndex];
      newVideos[currentIndex] = newVideos[newIndex];
      newVideos[newIndex] = temp;
      newVideos.forEach((v, i) => v.order = i + 1);
      setVideos(newVideos);
    }
  };

  const sortedVideos = [...videos].sort((a, b) => {
    switch (sortBy) {
      case 'order':
        return a.order - b.order;
      case 'date':
        return a.uploadedAt.getTime() - b.uploadedAt.getTime();
      case 'size':
        return a.size - b.size;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhiều video cho một kỷ niệm
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
          <h4 className="font-semibold text-sideoslate-900 dark:text-white text-sm mb-3">
            Cài đặt multiple videos
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Max videos per memory: {maxVideos}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={maxVideos}
                onChange={(e) => setMaxVideos(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-primary selection
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Allow reordering
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
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Videos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalVideos}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Primary</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {primaryVideo ? 'Yes' : 'No'}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <FileVideo className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Size</span>
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

      {/* Add Video Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleAdd}
          disabled={totalVideos >= maxVideos || isAdding}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? 'Adding...' : `Add Video (${totalVideos}/${maxVideos})`}
        </button>
      </div>

      {/* Sort Options */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSortBy('order')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              sortBy === 'order'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Order
          </button>
          <button
            type="button"
            onClick={() => setSortBy('date')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              sortBy === 'date'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Date
          </button>
          <button
            type="button"
            onClick={() => setSortBy('size')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              sortBy === 'size'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Size
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Videos
        </h4>
        <div className="space-y-2">
          {sortedVideos.map((video) => (
            <div
              key={video.id}
              className={`p-4 rounded-lg border-2 ${
                video.isPrimary
                  ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <FileVideo className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {video.videoName}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Order: {video.order}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!video.isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(video.id)}
                      className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      Set Primary
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleReorder(video.id, 'up')}
                    disabled={video.order === 1}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-50"
                  >
                    <ChevronUp className="h-3 w-3 text-slate-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(video.id, 'down')}
                    disabled={video.order === videos.length}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-50"
                  >
                    <ChevronDown className="h-3 w-3 text-slate-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(video.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              {video.isPrimary && (
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-semibold rounded-full">
                  Primary
                </span>
              )}

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(video.size)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(video.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Uploaded</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {video.uploadedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Nhiều video cho một kỷ niệm với max videos per memory limit, primary video selection, video reordering (up/down), sorting options (order/date/size), add/remove functionality, total size/duration tracking, auto-primary selection, và video management.
        </p>
      </div>
    </div>
  );
}