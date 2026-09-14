'use client';

import { useState } from 'react';
import { Activity, X, RefreshCw, CheckCircle, AlertTriangle, Info, TrendingUp, TrendingDown, Zap, Clock, Server, Database, HardDrive, Cpu, MemoryStick } from 'lucide-react';

interface PerformanceMetricsDashboardProps {
  onCancel?: () => void;
}

interface Metric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  threshold?: number;
  status: 'good' | 'warning' | 'critical';
}

export default function PerformanceMetricsDashboard({ onCancel }: PerformanceMetricsDashboardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>('hour');

  const [metrics, setMetrics] = useState<Metric[]>([
    { name: 'Response Time', value: 150, unit: 'ms', trend: 'down', threshold: 500, status: 'good' },
    { name: 'Request Rate', value: 1250, unit: 'req/s', trend: 'up', threshold: 1000, status: 'good' },
    { name: 'Error Rate', value: 0.5, unit: '%', trend: 'down', threshold: 1, status: 'good' },
    { name: 'CPU Usage', value: 45, unit: '%', trend: 'stable', threshold: 80, status: 'good' },
    { name: 'Memory Usage', value: 68, unit: '%', trend: 'up', threshold: 85, status: 'good' },
    { name: 'Disk Usage', value: 72, unit: '%', trend: 'up', threshold: 90, status: 'good' },
    { name: 'Database Connections', value: 85, unit: 'active', trend: 'stable', threshold: 100, status: 'good' },
    { name: 'Cache Hit Rate', value: 92, unit: '%', trend: 'up', threshold: 80, status: 'good' },
  ]);

  const getMetricIcon = (name: string) => {
    switch (name) {
      case 'Response Time': return <Clock className="h-4 w-4" />;
      case 'Request Rate': return <Zap className="h-4 w-4" />;
      case 'Error Rate': return <AlertTriangle className="h-4 w-4" />;
      case 'CPU Usage': return <Cpu className="h-4 w-4" />;
      case 'Memory Usage': return <MemoryStick className="h-4 w-4" />;
      case 'Disk Usage': return <HardDrive className="h-4 w-4" />;
      case 'Database Connections': return <Database className="h-4 w-4" />;
      case 'Cache Hit Rate': return <Server className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      case 'stable': return <Activity className="h-3 w-3 text-slate-400" />;
      default: return <Activity className="h-3 w-3 text-slate-400" />;
    }
  };

  const getProgressColor = (value: number, threshold: number) => {
    const percentage = (value / threshold) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Performance Metrics Dashboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitor system performance in real-time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Metrics</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{metrics.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Good</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{metrics.filter(m => m.status === 'good').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Warning</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{metrics.filter(m => m.status === 'warning').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Critical</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{metrics.filter(m => m.status === 'critical').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="hour">Last Hour</option>
            <option value="day">Last Day</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div key={metric.name} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMetricIcon(metric.name)}
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(metric.trend)}
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {metric.value} {metric.unit}
                  </span>
                  {metric.threshold && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Threshold: {metric.threshold} {metric.unit}
                    </span>
                  )}
                </div>
                {metric.threshold && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(metric.value, metric.threshold)}`}
                      style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recent Alerts</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-xs text-slate-900 dark:text-white">Memory usage approaching threshold</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-slate-900 dark:text-white">Database connection pool optimized</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">15 min ago</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Performance Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Monitor response time for user experience</li>
              <li>• Track error rates to detect issues early</li>
              <li>• Watch resource usage for capacity planning</li>
              <li>• Set up alerts for critical thresholds</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
