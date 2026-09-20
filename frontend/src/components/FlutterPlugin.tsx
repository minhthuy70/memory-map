'use client';

import { useState } from 'react';
import { Layers, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Download, FileText } from 'lucide-react';

interface FlutterPluginProps {
  onCancel?: () => void;
}

interface PluginVersion {
  id: string;
  version: string;
  type: 'stable' | 'beta' | 'alpha';
  publishedAt: string;
  downloadCount: number;
  isLatest: boolean;
}

interface PluginFeature {
  id: string;
  name: string;
  description: string;
  isImplemented: boolean;
  documentationUrl?: string;
}

interface PluginInstall {
  id: string;
  method: string;
  command: string;
  description: string;
}

export default function FlutterPlugin({ onCancel }: FlutterPluginProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPluginEnabled, setIsPluginEnabled] = useState(true);

  const [pluginVersions, setPluginVersions] = useState<PluginVersion[]>([
    { id: '1', version: '2.5.0', type: 'stable', publishedAt: '2024-01-17', downloadCount: 6280, isLatest: true },
    { id: '2', version: '2.4.8', type: 'stable', publishedAt: '2024-01-10', downloadCount: 5140, isLatest: false },
    { id: '3', version: '2.5.1-beta', type: 'beta', publishedAt: '2024-01-18', downloadCount: 1120, isLatest: false },
  ]);

  const [pluginFeatures, setPluginFeatures] = useState<PluginFeature[]>([
    { id: '1', name: 'Memory CRUD Operations', description: 'Create, read, update, delete memories', isImplemented: true },
    { id: '2', name: 'Authentication', description: 'OAuth2, API key authentication', isImplemented: true },
    { id: '3', name: 'Camera Integration', description: 'Native camera for photo/video capture', isImplemented: true },
    { id: '4', name: 'File Upload', description: 'Upload photos, videos, documents', isImplemented: true },
    { id: '5', name: 'Platform Channels', description: 'Native platform communication', isImplemented: true },
    { id: '6', name: 'Local Storage', description: 'Hive/SharedPreferences for offline', isImplemented: true },
  ]);

  const [pluginInstalls, setPluginInstalls] = useState<PluginInstall[]>([
    { id: '1', method: 'pub', command: 'flutter pub add memorymap_plugin', description: 'Install via pub' },
    { id: '2', method: 'yaml', command: 'memorymap_plugin: ^2.5.0', description: 'Add to pubspec.yaml' },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stable': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'beta': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'alpha': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Flutter Plugin
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plugin Flutter
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isPluginEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isPluginEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{pluginVersions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Latest</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{pluginVersions.find(v => v.isLatest)?.version || 'N/A'}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Downloads</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{pluginVersions.reduce((acc, v) => acc + v.downloadCount, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Features</p>
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{pluginFeatures.filter(f => f.isImplemented).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isPluginEnabled}
              onChange={(e) => setIsPluginEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Plugin</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-cyan-600 hover:bg-cyan-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download Plugin
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Installation</h4>
          <div className="space-y-2">
            {pluginInstalls.map((install) => (
              <div key={install.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                      <Layers className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{install.method}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{install.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCommand(install.command)}
                    className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    Copy
                  </button>
                </div>
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded font-mono text-xs text-slate-700 dark:text-slate-300">
                  {install.command}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Plugin Versions</h4>
          <div className="space-y-2">
            {pluginVersions.map((version) => (
              <div key={version.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Layers className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{version.version}</span>
                        {version.isLatest && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Latest
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(version.type)}`}>
                          {version.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Published: {version.publishedAt}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Downloads: {version.downloadCount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Plugin Features</h4>
          <div className="space-y-2">
            {pluginFeatures.map((feature) => (
              <div key={feature.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                      {feature.isImplemented ? (
                        <CheckCircle className="h-4 w-4 text-sky-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-sky-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{feature.name}</span>
                        {feature.isImplemented && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Implemented
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                  {feature.documentationUrl && (
                    <button
                      type="button"
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Docs
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Flutter Plugin Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Install via flutter pub add</li>
              <li>• Cross-platform support (iOS, Android, Web)</li>
              <li>• Platform channels for native communication</li>
              <li>• Local storage with Hive/SharedPreferences</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
