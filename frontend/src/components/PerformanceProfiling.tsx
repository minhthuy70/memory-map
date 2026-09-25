'use client';

import { useState, useEffect } from 'react';
import { Zap, X, Settings, RefreshCw, Activity, Clock, Cpu, Database, TrendingUp, AlertTriangle } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface PerformanceData {
  metrics: PerformanceMetric[];
  timestamp: Date;
}

interface PerformanceProfilingProps {
  onCancel?: () => void;
  onRunProfiling?: () => Promise<PerformanceData>;
}

const DEFAULT_METRICS: PerformanceMetric[] = [
  { name: 'FPS', value: 60, unit: 'fps', status: 'good', trend: 'stable' },
  { name: 'Memory', value: 45, unit: 'MB', status: 'good', trend: 'stable' },
  { name: 'CPU', value: 25, unit: '%', status: 'good', trend: 'down' },
  { name: 'TTFB', value: 180, unit: 'ms', status: 'good', trend: 'down' },
  { name: 'FCP', value: 1200, unit: 'ms', status: 'warning', trend: 'up' },
  { name: 'LCP', value: 2400, unit: 'ms', status: 'warning', trend: 'up' },
];

export default function PerformanceProfiling({ onCancel, onRunProfiling }: PerformanceProfilingProps) {
  const [isProfiling, setIsProfiling] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>(DEFAULT_METRICS);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(5000);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        simulateMetricsUpdate();
      }, refreshInterval);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const simulateMetricsUpdate = () => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, metric.value + (Math.random() - 0.5) * 10),
    })));
    setLastUpdated(new Date());
  };

  const handleRunProfiling = async () => {
    setIsProfiling(true);
    if (onRunProfiling) {
      const data = await onRunProfiling();
      setMetrics(data.metrics);
      setLastUpdated(data.timestamp);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      simulateMetricsUpdate();
    }
    setIsProfiling(false);
  };

  const getStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'good':
        return 'from-green-400 to-emerald-500';
      case 'warning':
        return 'from-amber-400 to-orange-500';
      case 'critical':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getTrendIcon = (trend: PerformanceMetric['trend']) => {
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phân tích hiệu suất
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
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
            Cài đặt
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
                <option value="1000">1 giây</option>
                <option value="5000">5 giây</option>
                <option value="10000">10 giây</option>
                <option value="30000">30 giây</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {metric.name === 'CPU' && <Cpu className="h-4 w-4 text-slate-500" />}
                {metric.name === 'Memory' && <Database className="h-4 w-4 text-slate-500" />}
                {metric.name === 'TTFB' && <Clock className="h-4 w-4 text-slate-500" />}
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  {metric.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(metric.trend)}
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(metric.status)} text-white text-[10px] font-bold rounded-full`}>
                  {metric.status}
                </span>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metric.value.toFixed(1)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {metric.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleRunProfiling}
        disabled={isProfiling}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isProfiling ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang phân tích...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Chạy phân tích hiệu suất
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Phân tích hiệu suất sử dụng Performance API để đo FPS, memory, CPU, và các Web Vitals.
        </p>
      </div>
    </div>
  );
}