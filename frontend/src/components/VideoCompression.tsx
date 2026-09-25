'use client';

import { useState } from 'react';
import { Video, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, FileVideo, Settings as SettingsIcon, Eye, HardDrive, Zap as ZapIcon, Minimize2, Scale, Sliders, RefreshCw, Check } from 'lucide-react';

interface CompressionProfile {
  id: string;
  name: string;
  targetSize: number;
  quality: 'low' | 'medium' | 'high';
  format: string;
  description: string;
}

interface CompressionJob {
  id: string;
  originalSize: number;
  compressedSize: number;
  originalFormat: string;
  compressedFormat: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  duration: number;
  startedAt: Date;
  completedAt: Date | null;
  profile: string;
}

interface VideoCompressionProps {
  onCancel?: () => void;
  onCompress?: (fileId: string, profile: string) => Promise<void>;
}

const DEFAULT_PROFILES: CompressionProfile[] = [
  {
    id: 'profile-1',
    name: 'High Quality',
    targetSize: 80,
    quality: 'high',
    format: 'mp4',
    description: '80% of original size, HD quality',
  },
  {
    id: 'profile-2',
    name: 'Medium Quality',
    targetSize: 50,
    quality: 'medium',
    format: 'mp4',
    description: '50% of original size, SD quality',
  },
  {
    id: 'profile-3',
    name: 'Low Quality',
    targetSize: 30,
    quality: 'low',
    format: 'mp4',
    description: '30% of original size, Web quality',
  },
];

const DEFAULT_JOBS: CompressionJob[] = [
  {
    id: 'job-1',
    originalSize: 50000000,
    compressedSize: 35000000,
    originalFormat: 'mov',
    compressedFormat: 'mp4',
    fileName: 'family-vacation.mov',
    status: 'completed',
    progress: 100,
    duration: 120,
    startedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
    profile: 'profile-1',
  },
];

export default function VideoCompression({ onCancel, onCompress }: VideoCompressionProps) {
  const [jobs, setJobs] = useState<CompressionJob[]>(DEFAULT_JOBS);
  const [profiles, setProfiles] = useState<CompressionProfile[]>(DEFAULT_PROFILES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('profile-1');
  const [isCompressing, setIsCompressing] = useState(false);
  const [autoCompress, setAutoCompress] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('mp4');

  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  const totalOriginalSize = jobs.reduce((sum, j) => sum + j.originalSize, 0);
  const totalCompressedSize = jobs.reduce((sum, j) => sum + j.compressedSize, 0);
  const avgCompressionRatio = totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100) : 0;

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
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

  const handleCompress = async (jobId: string) => {
    setIsCompressing(true);
    await onCompress?.(jobId, selectedProfile);
    setIsCompressing(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Minimize2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nén video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedJobs}/{totalJobs} compressed
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt video compression
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-compress on upload
              </span>
              <button
                type="button"
                onClick={() => setAutoCompress(!autoCompress)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoCompress ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoCompress ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Target format
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">MP4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Hardware acceleration
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Jobs</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalJobs}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Saved</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgCompressionRatio.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ZapIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Original</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalOriginalSize / 1048576).toFixed(1)}MB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Minimize2 className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Compressed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalCompressedSize / 1048576).toFixed(1)}MB
          </div>
        </div>
      </div>

      {/* Compression Profiles */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Compression Profiles
        </h4>
        <div className="space-y-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`p-4 rounded-lg border-2 ${
                selectedProfile === profile.id
                  ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getQualityColor(profile.quality)}`}>
                    <Sliders className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {profile.name}
                    </span>
                    <div className={`text-xs ${getQualityColor(profile.quality)} capitalize`}>
                      {profile.quality}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {profile.targetSize}%
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {profile.description}
              </p>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Target: {profile.format.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compression Jobs */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Compression Jobs
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
                      {job.fileName}
                    </span>
                    <div className={`text-xs ${getStatusColor(job.status)} capitalize`}>
                      {job.status}
                    </div>
                  </div>
                </div>
                {job.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => handleCompress(job.id)}
                    disabled={isCompressing}
                    className="flex items-center gap-2 px-3 py-2 bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-600 dark:text-teal-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`h-3 w-3 ${isCompressing ? 'animate-spin' : ''}`} />
                    {isCompressing ? 'Compressing...' : 'Compress'}
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
                      className="h-full bg-teal-500 transition-all"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Original</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(job.originalSize)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Compressed</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(job.compressedSize)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Format</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 uppercase">
                    {job.originalFormat} → {job.compressedFormat}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Savings</div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    {((1 - job.compressedSize / job.originalSize) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Started: {job.startedAt.toLocaleDateString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Nén video tự động trước khi upload với compression profiles (High/Medium/Low quality), target size settings, format conversion (MOV→MP4, etc.), compression progress tracking, original/compressed size comparison, savings percentage calculation, auto-compress on upload, và job history.
        </p>
      </div>
    </div>
  );
}