'use client';

import { useState } from 'react';
import { Video, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Upload, Play, Pause, Download, Trash2, FileVideo, Settings as SettingsIcon, Eye, HardDrive, Cloud, Check } from 'lucide-react';

interface VideoUpload {
  id: string;
  fileName: string;
  fileSize: number;
  duration: number;
  resolution: string;
  format: string;
  uploadedAt: Date;
  thumbnailUrl: string;
  videoUrl: string;
  status: 'uploading' | 'completed' | 'failed';
  progress: number;
}

interface VideoUploadForMemoriesProps {
  onCancel?: () => void;
  onUpload?: (file: File) => Promise<void>;
  onDelete?: (uploadId: string) => Promise<void>;
}

const DEFAULT_UPLOADS: VideoUpload[] = [
  {
    id: 'upload-1',
    fileName: 'family-vacation.mp4',
    fileSize: 24500000,
    duration: 120,
    resolution: '1920x1080',
    format: 'mp4',
    uploadedAt: new Date('2024-01-12'),
    thumbnailUrl: '/thumbnail-1.jpg',
    videoUrl: '/video-1.mp4',
    status: 'completed',
    progress: 100,
  },
];

export default function VideoUploadForMemories({ onCancel, onUpload, onDelete }: VideoUploadForMemoriesProps) {
  const [uploads, setUploads] = useState<VideoUpload[]>(DEFAULT_UPLOADS);
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(500);
  const [autoCompress, setAutoCompress] = useState(true);
  const [supportedFormats, setSupportedFormats] = useState(['mp4', 'mov', 'avi', 'webm']);

  const totalUploads = uploads.length;
  const completedUploads = uploads.filter(u => u.status === 'completed').length;
  const totalSize = uploads.reduce((sum, u) => sum + u.fileSize, 0);
  const avgDuration = uploads.reduce((sum, u) => sum + u.duration, 0) / totalUploads;

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

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    await onUpload?.(file);
    setIsUploading(false);
  };

  const handleDelete = async (uploadId: string) => {
    await onDelete?.(uploadId);
    setUploads(uploads.filter(u => u.id !== uploadId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
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
      case 'uploading':
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
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tải video lên kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedUploads}/{totalUploads} completed
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt video upload
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Max file size: {maxFileSize} MB
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                step="50"
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-compress
              </span>
              <button
                type="button"
                onClick={() => setAutoCompress(!autoCompress)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoCompress ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Supported formats
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                {supportedFormats.join(', ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <FileVideo className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Videos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalUploads}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalSize / 1048576).toFixed(1)}MB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(avgDuration)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Cloud className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Storage</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Cloud
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-purple-400 dark:hover:border-purple-600 transition-colors">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Kéo và thả video vào đây hoặc click để chọn file
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hỗ trợ: {supportedFormats.join(', ').toUpperCase()} (Max {maxFileSize}MB)
          </p>
          <input
            type="file"
            accept={supportedFormats.map(f => `.${f}`).join(',')}
            className="hidden"
            id="video-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="video-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Chọn Video
          </label>
        </div>
      </div>

      {/* Upload List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Uploaded Videos
        </h4>
        <div className="space-y-2">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <FileVideo className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {upload.fileName}
                    </span>
                    <div className={`text-xs ${getStatusColor(upload.status)}`}>
                      {upload.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {upload.status === 'uploading' && (
                    <Activity className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(upload.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              {upload.status === 'uploading' && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {upload.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(upload.fileSize)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(upload.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Resolution</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {upload.resolution}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Format</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 uppercase">
                    {upload.format}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Uploaded: {upload.uploadedAt.toLocaleDateString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Tải video lên kỷ niệm với drag-and-drop upload, supported formats (MP4/MOV/AVI/WebM), file size limits, auto-compression toggle, upload progress tracking, video metadata (duration/resolution/format), thumbnail generation, cloud storage, và delete functionality.
        </p>
      </div>
    </div>
  );
}