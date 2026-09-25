'use client';

import { useState, useEffect } from 'react';
import { Cpu, X, Settings, RefreshCw, HardDrive, Activity, Thermometer, Network, Zap, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface ResourceMetric {
  name: string;
  value: number;
  max: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

interface ResourceUsageProps {
  onCancel?: () => void;
  onRefreshResources?: () => Promise<ResourceMetric[]>;
  onOptimizeResources?: () => Promise<void>;
}

const DEFAULT_METRICS: ResourceMetric[] = [
  { name: 'CPU', value: 45, max: 100, unit: '%', trend: 'stable', history: [42, 45, 48, 45, 47, 45, 44, 46, 45, 45] },
  { name: 'Memory', value: 62, max: 100, unit: '%', trend: 'up', history: [58, 60, 61, 62, 63, 62, 61, 62, 63, 62] },
  { name: 'Disk', value: 78, max: 100, unit: '%', trend: 'stable', history: [78, 78, 78, 78, 78, 78, 78, 78, 78, 78] },
  { name: 'Network Up', value: 25, max: 100, unit: 'Mbps', trend: 'down', history: [30, 28, 26, 25, 24, 25, 26, 25, 24, 25] },
  { name: 'Network Down', value: 15, max: 100, unit: 'Mbps', trend: 'stable', history: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15] },
  { name: 'Temperature', value: 42, max: 100, unit: '°C', trend: 'stable', history: [41, 42, 43, 42, 41, 42, 43, 42, 41, 42] },
];

export default function ResourceUsage({ onCancel, onRefreshResources, onOptimizeResources }: ResourceUsageProps) {
  const [metrics, setMetrics] = useState<ResourceMetric[]>(DEFAULT_METRICS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);

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
    if (onRefreshResources) {
      const refreshedMetrics = await onRefreshResources();
      setMetrics(refreshedMetrics);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(metric.max, metric.value + (Math.random() - 0.5) * 10)),
        history: [...metric.history.slice(-9), Math.max(0, Math.min(metric.max, metric.value + (Math.random() - 0.5) * 10))],
      })));
    }
    setIsRefreshing(false);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    if (onOptimizeResources) {
      await onOptimizeResources();
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, metric.value * 0.8),
        history: [...metric.history.slice(-9), Math.max(0, metric.value * 0.8)],
      })));
    }
    setIsOptimizing(false);
  };

  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'CPU':
        return <Cpu className="h-4 w-4" />;
      case 'Memory':
        return <HardDrive className="h-4 w-4" />;
      case 'Disk':
        return <HardDrive className="h-4 w-4" />;
      case 'Network Up':
      case 'Network Down':
        return <Network className="h-4 w-4" />;
      case 'Temperature':
        return <Thermometer className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'from-red-400 to-rose-500';
    if (percentage >= 60) return 'from-amber-400 to-orange-500';
    return 'from-green-400 to-emerald-500';
  };

  const getTrendIcon = (trend: ResourceMetric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />;
      case 'stable':
        return <Activity className="h-3 w-3 text-slate-500" />;
      default:
        return <Activity className="h-3 w-3 text-slate-500" />;
    }
  };

  const renderHistoryChart = (history: number[], max: number) => {
    const maxHistory = Math.max(...history, max);
    return (
      <div className="flex items-end gap-0.5 h-8">
        {history.map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t bg-gradient-to-t ${getMetricColor(value, maxHistory)}`}
            style={{ height: `${(value / maxHistory) * 100}%` }}
            title={`${value.toFixed(1)}${max === 100 ? '%' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Sử dụng tài nguyên
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {metrics.length} metrics • Auto-refresh: {autoRefresh ? 'On' : 'Off'}
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
            Cài đặt giám sát
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
                  autoRefresh ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
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
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="1000">1 giây</option>
                <option value="5000">5 giây</option>
                <option value="10000">10 giây</option>
                <option value="30000">30 giây</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getMetricIcon(metric.name)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {metric.name}
                </span>
              </div>
              {getTrendIcon(metric.trend)}
            </div>

            {/* Current Value */}
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metric.value.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {metric.unit}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full mb-2">
              <div
                className={`h-full bg-gradient-to-r ${getMetricColor(metric.value, metric.max)} transition-all`}
                style={{ width: `${(metric.value / metric.max) * 100}%` }}
              />
            </div>

            {/* History Chart */}
            {renderHistoryChart(metric.history, metric.max)}
          </div>
        ))}
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">CPU Load</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.find(m => m.name === 'CPU')?.value.toFixed(1)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memory</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.find(m => m.name === 'Memory')?.value.toFixed(1)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Network className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Network</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(metrics.find(m => m.name === 'Network Up')?.value || 0 + metrics.find(m => m.name === 'Network Down')?.value || 0).toFixed(1)} Mbps
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Temp</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {metrics.find(m => m.name === 'Temperature')?.value.toFixed(1)}°C
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
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
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isOptimizing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang tối ưu...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Tối ưu
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Sử dụng tài nguyên theo dõi CPU, memory, disk, network, và temperature với real-time monitoring và history charts.
        </p>
      </div>
    </div>
  );
}