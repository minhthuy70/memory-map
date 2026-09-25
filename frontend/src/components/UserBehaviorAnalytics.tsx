'use client';

import { useState } from 'react';
import { Users, X, Settings, RefreshCw, Activity, Clock, Mouse, Keyboard, Eye, ArrowRight, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';

interface UserSession {
  id: string;
  userId: string;
  duration: number;
  pageViews: number;
  actions: number;
  bounceRate: number;
  exitPage: string;
  entryPage: string;
  timestamp: Date;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
}

interface UserBehaviorAnalyticsProps {
  onCancel?: () => void;
  onRefreshSessions?: () => Promise<UserSession[]>;
  onExportData?: () => Promise<void>;
}

const DEFAULT_SESSIONS: UserSession[] = [
  {
    id: 'session-1',
    userId: 'user-123',
    duration: 345,
    pageViews: 12,
    actions: 45,
    bounceRate: 0,
    exitPage: '/memories',
    entryPage: '/home',
    timestamp: new Date(Date.now() - 3600000),
    device: 'desktop',
    browser: 'Chrome',
  },
  {
    id: 'session-2',
    userId: 'user-456',
    duration: 180,
    pageViews: 5,
    actions: 15,
    bounceRate: 20,
    exitPage: '/map',
    entryPage: '/home',
    timestamp: new Date(Date.now() - 7200000),
    device: 'mobile',
    browser: 'Safari',
  },
  {
    id: 'session-3',
    userId: 'user-789',
    duration: 520,
    pageViews: 18,
    actions: 67,
    bounceRate: 0,
    exitPage: '/settings',
    entryPage: '/memories',
    timestamp: new Date(Date.now() - 10800000),
    device: 'tablet',
    browser: 'Firefox',
  },
  {
    id: 'session-4',
    userId: 'user-321',
    duration: 45,
    pageViews: 1,
    actions: 3,
    bounceRate: 100,
    exitPage: '/home',
    entryPage: '/home',
    timestamp: new Date(Date.now() - 1800000),
    device: 'mobile',
    browser: 'Chrome',
  },
];

export default function UserBehaviorAnalytics({ onCancel, onRefreshSessions, onExportData }: UserBehaviorAnalyticsProps) {
  const [sessions, setSessions] = useState<UserSession[]>(DEFAULT_SESSIONS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshSessions) {
      const refreshedSessions = await onRefreshSessions();
      setSessions(refreshedSessions);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsRefreshing(false);
  };

  const handleExport = async () => {
    if (onExportData) {
      await onExportData();
    } else {
      // Simulate export
      console.log('Exporting user behavior data...');
    }
  };

  const getDeviceIcon = (device: UserSession['device']) => {
    switch (device) {
      case 'desktop':
        return <Activity className="h-4 w-4" />;
      case 'mobile':
        return <Mouse className="h-4 w-4" />;
      case 'tablet':
        return <Keyboard className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
    return `${remainingSeconds}s`;
  };

  const filteredSessions = selectedDevice === 'all' 
    ? sessions 
    : sessions.filter(session => session.device === selectedDevice);

  const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
  const avgPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0) / sessions.length;
  const avgActions = sessions.reduce((sum, s) => sum + s.actions, 0) / sessions.length;
  const bounceRate = sessions.reduce((sum, s) => sum + s.bounceRate, 0) / sessions.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phân tích hành vi người dùng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {sessions.length} sessions • Avg: {formatDuration(avgDuration)}
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt analytics
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Track mouse movements
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Track scroll depth
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Track clicks
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
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(avgDuration)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Page Views</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgPageViews.toFixed(1)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Actions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgActions.toFixed(0)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Bounce Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {bounceRate.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value as any)}
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          <option value="all">Tất cả devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value as any)}
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
        >
          <option value="1h">1 giờ</option>
          <option value="24h">24 giờ</option>
          <option value="7d">7 ngày</option>
          <option value="30d">30 ngày</option>
        </select>
      </div>

      {/* Sessions List */}
      <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
        {filteredSessions.map((session) => (
          <div
            key={session.id}
            className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getDeviceIcon(session.device)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {session.userId}
                </span>
                <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-600 dark:text-slate-400">
                  {session.browser}
                </span>
              </div>
              {session.bounceRate === 100 && (
                <AlertTriangle className="h-3 w-3 text-amber-500" />
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDuration(session.duration)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Page Views</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {session.pageViews}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Actions</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {session.actions}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Bounce</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {session.bounceRate}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />
                <span>{session.entryPage} → {session.exitPage}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(session.timestamp).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Cập nhật
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <TrendingUp className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Phân tích hành vi người dùng theo dõi session duration, page views, actions, bounce rate, entry/exit pages, và device/browser info.
        </p>
      </div>
    </div>
  );
}