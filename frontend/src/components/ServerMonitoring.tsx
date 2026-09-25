'use client';

import { useState, useEffect } from 'react';
import { Server, X, Settings, RefreshCw, Activity, Cpu, HardDrive, Thermometer, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface ServerMetrics {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  cpu: number;
  memory: number;
  disk: number;
  temperature: number;
  uptime: number;
  lastCheck: Date;
}

interface ServerMonitoringProps {
  onCancel?: () => void;
  onRefreshServer?: () => Promise<ServerMetrics[]>;
  onRestartServer?: (serverName: string) => Promise<void>;
}

const DEFAULT_SERVERS: ServerMetrics[] = [
  {
    name: 'app-server-1',
    status: 'online',
    cpu: 45,
    memory: 62,
    disk: 78,
    temperature: 42,
    uptime: 1234567,
    lastCheck: new Date(),
  },
  {
    name: 'app-server-2',
    status: 'online',
    cpu: 32,
    memory: 48,
    disk: 65,
    temperature: 38,
    uptime: 987654,
    lastCheck: new Date(),
  },
  {
    name: 'db-server-1',
    status: 'degraded',
    cpu: 85,
    memory: 92,
    disk: 88,
    temperature: 65,
    uptime: 2345678,
    lastCheck: new Date(),
  },
];

export default function ServerMonitoring({ onCancel, onRefreshServer, onRestartServer }: ServerMonitoringProps) {
  const [servers, setServers] = useState<ServerMetrics[]>(DEFAULT_SERVERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(10000);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

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
    if (onRefreshServer) {
      const refreshedServers = await onRefreshServer();
      setServers(refreshedServers);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setServers(prev => prev.map(server => ({
        ...server,
        cpu: Math.max(0, Math.min(100, server.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, server.memory + (Math.random() - 0.5) * 5)),
        temperature: Math.max(20, Math.min(80, server.temperature + (Math.random() - 0.5) * 3)),
        lastCheck: new Date(),
      })));
    }
    setIsRefreshing(false);
  };

  const handleRestart = async (serverName: string) => {
    if (onRestartServer) {
      await onRestartServer(serverName);
    } else {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setServers(prev => prev.map(server => 
        server.name === serverName 
          ? { ...server, status: 'online' as const, cpu: 10, memory: 15, temperature: 35, uptime: 0 }
          : server
      ));
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (status: ServerMetrics['status']) => {
    switch (status) {
      case 'online':
        return 'from-green-400 to-emerald-500';
      case 'degraded':
        return 'from-amber-400 to-orange-500';
      case 'offline':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStatusLabel = (status: ServerMetrics['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'degraded':
        return 'Degraded';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'from-red-400 to-rose-500';
    if (value >= 60) return 'from-amber-400 to-orange-500';
    return 'from-green-400 to-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Server className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Giám sát server
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {servers.length} servers • {servers.filter(s => s.status === 'online').length} online
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
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
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
                  autoRefresh ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
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
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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

      {/* Servers List */}
      <div className="space-y-3 mb-4">
        {servers.map((server) => (
          <div
            key={server.name}
            className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {server.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(server.status)} text-white text-[10px] font-bold rounded-full`}>
                  {getStatusLabel(server.status)}
                </span>
                {server.status === 'online' && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                {server.status === 'degraded' && (
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Cpu className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">CPU</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {server.cpu.toFixed(0)}%
                  </span>
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-slate-400 to-slate-500" />
                </div>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full mt-1">
                  <div
                    className={`h-full bg-gradient-to-r ${getMetricColor(server.cpu)} transition-all`}
                    style={{ width: `${server.cpu}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <HardDrive className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Memory</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {server.memory.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full mt-1">
                  <div
                    className={`h-full bg-gradient-to-r ${getMetricColor(server.memory)} transition-all`}
                    style={{ width: `${server.memory}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <HardDrive className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Disk</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {server.disk.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full mt-1">
                  <div
                    className={`h-full bg-gradient-to-r ${getMetricColor(server.disk)} transition-all`}
                    style={{ width: `${server.disk}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Thermometer className="h-3 w-3 text-slate-500" />
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">Temp</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {server.temperature.toFixed(0)}°C
                  </span>
                </div>
                <div className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-full mt-1">
                  <div
                    className={`h-full bg-gradient-to-r ${getMetricColor(server.temperature / 80 * 100)} transition-all`}
                    style={{ width: `${(server.temperature / 80) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Uptime: {formatUptime(server.uptime)}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  • Last check: {new Date(server.lastCheck).toLocaleTimeString('vi-VN')}
                </span>
              </div>
              {server.status !== 'online' && (
                <button
                  type="button"
                  onClick={() => handleRestart(server.name)}
                  className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Restart
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
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang cập nhật...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Cập nhật server status
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Giám sát server theo dõi CPU, memory, disk, temperature, và uptime của các server trong cluster.
        </p>
      </div>
    </div>
  );
}