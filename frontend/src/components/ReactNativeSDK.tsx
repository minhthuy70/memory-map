'use client';

import { useState } from 'react';
import { Smartphone, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Download, FileText } from 'lucide-react';

interface ReactNativeSDKProps {
  onCancel?: () => void;
}

interface SDKVersion {
  id: string;
  version: string;
  type: 'stable' | 'beta' | 'alpha';
  publishedAt: string;
  downloadCount: number;
  isLatest: boolean;
}

interface SDKFeature {
  id: string;
  name: string;
  description: string;
  isImplemented: boolean;
  documentationUrl?: string;
}

interface SDKInstall {
  id: string;
  method: string;
  command: string;
  description: string;
}

export default function ReactNativeSDK({ onCancel }: ReactNativeSDKProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSDKEnabled, setIsSDKEnabled] = useState(true);

  const [sdkVersions, setSDKVersions] = useState<SDKVersion[]>([
    { id: '1', version: '2.5.0', type: 'stable', publishedAt: '2024-01-17', downloadCount: 8740, isLatest: true },
    { id: '2', version: '2.4.8', type: 'stable', publishedAt: '2024-01-10', downloadCount: 7250, isLatest: false },
    { id: '3', version: '2.5.1-beta', type: 'beta', publishedAt: '2024-01-18', downloadCount: 1450, isLatest: false },
  ]);

  const [sdkFeatures, setSdkFeatures] = useState<SDKFeature[]>([
    { id: '1', name: 'Memory CRUD Operations', description: 'Create, read, update, delete memories', isImplemented: true },
    { id: '2', name: 'Authentication', description: 'OAuth2, API key authentication', isImplemented: true },
    { id: '3', name: 'Camera Integration', description: 'Native camera for photo/video capture', isImplemented: true },
    { id: '4', name: 'File Upload', description: 'Upload photos, videos, documents', isImplemented: true },
    { id: '5', name: 'Offline Support', description: 'Local cache for offline operations', isImplemented: true },
    { id: '6', name: 'Push Notifications', description: 'Receive memory notifications', isImplemented: true },
  ]);

  const [sdkInstalls, setSdkInstalls] = useState<SDKInstall[]>([
    { id: '1', method: 'npm', command: 'npm install @memorymap/react-native', description: 'Install via npm' },
    { id: '2', method: 'yarn', command: 'yarn add @memorymap/react-native', description: 'Install via yarn' },
    { id: '3', method: 'expo', command: 'npx expo install @memorymap/react-native', description: 'Install via Expo' },
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
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              React Native SDK
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              SDK React Native
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSDKEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSDKEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{sdkVersions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Latest</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{sdkVersions.find(v => v.isLatest)?.version || 'N/A'}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Downloads</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{sdkVersions.reduce((acc, v) => acc + v.downloadCount, 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Features</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{sdkFeatures.filter(f => f.isImplemented).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSDKEnabled}
              onChange={(e) => setIsSDKEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable SDK</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Download SDK
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
            {sdkInstalls.map((install) => (
              <div key={install.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Smartphone className="h-4 w-4 text-purple-400" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">SDK Versions</h4>
          <div className="space-y-2">
            {sdkVersions.map((version) => (
              <div key={version.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Smartphone className="h-4 w-4 text-indigo-400" />
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
                    className="px-2 py-1 rounded text-xs bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1"
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">SDK Features</h4>
          <div className="space-y-2">
            {sdkFeatures.map((feature) => (
              <div key={feature.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-lg">
                      {feature.isImplemented ? (
                        <CheckCircle className="h-4 w-4 text-violet-400" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-violet-400" />
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">React Native SDK Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Install via npm, yarn, or Expo</li>
              <li>• Native camera integration</li>
              <li>• Offline support with local cache</li>
              <li>• Push notifications support</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
