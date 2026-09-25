'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Info,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Zap
} from 'lucide-react';

interface ZapierIntegrationProps {
  onCancel?: () => void;
}

interface ZapierZap {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isEnabled: boolean;
  lastRun?: string;
  runCount: number;
  status: 'active' | 'paused' | 'error';
}

interface ZapierApp {
  id: string;
  name: string;
  category: string;
  isConnected: boolean;
  apiKey?: string;
}

interface ZapierSettings {
  autoSync: boolean;
  syncInterval: number;
  errorNotification: boolean;
  webhookUrl: string;
}

export default function ZapierIntegration({ onCancel }: ZapierIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isZapierEnabled, setIsZapierEnabled] = useState(true);

  const [zapierZaps, setZapierZaps] = useState<ZapierZap[]>([
    { id: '1', name: 'Memory to BookMarked', trigger: 'New Memory Created', action: 'Create BookMarked Page', isEnabled: true, lastRun: '2024-01-17 18:30', runCount: 125, status: 'active' },
    { id: '2', name: 'Memory to Slack', trigger: 'New Memory Created', action: 'Send Slack Message', isEnabled: true, lastRun: '2024-01-16 10:15', runCount: 89, status: 'active' },
    { id: '3', name: 'Calendar RefreshCcw', trigger: 'Memory Date', action: 'Add to Google Calendar', isEnabled: false, lastRun: '2024-01-15 14:00', runCount: 45, status: 'paused' },
  ]);

  const [zapierApps, setZapierApps] = useState<ZapierApp[]>([
    { id: '1', name: 'BookMarked', category: 'Productivity', isConnected: true },
    { id: '2', name: 'Slack', category: 'Communication', isConnected: true },
    { id: '3', name: 'Google Sheets', category: 'Productivity', isConnected: false },
    { id: '4', name: 'Trello', category: 'Productivity', isConnected: false },
  ]);

  const [zapierSettings, setZapierSettings] = useState<ZapierSettings>({
    autoSync: true,
    syncInterval: 5,
    errorNotification: true,
    webhookUrl: 'https://hooks.zapier.com/hooks/memory-map',
  });

  const toggleZap = (id: string) => {
    setZapierZaps(zapierZaps.map(zap => 
      zap.id === id ? { ...zap, isEnabled: !zap.isEnabled } : zap
    ));
  };

  const deleteZap = (id: string) => {
    setZapierZaps(zapierZaps.filter(zap => zap.id !== id));
  };

  const createZap = () => {
    const newZap: ZapierZap = {
      id: Date.now().toString(),
      name: 'New Zap',
      trigger: 'New Memory Created',
      action: 'Custom Action',
      isEnabled: true,
      runCount: 0,
      status: 'active',
    };
    setZapierZaps([...zapierZaps, newZap]);
  };

  const connectApp = (id: string) => {
    setZapierApps(zapierApps.map(app => 
      app.id === id ? { ...app, isConnected: true } : app
    ));
  };

  const disconnectApp = (id: string) => {
    setZapierApps(zapierApps.map(app => 
      app.id === id ? { ...app, isConnected: false } : app
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'paused': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Zapier Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tích hợp Zapier (1500+ apps)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isZapierEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isZapierEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Zaps</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{zapierZaps.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{zapierZaps.filter(z => z.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Runs</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{zapierZaps.reduce((acc, z) => acc + z.runCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected Apps</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{zapierApps.filter(a => a.isConnected).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isZapierEnabled}
              onChange={(e) => setIsZapierEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Zapier</span>
          </div>
          <button
            type="button"
            onClick={createZap}
            className="px-3 py-1.5 rounded-lg text-xs bg-orange-600 hover:bg-orange-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Zap
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Zapier Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto RefreshCcw</span>
              </div>
              <input
                type="checkbox"
                checked={zapierSettings.autoSync}
                onChange={(e) => setZapierSettings({ ...zapierSettings, autoSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">RefreshCcw Interval (min)</span>
              </div>
              <input
                type="number"
                value={zapierSettings.syncInterval}
                onChange={(e) => setZapierSettings({ ...zapierSettings, syncInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Error Notification</span>
              </div>
              <input
                type="checkbox"
                checked={zapierSettings.errorNotification}
                onChange={(e) => setZapierSettings({ ...zapierSettings, errorNotification: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Webhook URL</span>
              </div>
              <input
                type="text"
                value={zapierSettings.webhookUrl}
                onChange={(e) => setZapierSettings({ ...zapierSettings, webhookUrl: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Zapier Zaps</h4>
          <div className="space-y-2">
            {zapierZaps.map((zap) => (
              <div key={zap.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Zap className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{zap.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(zap.status)}`}>
                          {zap.status}
                        </span>
                        {zap.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{zap.trigger} → {zap.action}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleZap(zap.id)}
                      className={`px-2 py-1 rounded text-xs ${zap.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {zap.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteZap(zap.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Runs: {zap.runCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Run: {zap.lastRun || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Connected Apps</h4>
          <div className="space-y-2">
            {zapierApps.map((app) => (
              <div key={app.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{app.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${app.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {app.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{app.category}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => app.isConnected ? disconnectApp(app.id) : connectApp(app.id)}
                    className={`px-2 py-1 rounded text-xs ${app.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {app.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Zapier Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create Zaps to automate memory workflows</li>
              <li>• Connect 1500+ apps via Zapier platform</li>
              <li>• Set triggers: new memory, memory updated, memory deleted</li>
              <li>• Configure actions: create pages, send messages, sync data</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
