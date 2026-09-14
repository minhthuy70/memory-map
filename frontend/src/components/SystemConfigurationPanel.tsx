'use client';

import { useState } from 'react';
import { Settings, X, Save, RefreshCw, CheckCircle, AlertTriangle, Info, Shield, Globe, Database, Server, Clock, Users, ToggleLeft, ToggleRight } from 'lucide-react';

interface SystemConfigurationPanelProps {
  onCancel?: () => void;
}

interface ConfigItem {
  id: string;
  category: string;
  name: string;
  value: string | boolean | number;
  type: 'text' | 'number' | 'boolean' | 'select';
  options?: string[];
  description: string;
}

export default function SystemConfigurationPanel({ onCancel }: SystemConfigurationPanelProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hasChanges, setHasChanges] = useState(false);

  const [configs, setConfigs] = useState<ConfigItem[]>([
    { id: 'site-name', category: 'General', name: 'Site Name', value: 'Memory Map', type: 'text', description: 'Main site name displayed in header' },
    { id: 'site-url', category: 'General', name: 'Site URL', value: 'https://memorymap.com', type: 'text', description: 'Base URL for the application' },
    { id: 'timezone', category: 'General', name: 'Default Timezone', value: 'UTC', type: 'select', options: ['UTC', 'Asia/Ho_Chi_Minh', 'America/New_York', 'Europe/London'], description: 'Default timezone for all users' },
    { id: 'maintenance-mode', category: 'General', name: 'Maintenance Mode', value: false, type: 'boolean', description: 'Enable maintenance mode for all users' },
    { id: 'max-users', category: 'User', name: 'Max Users', value: 10000, type: 'number', description: 'Maximum number of allowed users' },
    { id: 'registration-open', category: 'User', name: 'Registration Open', value: true, type: 'boolean', description: 'Allow new user registrations' },
    { id: 'email-verification', category: 'User', name: 'Email Verification Required', value: true, type: 'boolean', description: 'Require email verification for new accounts' },
    { id: 'default-storage', category: 'Storage', name: 'Default Storage (GB)', value: 10, type: 'number', description: 'Default storage quota per user' },
    { id: 'max-file-size', category: 'Storage', name: 'Max File Size (MB)', value: 100, type: 'number', description: 'Maximum file upload size' },
    { id: 'backup-retention', category: 'Database', name: 'Backup Retention (days)', value: 30, type: 'number', description: 'Days to keep database backups' },
    { id: 'auto-backup', category: 'Database', name: 'Auto Backup Enabled', value: true, type: 'boolean', description: 'Enable automatic database backups' },
    { id: 'log-retention', category: 'Logging', name: 'Log Retention (days)', value: 90, type: 'number', description: 'Days to keep system logs' },
    { id: 'log-level', category: 'Logging', name: 'Log Level', value: 'info', type: 'select', options: ['debug', 'info', 'warn', 'error'], description: 'Minimum log level to record' },
  ]);

  const categories = ['all', 'General', 'User', 'Storage', 'Database', 'Logging'];
  const filteredConfigs = selectedCategory === 'all' ? configs : configs.filter(c => c.category === selectedCategory);

  const updateConfig = (id: string, value: string | boolean | number) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, value } : c));
    setHasChanges(true);
  };

  const saveChanges = () => {
    setHasChanges(false);
  };

  const resetToDefaults = () => {
    setConfigs(configs.map(c => {
      if (c.type === 'boolean') return { ...c, value: false };
      if (c.type === 'number') return { ...c, value: 0 };
      return { ...c, value: '' };
    }));
    setHasChanges(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'General': return <Globe className="h-4 w-4" />;
      case 'User': return <Users className="h-4 w-4" />;
      case 'Storage': return <Database className="h-4 w-4" />;
      case 'Database': return <Server className="h-4 w-4" />;
      case 'Logging': return <Clock className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-400 to-slate-600 rounded-xl">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              System Configuration Panel
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage system-wide settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded">
              Unsaved changes
            </span>
          )}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Configs</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{configs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Categories</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{categories.length - 1}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Boolean</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{configs.filter(c => c.type === 'boolean').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Changes</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{hasChanges ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={saveChanges}
            disabled={!hasChanges}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:text-slate-500 dark:disabled:text-slate-400 border-0 flex items-center gap-1"
          >
            <Save className="h-3 w-3" />
            Save Changes
          </button>
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Reset Defaults
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Configuration Items</h4>
          <div className="space-y-3">
            {filteredConfigs.map((config) => (
              <div key={config.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(config.category)}
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{config.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({config.category})</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{config.description}</p>
                <div className="flex items-center gap-2">
                  {config.type === 'boolean' ? (
                    <button
                      type="button"
                      onClick={() => updateConfig(config.id, !config.value)}
                      className={`p-2 rounded-lg transition-colors ${config.value ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                    >
                      {config.value ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                    </button>
                  ) : config.type === 'select' ? (
                    <select
                      value={config.value as string}
                      onChange={(e) => updateConfig(config.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                    >
                      {config.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : config.type === 'number' ? (
                    <input
                      type="number"
                      value={config.value as number}
                      onChange={(e) => updateConfig(config.id, parseInt(e.target.value) || 0)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 w-24"
                    />
                  ) : (
                    <input
                      type="text"
                      value={config.value as string}
                      onChange={(e) => updateConfig(config.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
                    />
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">Current: {String(config.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Configuration Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Changes require save to take effect</li>
              <li>• Some settings may require restart</li>
              <li>• Review descriptions before modifying</li>
              <li>• Backup current config before major changes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
