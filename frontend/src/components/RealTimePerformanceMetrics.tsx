'use client';

import { useState, useEffect } from 'react';
import { Zap, X, Settings, RefreshCw, Activity, Clock, CheckCircle, AlertTriangle, TrendingUp, Monitor, Mouse, Keyboard } from 'lucide-react';

interface WebVital {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'good' | 'needs-improvement' | 'poor';
  history: number[];
}

interface RealTimeMetrics {
  fps: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  activeUsers: number;
  pageViews: number;
  errorRate: number;
  timestamp: Date;
}

interface RealTimePerformanceMetricsProps {
  onCancel?: () => void;
  onRefreshMetrics?: () => Promise<RealTimeMetrics>;
  onResetMetrics?: () => Promise<void>;
}

const DEFAULT_WEB_VITALS: WebVital[] = [
  { name: 'FCP', value: 1200, unit: 'ms', threshold: 1800, status: 'good', history: [1150, 1200, 1180, 1220, 1190, 1210, 1200, 1170, 1230, 1200] },
  { name: 'LCP', value: 2400, unit: 'ms', threshold: 2500, status: 'needs-improvement', history: [2350, 2400, 2380, 2420, 2390, 2410, 2400, 2370, 2430, 2400] },
  { name: 'FID', value: 45, unit: 'ms', threshold: 100, status: 'good', history: [42, 45, 43, 47, 44, 46, 45, 42, 48, 45] },
  { name: 'CLS', value: 0.08, unit: '', threshold: 0.1, status: 'good', history: [0.07, 0.08, 0.075, 0.085, 0.078, 0.082, 0.08, 0.076, 0.084, 0.08] },
  { name: 'TTFB', value: 180, unit: 'ms', threshold: 600, status: 'good', history: [175, 180, 178, 182, 179, 181, 180, 177, 183, 180] },
];

const DEFAULT_METRICS: RealTimeMetrics = {
  fps: 60,
  memoryUsage: 45,
  cpuUsage: 25,
  networkLatency: 85,
  activeUsers: 1245,
  pageViews: 5678,
  errorRate: 0.12,
  timestamp: new Date(),
};

export default function RealTimePerformanceMetrics({ onCancel, onRefreshMetrics, onResetMetrics }: RealTimePerformanceMetricsProps) {
  const [webVitals, setWebVitals] = useState<WebVital[]>(DEFAULT_WEB_VITALS);
  const [metrics, setMetrics] = useState<RealTimeMetrics>(DEFAULT_METRICS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(2000);
  const [selectedVital, setSelectedVital] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        handleRefresh();
      }, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshMetrics) {
      const refreshedMetrics = await onRefreshMetrics();
      setMetrics(refreshedMetrics);
    } else {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMetrics(prev => ({
        ...prev,
        fps: Math.max(30, Math.min(144, prev.fps + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        networkLatency: Math.max(10, prev.networkLatency + (Math.random() - 0.5) * 20),
        activeUsers: Math.max(0, prev.activeUsers + Math.floor((Math.random() - 0.5) * 50)),
        pageViews: Math.max(0, prev.pageViews + Math.floor((Math.random() - 0.5) * 100)),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.1)),
        timestamp: new Date(),
      }));
      setWebVitals(prev => prev.map(vital => ({
        ...vital,
        value: Math.max(0, vital.value + (Math.random() - 0.5) * (vital.unit === '' ? 0.01 : 50)),
        history: [...vital.history.slice(-9), Math.max(0, vital.value + (Math.random() - 0.5) * (vital.unit === '' ? 0.01 : 50))],
      })));
    }
    setIsRefreshing(false);
  };

  const handleReset = async () => {
    if (onResetMetrics) {
      await onResetMetrics();
    } else {
      setMetrics(DEFAULT_METRICS);
      setWebVitals(DEFAULT_WEB_VITALS);
    }
  };

  const getVitalStatusColor = (status: WebVital['status']) => {
    switch (status) {
      case 'good':
        return 'from-green-400 to-emerald-500';
      case 'needs-improvement':
        return 'from-amber-400 to-orange-500';
      case 'poor':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getVitalStatusLabel = (status: WebVital['status']) => {
    switch (status) {
      case 'good':
        return 'Good';
      case 'needs-improvement':
        return 'Needs Improvement';
      case 'poor':
        return 'Poor';
      default:
        return 'Unknown';
    }
  };

  const renderHistoryChart = (history: number[], threshold: number) => {
    const maxHistory = Math.max(...history, threshold);
    return (
      <div className="flex items-end gap-0.5 h-6">
        {history.map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t bg-gradient-to-t ${value > threshold ? 'from-red-400 to-rose-500' : 'from-green-400 to-emerald-500'}`}
            style={{ height: `${(value / maxHistory) * 100}%` }}
            title={`${value.toFixed(1)}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chỉ số hiệu suất thời gian thực
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              FPS: {metrics.fps.toFixed(0)} • Memory: {metrics.memoryUsage.toFixed(0)}% • Auto: {autoRefresh ? 'On' : 'Off'}
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt metrics
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tự động cập nhật
              </span>
              <button
                type="button"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoRefresh ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRefresh ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tần suất cập nhật: {refreshInterval}ms
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="500">500ms</option>
                <option value="1000">1 giây</option>
                <option value="2000">2 giây</option>
                <option value="5000">5 giây</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">FPS</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.fps.toFixed(0)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memory</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.memoryUsage.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">CPU</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.cpuUsage.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Latency</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.networkLatency.toFixed(0)}ms
          </div>
        </div>
      </div>

      {/* User Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active Users</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.activeUsers.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Page Views</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.pageViews.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Error Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.errorRate.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Web Vitals
        </h4>
        <div className="space-y-2">
          {webVitals.map((vital) => (
            <div
              key={vital.name}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {vital.name}
                  </span>
                  <span className={`px-2 py-0.5 bg-gradient-to-r ${getVitalStatusColor(vital.status)} text-white text-[10px] font-bold rounded-full`}>
                    {getVitalStatusLabel(vital.status)}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {vital.value.toFixed(vital.unit === '' ? 3 : 0)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {vital.unit}
                  </span>
                </div>
              </div>
              {renderHistoryChart(vital.history, vital.threshold)}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
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
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <Activity className="h-4 w-4" />
          Reset
        </button>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Chỉ số hiệu suất thời gian thực theo dõi FPS, memory, CPU, network latency, Web Vitals (FCP, LCP, FID, CLS, TTFB).
        </p>
      </div>
    </div>
  );
}