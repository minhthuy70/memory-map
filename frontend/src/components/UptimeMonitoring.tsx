'use client';

import { useState, useEffect } from 'react';
import { Activity, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Clock, Calendar, TrendingUp, Zap } from 'lucide-react';

interface UptimeRecord {
  timestamp: Date;
  status: 'up' | 'down' | 'degraded';
  responseTime: number;
}

interface ServiceUptime {
  name: string;
  url: string;
  uptime: number;
  availability: number;
  avgResponseTime: number;
  incidents: number;
  lastIncident: Date | null;
  records: UptimeRecord[];
  status: 'operational' | 'degraded' | 'down';
}

interface UptimeMonitoringProps {
  onCancel?: () => void;
  onRefreshUptime?: () => Promise<ServiceUptime[]>;
  onCheckService?: (serviceName: string) => Promise<void>;
}

const DEFAULT_SERVICES: ServiceUptime[] = [
  {
    name: 'Main API',
    url: 'https://api.memory-map.com',
    uptime: 99.95,
    availability: 99.95,
    avgResponseTime: 120,
    incidents: 2,
    lastIncident: new Date(Date.now() - 86400000 * 7),
    records: Array.from({ length: 90 }, (_, i) => ({
      timestamp: new Date(Date.now() - (90 - i) * 3600000),
      status: Math.random() > 0.02 ? 'up' : 'degraded',
      responseTime: Math.random() * 200 + 50,
    })),
    status: 'operational',
  },
  {
    name: 'Frontend',
    url: 'https://memory-map.com',
    uptime: 99.98,
    availability: 99.98,
    avgResponseTime: 85,
    incidents: 1,
    lastIncident: new Date(Date.now() - 86400000 * 14),
    records: Array.from({ length: 90 }, (_, i) => ({
      timestamp: new Date(Date.now() - (90 - i) * 3600000),
      status: Math.random() > 0.01 ? 'up' : 'degraded',
      responseTime: Math.random() * 150 + 30,
    })),
    status: 'operational',
  },
  {
    name: 'Database',
    url: 'internal-db',
    uptime: 99.99,
    availability: 99.99,
    avgResponseTime: 15,
    incidents: 0,
    lastIncident: null,
    records: Array.from({ length: 90 }, (_, i) => ({
      timestamp: new Date(Date.now() - (90 - i) * 3600000),
      status: 'up',
      responseTime: Math.random() * 20 + 5,
    })),
    status: 'operational',
  },
  {
    name: 'CDN',
    url: 'https://cdn.memory-map.com',
    uptime: 99.90,
    availability: 99.90,
    avgResponseTime: 45,
    incidents: 4,
    lastIncident: new Date(Date.now() - 86400000 * 3),
    records: Array.from({ length: 90 }, (_, i) => ({
      timestamp: new Date(Date.now() - (90 - i) * 3600000),
      status: Math.random() > 0.05 ? 'up' : 'degraded',
      responseTime: Math.random() * 80 + 20,
    })),
    status: 'degraded',
  },
];

export default function UptimeMonitoring({ onCancel, onRefreshUptime, onCheckService }: UptimeMonitoringProps) {
  const [services, setServices] = useState<ServiceUptime[]>(DEFAULT_SERVICES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000);
  const [selectedService, setSelectedService] = useState<string | null>(null);

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
    if (onRefreshUptime) {
      const refreshedServices = await onRefreshUptime();
      setServices(refreshedServices);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setServices(prev => prev.map(service => ({
        ...service,
        avgResponseTime: Math.max(10, service.avgResponseTime + (Math.random() - 0.5) * 20),
        records: [
          ...service.records.slice(-89),
          {
            timestamp: new Date(),
            status: Math.random() > 0.05 ? 'up' : 'degraded',
            responseTime: Math.random() * 200 + 50,
          },
        ],
      })));
    }
    setIsRefreshing(false);
  };

  const handleCheck = async (serviceName: string) => {
    if (onCheckService) {
      await onCheckService(serviceName);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => prev.map(service => 
        service.name === serviceName 
          ? { ...service, status: 'operational' as const, avgResponseTime: Math.max(10, service.avgResponseTime * 0.8) }
          : service
      ));
    }
  };

  const getStatusColor = (status: ServiceUptime['status']) => {
    switch (status) {
      case 'operational':
        return 'from-green-400 to-emerald-500';
      case 'degraded':
        return 'from-amber-400 to-orange-500';
      case 'down':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStatusLabel = (status: ServiceUptime['status']) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded';
      case 'down':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return 'from-green-400 to-emerald-500';
    if (uptime >= 99.5) return 'from-blue-400 to-cyan-500';
    if (uptime >= 99.0) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-rose-500';
  };

  const renderUptimeTimeline = (records: UptimeRecord[]) => {
    return (
      <div className="flex gap-0.5 h-2">
        {records.map((record, index) => (
          <div
            key={index}
            className={`flex-1 rounded-sm ${
              record.status === 'up' 
                ? 'bg-green-400' 
                : record.status === 'degraded' 
                  ? 'bg-amber-400' 
                  : 'bg-red-400'
            }`}
            title={`${new Date(record.timestamp).toLocaleString('vi-VN')} - ${record.status}`}
          />
        ))}
      </div>
    );
  };

  const overallUptime = services.reduce((sum, s) => sum + s.uptime, 0) / services.length;
  const overallAvailability = services.reduce((sum, s) => sum + s.availability, 0) / services.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Giám sát uptime
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {services.length} services • {overallUptime.toFixed(2)}% uptime
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
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
                  autoRefresh ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
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
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="10000">10 giây</option>
                <option value="30000">30 giây</option>
                <option value="60000">1 phút</option>
                <option value="300000">5 phút</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Overall Uptime</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {overallUptime.toFixed(2)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Availability</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {overallAvailability.toFixed(2)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Incidents</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {services.reduce((sum, s) => sum + s.incidents, 0)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Response</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(services.reduce((sum, s) => sum + s.avgResponseTime, 0) / services.length).toFixed(0)}ms
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3 mb-4">
        {services.map((service) => (
          <div
            key={service.name}
            className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {service.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(service.status)} text-white text-[10px] font-bold rounded-full`}>
                  {getStatusLabel(service.status)}
                </span>
                {service.status === 'operational' && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                {service.status === 'degraded' && (
                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                )}
              </div>
            </div>

            {/* Uptime Timeline */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400">90 days uptime</span>
                <span className={`text-xs font-semibold bg-gradient-to-r ${getUptimeColor(service.uptime)} bg-clip-text text-transparent`}>
                  {service.uptime.toFixed(2)}%
                </span>
              </div>
              {renderUptimeTimeline(service.records)}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Availability</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {service.availability.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Avg Response</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {service.avgResponseTime.toFixed(0)}ms
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Incidents</div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {service.incidents}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-slate-500" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {service.lastIncident 
                    ? `Last incident: ${new Date(service.lastIncident).toLocaleDateString('vi-VN')}`
                    : 'No incidents'
                  }
                </span>
              </div>
              {service.status !== 'operational' && (
                <button
                  type="button"
                  onClick={() => handleCheck(service.name)}
                  className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Check
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
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang cập nhật...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Cập nhật uptime status
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Giám sát uptime theo dõi thời gian hoạt động, availability, incidents, và response time của các services.
        </p>
      </div>
    </div>
  );
}