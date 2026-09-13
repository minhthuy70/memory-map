'use client';

import { useState, useEffect } from 'react';
import { WifiOff, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Database, HardDrive, Cloud, CloudOff, Download, Upload, Clock, Trash2, AlertCircle } from 'lucide-react';

interface OfflineData {
  id: string;
  type: 'memory' | 'location' | 'settings' | 'media';
  name: string;
  size: string;
  lastSynced: Date;
  status: 'synced' | 'pending' | 'conflict';
  localVersion: number;
  serverVersion: number;
}

interface SyncQueueItem {
  id: string;
  type: 'upload' | 'download';
  dataType: string;
  size: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  timestamp: Date;
}

interface OfflineModeProps {
  onCancel?: () => void;
  onSyncNow?: () => Promise<void>;
  onClearCache?: () => Promise<void>;
}

const DEFAULT_OFFLINE_DATA: OfflineData[] = [
  {
    id: 'data-1',
    type: 'memory',
    name: 'My Memories',
    size: '25.5 MB',
    lastSynced: new Date(),
    status: 'synced',
    localVersion: 15,
    serverVersion: 15,
  },
  {
    id: 'data-2',
    type: 'location',
    name: 'Location History',
    size: '8.2 MB',
    lastSynced: new Date(Date.now() - 3600000),
    status: 'synced',
    localVersion: 42,
    serverVersion: 42,
  },
  {
    id: 'data-3',
    type: 'settings',
    name: 'User Settings',
    size: '0.5 MB',
    lastSynced: new Date(Date.now() - 86400000),
    status: 'pending',
    localVersion: 8,
    serverVersion: 9,
  },
  {
    id: 'data-4',
    type: 'media',
    name: 'Cached Images',
    size: '125.3 MB',
    lastSynced: new Date(Date.now() - 7200000),
    status: 'synced',
    localVersion: 234,
    serverVersion: 234,
  },
];

const DEFAULT_SYNC_QUEUE: SyncQueueItem[] = [
  {
    id: 'sync-1',
    type: 'upload',
    dataType: 'New Memory',
    size: '2.5 MB',
    status: 'pending',
    timestamp: new Date(),
  },
  {
    id: 'sync-2',
    type: 'download',
    dataType: 'Location Updates',
    size: '1.2 MB',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000),
  },
];

export default function OfflineMode({ onCancel, onSyncNow, onClearCache }: OfflineModeProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData[]>(DEFAULT_OFFLINE_DATA);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(DEFAULT_SYNC_QUEUE);
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [cacheSize, setCacheSize] = useState(500);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    if (onSyncNow) {
      await onSyncNow();
    } else {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    setIsSyncing(false);
    setOfflineData(prev => prev.map(d => 
      d.status === 'pending' ? { ...d, status: 'synced' as const, localVersion: d.serverVersion } : d
    ));
    setSyncQueue(prev => prev.map(s => 
      s.status === 'pending' ? { ...s, status: 'completed' as const } : s
    ));
  };

  const handleClearCache = async () => {
    if (onClearCache) {
      await onClearCache();
    }
    setOfflineData(prev => prev.filter(d => d.type !== 'media'));
  };

  const getStatusColor = (status: OfflineData['status']) => {
    switch (status) {
      case 'synced':
        return 'text-green-500';
      case 'pending':
        return 'text-amber-500';
      case 'conflict':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getSyncStatusColor = (status: SyncQueueItem['status']) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
      case 'syncing':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const totalCacheSize = offlineData.reduce((sum, d) => sum + parseFloat(d.size), 0);
  const pendingSyncs = syncQueue.filter(s => s.status === 'pending').length;
  const conflicts = offlineData.filter(d => d.status === 'conflict').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-br ${isOnline ? 'from-green-400 to-emerald-500' : 'from-orange-400 to-amber-500'} rounded-xl`}>
            {isOnline ? <Cloud className="h-5 w-5 text-white" /> : <CloudOff className="h-5 w-5 text-white" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chế độ offline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isOnline ? 'Online' : 'Offline'} • {totalCacheSize.toFixed(1)} MB cached
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
            Cài đặt offline
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-sync when online
              </span>
              <button
                type="button"
                onClick={() => setAutoSync(!autoSync)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSync ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Max cache size: {cacheSize} MB
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                value={cacheSize}
                onChange={(e) => setCacheSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Prefetch memories
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
            <HardDrive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Cache Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalCacheSize.toFixed(1)} MB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Offline Data</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {offlineData.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCw className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Pending Sync</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {pendingSyncs}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Conflicts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {conflicts}
          </div>
        </div>
      </div>

      {/* Sync Button */}
      {!isOnline && (
        <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-xs text-orange-700 dark:text-orange-400 mb-2">
            <strong>Offline mode:</strong> App đang chạy trong chế độ offline
          </p>
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Đang sync...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Sync khi có kết nối
              </>
            )}
          </button>
        </div>
      )}

      {/* Offline Data */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Dữ liệu offline
        </h4>
        <div className="space-y-2">
          {offlineData.map((data) => (
            <div
              key={data.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {data.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(data.status)}`}>
                    {data.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {data.size}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Local v</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {data.localVersion}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Server v</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {data.serverVersion}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Sync</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {new Date(data.lastSynced).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              {data.status === 'conflict' && (
                <div className="flex items-center gap-2 text-[10px] text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Version conflict detected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sync Queue */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Sync Queue
        </h4>
        <div className="space-y-2">
          {syncQueue.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {item.type === 'upload' ? <Upload className="h-4 w-4 text-slate-500" /> : <Download className="h-4 w-4 text-slate-500" />}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {item.dataType}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getSyncStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.size}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(item.timestamp).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Cache */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleClearCache}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Xóa cache
        </button>
      </div>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Chế độ offline sử dụng IndexedDB và Service Worker để cache dữ liệu, sync queue, và conflict resolution.
        </p>
      </div>
    </div>
  );
}