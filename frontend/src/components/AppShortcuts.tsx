'use client';

import { useState } from 'react';
import { Smartphone, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Zap } from 'lucide-react';

interface AppShortcutsProps {
  onCancel?: () => void;
}

interface Shortcut {
  id: string;
  name: string;
  icon: string;
  action: string;
  parameters: string;
  isEnabled: boolean;
  lastUsed?: string;
  usageCount: number;
}

interface ShortcutSettings {
  autoSync: boolean;
  syncInterval: number;
  cloudSync: boolean;
  defaultShortcuts: boolean;
  customShortcuts: boolean;
}

export default function AppShortcuts({ onCancel }: AppShortcutsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isShortcutsEnabled, setIsShortcutsEnabled] = useState(true);

  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    { id: '1', name: 'Quick Memory Capture', icon: 'camera', action: 'Create Memory', parameters: 'photo,text,location', isEnabled: true, lastUsed: '2024-01-17 18:30', usageCount: 45 },
    { id: '2', name: 'Memory Search', icon: 'search', action: 'Search Memories', parameters: 'query,filters', isEnabled: true, lastUsed: '2024-01-16 10:15', usageCount: 32 },
    { id: '3', name: 'Show Favorites', icon: 'heart', action: 'Display Favorites', parameters: 'none', isEnabled: true, lastUsed: '2024-01-15 14:00', usageCount: 28 },
  ]);

  const [shortcutSettings, setShortcutSettings] = useState<ShortcutSettings>({
    autoSync: true,
    syncInterval: 10,
    cloudSync: true,
    defaultShortcuts: true,
    customShortcuts: true,
  });

  const toggleShortcut = (id: string) => {
    setShortcuts(shortcuts.map(shortcut => 
      shortcut.id === id ? { ...shortcut, isEnabled: !shortcut.isEnabled } : shortcut
    ));
  };

  const deleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(shortcut => shortcut.id !== id));
  };

  const createShortcut = () => {
    const newShortcut: Shortcut = {
      id: Date.now().toString(),
      name: 'New Shortcut',
      icon: 'plus',
      action: 'Custom Action',
      parameters: 'custom',
      isEnabled: true,
      usageCount: 0,
    };
    setShortcuts([...shortcuts, newShortcut]);
  };

  const useShortcut = (id: string) => {
    const shortcut = shortcuts.find(s => s.id === id);
    if (!shortcut) return;

    setShortcuts(shortcuts.map(s => 
      s.id === id ? { ...s, lastUsed: new Date().toISOString().replace('T', ' ').substring(0, 16), usageCount: s.usageCount + 1 } : s
    ));
  };

  const getIconName = (icon: string) => {
    switch (icon) {
      case 'camera': return 'Camera';
      case 'search': return 'Search';
      case 'heart': return 'Heart';
      case 'plus': return 'Plus';
      default: return 'Zap';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              iOS Shortcut Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hỗ trợ Shortcuts iOS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isShortcutsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isShortcutsEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Shortcuts</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{shortcuts.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Enabled</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{shortcuts.filter(s => s.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Usage</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{shortcuts.reduce((acc, s) => acc + s.usageCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Cloud Sync</p>
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{shortcutSettings.cloudSync ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isShortcutsEnabled}
              onChange={(e) => setIsShortcutsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Shortcuts</span>
          </div>
          <button
            type="button"
            onClick={createShortcut}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Shortcut
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Shortcut Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Sync</span>
              </div>
              <input
                type="checkbox"
                checked={shortcutSettings.autoSync}
                onChange={(e) => setShortcutSettings({ ...shortcutSettings, autoSync: e.target.checked })}
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
                value={shortcutSettings.syncInterval}
                onChange={(e) => setShortcutSettings({ ...shortcutSettings, syncInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Cloud Sync</span>
              </div>
              <input
                type="checkbox"
                checked={shortcutSettings.cloudSync}
                onChange={(e) => setShortcutSettings({ ...shortcutSettings, cloudSync: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Shortcuts</span>
              </div>
              <input
                type="checkbox"
                checked={shortcutSettings.defaultShortcuts}
                onChange={(e) => setShortcutSettings({ ...shortcutSettings, defaultShortcuts: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Plus className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Custom Shortcuts</span>
              </div>
              <input
                type="checkbox"
                checked={shortcutSettings.customShortcuts}
                onChange={(e) => setShortcutSettings({ ...shortcutSettings, customShortcuts: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">iOS Shortcuts</h4>
          <div className="space-y-2">
            {shortcuts.map((shortcut) => (
              <div key={shortcut.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Zap className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{shortcut.name}</span>
                        {shortcut.isEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Enabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{shortcut.action} • {shortcut.parameters}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleShortcut(shortcut.id)}
                      className={`px-2 py-1 rounded text-xs ${shortcut.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {shortcut.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                    {shortcut.isEnabled && (
                      <button
                        type="button"
                        onClick={() => useShortcut(shortcut.id)}
                        className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Use
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteShortcut(shortcut.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Usage: {shortcut.usageCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Used: {shortcut.lastUsed || 'Never'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">iOS Shortcuts Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create shortcuts for quick memory actions</li>
              <li>• Configure Siri voice commands for shortcuts</li>
              <li>• Use shortcuts with Home Screen widgets</li>
              <li>• Cloud sync shortcuts across devices</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
