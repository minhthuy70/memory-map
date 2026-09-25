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
  Cloud,
  Copy,
  Database,
  Download,
  Eye,
  Filter,
  Gauge,
  HardDrive,
  Link,
  Pause,
  Play,
  RefreshCw,
  Settings,
  SettingsIcon,
  Shield,
  Trash2,
  Upload,
  Video,
  Zap,
  ZapIcon
} from 'lucide-react';

interface StorageProvider {
  id: string;
  name: string;
  type: 's3' | 'gcs' | 'azure' | 'custom';
  status: 'connected' | 'disconnected' | 'error';
  usedSpace: number;
  totalSpace: number;
  region: string;
  endpoint: string;
}

interface StoredVideo {
  id: string;
  videoId: string;
  fileName: string;
  size: number;
  storageProvider: string;
  storagePath: string;
  uploadedAt: Date;
  cdnUrl: string;
  isEncrypted: boolean;
}

interface VideoCloudStorageProps {
  onCancel?: () => void;
  onUploadToStorage?: (videoId: string, provider: string) => Promise<void>;
  onSync?: (provider: string) => Promise<void>;
}

const DEFAULT_PROVIDERS: StorageProvider[] = [
  {
    id: 'provider-1',
    name: 'AWS S3',
    type: 's3',
    status: 'connected',
    usedSpace: 50000000000,
    totalSpace: 100000000000,
    region: 'us-east-1',
    endpoint: 's3.amazonaws.com',
  },
  {
    id: 'provider-2',
    name: 'Google Cloud Storage',
    type: 'gcs',
    status: 'connected',
    usedSpace: 30000000000,
    totalSpace: 50000000000,
    region: 'us-central1',
    endpoint: 'storage.googleapis.com',
  },
];

const DEFAULT_VIDEOS: StoredVideo[] = [
  {
    id: 'sv-1',
    videoId: 'video-1',
    fileName: 'family-vacation.mp4',
    size: 25000000,
    storageProvider: 'provider-1',
    storagePath: 'memories/2024/01/video-1.mp4',
    uploadedAt: new Date('2024-01-12'),
    cdnUrl: 'https://cdn.example.com/video-1.mp4',
    isEncrypted: true,
  },
];

export default function VideoCloudStorage({ onCancel, onUploadToStorage, onSync }: VideoCloudStorageProps) {
  const [providers, setProviders] = useState<StorageProvider[]>(DEFAULT_PROVIDERS);
  const [videos, setVideos] = useState<StoredVideo[]>(DEFAULT_VIDEOS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('provider-1');
  const [isUploading, setIsUploading] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  const totalProviders = providers.length;
  const connectedProviders = providers.filter(p => p.status === 'connected').length;
  const totalUsedSpace = providers.reduce((sum, p) => sum + p.usedSpace, 0);
  const totalSpace = providers.reduce((sum, p) => sum + p.totalSpace, 0);
  const storageUsage = (totalUsedSpace / totalSpace) * 100;

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB';
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4" />;
      case 'disconnected':
        return <Clock className="h-4 w-4" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <HardDrive className="h-4 w-4" />;
    }
  };

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 's3':
        return <Database className="h-4 w-4" />;
      case 'gcs':
        return <Cloud className="h-4 w-4" />;
      case 'azure':
        return <Database className="h-4 w-4" />;
      default:
        return <HardDrive className="h-4 w-4" />;
    }
  };

  const handleUpload = async (videoId: string) => {
    setIsUploading(true);
    await onUploadToStorage?.(videoId, selectedProvider);
    setIsUploading(false);
  };

  const handleSync = async (providerId: string) => {
    await onSync?.(providerId);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Lưu trữ video trên Cloud
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {connectedProviders}/{totalProviders} connected
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt cloud storage
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-sync on upload
              </span>
              <button
                type="button"
                onClick={() => setAutoSync(!autoSync)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSync ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSync ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Encryption at rest
              </span>
              <button
                type="button"
                onClick={() => setEncryptionEnabled(!encryptionEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  encryptionEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    encryptionEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                CDN integration
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
            <Cloud className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Providers</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalProviders}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Used</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {storageUsage.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Storage</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalSpace / 1073741824).toFixed(0)}GB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Encryption</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {encryptionEnabled ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Storage Providers */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Storage Providers
        </h4>
        <div className="space-y-2">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(provider.status)}`}>
                    {getProviderIcon(provider.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {provider.name}
                    </span>
                    <div className={`text-xs ${getStatusColor(provider.status)} capitalize`}>
                      {provider.status}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSync(provider.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  RefreshCcw
                </button>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatFileSize(provider.usedSpace)} / {formatFileSize(provider.totalSpace)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {((provider.usedSpace / provider.totalSpace) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(provider.usedSpace / provider.totalSpace) * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Region</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.region}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Endpoint</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {provider.endpoint}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stored Videos */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Stored Videos
        </h4>
        <div className="space-y-2">
          {videos.map((video) => (
            <div
              key={video.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Video className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {video.fileName}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatFileSize(video.size)}
                    </div>
                  </div>
                </div>
                {video.isEncrypted && (
                  <Shield className="h-4 w-4 text-green-500" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Storage Path</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {video.storagePath}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Uploaded</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {video.uploadedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(video.cdnUrl)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  Copy URL
                </button>
                <button
                  type="button"
                  onClick={() => window.open(video.cdnUrl, '_blank')}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Lưu video trên S3/Google Cloud Storage với multi-provider support (AWS S3/GCS/Azure/Custom), storage usage tracking, encryption at rest, CDN integration, auto-sync on upload, provider status monitoring, sync functionality, URL copy, và storage path management.
        </p>
      </div>
    </div>
  );
}