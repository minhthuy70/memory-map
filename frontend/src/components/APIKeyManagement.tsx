'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Key,
  Plus,
  RefreshCw,
  Settings,
  Shield,
  Trash2
} from 'lucide-react';

interface APIKeyManagementProps {
  onCancel?: () => void;
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  prefix: string;
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  expiresAt?: string;
  lastUsed?: string;
  requestCount: number;
  scopes: string[];
}

interface KeySettings {
  autoRotate: boolean;
  rotationDays: number;
  defaultExpiration: number;
  requireIPWhitelist: boolean;
}

export default function APIKeyManagement({ onCancel }: APIKeyManagementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isKeyManagementEnabled, setIsKeyManagementEnabled] = useState(true);
  const [showKeys, setShowKeys] = useState(false);

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    { id: '1', name: 'Production Key', key: 'sk_live_1234567890abcdef', prefix: 'sk_live_', status: 'active', createdAt: '2024-01-01', expiresAt: '2024-12-31', lastUsed: '2024-01-17', requestCount: 125000, scopes: ['read', 'write', 'delete'] },
    { id: '2', name: 'Development Key', key: 'sk_test_0987654321fedcba', prefix: 'sk_test_', status: 'active', createdAt: '2024-01-10', lastUsed: '2024-01-16', requestCount: 45000, scopes: ['read', 'write'] },
    { id: '3', name: 'Old Key', key: 'sk_live_5555555555555555', prefix: 'sk_live_', status: 'revoked', createdAt: '2023-06-01', lastUsed: '2023-12-31', requestCount: 89000, scopes: ['read', 'write', 'delete'] },
  ]);

  const [keySettings, setKeySettings] = useState<KeySettings>({
    autoRotate: true,
    rotationDays: 90,
    defaultExpiration: 365,
    requireIPWhitelist: false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'revoked': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'expired': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const revokeKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: 'revoked' } : key
    ));
  };

  const regenerateKey = (id: string) => {
    const newKey = `sk_live_${Math.random().toString(36).substring(2, 24)}`;
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, key: newKey, status: 'active' } : key
    ));
  };

  const createKey = () => {
    const newKey: APIKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: `sk_live_${Math.random().toString(36).substring(2, 24)}`,
      prefix: 'sk_live_',
      status: 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 10),
      requestCount: 0,
      scopes: ['read'],
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const maskKey = (key: string) => {
    if (showKeys) return key;
    return key.substring(0, 8) + '...' + key.substring(key.length - 4);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Key className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              API Key Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quản lý API key
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isKeyManagementEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isKeyManagementEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Keys</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{apiKeys.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{apiKeys.filter(k => k.status === 'active').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Requests</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{apiKeys.reduce((acc, k) => acc + k.requestCount, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto Rotate</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{keySettings.autoRotate ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isKeyManagementEnabled}
              onChange={(e) => setIsKeyManagementEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Key Management</span>
          </div>
          <button
            type="button"
            onClick={createKey}
            className="px-3 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Create Key
          </button>
          <button
            type="button"
            onClick={() => setShowKeys(!showKeys)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            {showKeys ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
            {showKeys ? 'Hide Keys' : 'Show Keys'}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Key Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Rotate</span>
              </div>
              <input
                type="checkbox"
                checked={keySettings.autoRotate}
                onChange={(e) => setKeySettings({ ...keySettings, autoRotate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Rotation Days</span>
              </div>
              <input
                type="number"
                value={keySettings.rotationDays}
                onChange={(e) => setKeySettings({ ...keySettings, rotationDays: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Expiration (days)</span>
              </div>
              <input
                type="number"
                value={keySettings.defaultExpiration}
                onChange={(e) => setKeySettings({ ...keySettings, defaultExpiration: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Require IP Whitelist</span>
              </div>
              <input
                type="checkbox"
                checked={keySettings.requireIPWhitelist}
                onChange={(e) => setKeySettings({ ...keySettings, requireIPWhitelist: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">API Keys</h4>
          <div className="space-y-2">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <Key className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{apiKey.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(apiKey.status)}`}>
                          {apiKey.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{maskKey(apiKey.key)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {apiKey.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => regenerateKey(apiKey.id)}
                        className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Regenerate
                      </button>
                    )}
                    {apiKey.status === 'active' && (
                      <button
                        type="button"
                        onClick={() => revokeKey(apiKey.id)}
                        className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Created: {apiKey.createdAt}</span>
                  {apiKey.expiresAt && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Expires: {apiKey.expiresAt}</span>
                  )}
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last Used: {apiKey.lastUsed || 'Never'}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Requests: {apiKey.requestCount.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Scopes: {apiKey.scopes.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">API Key Management Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create separate keys for different environments</li>
              <li>• Use auto-rotation for enhanced security</li>
              <li>• Set expiration dates for temporary keys</li>
              <li>• Configure IP whitelisting for additional security</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
