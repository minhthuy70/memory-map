'use client';

import { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Info,
  Plus,
  RefreshCw,
  Settings,
  Trash2
} from 'lucide-react';

interface ObsidianPluginProps {
  onCancel?: () => void;
}

interface ObsidianVault {
  id: string;
  name: string;
  path: string;
  isConnected: boolean;
  lastSync?: string;
  noteCount: number;
}

interface ObsidianNote {
  id: string;
  vaultId: string;
  vaultName: string;
  memoryId: string;
  memoryTitle: string;
  notePath: string;
  syncedAt: string;
  status: 'success' | 'failed' | 'pending';
}

interface ObsidianSettings {
  autoSync: boolean;
  syncInterval: number;
  createNotes: boolean;
  folderStructure: boolean;
  includeAttachments: boolean;
  markdownFormat: boolean;
}

export default function ObsidianPlugin({ onCancel }: ObsidianPluginProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isObsidianEnabled, setIsObsidianEnabled] = useState(true);

  const [obsidianVaults, setObsidianVaults] = useState<ObsidianVault[]>([
    { id: '1', name: 'Memory Vault', path: '/Users/user/Obsidian/MemoryVault', isConnected: true, lastSync: '2024-01-17 18:30', noteCount: 150 },
    { id: '2', name: 'Personal Notes', path: '/Users/user/Obsidian/Personal', isConnected: true, lastSync: '2024-01-16 10:15', noteCount: 98 },
    { id: '3', name: 'Work Notes', path: '/Users/user/Obsidian/Work', isConnected: false, noteCount: 0 },
  ]);

  const [obsidianNotes, setObsidianNotes] = useState<ObsidianNote[]>([
    { id: '1', vaultId: '1', vaultName: 'Memory Vault', memoryId: 'mem1', memoryTitle: 'Summer Vacation', notePath: 'Memories/2024/Summer Vacation.md', syncedAt: '2024-01-17 18:30', status: 'success' },
    { id: '2', vaultId: '2', vaultName: 'Personal Notes', memoryId: 'mem2', memoryTitle: 'Meeting Notes', notePath: 'Notes/2024/Meeting Notes.md', syncedAt: '2024-01-16 10:15', status: 'success' },
  ]);

  const [obsidianSettings, setObsidianSettings] = useState<ObsidianSettings>({
    autoSync: true,
    syncInterval: 20,
    createNotes: true,
    folderStructure: true,
    includeAttachments: true,
    markdownFormat: true,
  });

  const connectVault = (id: string) => {
    setObsidianVaults(obsidianVaults.map(vault => 
      vault.id === id ? { ...vault, isConnected: true } : vault
    ));
  };

  const disconnectVault = (id: string) => {
    setObsidianVaults(obsidianVaults.map(vault => 
      vault.id === id ? { ...vault, isConnected: false } : vault
    ));
  };

  const syncNote = (vaultId: string) => {
    const vault = obsidianVaults.find(v => v.id === vaultId);
    if (!vault) return;

    const newNote: ObsidianNote = {
      id: Date.now().toString(),
      vaultId,
      vaultName: vault.name,
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Memory',
      notePath: `Memories/2024/New Memory.md`,
      syncedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setObsidianNotes([...obsidianNotes, newNote]);
    
    setTimeout(() => {
      setObsidianNotes(notes => notes.map(n => 
        n.id === newNote.id ? { ...n, status: 'success' } : n
      ));
      setObsidianVaults(vaults => vaults.map(v => 
        v.id === vaultId ? { ...v, noteCount: v.noteCount + 1, lastSync: new Date().toISOString().replace('T', ' ').substring(0, 16) } : v
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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Obsidian Plugin
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Plugin Obsidian
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isObsidianEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isObsidianEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Vaults</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{obsidianVaults.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Connected</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{obsidianVaults.filter(v => v.isConnected).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Notes</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{obsidianNotes.filter(n => n.status === 'success').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Notes</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{obsidianVaults.reduce((acc, v) => acc + v.noteCount, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isObsidianEnabled}
              onChange={(e) => setIsObsidianEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Plugin</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1"
          >
            <BookOpen className="h-3 w-3" />
            Scan Vaults
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Plugin Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto RefreshCcw</span>
              </div>
              <input
                type="checkbox"
                checked={obsidianSettings.autoSync}
                onChange={(e) => setObsidianSettings({ ...obsidianSettings, autoSync: e.target.checked })}
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
                value={obsidianSettings.syncInterval}
                onChange={(e) => setObsidianSettings({ ...obsidianSettings, syncInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Create Notes</span>
              </div>
              <input
                type="checkbox"
                checked={obsidianSettings.createNotes}
                onChange={(e) => setObsidianSettings({ ...obsidianSettings, createNotes: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Folder Structure</span>
              </div>
              <input
                type="checkbox"
                checked={obsidianSettings.folderStructure}
                onChange={(e) => setObsidianSettings({ ...obsidianSettings, folderStructure: e.target.checked })}
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
                checked={obsidianSettings.includeAttachments}
                onChange={(e) => setObsidianSettings({ ...obsidianSettings, includeAttachments: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Markdown Format</span>
              </div>
              <input
                type="checkbox"
                checked={obsidianSettings.markdownFormat}
                onChange={(e) => setObsidianSettings({ ...obsidianSettings, markdownFormat: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Obsidian Vaults</h4>
          <div className="space-y-2">
            {obsidianVaults.map((vault) => (
              <div key={vault.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <BookOpen className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{vault.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${vault.isConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {vault.isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{vault.path}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => vault.isConnected ? disconnectVault(vault.id) : connectVault(vault.id)}
                    className={`px-2 py-1 rounded text-xs ${vault.isConnected ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {vault.isConnected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Notes: {vault.noteCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last RefreshCcw: {vault.lastSync || 'Never'}</span>
                </div>
                {vault.isConnected && (
                  <button
                    type="button"
                    onClick={() => syncNote(vault.id)}
                    className="w-full px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" />
                    RefreshCcw Note
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Synced Notes</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {obsidianNotes.map((note) => (
              <div key={note.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <FileText className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{note.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(note.status)}`}>
                          {note.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{note.vaultName} • {note.syncedAt}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {note.memoryId}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Path: {note.notePath}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Obsidian Plugin Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Connect Obsidian vaults for memory sync</li>
              <li>• Create markdown notes from memories</li>
              <li>• Organize notes with folder structure</li>
              <li>• Include attachments in sync</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
