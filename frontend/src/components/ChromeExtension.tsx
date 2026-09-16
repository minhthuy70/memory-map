'use client';

import { useState } from 'react';
import { Globe, X, RefreshCw, Info, Settings, Plus, Trash2, CheckCircle, AlertCircle, Clock, Calendar, ExternalLink, Link2 } from 'lucide-react';

interface ChromeExtensionProps {
  onCancel?: () => void;
}

interface QuickCapture {
  id: string;
  url: string;
  title: string;
  memoryId: string;
  memoryTitle: string;
  capturedAt: string;
  status: 'success' | 'failed' | 'pending';
}

interface ExtensionSettings {
  autoCapture: boolean;
  saveScreenshots: boolean;
  savePageContent: boolean;
  defaultFolder: string;
  popupHotkey: string;
  syncInterval: number;
}

export default function ChromeExtension({ onCancel }: ChromeExtensionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);

  const [quickCaptures, setQuickCaptures] = useState<QuickCapture[]>([
    { id: '1', url: 'https://example.com/article', title: 'Interesting Article', memoryId: 'mem1', memoryTitle: 'Article Summary', capturedAt: '2024-01-17 18:30', status: 'success' },
    { id: '2', url: 'https://example.com/product', title: 'Product Page', memoryId: 'mem2', memoryTitle: 'Product Reference', capturedAt: '2024-01-16 10:15', status: 'success' },
  ]);

  const [extensionSettings, setExtensionSettings] = useState<ExtensionSettings>({
    autoCapture: true,
    saveScreenshots: true,
    savePageContent: true,
    defaultFolder: 'Quick Captures',
    popupHotkey: 'Ctrl+Shift+M',
    syncInterval: 5,
  });

  const capturePage = () => {
    const newCapture: QuickCapture = {
      id: Date.now().toString(),
      url: 'https://example.com/new-page',
      title: 'New Page',
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'Quick Capture',
      capturedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setQuickCaptures([...quickCaptures, newCapture]);
    
    setTimeout(() => {
      setQuickCaptures(captures => captures.map(c => 
        c.id === newCapture.id ? { ...c, status: 'success' } : c
      ));
    }, 1500);
  };

  const deleteCapture = (id: string) => {
    setQuickCaptures(quickCaptures.filter(capture => capture.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chrome Extension
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extension Chrome (quick capture)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isExtensionEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isExtensionEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Captures</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{quickCaptures.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Success</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{quickCaptures.filter(c => c.status === 'success').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{quickCaptures.filter(c => c.status === 'pending').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Failed</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{quickCaptures.filter(c => c.status === 'failed').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isExtensionEnabled}
              onChange={(e) => setIsExtensionEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Extension</span>
          </div>
          <button
            type="button"
            onClick={capturePage}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Link2 className="h-3 w-3" />
            Capture Page
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Extension Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Capture</span>
              </div>
              <input
                type="checkbox"
                checked={extensionSettings.autoCapture}
                onChange={(e) => setExtensionSettings({ ...extensionSettings, autoCapture: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Save Screenshots</span>
              </div>
              <input
                type="checkbox"
                checked={extensionSettings.saveScreenshots}
                onChange={(e) => setExtensionSettings({ ...extensionSettings, saveScreenshots: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Save Page Content</span>
              </div>
              <input
                type="checkbox"
                checked={extensionSettings.savePageContent}
                onChange={(e) => setExtensionSettings({ ...extensionSettings, savePageContent: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Folder</span>
              </div>
              <input
                type="text"
                value={extensionSettings.defaultFolder}
                onChange={(e) => setExtensionSettings({ ...extensionSettings, defaultFolder: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-32"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Popup Hotkey</span>
              </div>
              <input
                type="text"
                value={extensionSettings.popupHotkey}
                onChange={(e) => setExtensionSettings({ ...extensionSettings, popupHotkey: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-24"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sync Interval (min)</span>
              </div>
              <input
                type="number"
                value={extensionSettings.syncInterval}
                onChange={(e) => setExtensionSettings({ ...extensionSettings, syncInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quick Captures</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {quickCaptures.map((capture) => (
              <div key={capture.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Globe className="h-4 w-4 text-green-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{capture.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(capture.status)}`}>
                          {capture.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{capture.url} • {capture.capturedAt}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCapture(capture.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {capture.memoryTitle}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">ID: {capture.memoryId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Chrome Extension Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Quick capture memories from any webpage</li>
              <li>• Save screenshots and page content</li>
              <li>• Configure popup hotkey for quick access</li>
              <li>• Auto-sync captured content</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
