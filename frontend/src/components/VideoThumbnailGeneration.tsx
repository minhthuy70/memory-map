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
  Crop,
  Download,
  Eye,
  Filter,
  Grid,
  Image,
  ImageIcon,
  Layers,
  Maximize2,
  Pause,
  Play,
  RefreshCw,
  Settings,
  SettingsIcon,
  Sliders,
  Sparkles,
  Trash2,
  Video,
  Zap,
  ZapIcon
} from 'lucide-react';

interface Thumbnail {
  id: string;
  videoId: string;
  thumbnailUrl: string;
  timestamp: number;
  generatedAt: Date;
  isDefault: boolean;
}

interface ThumbnailGenerationJob {
  id: string;
  videoId: string;
  videoName: string;
  duration: number;
  thumbnails: Thumbnail[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  selectedCount: number;
  autoGenerate: boolean;
}

interface VideoThumbnailGenerationProps {
  onCancel?: () => void;
  onGenerateThumbnails?: (videoId: string, count: number) => Promise<void>;
  onSelectThumbnail?: (thumbnailId: string) => Promise<void>;
}

const DEFAULT_JOBS: ThumbnailGenerationJob[] = [
  {
    id: 'job-1',
    videoId: 'video-1',
    videoName: 'family-vacation.mp4',
    duration: 120,
    thumbnails: [
      {
        id: 'thumb-1',
        videoId: 'video-1',
        thumbnailUrl: '/thumb-1.jpg',
        timestamp: 0,
        generatedAt: new Date('2024-01-12'),
        isDefault: true,
      },
      {
        id: 'thumb-2',
        videoId: 'video-1',
        thumbnailUrl: '/thumb-2.jpg',
        timestamp: 30,
        generatedAt: new Date('2024-01-12'),
        isDefault: false,
      },
      {
        id: 'thumb-3',
        videoId: 'video-1',
        thumbnailUrl: '/thumb-3.jpg',
        timestamp: 60,
        generatedAt: new Date('2024-01-12'),
        isDefault: false,
      },
    ],
    status: 'completed',
    progress: 100,
    selectedCount: 1,
    autoGenerate: true,
  },
];

export default function VideoThumbnailGeneration({ onCancel, onGenerateThumbnails, onSelectThumbnail }: VideoThumbnailGenerationProps) {
  const [jobs, setJobs] = useState<ThumbnailGenerationJob[]>(DEFAULT_JOBS);
  const [showSettings, setShowSettings] = useState(false);
  const [thumbnailCount, setThumbnailCount] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [thumbnailQuality, setThumbnailQuality] = useState('high');

  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const totalThumbnails = jobs.reduce((sum, j) => sum + j.thumbnails.length, 0);
  const avgThumbnails = totalThumbnails / totalJobs;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerate = async (videoId: string) => {
    setIsGenerating(true);
    await onGenerateThumbnails?.(videoId, thumbnailCount);
    setIsGenerating(false);
  };

  const handleSelect = async (thumbnailId: string) => {
    await onSelectThumbnail?.(thumbnailId);
    setJobs(jobs.map(j => ({
      ...j,
      thumbnails: j.thumbnails.map(t => 
        t.id === thumbnailId ? { ...t, isDefault: true } : { ...t, isDefault: false }
      )
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
      case 'processing':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Activity className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Video className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tạo thumbnail video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalThumbnails} thumbnails generated
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
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt thumbnail generation
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Thumbnail count: {thumbnailCount}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={thumbnailCount}
                onChange={(e) => setThumbnailCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-generate on upload
              </span>
              <button
                type="button"
                onClick={() => setAutoGenerate(!autoGenerate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoGenerate ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoGenerate ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Thumbnail quality
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">{thumbnailQuality}</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Grid className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Videos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalJobs}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Thumbnails</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalThumbnails}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg/Video</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgThumbnails.toFixed(1)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedJobs}
          </div>
        </div>
      </div>

      {/* Thumbnail Jobs */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Thumbnail Generation Jobs
        </h4>
        <div className="space-y-2">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(job.status)}`}>
                    {getStatusIcon(job.status)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {job.videoName}
                    </span>
                    <div className={`text-xs ${getStatusColor(job.status)} capitalize`}>
                      {job.status}
                    </div>
                  </div>
                </div>
                {job.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleGenerate(job.videoId)}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-3 py-2 bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 text-pink-600 dark:text-pink-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </button>
                )}
              </div>

              {job.status === 'processing' && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {job.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 transition-all"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(job.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Thumbnails</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {job.thumbnails.length}
                  </div>
                </div>
              </div>

              {/* Thumbnails Grid */}
              <div className="grid grid-cols-5 gap-2">
                {job.thumbnails.map((thumbnail) => (
                  <div
                    key={thumbnail.id}
                    className={`relative p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      thumbnail.isDefault
                        ? 'border-pink-400 dark:border-pink-600 bg-pink-50 dark:bg-pink-950/30'
                        : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 hover:border-pink-300 dark:hover:border-pink-700'
                    }`}
                    onClick={() => handleSelect(thumbnail.id)}
                  >
                    <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded flex items-center justify-center mb-1">
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
                      {formatDuration(thumbnail.timestamp)}
                    </div>
                    {thumbnail.isDefault && (
                      <div className="absolute top-1 right-1">
                        <Check className="h-3 w-3 text-pink-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Tự động tạo thumbnail từ video với configurable thumbnail count (1-10), auto-generate on upload, thumbnail quality settings, timestamp-based thumbnail selection, multiple thumbnails per video, progress tracking, default thumbnail selection, và job history.
        </p>
      </div>
    </div>
  );
}