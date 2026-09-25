'use client';

import { useState } from 'react';
import { Video, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Scissors, PlayCircle, RefreshCw, Check, Zap as ZapIcon, SkipBack, SkipForward, Maximize2, Crop, RotateCw, FileVideo, Save, Undo, Redo } from 'lucide-react';

interface TrimSegment {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
}

interface TrimJob {
  id: string;
  videoId: string;
  videoName: string;
  originalDuration: number;
  trimmedDuration: number;
  segments: TrimSegment[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt: Date | null;
}

interface InAppVideoTrimmingProps {
  onCancel?: () => void;
  onTrim?: (videoId: string, segments: TrimSegment[]) => Promise<void>;
  onPreview?: (startTime: number, endTime: number) => Promise<void>;
}

const DEFAULT_JOBS: TrimJob[] = [
  {
    id: 'job-1',
    videoId: 'video-1',
    videoName: 'family-vacation.mp4',
    originalDuration: 120,
    trimmedDuration: 60,
    segments: [
      {
        id: 'seg-1',
        startTime: 10,
        endTime: 70,
        duration: 60,
      },
    ],
    status: 'completed',
    progress: 100,
    startedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
  },
];

export default function InAppVideoTrimming({ onCancel, onTrim, onPreview }: InAppVideoTrimmingProps) {
  const [jobs, setJobs] = useState<TrimJob[]>(DEFAULT_JOBS);
  const [showSettings, setShowSettings] = useState(false);
  const [currentJob, setCurrentJob] = useState<TrimJob | null>(DEFAULT_JOBS[0]);
  const [trimStart, setTrimStart] = useState(10);
  const [trimEnd, setTrimEnd] = useState(70);
  const [currentTime, setCurrentTime] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [precisionMode, setPrecisionMode] = useState<'frame' | 'second'>('second');
  const [autoSave, setAutoSave] = useState(true);

  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const avgTrimTime = jobs
    .filter(j => j.completedAt)
    .reduce((sum, j) => sum + (j.completedAt!.getTime() - j.startedAt.getTime()) / 1000, 0) / completedJobs;
  const avgDurationReduction = jobs.reduce((sum, j) => sum + (1 - j.trimmedDuration / j.originalDuration), 0) / totalJobs;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimecode = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = precisionMode === 'frame' ? Math.floor((seconds % 1) * 30) : 0;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}${frames > 0 ? `:${frames.toString().padStart(2, '0')}` : ''}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}${frames > 0 ? `:${frames.toString().padStart(2, '0')}` : ''}`;
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
        return <Scissors className="h-4 w-4" />;
    }
  };

  const handleTrim = async () => {
    if (currentJob) {
      setIsTrimming(true);
      const newSegment: TrimSegment = {
        id: `seg-${Date.now()}`,
        startTime: trimStart,
        endTime: trimEnd,
        duration: trimEnd - trimStart,
      };
      await onTrim?.(currentJob.videoId, [newSegment]);
      setIsTrimming(false);
    }
  };

  const handlePreview = async () => {
    await onPreview?.(trimStart, trimEnd);
  };

  const setBothTimes = (start: number, end: number) => {
    setTrimStart(start);
    setTrimEnd(end);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Cắt video trong app
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedJobs}/{totalJobs} trimmed
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
        <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt video trimming
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Precision mode
              </span>
              <button
                type="button"
                onClick={() => setPrecisionMode(precisionMode === 'frame' ? 'second' : 'frame')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  precisionMode === 'frame'
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                }`}
              >
                {precisionMode === 'frame' ? 'Frame' : 'Second'}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-save trim
              </span>
              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSave ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSave ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Preserve quality
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
            <Scissors className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Jobs</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalJobs}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgTrimTime.toFixed(0)}s
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Crop className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Reduction</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgDurationReduction * 100).toFixed(0)}%
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

      {/* Trim Interface */}
      {currentJob && (
        <div className="mb-4">
          <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="h-16 w-16 text-slate-600" />
            </div>

            {/* Trim Handles */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="relative mb-3">
                <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all"
                    style={{ 
                      width: `${((trimEnd - trimStart) / currentJob.originalDuration) * 100}%`,
                      marginLeft: `${(trimStart / currentJob.originalDuration) * 100}%`
                    }}
                  />
                </div>
                {/* Trim Handles */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-rose-500 rounded-full cursor-pointer border-2 border-white"
                  style={{ left: `${(trimStart / currentJob.originalDuration) * 100}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-rose-500 rounded-full cursor-pointer border-2 border-white"
                  style={{ left: `${(trimEnd / currentJob.originalDuration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-white text-xs">
                <span>{formatTimecode(trimStart)}</span>
                <span>Trimmed: {formatDuration(trimEnd - trimStart)}</span>
                <span>{formatTimecode(trimEnd)}</span>
              </div>
            </div>
          </div>

          {/* Trim Controls */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Start Time
              </label>
              <input
                type="text"
                value={formatTimecode(trimStart)}
                onChange={(e) => {
                  const parts = e.target.value.split(':').map(Number);
                  const newStart = parts.length >= 2 ? parts[0] * 60 + parts[1] : 0;
                  if (newStart < trimEnd) setTrimStart(newStart);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                End Time
              </label>
              <input
                type="text"
                value={formatTimecode(trimEnd)}
                onChange={(e) => {
                  const parts = e.target.value.split(':').map(Number);
                  const newEnd = parts.length >= 2 ? parts[0] * 60 + parts[1] : 0;
                  if (newEnd > trimStart) setTrimEnd(newEnd);
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Quick Trim Options */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              type="button"
              onClick={() => setBothTimes(0, currentJob.originalDuration)}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setBothTimes(0, currentJob.originalDuration / 2)}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              First Half
            </button>
            <button
              type="button"
              onClick={() => setBothTimes(currentJob.originalDuration / 2, currentJob.originalDuration)}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Second Half
            </button>
            <button
              type="button"
              onClick={() => setBothTimes(currentJob.originalDuration * 0.25, currentJob.originalDuration * 0.75)}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Middle 50%
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePreview}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
            >
              <PlayCircle className="h-4 w-4" />
              Preview
            </button>
            <button
              type="button"
              onClick={handleTrim}
              disabled={isTrimming}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              <Scissors className="h-4 w-4" />
              {isTrimming ? 'Trimming...' : 'Trim Video'}
            </button>
          </div>
        </div>
      )}

      {/* Trim Jobs */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Trim Jobs
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
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Original</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(job.originalDuration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Trimmed</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(job.trimmedDuration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Saved</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {((1 - job.trimmedDuration / job.originalDuration) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg">
        <p className="text-[10px] text-rose-700 dark:text-rose-400">
          <strong>Lưu ý:</strong> Cắt video trực tiếp trong app với visual trim timeline, drag handles for start/end time, timecode input (frame/second precision), quick trim options (reset/first half/second half/middle 50%), preview functionality, trim job tracking, duration reduction calculation, auto-save trim, và preserve quality.
        </p>
      </div>
    </div>
  );
}