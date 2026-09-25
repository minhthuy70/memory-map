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
  Workflow
} from 'lucide-react';

interface MakeIntegrationProps {
  onCancel?: () => void;
}

interface MakeScenario {
  id: string;
  name: string;
  trigger: string;
  action: string;
  isEnabled: boolean;
  lastRun?: string;
  runCount: number;
  status: 'active' | 'paused' | 'error';
}

interface MakeModule {
  id: string;
  name: string;
  category: string;
  isConnected: boolean;
  apiKey?: string;
}

interface MakeSettings {
  autoSync: boolean;
  syncInterval: number;
  errorNotification: boolean;
  webhookUrl: string;
}

export default function MakeIntegration({ onCancel }: MakeIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isMakeEnabled, setIsMakeEnabled] = useState(true);

  const [makeScenarios, setMakeScenarios] = useState<MakeScenario[]>([
    { id: '1', name: 'Memory to Airtable', trigger: 'New Memory Created', action: 'Create Airtable Record', isEnabled: true, lastRun: '2024-01-17 18:30', runCount: 76, status: 'active' },
    { id: '2', name: 'Memory to Trello', trigger: 'New Memory Created', action: 'Create Trello Card', isEnabled: true, lastRun: '2024-01-16 10:15', runCount: 54, status: 'active' },
    { id: '3', name: 'Email Notification', trigger: 'Memory Updated', action: 'Send Email', isEnabled: false, lastRun: '2024-01-15 14:00', runCount: 28, status: 'paused' },
  ]);

  const [makeModules, setMakeModules] = useState<MakeModule[]>([
    { id: '1', name: 'Airtable', category: 'Database', isConnected: true },
    { id: '2', name: 'Trello', category: 'Project Management', isConnected: true },
    { id: '3', name: 'Google Sheets', category: 'Spreadsheets', isConnected: false },
    { id: '4', name: 'Salesforce', category: 'CRM', isConnected: false },
  ]);

  const [makeSettings, setMakeSettings] = useState<MakeSettings>({
    autoSync: true,
    syncInterval: 15,
    errorNotification: true,
    webhookUrl: 'https://hook.make.com/memory-map',
  });

  const toggleScenario = (id: string) => {
    setMakeScenarios(makeScenarios.map(scenario => 
      scenario.id === id ? { ...scenario, isEnabled: !scenario.isEnabled } : scenario
    ));
  };

  const deleteScenario = (id: string) => {
    setMakeScenarios(makeScenarios.filter(scenario => scenario.id !== id));
  };

  const createScenario = () => {
    const newScenario: MakeScenario = {
      id: Date.now().toString(),
      name: 'New Scenario',
      trigger: 'New Memory Created',
      action: 'Custom Action',
      isEnabled: true,
      runCount: 0,
      status: 'active',
    };
    setMakeScenarios([...makeScenarios, newScenario]);
  };

  const connectModule = (id: string) => {
    setMakeModules(makeModules.map(module => 
      module.id === id ? { ...module, isConnected: true } : module
    ));
  };

  const disconnectModule = (id: string) => {
    setMakeModules(makeModules.map(module => 
      module.id === id ? { ...module, isConnected: false } : module
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
          <div className="p-2 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl">
            <Workflow className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Make (Integromat) Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tích hợp Make
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isMakeEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isMakeEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Scenarios</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{makeScenarios.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{makeScenarios.filter(s => s.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Runs</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{makeScenarios.reduce((acc, s) => acc + s.runCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected Modules</p>
            <p className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">{makeModules.filter(m => m.isConnected).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isMakeEnabled}
              onChange={(e) => setIsMakeEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Make</span>
          </div>
          <button
            type="button"
            onClick={createScenario}
            className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Scenario
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Make Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto RefreshCcw</span>
              </div>
              <input
                type="checkbox"
                checked={makeSettings.autoSync}
                onChange={(e) => setMakeSettings({ ...makeSettings, autoSync: e.target.checked })}
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
                value={makeSettings.syncInterval}
                onChange={(e) => setMakeSettings({ ...makeSettings, syncInterval: parseInt(e.target.value) })}
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
                checked={makeSettings.errorNotification}
                onChange={(e) => setMakeSettings({ ...makeSettings, errorNotification: e.target.checked })}
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
                value={makeSettings.webhookUrl}
                onChange={(e) => setMakeSettings({ ...makeSettings, webhookUrl: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Make Scenarios</h4>
          <div className="space-y-2">
            {makeScenarios.map((scenario) => (
              <div key={scenario.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Workflow className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{scenario.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(scenario.status)}`}>
                          {scenario.status}
                        </span>
                        {scenario.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{scenario.trigger} → {scenario.action}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleScenario(scenario.id)}
                      className={`px-2 py-1 rounded text-xs ${scenario.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {scenario.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteScenario(scenario.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Runs: {scenario.runCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Run: {scenario.lastRun || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Connected Modules</h4>
          <div className="space-y-2">
            {makeModules.map((module) => (
              <div key={module.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{module.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${module.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {module.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{module.category}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => module.isConnected ? disconnectModule(module.id) : connectModule(module.id)}
                    className={`px-2 py-1 rounded text-xs ${module.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {module.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Make Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create scenarios to automate memory workflows</li>
              <li>• Connect apps via Make visual workflow builder</li>
              <li>• Set triggers: new memory, memory updated, memory deleted</li>
              <li>• Configure actions: create records, send messages, sync data</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
