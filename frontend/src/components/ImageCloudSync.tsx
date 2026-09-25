'use client';

import { useState } from 'react';
import { Cloud, Upload, Download, CheckCircle, XCircle, AlertCircle, Settings, RefreshCw, Image as ImageIcon, HardDrive } from 'lucide-react';

interface CloudSyncProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  storageUsed: number;
  storageTotal: number;
}

interface ImageCloudSyncProps {
  providers?: CloudSyncProvider[];
  onSyncImages?: (providerId: string) => Promise<void>;
  onConnectProvider?: (providerId: string) => Promise<void>;
  onDisconnectProvider?: (providerId: string) => Promise<void>;
  onDownloadImages?: (providerId: string) => Promise<void>;
  isSyncing?: boolean;
  isDownloading?: boolean;
  currentProvider?: string;
}

const DEFAULT_PROVIDERS: CloudSyncProvider[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    icon: <HardDrive className="h-4 w-4" />,
    connected: false,
    storageUsed: 0,
    storageTotal: 15 * 1024 * 1024 * 1024, // 15GB
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: <HardDrive className="h-4 w-4" />,
    connected: false,
    storageUsed: 0,
    storageTotal: 2 * 1024 * 1024 * 1024, // 2GB
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: <HardDrive className="h-4 w-4" />,
    connected: false,
    storageUsed: 0,
    storageTotal: 5 * 1024 * 1024 * 1024, // 5GB
  },
];

export default function ImageCloudSync({
  providers = DEFAULT_PROVIDERS,
  onSyncImages,
  onConnectProvider,
  onDisconnectProvider,
  onDownloadImages,
  isSyncing = false,
  isDownloading = false,
  currentProvider,
}: ImageCloudSyncProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [syncQuality, setSyncQuality] = useState('original');
  const [syncOnWifi, setSyncOnWifi] = useState(true);

  const handleSync = async (providerId: string) => {
    if (onSyncImages) {
      await onSyncImages(providerId);
    }
  };

  const handleConnect = async (providerId: string) => {
    if (onConnectProvider) {
      await onConnectProvider(providerId);
    }
  };

  const handleDisconnect = async (providerId: string) => {
    if (onDisconnectProvider) {
      await onDisconnectProvider(providerId);
    }
  };

  const handleDownload = async (providerId: string) => {
    if (onDownloadImages) {
      await onDownloadImages(providerId);
    }
  };

  const formatStorage = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' GB';
  };

  const getStoragePercentage = (used: number, total: number) => {
    return ((used / total) * 100).toFixed(1);
  };

  const totalImages = providers.reduce((sum, p) => sum + Math.floor(p.storageUsed / (2 * 1024 * 1024)), 0); // Assuming 2MB per image

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Cloud className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Đồng bộ ảnh đám mây
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalImages} ảnh • {providers.filter(p => p.connected).length} dịch vụ đã kết nối
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
            <Settings className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Tự động đồng bộ ảnh
            </label>
            <button
              type="button"
              onClick={() => setAutoSync(!autoSync)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                autoSync ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  autoSync ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Chất lượng đồng bộ
            </label>
            <select
              value={syncQuality}
              onChange={(e) => setSyncQuality(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            >
              <option value="original">Gốc (Original)</option>
              <option value="high">Cao (High)</option>
              <option value="medium">Trung bình (Medium)</option>
              <option value="low">Thấp (Low)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Chỉ đồng bộ qua WiFi
            </label>
            <button
              type="button"
              onClick={() => setSyncOnWifi(!syncOnWifi)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                syncOnWifi ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  syncOnWifi ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Providers */}
      <div className="space-y-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`p-4 rounded-xl border-2 transition-all ${
              provider.connected
                ? 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-300 dark:border-cyan-700'
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${
                provider.connected
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
                  : 'bg-slate-200 dark:bg-slate-600'
              }`}>
                {provider.connected ? (
                  <div className="text-white">
                    {provider.icon}
                  </div>
                ) : (
                  <div className="text-slate-400">
                    {provider.icon}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className={`font-semibold ${
                      provider.connected
                        ? 'text-cyan-900 dark:text-cyan-100'
                        : 'text-slate-700 dark:text-slate-300'
                    } text-sm`}>
                      {provider.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {provider.connected ? 'Đã kết nối' : 'Chưa kết nối'}
                    </p>
                  </div>
                  {provider.connected && (
                    <button
                      type="button"
                      onClick={() => handleDisconnect(provider.id)}
                      className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Ngắt kết nối
                    </button>
                  )}
                </div>

                {provider.connected && (
                  <>
                    {/* Storage Info */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-600 dark:text-slate-400">
                          Dung lượng đã dùng
                        </span>
                        <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                          {formatStorage(provider.storageUsed)} / {formatStorage(provider.storageTotal)}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                          style={{ width: `${getStoragePercentage(provider.storageUsed, provider.storageTotal)}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSync(provider.id)}
                        disabled={isSyncing && currentProvider === provider.id}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        {isSyncing && currentProvider === provider.id ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Đang đồng bộ...
                          </>
                        ) : (
                          <>
                            <Upload className="h-3 w-3" />
                            Đồng bộ lên
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownload(provider.id)}
                        disabled={isDownloading && currentProvider === provider.id}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                      >
                        {isDownloading && currentProvider === provider.id ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            Đang tải...
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3" />
                            Tải xuống
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {!provider.connected && (
                  <button
                    type="button"
                    onClick={() => handleConnect(provider.id)}
                    className="w-full px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Kết nối {provider.name}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
        <p className="text-[10px] text-cyan-700 dark:text-cyan-400">
          <strong>Lưu ý:</strong> Đồng bộ ảnh đám mây sẽ tự động sao lưu các ảnh từ kỷ niệm của bạn 
          lên các dịch vụ lưu trữ đám mây. Bạn có thể truy cập ảnh từ bất cứ đâu.
        </p>
      </div>
    </div>
  );
}