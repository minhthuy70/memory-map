'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Globe,
  Info,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Zap
} from 'lucide-react';

interface APIVersioningProps {
  onCancel?: () => void;
}

interface APIVersion {
  id: string;
  version: string;
  status: 'active' | 'deprecated' | 'beta';
  releasedAt: string;
  sunsetDate?: string;
  requestCount: number;
  isDefault: boolean;
}

interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  version: string;
  description: string;
  isDeprecated: boolean;
}

interface VersioningSettings {
  autoVersioning: boolean;
  versionPrefix: string;
  deprecationWarning: boolean;
  sunsetDays: number;
}

export default function APIVersioning({ onCancel }: APIVersioningProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isVersioningEnabled, setIsVersioningEnabled] = useState(true);

  const [apiVersions, setApiVersions] = useState<APIVersion[]>([
    { id: '1', version: 'v2', status: 'active', releasedAt: '2024-01-01', requestCount: 125000, isDefault: true },
    { id: '2', version: 'v1', status: 'deprecated', releasedAt: '2023-01-01', sunsetDate: '2024-06-30', requestCount: 45000, isDefault: false },
    { id: '3', version: 'v3-beta', status: 'beta', releasedAt: '2024-01-15', requestCount: 8500, isDefault: false },
  ]);

  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([
    { id: '1', path: '/api/v2/memories', method: 'GET', version: 'v2', description: 'List all memories', isDeprecated: false },
    { id: '2', path: '/api/v2/memories/:id', method: 'GET', version: 'v2', description: 'Get a specific memory', isDeprecated: false },
    { id: '3', path: '/api/v2/memories', method: 'POST', version: 'v2', description: 'Create a new memory', isDeprecated: false },
    { id: '4', path: '/api/v1/memories', method: 'GET', version: 'v1', description: 'List all memories (deprecated)', isDeprecated: true },
  ]);

  const [versioningSettings, setVersioningSettings] = useState<VersioningSettings>({
    autoVersioning: true,
    versionPrefix: 'v',
    deprecationWarning: true,
    sunsetDays: 180,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'deprecated': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'beta': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'POST': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'PUT': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'DELETE': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'PATCH': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const setDefaultVersion = (id: string) => {
    setApiVersions(apiVersions.map(v => 
      v.id === id ? { ...v, isDefault: true } : { ...v, isDefault: false }
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              API v2 with Versioning
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              API v2 có versioning
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isVersioningEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isVersioningEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Versions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{apiVersions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Default</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{apiVersions.find(v => v.isDefault)?.version || 'N/A'}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Requests</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{apiVersions.reduce((acc, v) => acc + v.requestCount, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Endpoints</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{apiEndpoints.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isVersioningEnabled}
              onChange={(e) => setIsVersioningEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Versioning</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            New Version
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Versioning Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Versioning</span>
              </div>
              <input
                type="checkbox"
                checked={versioningSettings.autoVersioning}
                onChange={(e) => setVersioningSettings({ ...versioningSettings, autoVersioning: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Version Prefix</span>
              </div>
              <input
                type="text"
                value={versioningSettings.versionPrefix}
                onChange={(e) => setVersioningSettings({ ...versioningSettings, versionPrefix: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-16"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Deprecation Warning</span>
              </div>
              <input
                type="checkbox"
                checked={versioningSettings.deprecationWarning}
                onChange={(e) => setVersioningSettings({ ...versioningSettings, deprecationWarning: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sunset Days</span>
              </div>
              <input
                type="number"
                value={versioningSettings.sunsetDays}
                onChange={(e) => setVersioningSettings({ ...versioningSettings, sunsetDays: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">API Versions</h4>
          <div className="space-y-2">
            {apiVersions.map((version) => (
              <div key={version.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Globe className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{version.version}</span>
                        {version.isDefault && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Default
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(version.status)}`}>
                          {version.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Released: {version.releasedAt}</p>
                    </div>
                  </div>
                  {!version.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultVersion(version.id)}
                      className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Set Default
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Requests: {version.requestCount.toLocaleString()}</span>
                  {version.sunsetDate && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Sunset: {version.sunsetDate}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">API Endpoints</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {apiEndpoints.map((endpoint) => (
              <div key={endpoint.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Zap className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{endpoint.path}</span>
                        {endpoint.isDeprecated && (
                          <span className="px-2 py-0.5 rounded text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                            Deprecated
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{endpoint.description} • {endpoint.version}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">API Versioning Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use versioned endpoints for backward compatibility</li>
              <li>• Set deprecation warnings before sunset</li>
              <li>• Configure sunset days for deprecated versions</li>
              <li>• Auto-versioning for new breaking changes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
