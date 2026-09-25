'use client';

import { useState } from 'react';
import { BarChart3, X, Settings, RefreshCw, Users, Activity, TrendingUp, Clock, Eye, Mouse, ArrowUp, ArrowDown, Calendar, Filter, Download } from 'lucide-react';

interface DashboardMetric {
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  unit: string;
  trend: number[];
}

interface AnalyticsDashboardProps {
  onCancel?: () => void;
  onRefreshDashboard?: () => Promise<DashboardMetric[]>;
  onExportReport?: () => Promise<void>;
}

const DEFAULT_METRICS: DashboardMetric[] = [
  { name: 'Active Users', value: 1245, change: 12.5, changeType: 'increase', unit: '', trend: [1100, 1150, 1200, 1180, 1220, 1245] },
  { name: 'Page Views', value: 5678, change: 8.3, changeType: 'increase', unit: '', trend: [5200, 5350, 5400, 5520, 5600, 5678] },
  { name: 'Session Duration', value: 245, change: -3.2, changeType: 'decrease', unit: 's', trend: [260, 255, 250, 248, 246, 245] },
  { name: 'Bounce Rate', value: 32.5, change: -5.8, changeType: 'increase', unit: '%', trend: [38, 36, 35, 34, 33, 32.5] },
  { name: 'Conversion Rate', value: 4.2, change: 15.7, changeType: 'increase', unit: '%', trend: [3.5, 3.7, 3.8, 4.0, 4.1, 4.2] },
  { name: 'Avg Load Time', value: 1.2, change: -12.3, changeType: 'increase', unit: 's', trend: [1.5, 1.4, 1.35, 1.3, 1.25, 1.2] },
];

export default function AnalyticsDashboard({ onCancel, onRefreshDashboard, onExportReport }: AnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetric[]>(DEFAULT_METRICS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshDashboard) {
      const refreshedMetrics = await onRefreshDashboard();
      setMetrics(refreshedMetrics);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsRefreshing(false);
  };

  const handleExport = async () => {
    if (onExportReport) {
      await onExportReport();
    } else {
      console.log('Exporting analytics report...');
    }
  };

  const renderMiniChart = (trend: number[], isPositive: boolean) => {
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end gap-0.5 h-8">
        {trend.map((value, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t ${
              isPositive ? 'bg-green-400' : 'bg-red-400'
            }`}
            style={{ height: `${((value - min) / range) * 100}%` }}
            title={value.toFixed(1)}
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
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Dashboard phân tích
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedTimeRange} • {selectedPeriod}
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
            Cài đặt dashboard
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-refresh
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled (5m)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Data retention
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">90 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Sampling rate
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">100%</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value as any)}
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        >
          <option value="7d">7 ngày</option>
          <option value="30d">30 ngày</option>
          <option value="90d">90 ngày</option>
        </select>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        >
          <option value="daily">Hàng ngày</option>
          <option value="weekly">Hàng tuần</option>
          <option value="monthly">Hàng tháng</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {metric.name}
              </span>
              {renderMiniChart(metric.trend, metric.changeType === 'increase')}
            </div>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {metric.value.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {metric.unit}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {metric.changeType === 'increase' ? (
                <>
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {metric.change.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDown className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {metric.change.toFixed(1)}%
                  </span>
                </>
              )}
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                vs last period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Users</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            8,542
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Sessions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            12,847
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Page Views</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            45,623
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Growth Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            +15.3%
          </div>
        </div>
      </div>

      {/* Top Pages */}
      <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Top Pages
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300">/memories</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">12,450</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300">/map</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '72%' }} />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">10,230</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300">/analytics</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '58%' }} />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">8,120</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-700 dark:text-slate-300">/settings</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-600 rounded-full">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: '45%' }} />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">6,340</span>
            </div>
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
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Dashboard phân tích hiển thị comprehensive metrics với mini charts, trends, top pages, và export functionality.
        </p>
      </div>
    </div>
  );
}