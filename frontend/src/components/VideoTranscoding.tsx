'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  as,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Download,
  FileVideo,
  Filter,
  Gauge,
  HardDrive,
  Layers,
  Pause,
  Play,
  RefreshCw,
  Settings,
  SettingsIcon,
  Shuffle,
  Sliders,
  Trash2,
  Video,
  VideoIcon,
  Zap,
  ZapIcon
} from 'lucide-react';

interface TranscodeFormat {
  id: string;
  name: string;
  extension: string;
  codec: string;
  isDefault: boolean;
}

interface TranscodeJob {
  id: string;
  videoId: string;
  videoName: string;
  sourceFormat: string;
  targetFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  originalSize: number;
  transcodedSize: number;
  duration: number;
  startedAt: Date;
  completedAt: Date | null;
  quality: 'high' | 'medium' | 'low';
}

interface VideoTranscodingProps {
  onCancel?: () => void;
  onTranscode?: (videoId: string, targetFormat: string, quality: string) => Promise<void>;
}

const DEFAULT_FORMATS: TranscodeFormat[] = [
  {
    id: 'format-1',
    name: 'MP4',
    extension: 'mp4',
    codec: 'H.264',
    isDefault: true,
  },
  {
    id: 'format-2',
    name: 'WebM',
    extension: 'webm',
    codec: 'VP9',
    isDefault: false,
  },
  {
    id: 'format-3',
    name: 'MOV',
    extension: 'mov',
    codec: 'H.264',
    isDefault: false,
  },
  {
    id: 'format-4',
    name: 'AVI',
    extension: 'avi',
    codec: 'XviD',
    isDefault: false,
  },
];

const DEFAULT_JOBS: TranscodeJob[] = [
  {
    id: 'job-1',
    videoId: 'video-1',
    videoName: 'family-vacation.mov',
    sourceFormat: 'mov',
    targetFormat: 'mp4',
    status: 'completed',
    progress: 100,
    originalSize: 50000000,
    transcodedSize: 35000000,
    duration: 120,
    startedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
    quality: 'high',
  },
];

export default function VideoTranscoding({ onCancel, onTranscode }: VideoTranscodingProps) {
  const [jobs, setJobs] = useState<TranscodeJob[]>(DEFAULT_JOBS);
  const [formats, setFormats] = useState<TranscodeFormat[]>(DEFAULT_FORMATS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('format-1');
  const [selectedQuality, setSelectedQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [isTranscoding, setIsTranscoding] = useState(false);
  const [autoTranscode, setAutoTranscode] = useState(true);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);

  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const avgTranscodeTime = jobs
    .filter(j => j.completedAt)
    .reduce((sum, j) => sum + (j.completedAt!.getTime() - j.startedAt.getTime()) / 1000, 0) / completedJobs;
  const avgSizeReduction = jobs.reduce((sum, j) => sum + (1 - j.transcodedSize / j.originalSize), 0) / totalJobs;

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        return <VideoIcon className="h-4 w-4" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high':
        return 'text-green-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-slate-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleTranscode = async (videoId: string) => {
    setIsTranscoding(true);
    await onTranscode?.(videoId, selectedFormat, selectedQuality);
    setIsTranscoding(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <Shuffle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chuyển đổi định dạng video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedJobs}/{totalJobs} transcoded
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
            Cài đặt transcoding
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
                  autoTranscode ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Hardware acceleration
              </span>
              <button
                type="button"
                onClick={() => setHardwareAcceleration(!hardwareAcceleration)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  hardwareAcceleration ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    hardwareAcceleration ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Multi-thread processing
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
            <Shuffle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Jobs</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalJobs}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgTranscodeTime.toFixed(0)}s
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Size Reduction</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgSizeReduction * 100).toFixed(0)}%
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

      {/* Format Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Target Format
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {formats.map((format) => (
            <button
              key={format.id}
              type="button"
              onClick={() => setSelectedFormat(format.id)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedFormat === format.id
                  ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-violet-300 dark:hover:border-violet-700'
              }`}
            >
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {format.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {format.codec}
              </div>
              {format.isDefault && (
                <span className="text-[10px] text-violet-500">Default</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Gauge Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Gauge Level
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {(['high', 'medium', 'low'] as const).map((quality) => (
            <button
              key={quality}
              type="button"
              onClick={() => setSelectedQuality(quality)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedQuality === quality
                  ? 'bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-violet-300 dark:hover:border-violet-700'
              }`}
            >
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                {quality}
              </div>
              <div className={`text-xs ${getQualityColor(quality)}`}>
                {quality === 'high' ? 'Original' : quality === 'medium' ? 'Balanced' : 'Compressed'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transcode Jobs */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Transcode Jobs
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
                    onClick={() => handleTranscode(job.videoId)}
                    disabled={isTranscoding}
                    className="flex items-center gap-2 px-3 py-2 bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-3 w-3 ${isTranscoding ? 'animate-spin' : ''}`} />
                    {isTranscoding ? 'Transcoding...' : 'Transcode'}
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
                      className="h-full bg-violet-500 transition-all"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {job.sourceFormat.toUpperCase()}
                </span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {job.targetFormat.toUpperCase()}
                </span>
                <span className={`text-xs ${getQualityColor(job.quality)} capitalize`}>
                  • {job.quality}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Original</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(job.originalSize)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Transcoded</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(job.transcodedSize)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(job.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Started</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {job.startedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 rounded-lg">
        <p className="text-[10px] text-violet-700 dark:text-violet-400">
          <strong>Lưu ý:</strong> Chuyển đổi định dạng video tự động (MP4/WebM/MOV/AVI) với codec selection (H.264/VP9/XviD), quality levels (High/Medium/Low), progress tracking, original/transcoded size comparison, transcode time tracking, auto-transcode on upload, hardware acceleration, và multi-thread processing.
        </p>
      </div>
    </div>
  );
}