'use client';

import { useState, useEffect } from 'react';
import { Database, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Activity, HardDrive, Clock, Zap, TrendingUp } from 'lucide-react';

interface DatabaseMetrics {
  name: string;
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
  status: 'healthy' | 'degraded' | 'down';
  connections: number;
  maxConnections: number;
  queriesPerSecond: number;
  avgQueryTime: number;
  dataSize: number;
  dataSizeFormatted: string;
  replicationLag: number;
  lastCheck: Date;
}

interface DatabaseMonitoringProps {
  onCancel?: () => void;
  onRefreshDatabase?: () => Promise<DatabaseMetrics[]>;
  onOptimizeDatabase?: (dbName: string) => Promise<void>;
}

const DEFAULT_DATABASES: DatabaseMetrics[] = [
  {
    name: 'memory-map-db',
    type: 'postgresql',
    status: 'healthy',
    connections: 45,
    maxConnections: 100,
    queriesPerSecond: 125,
    avgQueryTime: 15,
    dataSize: 245.5,
    dataSizeFormatted: '245.5 GB',
    replicationLag: 0,
    lastCheck: new Date(),
  },
  {
    name: 'redis-cache',
    type: 'redis',
    status: 'healthy',
    connections: 28,
    maxConnections: 50,
    queriesPerSecond: 890,
    avgQueryTime: 2,
    dataSize: 12.3,
    dataSizeFormatted: '12.3 GB',
    replicationLag: 0,
    lastCheck: new Date(),
  },
  {
    name: 'analytics-db',
    type: 'postgresql',
    status: 'degraded',
    connections: 85,
    maxConnections: 100,
    queriesPerSecond: 45,
    avgQueryTime: 85,
    dataSize: 512.8,
    dataSizeFormatted: '512.8 GB',
    replicationLag: 15,
    lastCheck: new Date(),
  },
];

export default function DatabaseMonitoring({ onCancel, onRefreshDatabase, onOptimizeDatabase }: DatabaseMonitoringProps) {
  const [databases, setDatabases] = useState<DatabaseMetrics[]>(DEFAULT_DATABASES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10000);

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
    if (onRefreshDatabase) {
      const refreshedDatabases = await onRefreshDatabase();
      setDatabases(refreshedDatabases);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDatabases(prev => prev.map(db => ({
        ...db,
        connections: Math.max(0, Math.min(db.maxConnections, db.connections + Math.floor((Math.random() - 0.5) * 10))),
        queriesPerSecond: Math.max(0, db.queriesPerSecond + Math.floor((Math.random() - 0.5) * 50)),
        avgQueryTime: Math.max(1, db.avgQueryTime + (Math.random() - 0.5) * 5),
        lastCheck: new Date(),
      })));
    }
    setIsRefreshing(false);
  };

  const handleOptimize = async (dbName: string) => {
    if (onOptimizeDatabase) {
      await onOptimizeDatabase(dbName);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDatabases(prev => prev.map(db => 
        db.name === dbName 
          ? { ...db, avgQueryTime: Math.max(1, db.avgQueryTime * 0.7), status: 'healthy' as const }
          : db
      ));
    }
  };

  const getStatusColor = (status: DatabaseMetrics['status']) => {
    switch (status) {
      case 'healthy':
        return 'from-green-400 to-emerald-500';
      case 'degraded':
        return 'from-amber-400 to-orange-500';
      case 'down':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStatusLabel = (status: DatabaseMetrics['status']) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'degraded':
        return 'Degraded';
      case 'down':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  const getTypeLabel = (type: DatabaseMetrics['type']) => {
    switch (type) {
      case 'postgresql':
        return 'PostgreSQL';
      case 'mysql':
        return 'MySQL';
      case 'mongodb':
        return 'MongoDB';
      case 'redis':
        return 'Redis';
      default:
        return type;
    }
  };

  const getTypeColor = (type: DatabaseMetrics['type']) => {
    switch (type) {
      case 'postgresql':
        return 'from-blue-400 to-cyan-500';
      case 'mysql':
        return 'from-orange-400 to-amber-500';
      case 'mongodb':
        return 'from-green-400 to-emerald-500';
      case 'redis':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getMetricColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'from-red-400 to-rose-500';
    if (percentage >= 60) return 'from-amber-400 to-orange-500';
    return 'from-green-400 to-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Giám sát database
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {databases.length} databases • {databases.filter(d => d.status === 'healthy').length} healthy
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
                  autoRefresh ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
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
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="5000">5 giây</option>
                <option value="10000">10 giây</option>
                <option value="30000">30 giây</option>
                <option value="60000">1 phút</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Databases List */}
      <div className="space-y-3 mb-4">
        {databases.map((db) => (
          <div
            key={db.name}
            className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {db.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getTypeColor(db.type)} text-white text-[10px] font-bold rounded-full`}>
                  {getTypeLabel(db.type)}
                </span>
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(db.status)} text-white text-[10px] font-bold rounded-full`}>
                  {getStatusLabel(db.status)}
                </span>
                {db.status === 'healthy' && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                {db.status === 'degraded' && (
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Activity className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Connections</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {db.connections}/{db.maxConnections}
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full mt-1">
                  <div
                    className={`h-full bg-gradient-to-r ${getMetricColor(db.connections, db.maxConnections)} transition-all`}
                    style={{ width: `${(db.connections / db.maxConnections) * 100}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Zap className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">QPS</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {db.queriesPerSecond}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  queries/sec
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {db.avgQueryTime.toFixed(1)}ms
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  avg query
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <HardDrive className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Size</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {db.dataSizeFormatted}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {db.replicationLag > 0 && `Lag: ${db.replicationLag}s`}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Last check: {new Date(db.lastCheck).toLocaleTimeString('vi-VN')}
              </span>
              {db.status !== 'healthy' && (
                <button
                  type="button"
                  onClick={() => handleOptimize(db.name)}
                  className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Optimize
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
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang cập nhật...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Cập nhật database status
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Giám sát database theo dõi connections, queries per second, avg query time, data size, và replication lag.
        </p>
      </div>
    </div>
  );
}