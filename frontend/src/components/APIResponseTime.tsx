'use client';

import { useState, useEffect } from 'react';
import { Clock, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Activity, TrendingUp, TrendingDown, Zap, FileText } from 'lucide-react';

interface APIEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  successRate: number;
  requestCount: number;
  errorCount: number;
  status: 'fast' | 'normal' | 'slow' | 'critical';
  lastCheck: Date;
}

interface APIResponseTimeProps {
  onCancel?: () => void;
  onRefreshEndpoints?: () => Promise<APIEndpoint[]>;
  onTestEndpoint?: (endpointName: string) => Promise<void>;
}

const DEFAULT_ENDPOINTS: APIEndpoint[] = [
  {
    name: 'GET /api/memories',
    method: 'GET',
    path: '/api/memories',
    avgResponseTime: 120,
    p95ResponseTime: 245,
    p99ResponseTime: 412,
    successRate: 99.5,
    requestCount: 12540,
    errorCount: 63,
    status: 'fast',
    lastCheck: new Date(),
  },
  {
    name: 'POST /api/memories',
    method: 'POST',
    path: '/api/memories',
    avgResponseTime: 185,
    p95ResponseTime: 320,
    p99ResponseTime: 580,
    successRate: 98.2,
    requestCount: 3240,
    errorCount: 58,
    status: 'normal',
    lastCheck: new Date(),
  },
  {
    name: 'GET /api/memories/:id',
    method: 'GET',
    path: '/api/memories/:id',
    avgResponseTime: 95,
    p95ResponseTime: 180,
    p99ResponseTime: 295,
    successRate: 99.8,
    requestCount: 18750,
    errorCount: 37,
    status: 'fast',
    lastCheck: new Date(),
  },
  {
    name: 'POST /api/auth/login',
    method: 'POST',
    path: '/api/auth/login',
    avgResponseTime: 245,
    p95ResponseTime: 420,
    p99ResponseTime: 780,
    successRate: 95.5,
    requestCount: 840,
    errorCount: 38,
    status: 'slow',
    lastCheck: new Date(),
  },
  {
    name: 'GET /api/analytics',
    method: 'GET',
    path: '/api/analytics',
    avgResponseTime: 580,
    p95ResponseTime: 890,
    p99ResponseTime: 1240,
    successRate: 92.3,
    requestCount: 210,
    errorCount: 16,
    status: 'critical',
    lastCheck: new Date(),
  },
];

export default function APIResponseTime({ onCancel, onRefreshEndpoints, onTestEndpoint }: APIResponseTimeProps) {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>(DEFAULT_ENDPOINTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10000);
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

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
    if (onRefreshEndpoints) {
      const refreshedEndpoints = await onRefreshEndpoints();
      setEndpoints(refreshedEndpoints);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEndpoints(prev => prev.map(endpoint => ({
        ...endpoint,
        avgResponseTime: Math.max(50, endpoint.avgResponseTime + (Math.random() - 0.5) * 30),
        p95ResponseTime: Math.max(100, endpoint.p95ResponseTime + (Math.random() - 0.5) * 50),
        p99ResponseTime: Math.max(150, endpoint.p99ResponseTime + (Math.random() - 0.5) * 80),
        successRate: Math.max(80, Math.min(100, endpoint.successRate + (Math.random() - 0.5) * 2)),
        lastCheck: new Date(),
      })));
    }
    setIsRefreshing(false);
  };

  const handleTest = async (endpointName: string) => {
    if (onTestEndpoint) {
      await onTestEndpoint(endpointName);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEndpoints(prev => prev.map(ep => 
        ep.name === endpointName 
          ? { ...ep, avgResponseTime: Math.max(50, ep.avgResponseTime * 0.8), status: 'fast' as const }
          : ep
      ));
    }
  };

  const getStatusColor = (status: APIEndpoint['status']) => {
    switch (status) {
      case 'fast':
        return 'from-green-400 to-emerald-500';
      case 'normal':
        return 'from-blue-400 to-cyan-500';
      case 'slow':
        return 'from-amber-400 to-orange-500';
      case 'critical':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStatusLabel = (status: APIEndpoint['status']) => {
    switch (status) {
      case 'fast':
        return 'Fast';
      case 'normal':
        return 'Normal';
      case 'slow':
        return 'Slow';
      case 'critical':
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  const getMethodColor = (method: APIEndpoint['method']) => {
    switch (method) {
      case 'GET':
        return 'from-green-400 to-emerald-500';
      case 'POST':
        return 'from-blue-400 to-cyan-500';
      case 'PUT':
        return 'from-amber-400 to-orange-500';
      case 'DELETE':
        return 'from-red-400 to-rose-500';
      case 'PATCH':
        return 'from-purple-400 to-pink-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const filteredEndpoints = selectedMethod === 'all' 
    ? endpoints 
    : endpoints.filter(ep => ep.method === selectedMethod);

  const avgResponseTime = filteredEndpoints.reduce((sum, ep) => sum + ep.avgResponseTime, 0) / filteredEndpoints.length;
  const avgSuccessRate = filteredEndpoints.reduce((sum, ep) => sum + ep.successRate, 0) / filteredEndpoints.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thời gian phản hồi API
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredEndpoints.length} endpoints • Avg: {avgResponseTime.toFixed(0)}ms
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
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tần suất cập nhật: {refreshInterval}ms
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="5000">5 giây</option>
                <option value="10000">10 giây</option>
                <option value="30000">30 giây</option>
                <option value="60000">1 phút</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Lọc theo method
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="all">Tất cả</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Response</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgResponseTime.toFixed(0)}ms
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Success Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgSuccessRate.toFixed(1)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Requests</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {filteredEndpoints.reduce((sum, ep) => sum + ep.requestCount, 0).toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Errors</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {filteredEndpoints.reduce((sum, ep) => sum + ep.errorCount, 0)}
          </div>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-2 mb-4">
        {filteredEndpoints.map((endpoint) => (
          <div
            key={endpoint.name}
            className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getMethodColor(endpoint.method)} text-white text-[10px] font-bold rounded-full`}>
                  {endpoint.method}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {endpoint.path}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(endpoint.status)} text-white text-[10px] font-bold rounded-full`}>
                  {getStatusLabel(endpoint.status)}
                </span>
                {endpoint.status === 'fast' && (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                )}
                {endpoint.status === 'critical' && (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {endpoint.avgResponseTime.toFixed(0)}ms
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">P95</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {endpoint.p95ResponseTime.toFixed(0)}ms
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">P99</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {endpoint.p99ResponseTime.toFixed(0)}ms
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Success</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {endpoint.successRate.toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {endpoint.requestCount.toLocaleString()} requests • {endpoint.errorCount} errors
                </span>
              </div>
              {endpoint.status !== 'fast' && (
                <button
                  type="button"
                  onClick={() => handleTest(endpoint.name)}
                  className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Test
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang cập nhật...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Cập nhật API metrics
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Thời gian phản hồi API theo dõi avg, P95, P99 response times, success rate, và error count cho từng endpoint.
        </p>
      </div>
    </div>
  );
}