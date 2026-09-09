'use client';

import { useState } from 'react';
import { AlertCircle, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Code, User, Clock, Filter, Search, Trash2, ExternalLink } from 'lucide-react';

interface ErrorLog {
  id: string;
  type: 'javascript' | 'network' | 'api' | 'console';
  severity: 'critical' | 'error' | 'warning' | 'info';
  message: string;
  stackTrace?: string;
  url: string;
  userAgent: string;
  userId?: string;
  timestamp: Date;
  occurrences: number;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

interface ErrorTrackingProps {
  onCancel?: () => void;
  onResolveError?: (errorId: string) => Promise<void>;
  onDeleteError?: (errorId: string) => Promise<void>;
  onRefreshErrors?: () => Promise<ErrorLog[]>;
}

const DEFAULT_ERRORS: ErrorLog[] = [
  {
    id: 'err-1',
    type: 'javascript',
    severity: 'critical',
    message: 'TypeError: Cannot read property "map" of undefined',
    stackTrace: 'at MemoryList.tsx:45:12\nat render()',
    url: '/memories',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    userId: 'user-123',
    timestamp: new Date(Date.now() - 3600000),
    occurrences: 15,
    resolved: false,
  },
  {
    id: 'err-2',
    type: 'network',
    severity: 'error',
    message: 'Failed to fetch: NetworkError when attempting to fetch resource',
    url: '/api/memories',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    userId: 'user-456',
    timestamp: new Date(Date.now() - 7200000),
    occurrences: 8,
    resolved: false,
  },
  {
    id: 'err-3',
    type: 'api',
    severity: 'warning',
    message: 'API rate limit exceeded (429)',
    url: '/api/analytics',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    userId: 'user-789',
    timestamp: new Date(Date.now() - 10800000),
    occurrences: 3,
    resolved: true,
    resolvedAt: new Date(Date.now() - 3600000),
    resolvedBy: 'admin',
  },
  {
    id: 'err-4',
    type: 'console',
    severity: 'info',
    message: 'Performance warning: Long task detected (120ms)',
    url: '/map',
    userAgent: 'Mozilla/5.0 (Linux; Android 10)',
    timestamp: new Date(Date.now() - 1800000),
    occurrences: 5,
    resolved: false,
  },
];

export default function ErrorTracking({ onCancel, onResolveError, onDeleteError, onRefreshErrors }: ErrorTrackingProps) {
  const [errors, setErrors] = useState<ErrorLog[]>(DEFAULT_ERRORS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'critical' | 'error' | 'warning' | 'info'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'javascript' | 'network' | 'api' | 'console'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshErrors) {
      const refreshedErrors = await onRefreshErrors();
      setErrors(refreshedErrors);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsRefreshing(false);
  };

  const handleResolve = async (errorId: string) => {
    if (onResolveError) {
      await onResolveError(errorId);
    }
    setErrors(prev => prev.map(error => 
      error.id === errorId 
        ? { ...error, resolved: true, resolvedAt: new Date(), resolvedBy: 'current-user' }
        : error
    ));
  };

  const handleDelete = async (errorId: string) => {
    if (onDeleteError) {
      await onDeleteError(errorId);
    }
    setErrors(prev => prev.filter(error => error.id !== errorId));
    if (selectedError?.id === errorId) {
      setSelectedError(null);
    }
  };

  const getSeverityColor = (severity: ErrorLog['severity']) => {
    switch (severity) {
      case 'critical':
        return 'from-red-400 to-rose-500';
      case 'error':
        return 'from-orange-400 to-amber-500';
      case 'warning':
        return 'from-yellow-400 to-amber-500';
      case 'info':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getTypeIcon = (type: ErrorLog['type']) => {
    switch (type) {
      case 'javascript':
        return <Code className="h-4 w-4" />;
      case 'network':
        return <AlertCircle className="h-4 w-4" />;
      case 'api':
        return <ExternalLink className="h-4 w-4" />;
      case 'console':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredErrors = errors.filter(error => {
    const matchesSeverity = selectedSeverity === 'all' || error.severity === selectedSeverity;
    const matchesType = selectedType === 'all' || error.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      error.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      error.url.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesType && matchesSearch;
  });

  const criticalErrors = errors.filter(e => e.severity === 'critical' && !e.resolved).length;
  const totalErrors = errors.filter(e => !e.resolved).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Theo dõi lỗi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalErrors} unresolved • {criticalErrors} critical
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
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt error tracking
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-capture errors
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Include stack traces
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
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
      <div className="mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm lỗi..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          >
            <option value="all">Tất cả severity</option>
            <option value="critical">Critical</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
          >
            <option value="all">Tất cả type</option>
            <option value="javascript">JavaScript</option>
            <option value="network">Network</option>
            <option value="api">API</option>
            <option value="console">Console</option>
          </select>
        </div>
      </div>

      {/* Error List */}
      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {filteredErrors.length === 0 ? (
          <div className="text-center py-8 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Không có lỗi
            </p>
          </div>
        ) : (
          filteredErrors.map((error) => (
            <div
              key={error.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedError?.id === error.id
                  ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-red-200 dark:hover:border-red-800'
              } ${error.resolved ? 'opacity-60' : ''}`}
              onClick={() => setSelectedError(error)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTypeIcon(error.type)}
                  <span className={`px-2 py-0.5 bg-gradient-to-r ${getSeverityColor(error.severity)} text-white text-[10px] font-bold rounded-full`}>
                    {error.severity}
                  </span>
                  {error.resolved && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {error.occurrences}x
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(error.id);
                    }}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  >
                    <Trash2 className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2 line-clamp-2">
                {error.message}
              </p>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(error.timestamp).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  <span>{error.url}</span>
                </div>
                {error.userId && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{error.userId}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Error Details */}
      {selectedError && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Chi tiết lỗi
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Message:</span>
              <p className="text-sm text-slate-700 dark:text-slate-300">{selectedError.message}</p>
            </div>
            {selectedError.stackTrace && (
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Stack Trace:</span>
                <pre className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2 rounded mt-1 overflow-x-auto">
                  {selectedError.stackTrace}
                </pre>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">URL:</span>
                <p className="text-sm text-slate-700 dark:text-slate-300">{selectedError.url}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">User Agent:</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 truncate">{selectedError.userAgent}</p>
              </div>
            </div>
            {!selectedError.resolved && (
              <button
                type="button"
                onClick={() => handleResolve(selectedError.id)}
                className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Resolve Error
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang cập nhật...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Cập nhật error logs
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
        <p className="text-[10px] text-red-700 dark:text-red-400">
          <strong>Lưu ý:</strong> Theo dõi lỗi tự động bắt JavaScript errors, network errors, API errors, và console warnings với stack traces và occurrence tracking.
        </p>
      </div>
    </div>
  );
}