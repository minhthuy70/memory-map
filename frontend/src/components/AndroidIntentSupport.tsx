'use client';

import { useState } from 'react';
import { Smartphone, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Zap } from 'lucide-react';

interface AndroidIntentSupportProps {
  onCancel?: () => void;
}

interface Intent {
  id: string;
  name: string;
  action: string;
  category: string;
  dataType: string;
  isEnabled: boolean;
  lastUsed?: string;
  usageCount: number;
}

interface IntentSettings {
  autoHandle: boolean;
  defaultIntent: boolean;
  broadcastEnabled: boolean;
  permissionRequired: boolean;
  defaultCategory: string;
}

export default function AndroidIntentSupport({ onCancel }: AndroidIntentSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isIntentsEnabled, setIsIntentsEnabled] = useState(true);

  const [intents, setIntents] = useState<Intent[]>([
    { id: '1', name: 'Create Memory Intent', action: 'com.memorymap.CREATE_MEMORY', category: 'DEFAULT', dataType: 'text/plain', isEnabled: true, lastUsed: '2024-01-17 18:30', usageCount: 52 },
    { id: '2', name: 'Search Memory Intent', action: 'com.memorymap.SEARCH_MEMORY', category: 'BROWSABLE', dataType: 'application/json', isEnabled: true, lastUsed: '2024-01-16 10:15', usageCount: 38 },
    { id: '3', name: 'Share Memory Intent', action: 'com.memorymap.SHARE_MEMORY', category: 'SEND', dataType: 'image/*', isEnabled: true, lastUsed: '2024-01-15 14:00', usageCount: 24 },
  ]);

  const [intentSettings, setIntentSettings] = useState<IntentSettings>({
    autoHandle: true,
    defaultIntent: true,
    broadcastEnabled: false,
    permissionRequired: true,
    defaultCategory: 'DEFAULT',
  });

  const toggleIntent = (id: string) => {
    setIntents(intents.map(intent => 
      intent.id === id ? { ...intent, isEnabled: !intent.isEnabled } : intent
    ));
  };

  const deleteIntent = (id: string) => {
    setIntents(intents.filter(intent => intent.id !== id));
  };

  const createIntent = () => {
    const newIntent: Intent = {
      id: Date.now().toString(),
      name: 'New Intent',
      action: 'com.memorymap.CUSTOM_ACTION',
      category: 'DEFAULT',
      dataType: 'text/plain',
      isEnabled: true,
      usageCount: 0,
    };
    setIntents([...intents, newIntent]);
  };

  const useIntent = (id: string) => {
    const intent = intents.find(i => i.id === id);
    if (!intent) return;

    setIntents(intents.map(i => 
      i.id === id ? { ...i, lastUsed: new Date().toISOString().replace('T', ' ').substring(0, 16), usageCount: i.usageCount + 1 } : i
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl">
            <Android className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Android Intent Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hỗ trợ Android intents
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isIntentsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isIntentsEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Intents</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{intents.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Enabled</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{intents.filter(i => i.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Usage</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{intents.reduce((acc, i) => acc + i.usageCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Broadcast</p>
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{intentSettings.broadcastEnabled ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isIntentsEnabled}
              onChange={(e) => setIsIntentsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Intents</span>
          </div>
          <button
            type="button"
            onClick={createIntent}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Intent
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Intent Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Handle</span>
              </div>
              <input
                type="checkbox"
                checked={intentSettings.autoHandle}
                onChange={(e) => setIntentSettings({ ...intentSettings, autoHandle: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Intent</span>
              </div>
              <input
                type="checkbox"
                checked={intentSettings.defaultIntent}
                onChange={(e) => setIntentSettings({ ...intentSettings, defaultIntent: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Broadcast Enabled</span>
              </div>
              <input
                type="checkbox"
                checked={intentSettings.broadcastEnabled}
                onChange={(e) => setIntentSettings({ ...intentSettings, broadcastEnabled: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Permission Required</span>
              </div>
              <input
                type="checkbox"
                checked={intentSettings.permissionRequired}
                onChange={(e) => setIntentSettings({ ...intentSettings, permissionRequired: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Category</span>
              </div>
              <input
                type="text"
                value={intentSettings.defaultCategory}
                onChange={(e) => setIntentSettings({ ...intentSettings, defaultCategory: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-24"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Android Intents</h4>
          <div className="space-y-2">
            {intents.map((intent) => (
              <div key={intent.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Zap className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{intent.name}</span>
                        {intent.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{intent.action} • {intent.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleIntent(intent.id)}
                      className={`px-2 py-1 rounded text-xs ${intent.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {intent.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                    {intent.isEnabled && (
                      <button
                        type="button"
                        onClick={() => useIntent(intent.id)}
                        className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                      >
                        Use
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteIntent(intent.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Data Type: {intent.dataType}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Usage: {intent.usageCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Used: {intent.lastUsed || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Android Intents Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create intents for inter-app communication</li>
              <li>• Configure action and category types</li>
              <li>• Handle data types: text/plain, image/*, application/json</li>
              <li>• Use broadcasts for system-wide events</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
