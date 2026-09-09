'use client';

import { useState } from 'react';
import { Database, X, Settings, Check, RefreshCw, Trash2, TrendingUp, HardDrive, Clock, Shield, AlertTriangle } from 'lucide-react';

interface CacheEntry {
  key: string;
  type: 'memory' | 'localStorage' | 'sessionStorage' | 'indexedDB';
  size: number;
  sizeFormatted: string;
  lastAccessed: Date;
  expiresAt: Date | null;
  hitCount: number;
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  avgAccessTime: number;
}

interface CacheOptimizationProps {
  onCancel?: () => void;
  onClearCache?: (type?: CacheEntry['type']) => Promise<void>;
  onAnalyzeCache?: () => Promise<CacheStats>;
  onOptimizeCache?: () => Promise<void>;
}

const DEFAULT_ENTRIES: CacheEntry[] = [
  { key: 'memories_list', type: 'memory', size: 0.5, sizeFormatted: '0.5 MB', lastAccessed: new Date(), expiresAt: null, hitCount: 245 },
  { key: 'user_preferences', type: 'localStorage', size: 0.1, sizeFormatted: '0.1 MB', lastAccessed: new Date(), expiresAt: null, hitCount: 89 },
  { key: 'map_tiles', type: 'indexedDB', size: 25.5, sizeFormatted: '25.5 MB', lastAccessed: new Date(), expiresAt: null, hitCount: 512 },
  { key: 'images_cache', type: 'indexedDB', size: 45.2, sizeFormatted: '45.2 MB', lastAccessed: new Date(), expiresAt: null, hitCount: 320 },
  { key: 'session_data', type: 'sessionStorage', size: 0.2, sizeFormatted: '0.2 MB', lastAccessed: new Date(), expiresAt: null, hitCount: 45 },
];

const DEFAULT_STATS: CacheStats = {
  totalEntries: 5,
  totalSize: 71.5,
  hitRate: 92.5,
  missRate: 7.5,
  avgAccessTime: 15,
};

export default function CacheOptimization({ onCancel, onClearCache, onAnalyzeCache, onOptimizeCache }: CacheOptimizationProps) {
  const [entries, setEntries] = useState<CacheEntry[]>(DEFAULT_ENTRIES);
  const [stats, setStats] = useState<CacheStats>(DEFAULT_STATS);
  const [showSettings, setShowSettings] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [maxCacheSize, setMaxCacheSize] = useState(100);

  const handleClearCache = async (type?: CacheEntry['type']) => {
    setIsClearing(true);
    if (onClearCache) {
      await onClearCache(type);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (type) {
        setEntries(prev => prev.filter(e => e.type !== type));
      } else {
        setEntries([]);
      }
      setStats({
        ...stats,
        totalEntries: type ? entries.filter(e => e.type !== type).length : 0,
        totalSize: type ? entries.filter(e => e.type !== type).reduce((sum, e) => sum + e.size, 0) : 0,
      });
    }
    setIsClearing(false);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    if (onOptimizeCache) {
      await onOptimizeCache();
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate optimization
      setStats({
        ...stats,
        hitRate: Math.min(100, stats.hitRate + 2),
        avgAccessTime: Math.max(5, stats.avgAccessTime - 2),
      });
    }
    setIsOptimizing(false);
  };

  const getTypeIcon = (type: CacheEntry['type']) => {
    switch (type) {
      case 'memory':
        return <HardDrive className="h-4 w-4" />;
      case 'localStorage':
        return <Database className="h-4 w-4" />;
      case 'sessionStorage':
        return <Clock className="h-4 w-4" />;
      case 'indexedDB':
        return <Shield className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: CacheEntry['type']) => {
    switch (type) {
      case 'memory':
        return 'Memory';
      case 'localStorage':
        return 'LocalStorage';
      case 'sessionStorage':
        return 'SessionStorage';
      case 'indexedDB':
        return 'IndexedDB';
      default:
        return 'Memory';
    }
  };

  const getTypeColor = (type: CacheEntry['type']) => {
    switch (type) {
      case 'memory':
        return 'from-blue-400 to-cyan-500';
      case 'localStorage':
        return 'from-purple-400 to-pink-500';
      case 'sessionStorage':
        return 'from-amber-400 to-orange-500';
      case 'indexedDB':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tối ưu hóa cache
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {entries.length} entries • {stats.totalSize.toFixed(1)} MB
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt cache
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tự động tối ưu
              </span>
              <button
                type="button"
                onClick={() => setAutoOptimize(!autoOptimize)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoOptimize ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoOptimize ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Kích thước cache tối đa: {maxCacheSize} MB
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={maxCacheSize}
                onChange={(e) => setMaxCacheSize(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>10 MB</span>
                <span>500 MB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Entries</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {stats.totalEntries}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {stats.totalSize.toFixed(1)} MB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Hit Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {stats.hitRate.toFixed(1)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {stats.avgAccessTime}ms
          </div>
        </div>
      </div>

      {/* Cache Entries */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Cache entries
        </h4>
        {entries.length === 0 ? (
          <div className="text-center py-4 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
            <AlertTriangle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Không có cache entries
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.key}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(entry.type)}
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {entry.key}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 bg-gradient-to-r ${getTypeColor(entry.type)} text-white text-[10px] font-bold rounded-full`}>
                    {getTypeLabel(entry.type)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.sizeFormatted}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      • {entry.hitCount} hits
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleClearCache(entry.type)}
                    disabled={isClearing}
                    className="px-2 py-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {isClearing ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang tối ưu...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Tối ưu cache
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => handleClearCache()}
          disabled={isClearing || entries.length === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isClearing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang xóa...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              Xóa tất cả
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Tối ưu hóa cache sử dụng memory, localStorage, sessionStorage, và IndexedDB để giảm API calls và cải thiện performance.
        </p>
      </div>
    </div>
  );
}