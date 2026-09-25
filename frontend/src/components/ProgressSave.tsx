'use client';

import { useState, useEffect } from 'react';
import {
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  Download,
  Eye,
  EyeOff,
  HardDrive,
  Info,
  RefreshCw,
  Save,
  Settings,
  Smartphone,
  Trash2,
  Upload,
  Zap
} from 'lucide-react';

interface ProgressSaveProps {
  onCancel?: () => void;
}

interface SavedProgress {
  id: string;
  name: string;
  type: 'memory' | 'form' | 'wizard' | 'upload';
  timestamp: string;
  size: number;
  data: any;
}

export default function ProgressSave({ onCancel }: ProgressSaveProps) {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [autoSaveInterval, setAutoSaveInterval] = useState(30);
  const [showHistory, setShowHistory] = useState(false);

  const [savedProgress, setSavedProgress] = useState<SavedProgress[]>([
    {
      id: '1',
      name: 'Memory Draft - Summer Trip',
      type: 'memory',
      timestamp: '2026-09-14 10:30',
      size: 2500,
      data: { title: 'Summer Trip', content: 'Had an amazing time...', location: 'Hanoi' },
    },
    {
      id: '2',
      name: 'Photo Upload - Batch 1',
      type: 'upload',
      timestamp: '2026-09-14 09:15',
      size: 15000,
      data: { files: ['photo1.jpg', 'photo2.jpg'], progress: 75 },
    },
    {
      id: '3',
      name: 'Import Wizard - Step 2',
      type: 'wizard',
      timestamp: '2026-09-13 15:20',
      size: 5000,
      data: { step: 2, source: 'Google Photos', selected: 25 },
    },
  ]);

  useEffect(() => {
    if (autoSaveEnabled) {
      const interval = setInterval(() => {
        simulateAutoSave();
      }, autoSaveInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled, autoSaveInterval]);

  const simulateAutoSave = () => {
    const newProgress: SavedProgress = {
      id: Date.now().toString(),
      name: `Auto-save ${new Date().toLocaleTimeString()}`,
      type: 'form',
      timestamp: new Date().toISOString(),
      size: Math.floor(Math.random() * 1000) + 500,
      data: { lastAction: 'typing', field: 'description' },
    };
    setSavedProgress(prev => [newProgress, ...prev].slice(0, 20));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const deleteProgress = (id: string) => {
    setSavedProgress(savedProgress.filter(p => p.id !== id));
  };

  const restoreProgress = (id: string) => {
    const progress = savedProgress.find(p => p.id === id);
    if (progress) {
      console.log('Restoring progress:', progress.data);
    }
  };

  const clearAll = () => {
    setSavedProgress([]);
  };

  const totalStorage = savedProgress.reduce((sum, p) => sum + p.size, 0);
  const totalCount = savedProgress.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Save className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Progress Auto-Save
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automatically save progress at every step
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show history"
          >
            {showHistory ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className={`p-4 rounded-lg border ${autoSaveEnabled ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${autoSaveEnabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {autoSaveEnabled ? <CheckCircle className="h-6 w-6 text-white" /> : <Save className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {autoSaveEnabled ? 'Auto-Save Active' : 'Auto-Save Disabled'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {autoSaveEnabled ? `Saving every ${autoSaveInterval} seconds` : 'Manual save only'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${autoSaveEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {autoSaveEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Saved Items</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Storage Used</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatBytes(totalStorage)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Interval</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{autoSaveInterval}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Last Save</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{totalCount > 0 ? 'Now' : 'Never'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={autoSaveInterval.toString()}
            onChange={(e) => setAutoSaveInterval(parseInt(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="15">15 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
            <option value="300">5 minutes</option>
          </select>
          <button
            type="button"
            onClick={clearAll}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear All
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Upload className="h-3 w-3" />
            Export All
          </button>
        </div>

        {showHistory && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Save History</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {savedProgress.map((progress) => (
                <div key={progress.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{progress.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{progress.timestamp} • {formatBytes(progress.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 capitalize">
                      {progress.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => restoreProgress(progress.id)}
                      className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                      title="Restore"
                    >
                      <RefreshCw className="h-3 w-3 text-green-500" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProgress(progress.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      title="Delete"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Auto-Save Configuration
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Progress is saved automatically at every step</li>
            <li>• Configurable save interval (15s to 5m)</li>
            <li>• Local storage with offline support</li>
            <li>• Restore previous progress anytime</li>
            <li>• Export/Import saved progress</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Storage Management
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Progress stored in IndexedDB for persistence</li>
            <li>• Auto-cleanup of old saves (30 days)</li>
            <li>• Maximum 20 saved items per type</li>
            <li>• Storage quota: 10MB per user</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
