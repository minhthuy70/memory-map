'use client';

import { useState } from 'react';
import { Globe, X, Settings, Check, RefreshCw, Cloud, Server, CheckCircle, AlertTriangle, Zap, Upload, Download } from 'lucide-react';

interface CDNConfig {
  provider: 'cloudflare' | 'aws-cloudfront' | 'azure-cdn' | 'fastly' | 'custom';
  enabled: boolean;
  baseUrl: string;
  cacheDuration: number;
  assetPaths: string[];
  lastSync: Date;
}

interface CDNStats {
  totalAssets: number;
  cachedAssets: number;
  totalSize: number;
  bandwidthSaved: number;
  avgResponseTime: number;
}

interface CDNIntegrationProps {
  onCancel?: () => void;
  onConfigureCDN?: (config: CDNConfig) => Promise<void>;
  onSyncAssets?: () => Promise<void>;
  onPurgeCache?: () => Promise<void>;
}

const DEFAULT_CONFIG: CDNConfig = {
  provider: 'cloudflare',
  enabled: true,
  baseUrl: 'https://cdn.example.com',
  cacheDuration: 3600,
  assetPaths: ['/images', '/static', '/videos'],
  lastSync: new Date(),
};

const DEFAULT_STATS: CDNStats = {
  totalAssets: 245,
  cachedAssets: 198,
  totalSize: 125.5,
  bandwidthSaved: 89.2,
  avgResponseTime: 120,
};

export default function CDNIntegration({ onCancel, onConfigureCDN, onSyncAssets, onPurgeCache }: CDNIntegrationProps) {
  const [config, setConfig] = useState<CDNConfig>(DEFAULT_CONFIG);
  const [stats, setStats] = useState<CDNStats>(DEFAULT_STATS);
  const [showSettings, setShowSettings] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [newBaseUrl, setNewBaseUrl] = useState(config.baseUrl);
  const [newCacheDuration, setNewCacheDuration] = useState(config.cacheDuration);

  const handleSaveConfig = async () => {
    setConfig({
      ...config,
      baseUrl: newBaseUrl,
      cacheDuration: newCacheDuration,
    });
    if (onConfigureCDN) {
      await onConfigureCDN({
        ...config,
        baseUrl: newBaseUrl,
        cacheDuration: newCacheDuration,
      });
    }
    setShowSettings(false);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    if (onSyncAssets) {
      await onSyncAssets();
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStats({
        ...stats,
        lastSync: new Date(),
        cachedAssets: Math.floor(stats.totalAssets * 0.9),
      });
    }
    setIsSyncing(false);
  };

  const handlePurge = async () => {
    setIsPurging(true);
    if (onPurgeCache) {
      await onPurgeCache();
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStats({
        ...stats,
        cachedAssets: 0,
      });
    }
    setIsPurging(false);
  };

  const getProviderLabel = (provider: CDNConfig['provider']) => {
    switch (provider) {
      case 'cloudflare':
        return 'Cloudflare';
      case 'aws-cloudfront':
        return 'AWS CloudFront';
      case 'azure-cdn':
        return 'Azure CDN';
      case 'fastly':
        return 'Fastly';
      case 'custom':
        return 'Custom';
      default:
        return 'Cloudflare';
    }
  };

  const getProviderColor = (provider: CDNConfig['provider']) => {
    switch (provider) {
      case 'cloudflare':
        return 'from-orange-400 to-amber-500';
      case 'aws-cloudfront':
        return 'from-blue-400 to-cyan-500';
      case 'azure-cdn':
        return 'from-purple-400 to-indigo-500';
      case 'fastly':
        return 'from-green-400 to-emerald-500';
      case 'custom':
        return 'from-slate-400 to-slate-500';
      default:
        return 'from-orange-400 to-amber-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tích hợp CDN
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {getProviderLabel(config.provider)} • {config.enabled ? 'Đã bật' : 'Đã tắt'}
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
            Cấu hình CDN
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Nhà cung cấp CDN
              </label>
              <select
                value={config.provider}
                onChange={(e) => setConfig({ ...config, provider: e.target.value as CDNConfig['provider'] })}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="cloudflare">Cloudflare</option>
                <option value="aws-cloudfront">AWS CloudFront</option>
                <option value="azure-cdn">Azure CDN</option>
                <option value="fastly">Fastly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Base URL
              </label>
              <input
                type="text"
                value={newBaseUrl}
                onChange={(e) => setNewBaseUrl(e.target.value)}
                placeholder="https://cdn.example.com"
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Thời gian cache (giây): {newCacheDuration}
              </label>
              <input
                type="range"
                min="300"
                max="86400"
                value={newCacheDuration}
                onChange={(e) => setNewCacheDuration(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>5 phút</span>
                <span>24 giờ</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Bật CDN
              </span>
              <button
                type="button"
                onClick={() => setConfig({ ...config, enabled: !config.enabled })}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  config.enabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    config.enabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <button
              type="button"
              onClick={handleSaveConfig}
              className="w-full px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Lưu cấu hình
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <Cloud className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Tổng assets</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.totalAssets}
          </div>
        </div>
        <div className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Đã cache</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.cachedAssets}
          </div>
        </div>
        <div className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Bandwidth lưu</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {stats.bandwidthSaved} MB
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Hiệu suất
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Tổng kích thước assets
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {stats.totalSize} MB
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Thời gian phản hồi trung bình
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {stats.avgResponseTime}ms
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 dark-slate-400">
              Cache hit rate
            </span>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              {((stats.cachedAssets / stats.totalAssets) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSync}
          disabled={isSyncing || !config.enabled}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isSyncing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang sync...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Sync assets
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handlePurge}
          disabled={isPurging || !config.enabled}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isPurging ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang xóa...
            </>
          ) : (
            <>
              <Cloud className="h-4 w-4" />
              Xóa cache
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> CDN phân phối assets toàn cầu từ các edge locations để giảm latency và tăng tốc độ tải.
        </p>
      </div>
    </div>
  );
}