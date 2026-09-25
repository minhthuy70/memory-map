import { AlertTriangle, BarChart3, CheckCircle, Clock, Cloud, Database, Download, HardDrive, Info, RefreshCw, Settings, Smartphone, Trash2, Upload, Wifi, WifiOff, X } from 'lucide-react';
'use client';

import { useState, useEffect } from 'react';


interface OfflineModeProps {
  onCancel?: () => void;
}

interface OfflineData {
  id: string;
  type: 'memory' | 'photo' | 'location' | 'settings';
  name: string;
  size: number;
  synced: boolean;
  lastModified: string;
}

export default function OfflineMode({ onCancel }: OfflineModeProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [showStorage, setShowStorage] = useState(false);

  const [offlineData, setOfflineData] = useState<OfflineData[]>([
    {
      id: '1',
      type: 'memory',
      name: 'Recent memories (last 30 days)',
      size: 25000000,
      synced: true,
      lastModified: '2026-09-14 10:30',
    },
    {
      id: '2',
      type: 'photo',
      name: 'Cached photos',
      size: 150000000,
      synced: true,
      lastModified: '2026-09-14 09:15',
    },
    {
      id: '3',
      type: 'location',
      name: 'Location history',
      size: 5000000,
      synced: true,
      lastModified: '2026-09-14 08:00',
    },
    {
      id: '4',
      type: 'settings',
      name: 'User preferences',
      size: 50000,
      synced: true,
      lastModified: '2026-09-13 15:20',
    },
    {
      id: '5',
      type: 'memory',
      name: 'Pending sync (3 items)',
      size: 3000000,
      synced: false,
      lastModified: '2026-09-14 11:00',
    },
  ]);

  const [syncQueue] = useState([
    { id: '1', type: 'memory', name: 'New memory - Hanoi trip', status: 'pending' },
    { id: '2', type: 'photo', name: 'Photo upload - Sunset.jpg', status: 'pending' },
    { id: '3', type: 'memory', name: 'Memory edit - Updated description', status: 'pending' },
  ]);

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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const totalStorage = offlineData.reduce((sum, item) => sum + item.size, 0);
  const syncedCount = offlineData.filter(d => d.synced).length;
  const pendingSync = offlineData.filter(d => !d.synced).length;

  const handleSyncNow = () => {
    setOfflineData(offlineData.map(item => {
      if (!item.synced) {
        return { ...item, synced: true };
      }
      return item;
    }));
  };

  const clearCache = () => {
    setOfflineData(offlineData.filter(item => item.type !== 'photo'));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isOnline ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-red-400 to-rose-500'}`}>
            {isOnline ? <Wifi className="h-5 w-5 text-white" /> : <WifiOff className="h-5 w-5 text-white" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Offline Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isOnline ? 'Connected - Syncing enabled' : 'Offline - Using cached data'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowStorage(!showStorage)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show storage"
          >
            {showStorage ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className={`p-4 rounded-lg border ${isOnline ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' : 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-red-200 dark:border-red-800'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}>
                {isOnline ? <CheckCircle className="h-6 w-6 text-white" /> : <AlertTriangle className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {isOnline ? 'Online' : 'Offline'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {isOnline ? 'All features available' : 'Limited functionality, using cached data'}
                </p>
              </div>
            </div>
            {!isOnline && (
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Connection
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Storage Used</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatBytes(totalStorage)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Synced Items</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{syncedCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending Sync</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{pendingSync}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto Sync</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{autoSync ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={!isOnline || pendingSync === 0}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${isOnline && pendingSync > 0 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed'}`}
          >
            <RefreshCw className="h-3 w-3" />
            Sync Now
          </button>
          <button
            type="button"
            onClick={() => setAutoSync(!autoSync)}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${autoSync ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}
          >
            <Cloud className="h-3 w-3" />
            {autoSync ? 'Auto Sync On' : 'Auto Sync Off'}
          </button>
          <button
            type="button"
            onClick={clearCache}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear Cache
          </button>
        </div>

        {showStorage && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Offline Storage</h4>
            <div className="space-y-2">
              {offlineData.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(item.size)} • {item.lastModified}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 capitalize">
                      {item.type}
                    </span>
                    {item.synced ? (
                      <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <CheckCircle className="h-3 w-3" />
                        <span>Synced</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
                        <Clock className="h-3 w-3" />
                        <span>Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pendingSync > 0 && (
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sync Queue ({syncQueue.length} items)</h4>
            <div className="space-y-2">
              {syncQueue.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{item.type}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Offline Features
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• View cached memories and photos</li>
            <li>• Create new memories (synced when online)</li>
            <li>• Edit existing memories (synced when online)</li>
            <li>• Access location history</li>
            <li>• View and manage settings</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Storage Management
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Offline data uses device storage</li>
            <li>• Photos take the most space</li>
            <li>• Clear cache to free up storage</li>
            <li>• Auto-sync when connection is restored</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
