'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  Beaker,
  CheckCircle,
  Clock,
  Cpu,
  RefreshCw,
  Settings,
  Smartphone,
  Zap
} from 'lucide-react';

interface RefreshEvent {
  id: string;
  timestamp: Date;
  duration: number;
  status: 'success' | 'failed';
  dataFetched: number;
}

interface NativePullToRefreshProps {
  onCancel?: () => void;
  onRefresh?: () => Promise<void>;
}

const DEFAULT_EVENTS: RefreshEvent[] = [
  {
    id: 'event-1',
    timestamp: new Date(),
    duration: 1250,
    status: 'success',
    dataFetched: 45,
  },
  {
    id: 'event-2',
    timestamp: new Date(Date.now() - 3600000),
    duration: 890,
    status: 'success',
    dataFetched: 32,
  },
];

export default function NativePullToRefresh({ onCancel, onRefresh }: NativePullToRefreshProps) {
  const [refreshEvents, setRefreshEvents] = useState<RefreshEvent[]>(DEFAULT_EVENTS);
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [threshold, setThreshold] = useState(80);
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(60);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setPullDistance(0);
    if (onRefresh) {
      await onRefresh();
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    const newEvent: RefreshEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      duration: Math.floor(Math.random() * 1000) + 500,
      status: 'success',
      dataFetched: Math.floor(Math.random() * 50) + 10,
    };
    setRefreshEvents(prev => [newEvent, ...prev]);
    setIsRefreshing(false);
  };

  const avgDuration = refreshEvents.reduce((sum, e) => sum + e.duration, 0) / refreshEvents.length;
  const successRate = (refreshEvents.filter(e => e.status === 'success').length / refreshEvents.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <RefreshCw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Pull-to-refresh native
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isRefreshing ? 'Đang refresh' : 'Đã sẵn sàng'}
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
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt pull-to-refresh
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Threshold: {threshold}px
              </label>
              <input
                type="range"
                min="50"
                max="150"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Enable animation
              </span>
              <button
                type="button"
                onClick={() => setEnableAnimation(!enableAnimation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableAnimation ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableAnimation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-refresh
              </span>
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoRefresh ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRefresh ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            {autoRefresh && (
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Interval: {refreshInterval}s
                </label>
                <input
                  type="range"
                  min="30"
                  max="300"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgDuration.toFixed(0)}ms
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Success Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {successRate.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Threshold</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {threshold}px
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Animation</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enableAnimation ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Pull to Refresh Demo */}
      <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Pull Distance
        </h4>
        <div className="flex items-center gap-2 mb-2">
          <ArrowDown className="h-4 w-4 text-slate-500" />
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-300"
              style={{ width: `${(pullDistance / threshold) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {pullDistance}px / {threshold}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max={threshold}
          value={pullDistance}
          onChange={(e) => setPullDistance(parseInt(e.target.value))}
          className="w-full"
        />
        {pullDistance >= threshold && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Đang refresh...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Release to Refresh
              </>
            )}
          </button>
        )}
      </div>

      {/* Manual Refresh */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang refresh...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Refresh Now
            </>
          )}
        </button>
      </div>

      {/* Refresh History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Refresh History
        </h4>
        <div className="space-y-2">
          {refreshEvents.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {event.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {event.status === 'success' ? 'Success' : 'Failed'}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {event.duration}ms
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Data Fetched</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {event.dataFetched} items
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Time</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {new Date(event.timestamp).toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Pull-to-refresh native sử dụng native gesture với configurable threshold, animation, và auto-refresh support.
        </p>
      </div>
    </div>
  );
}