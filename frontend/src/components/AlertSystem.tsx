'use client';

import { useState } from 'react';
import { Bell, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Info, Mail, Phone, MessageSquare, Trash2, Clock, Filter, Plus } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  source: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
}

interface AlertRule {
  id: string;
  name: string;
  metric: string;
  threshold: number;
  condition: 'greater' | 'less' | 'equal';
  enabled: boolean;
  channels: string[];
}

interface AlertSystemProps {
  onCancel?: () => void;
  onAcknowledgeAlert?: (alertId: string) => Promise<void>;
  onResolveAlert?: (alertId: string) => Promise<void>;
  onCreateRule?: (rule: AlertRule) => Promise<void>;
}

const DEFAULT_ALERTS: Alert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    source: 'Server',
    message: 'CPU usage exceeded 90% on app-server-1',
    timestamp: new Date(Date.now() - 3600000),
    acknowledged: false,
    resolved: false,
  },
  {
    id: 'alert-2',
    type: 'warning',
    source: 'Database',
    message: 'Disk space running low on db-server-1 (85% used)',
    timestamp: new Date(Date.now() - 7200000),
    acknowledged: true,
    resolved: false,
  },
  {
    id: 'alert-3',
    type: 'info',
    source: 'API',
    message: 'API response time increased for /api/analytics endpoint',
    timestamp: new Date(Date.now() - 10800000),
    acknowledged: true,
    resolved: true,
  },
  {
    id: 'alert-4',
    type: 'critical',
    source: 'Database',
    message: 'Connection pool exhausted on analytics-db',
    timestamp: new Date(Date.now() - 1800000),
    acknowledged: false,
    resolved: false,
  },
];

const DEFAULT_RULES: AlertRule[] = [
  {
    id: 'rule-1',
    name: 'High CPU Alert',
    metric: 'cpu',
    threshold: 90,
    condition: 'greater',
    enabled: true,
    channels: ['email', 'slack'],
  },
  {
    id: 'rule-2',
    name: 'Low Memory Alert',
    metric: 'memory',
    threshold: 15,
    condition: 'less',
    enabled: true,
    channels: ['email'],
  },
  {
    id: 'rule-3',
    name: 'Disk Space Alert',
    metric: 'disk',
    threshold: 85,
    condition: 'greater',
    enabled: true,
    channels: ['email', 'slack', 'sms'],
  },
];

export default function AlertSystem({ onCancel, onAcknowledgeAlert, onResolveAlert, onCreateRule }: AlertSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>(DEFAULT_ALERTS);
  const [rules, setRules] = useState<AlertRule[]>(DEFAULT_RULES);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'alerts' | 'rules'>('alerts');
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [showNewRule, setShowNewRule] = useState(false);

  const handleAcknowledge = async (alertId: string) => {
    if (onAcknowledgeAlert) {
      await onAcknowledgeAlert(alertId);
    }
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleResolve = async (alertId: string) => {
    if (onResolveAlert) {
      await onResolveAlert(alertId);
    }
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true, acknowledged: true } : alert
    ));
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getTypeColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'from-red-400 to-rose-500';
      case 'warning':
        return 'from-amber-400 to-orange-500';
      case 'info':
        return 'from-blue-400 to-cyan-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-3 w-3" />;
      case 'slack':
        return <MessageSquare className="h-3 w-3" />;
      case 'sms':
        return <Phone className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  const filteredAlerts = filterType === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.type === filterType);

  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.resolved).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hệ thống cảnh báo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeAlerts} active • {criticalAlerts} critical
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
            Cài đặt cảnh báo
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Kênh mặc định
              </span>
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">
                  Email
                </span>
                <span className="px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded text-xs text-slate-700 dark:text-slate-300">
                  Slack
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tần suất kiểm tra
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">1 phút</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'alerts'
              ? 'bg-red-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          Cảnh báo ({alerts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'rules'
              ? 'bg-red-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          Quy tắc ({rules.length})
        </button>
      </div>

      {activeTab === 'alerts' && (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-800 dark:bg-slate-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterType('critical')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'critical'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Critical
            </button>
            <button
              type="button"
              onClick={() => setFilterType('warning')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'warning'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Warning
            </button>
            <button
              type="button"
              onClick={() => setFilterType('info')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'info'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Info
            </button>
          </div>

          {/* Alerts List */}
          <div className="space-y-2 mb-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Không có cảnh báo
                </p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-2 ${
                    alert.resolved 
                      ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${getTypeColor(alert.type)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {alert.source}
                          </span>
                          {alert.acknowledged && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                          {alert.resolved && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold rounded-full">
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-slate-500" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {new Date(alert.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    {!alert.resolved && (
                      <div className="flex gap-2">
                        {!alert.acknowledged && (
                          <button
                            type="button"
                            onClick={() => handleAcknowledge(alert.id)}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleResolve(alert.id)}
                          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {activeTab === 'rules' && (
        <>
          <div className="space-y-2 mb-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {rule.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      rule.enabled 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                    }`}>
                      {rule.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleRule(rule.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      rule.enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        rule.enabled ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {rule.metric} {rule.condition} {rule.threshold}%
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Channels:</span>
                  {rule.channels.map((channel) => (
                    <span
                      key={channel}
                      className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      {getChannelIcon(channel)}
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowNewRule(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white text-sm font-semibold rounded-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Tạo quy tắc mới
          </button>
        </>
      )}

      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
        <p className="text-[10px] text-red-700 dark:text-red-400">
          <strong>Lưu ý:</strong> Hệ thống cảnh báo tự động giám sát và thông báo khi có vấn đề với server, database, hoặc API endpoints.
        </p>
      </div>
    </div>
  );
}