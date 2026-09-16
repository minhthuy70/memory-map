'use client';

import { useState } from 'react';
import { ArrowRight, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink } from 'lucide-react';

interface IFTTTIntegrationProps {
  onCancel?: () => void;
}

interface IFTTTApplet {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isEnabled: boolean;
  lastRun?: string;
  runCount: number;
  status: 'active' | 'paused' | 'error';
}

interface IFTTTService {
  id: string;
  name: string;
  category: string;
  isConnected: boolean;
  apiKey?: string;
}

interface IFTTTSettings {
  autoSync: boolean;
  syncInterval: number;
  errorNotification: boolean;
  webhookKey: string;
}

export default function IFTTTIntegration({ onCancel }: IFTTTIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isIFTTTEnabled, setIsIFTTTEnabled] = useState(true);

  const [iftttApplets, setIftttApplets] = useState<IFTTTApplet[]>([
    { id: '1', name: 'Memory to Evernote', trigger: 'New Memory Created', action: 'Create Evernote Note', isEnabled: true, lastRun: '2024-01-17 18:30', runCount: 98, status: 'active' },
    { id: '2', name: 'Memory to Twitter', trigger: 'New Memory Created', action: 'Post Tweet', isEnabled: true, lastRun: '2024-01-16 10:15', runCount: 67, status: 'active' },
    { id: '3', name: 'Photo Backup', trigger: 'New Photo Memory', action: 'Save to Google Drive', isEnabled: false, lastRun: '2024-01-15 14:00', runCount: 34, status: 'paused' },
  ]);

  const [iftttServices, setIftttServices] = useState<IFTTTService[]>([
    { id: '1', name: 'Evernote', category: 'Productivity', isConnected: true },
    { id: '2', name: 'Twitter', category: 'Social', isConnected: true },
    { id: '3', name: 'Google Drive', category: 'Storage', isConnected: false },
    { id: '4', name: 'Dropbox', category: 'Storage', isConnected: false },
  ]);

  const [iftttSettings, setIftttSettings] = useState<IFTTTSettings>({
    autoSync: true,
    syncInterval: 10,
    errorNotification: true,
    webhookKey: 'ifttt_webhook_key_12345',
  });

  const toggleApplet = (id: string) => {
    setIftttApplets(iftttApplets.map(applet => 
      applet.id === id ? { ...applet, isEnabled: !applet.isEnabled } : applet
    ));
  };

  const deleteApplet = (id: string) => {
    setIftttApplets(iftttApplets.filter(applet => applet.id !== id));
  };

  const createApplet = () => {
    const newApplet: IFTTTApplet = {
      id: Date.now().toString(),
      name: 'New Applet',
      trigger: 'New Memory Created',
      action: 'Custom Action',
      isEnabled: true,
      runCount: 0,
      status: 'active',
    };
    setIftttApplets([...iftttApplets, newApplet]);
  };

  const connectService = (id: string) => {
    setIftttServices(iftttServices.map(service => 
      service.id === id ? { ...service, isConnected: true } : service
    ));
  };

  const disconnectService = (id: string) => {
    setIftttServices(iftttServices.map(service => 
      service.id === id ? { ...service, isConnected: false } : service
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
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <ArrowRight className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              IFTTT Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tích hợp IFTTT
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isIFTTTEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isIFTTTEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Applets</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{iftttApplets.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{iftttApplets.filter(a => a.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Runs</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{iftttApplets.reduce((acc, a) => acc + a.runCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected Services</p>
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{iftttServices.filter(s => s.isConnected).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isIFTTTEnabled}
              onChange={(e) => setIsIFTTTEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable IFTTT</span>
          </div>
          <button
            type="button"
            onClick={createApplet}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Applet
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">IFTTT Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Sync</span>
              </div>
              <input
                type="checkbox"
                checked={iftttSettings.autoSync}
                onChange={(e) => setIftttSettings({ ...iftttSettings, autoSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sync Interval (min)</span>
              </div>
              <input
                type="number"
                value={iftttSettings.syncInterval}
                onChange={(e) => setIftttSettings({ ...iftttSettings, syncInterval: parseInt(e.target.value) })}
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
                checked={iftttSettings.errorNotification}
                onChange={(e) => setIftttSettings({ ...iftttSettings, errorNotification: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Webhook Key</span>
              </div>
              <input
                type="text"
                value={iftttSettings.webhookKey}
                onChange={(e) => setIftttSettings({ ...iftttSettings, webhookKey: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">IFTTT Applets</h4>
          <div className="space-y-2">
            {iftttApplets.map((applet) => (
              <div key={applet.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <ArrowRight className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{applet.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(applet.status)}`}>
                          {applet.status}
                        </span>
                        {applet.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{applet.trigger} → {applet.action}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleApplet(applet.id)}
                      className={`px-2 py-1 rounded text-xs ${applet.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {applet.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteApplet(applet.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Runs: {applet.runCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Run: {applet.lastRun || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Connected Services</h4>
          <div className="space-y-2">
            {iftttServices.map((service) => (
              <div key={service.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{service.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${service.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {service.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{service.category}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => service.isConnected ? disconnectService(service.id) : connectService(service.id)}
                    className={`px-2 py-1 rounded text-xs ${service.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {service.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">IFTTT Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create applets to automate memory workflows</li>
              <li>• Connect popular services via IFTTT platform</li>
              <li>• Set triggers: new memory, memory updated, memory deleted</li>
              <li>• Configure actions: create notes, post updates, sync data</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
