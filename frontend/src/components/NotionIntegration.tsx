'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Database,
  ExternalLink,
  FileText,
  Info,
  Plus,
  RefreshCw,
  Settings,
  Trash2
} from 'lucide-react';

interface NotionIntegrationProps {
  onCancel?: () => void;
}

interface NotionDatabase {
  id: string;
  name: string;
  type: 'page' | 'database';
  isConnected: boolean;
  lastSync?: string;
  memoryCount: number;
}

interface NotionSync {
  id: string;
  databaseId: string;
  databaseName: string;
  memoryId: string;
  memoryTitle: string;
  syncedAt: string;
  status: 'success' | 'failed' | 'pending';
  pageId?: string;
}

interface NotionSettings {
  autoSync: boolean;
  syncInterval: number;
  createPages: boolean;
  createDatabase: boolean;
  includeAttachments: boolean;
  apiKey: string;
}

export default function NotionIntegration({ onCancel }: NotionIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isNotionEnabled, setIsNotionEnabled] = useState(true);

  const [notionDatabases, setNotionDatabases] = useState<NotionDatabase[]>([
    { id: '1', name: 'Memories Database', type: 'database', isConnected: true, lastSync: '2024-01-17 18:30', memoryCount: 125 },
    { id: '2', name: 'Memory Journal', type: 'page', isConnected: true, lastSync: '2024-01-16 10:15', memoryCount: 89 },
    { id: '3', name: 'Archive', type: 'database', isConnected: false, memoryCount: 0 },
  ]);

  const [notionSyncs, setNotionSyncs] = useState<NotionSync[]>([
    { id: '1', databaseId: '1', databaseName: 'Memories Database', memoryId: 'mem1', memoryTitle: 'Summer Vacation', syncedAt: '2024-01-17 18:30', status: 'success', pageId: 'page1' },
    { id: '2', databaseId: '2', databaseName: 'Memory Journal', memoryId: 'mem2', memoryTitle: 'Meeting Notes', syncedAt: '2024-01-16 10:15', status: 'success', pageId: 'page2' },
  ]);

  const [notionSettings, setNotionSettings] = useState<NotionSettings>({
    autoSync: true,
    syncInterval: 30,
    createPages: true,
    createDatabase: false,
    includeAttachments: true,
    apiKey: 'notion_api_key_12345',
  });

  const connectDatabase = (id: string) => {
    setNotionDatabases(notionDatabases.map(database => 
      database.id === id ? { ...database, isConnected: true } : database
    ));
  };

  const disconnectDatabase = (id: string) => {
    setNotionDatabases(notionDatabases.map(database => 
      database.id === id ? { ...database, isConnected: false } : database
    ));
  };

  const syncMemory = (databaseId: string) => {
    const database = notionDatabases.find(d => d.id === databaseId);
    if (!database) return;

    const newSync: NotionSync = {
      id: Date.now().toString(),
      databaseId,
      databaseName: database.name,
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Memory',
      syncedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setNotionSyncs([...notionSyncs, newSync]);
    
    setTimeout(() => {
      setNotionSyncs(syncs => syncs.map(s => 
        s.id === newSync.id ? { ...s, status: 'success', pageId: `page${Date.now()}` } : s
      ));
      setNotionDatabases(databases => databases.map(d => 
        d.id === databaseId ? { ...d, memoryCount: d.memoryCount + 1, lastSync: new Date().toISOString().replace('T', ' ').substring(0, 16) } : d
      ));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'database': return <Database className="h-4 w-4" />;
      case 'page': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-700 to-slate-800 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              BookMarked Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tích hợp BookMarked database
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isNotionEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isNotionEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Databases</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{notionDatabases.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{notionDatabases.filter(d => d.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Synced Memories</p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{notionSyncs.filter(s => s.status === 'success').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Pages</p>
            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">{notionDatabases.reduce((acc, d) => acc + d.memoryCount, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isNotionEnabled}
              onChange={(e) => setIsNotionEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable BookMarked</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-gray-700 hover:bg-gray-800 text-white border-0 flex items-center gap-1"
          >
            <Database className="h-3 w-3" />
            Scan Databases
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">BookMarked Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto RefreshCcw</span>
              </div>
              <input
                type="checkbox"
                checked={notionSettings.autoSync}
                onChange={(e) => setNotionSettings({ ...notionSettings, autoSync: e.target.checked })}
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
                value={notionSettings.syncInterval}
                onChange={(e) => setNotionSettings({ ...notionSettings, syncInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Create Pages</span>
              </div>
              <input
                type="checkbox"
                checked={notionSettings.createPages}
                onChange={(e) => setNotionSettings({ ...notionSettings, createPages: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Create Database</span>
              </div>
              <input
                type="checkbox"
                checked={notionSettings.createDatabase}
                onChange={(e) => setNotionSettings({ ...notionSettings, createDatabase: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Attachments</span>
              </div>
              <input
                type="checkbox"
                checked={notionSettings.includeAttachments}
                onChange={(e) => setNotionSettings({ ...notionSettings, includeAttachments: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">API Key</span>
              </div>
              <input
                type="text"
                value={notionSettings.apiKey}
                onChange={(e) => setNotionSettings({ ...notionSettings, apiKey: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">BookMarked Databases</h4>
          <div className="space-y-2">
            {notionDatabases.map((database) => (
              <div key={database.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                      {getTypeIcon(database.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{database.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${database.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {database.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {database.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => database.isConnected ? disconnectDatabase(database.id) : connectDatabase(database.id)}
                    className={`px-2 py-1 rounded text-xs ${database.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {database.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memories: {database.memoryCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last RefreshCcw: {database.lastSync || 'Never'}</span>
                </div>
                {database.isConnected && (
                  <button
                    type="button"
                    onClick={() => syncMemory(database.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    RefreshCcw Memory
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">RefreshCcw History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {notionSyncs.map((sync) => (
              <div key={sync.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{sync.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(sync.status)}`}>
                          {sync.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{sync.databaseName} • {sync.syncedAt}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {sync.memoryId}</span>
                  {sync.pageId && <span className="text-xs text-slate-500 dark:text-slate-400">Page: {sync.pageId}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">BookMarked Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect BookMarked databases for memory sync</li>
              <li>• Create pages or database entries from memories</li>
              <li>• Include attachments in sync</li>
              <li>• Configure sync interval and API key</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
