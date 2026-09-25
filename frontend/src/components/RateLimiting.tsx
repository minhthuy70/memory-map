'use client';

import { useState } from 'react';
import { Gauge, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Shield, Zap } from 'lucide-react';

interface RateLimitingProps {
  onCancel?: () => void;
}

interface RateLimitRule {
  id: string;
  name: string;
  apiKey?: string;
  endpoint?: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  isBurstEnabled: boolean;
  burstLimit: number;
  status: 'active' | 'disabled';
}

interface RateLimitStats {
  currentUsage: number;
  limit: number;
  resetTime: string;
  blockedRequests: number;
}

interface LimitingSettings {
  defaultRPM: number;
  defaultRPH: number;
  defaultRPD: number;
  enableBurst: boolean;
  defaultBurstLimit: number;
  blockOnExceed: boolean;
}

export default function RateLimiting({ onCancel }: RateLimitingProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRateLimitingEnabled, setIsRateLimitingEnabled] = useState(true);

  const [rateLimitRules, setRateLimitRules] = useState<RateLimitRule[]>([
    { id: '1', name: 'Production Key', apiKey: 'sk_live_...', requestsPerMinute: 1000, requestsPerHour: 50000, requestsPerDay: 1000000, isBurstEnabled: true, burstLimit: 1200, status: 'active' },
    { id: '2', name: 'Development Key', apiKey: 'sk_test_...', requestsPerMinute: 100, requestsPerHour: 5000, requestsPerDay: 100000, isBurstEnabled: true, burstLimit: 150, status: 'active' },
    { id: '3', name: 'Free Tier', apiKey: undefined, requestsPerMinute: 10, requestsPerHour: 500, requestsPerDay: 10000, isBurstEnabled: false, burstLimit: 0, status: 'active' },
  ]);

  const [rateLimitStats, setRateLimitStats] = useState<RateLimitStats>({
    currentUsage: 750,
    limit: 1000,
    resetTime: '2024-01-17 19:00',
    blockedRequests: 25,
  });

  const [limitingSettings, setLimitingSettings] = useState<LimitingSettings>({
    defaultRPM: 100,
    defaultRPH: 5000,
    defaultRPD: 100000,
    enableBurst: true,
    defaultBurstLimit: 120,
    blockOnExceed: true,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'disabled': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const toggleRule = (id: string) => {
    setRateLimitRules(rateLimitRules.map(rule => 
      rule.id === id ? { ...rule, status: rule.status === 'active' ? 'disabled' : 'active' } : rule
    ));
  };

  const createRule = () => {
    const newRule: RateLimitRule = {
      id: Date.now().toString(),
      name: 'New Rule',
      requestsPerMinute: limitingSettings.defaultRPM,
      requestsPerHour: limitingSettings.defaultRPH,
      requestsPerDay: limitingSettings.defaultRPD,
      isBurstEnabled: limitingSettings.enableBurst,
      burstLimit: limitingSettings.defaultBurstLimit,
      status: 'active',
    };
    setRateLimitRules([...rateLimitRules, newRule]);
  };

  const usagePercentage = (rateLimitStats.currentUsage / rateLimitStats.limit) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Rate Limiting per API Key
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Giới hạn tốc độ theo API key
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isRateLimitingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isRateLimitingEnabled ? 'Enabled' : 'Disabled'}
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
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Rules</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{rateLimitRules.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{rateLimitRules.filter(r => r.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Blocked</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{rateLimitStats.blockedRequests}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Usage</p>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{usagePercentage.toFixed(1)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isRateLimitingEnabled}
              onChange={(e) => setIsRateLimitingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Rate Limiting</span>
          </div>
          <button
            type="button"
            onClick={createRule}
            className="px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Rule
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Current Usage</h4>
          <div className="space-y-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Gauge className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">Rate Limit Status</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{rateLimitStats.currentUsage} / {rateLimitStats.limit} requests/min</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${usagePercentage > 90 ? 'bg-red-500' : usagePercentage > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Reset: {rateLimitStats.resetTime}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Blocked: {rateLimitStats.blockedRequests}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Rate Limit Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-red-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default RPM</span>
              </div>
              <input
                type="number"
                value={limitingSettings.defaultRPM}
                onChange={(e) => setLimitingSettings({ ...limitingSettings, defaultRPM: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default RPH</span>
              </div>
              <input
                type="number"
                value={limitingSettings.defaultRPH}
                onChange={(e) => setLimitingSettings({ ...limitingSettings, defaultRPH: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default RPD</span>
              </div>
              <input
                type="number"
                value={limitingSettings.defaultRPD}
                onChange={(e) => setLimitingSettings({ ...limitingSettings, defaultRPD: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Enable Burst</span>
              </div>
              <input
                type="checkbox"
                checked={limitingSettings.enableBurst}
                onChange={(e) => setLimitingSettings({ ...limitingSettings, enableBurst: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Block on Exceed</span>
              </div>
              <input
                type="checkbox"
                checked={limitingSettings.blockOnExceed}
                onChange={(e) => setLimitingSettings({ ...limitingSettings, blockOnExceed: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Rate Limit Rules</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {rateLimitRules.map((rule) => (
              <div key={rule.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <Gauge className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{rule.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(rule.status)}`}>
                          {rule.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{rule.apiKey || 'All Keys'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRule(rule.id)}
                    className={`px-2 py-1 rounded text-xs ${rule.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {rule.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">RPM: {rule.requestsPerMinute}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">RPH: {rule.requestsPerHour}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">RPD: {rule.requestsPerDay}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Burst: {rule.isBurstEnabled ? `Yes (${rule.burstLimit})` : 'No'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Rate Limiting Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Set different limits for different API keys</li>
              <li>• Enable burst for temporary traffic spikes</li>
              <li>• Monitor usage to prevent blocking</li>
              <li>• Configure block-on-exceed for strict limits</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
