'use client';

import { useState } from 'react';
import { BarChart3, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, TrendingUp, TrendingDown, Users, Activity } from 'lucide-react';

interface APIAnalyticsDashboardProps {
  onCancel?: () => void;
}

interface APIMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  period: string;
}

interface APIUsage {
  id: string;
  endpoint: string;
  method: string;
  requests: number;
  errors: number;
  avgLatency: number;
  p95Latency: number;
}

interface TopUser {
  id: string;
  apiKey: string;
  requests: number;
  errors: number;
  lastActive: string;
}

export default function APIAnalyticsDashboard({ onCancel }: APIAnalyticsDashboardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAnalyticsEnabled, setIsAnalyticsEnabled] = useState(true);

  const [apiMetrics, setApiMetrics] = useState<APIMetric[]>([
    { id: '1', name: 'Total Requests', value: 1250000, change: 12.5, period: '24h' },
    { id: '2', name: 'Avg Latency', value: 45, change: -5.2, period: '24h' },
    { id: '3', name: 'Error Rate', value: 0.8, change: -15.3, period: '24h' },
    { id: '4', name: 'Active Keys', value: 245, change: 8.7, period: '24h' },
  ]);

  const [apiUsage, setApiUsage] = useState<APIUsage[]>([
    { id: '1', endpoint: '/api/v2/memories', method: 'GET', requests: 450000, errors: 1250, avgLatency: 42, p95Latency: 85 },
    { id: '2', endpoint: '/api/v2/memories', method: 'POST', requests: 280000, errors: 890, avgLatency: 68, p95Latency: 120 },
    { id: '3', endpoint: '/api/v2/memories/:id', method: 'GET', requests: 320000, errors: 560, avgLatency: 38, p95Latency: 72 },
    { id: '4', endpoint: '/api/v2/memories/:id', method: 'PUT', requests: 150000, errors: 420, avgLatency: 55, p95Latency: 95 },
  ]);

  const [topUsers, setTopUsers] = useState<TopUser[]>([
    { id: '1', apiKey: 'sk_live_...abc', requests: 125000, errors: 450, lastActive: '2024-01-17 18:30' },
    { id: '2', apiKey: 'sk_live_...def', requests: 98000, errors: 320, lastActive: '2024-01-17 17:45' },
    { id: '3', apiKey: 'sk_test_...ghi', requests: 76000, errors: 180, lastActive: '2024-01-17 16:20' },
  ]);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'POST': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'PUT': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'DELETE': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              API Analytics Dashboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dashboard phân tích sử dụng API
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isAnalyticsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isAnalyticsEnabled ? 'Enabled' : 'Disabled'}
          </span>
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
          {apiMetrics.map((metric) => (
            <div key={metric.id} className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{metric.name}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {metric.value.toLocaleString()}
                {metric.name === 'Avg Latency' && 'ms'}
                {metric.name === 'Error Rate' && '%'}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1">
                {metric.change >= 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                <span className={`text-xs ${getChangeColor(metric.change)}`}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{metric.period}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isAnalyticsEnabled}
              onChange={(e) => setIsAnalyticsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Analytics</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Calendar className="h-3 w-3" />
            Last 24h
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">API Usage by Endpoint</h4>
          <div className="space-y-2">
            {apiUsage.map((usage) => (
              <div key={usage.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                      <Activity className="h-4 w-4 text-violet-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getMethodColor(usage.method)}`}>
                          {usage.method}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{usage.endpoint}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Requests</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{usage.requests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Errors</p>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400">{usage.errors.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Avg Latency</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{usage.avgLatency}ms</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">P95 Latency</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{usage.p95Latency}ms</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Top API Keys by Usage</h4>
          <div className="space-y-2">
            {topUsers.map((user) => (
              <div key={user.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Users className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{user.apiKey}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Requests</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.requests.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Errors</p>
                    <p className="text-xs font-semibold text-red-600 dark:text-red-400">{user.errors.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Last Active</p>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{user.lastActive}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">API Analytics Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Monitor total requests and error rates</li>
              <li>• Track latency metrics (avg and P95)</li>
              <li>• Analyze usage by endpoint</li>
              <li>• Identify top API keys by usage</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
