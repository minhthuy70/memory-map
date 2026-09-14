'use client';

import { useState } from 'react';
import { HardDrive, X, Trash2, RefreshCw, CheckCircle, AlertTriangle, Info, Upload, Download, Folder, FileImage, FileVideo, FileText, Zap, Shield, BarChart3 } from 'lucide-react';

interface StorageManagementProps {
  onCancel?: () => void;
}

interface StorageItem {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
  date: string;
  owner: string;
}

export default function StorageManagement({ onCancel }: StorageManagementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const [storageItems, setStorageItems] = useState<StorageItem[]>([
    { id: '1', name: 'memory_photo_001.jpg', type: 'image', size: 5.2, date: '2026-09-14', owner: 'user_123' },
    { id: '2', name: 'memory_video_001.mp4', type: 'video', size: 125.5, date: '2026-09-13', owner: 'user_456' },
    { id: '3', name: 'backup_2026-09-12.zip', type: 'document', size: 250.0, date: '2026-09-12', owner: 'system' },
    { id: '4', name: 'memory_photo_002.jpg', type: 'image', size: 4.8, date: '2026-09-11', owner: 'user_789' },
    { id: '5', name: 'memory_document_001.pdf', type: 'document', size: 2.3, date: '2026-09-10', owner: 'user_321' },
    { id: '6', name: 'memory_video_002.mp4', type: 'video', size: 98.7, date: '2026-09-09', owner: 'user_654' },
    { id: '7', name: 'memory_photo_003.jpg', type: 'image', size: 6.1, date: '2026-09-08', owner: 'user_987' },
    { id: '8', name: 'cache_temp_data.tmp', type: 'other', size: 15.2, date: '2026-09-07', owner: 'system' },
  ]);

  const [storageConfig, setStorageConfig] = useState({
    totalStorage: 1000,
    usedStorage: 543.8,
    autoCleanup: true,
    cleanupThreshold: 80,
    retentionDays: 90,
    maxFileSize: 500,
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes.toFixed(1) + ' MB';
    return (bytes / 1024).toFixed(2) + ' GB';
  };

  const filteredItems = selectedType === 'all' ? storageItems : storageItems.filter(item => item.type === selectedType);

  const deleteItem = (id: string) => {
    setStorageItems(storageItems.filter(item => item.id !== id));
  };

  const cleanupOldFiles = () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - storageConfig.retentionDays);
    const cutoffString = cutoffDate.toISOString().split('T')[0];
    
    setStorageItems(storageItems.filter(item => new Date(item.date) >= cutoffDate));
  };

  const clearCache = () => {
    setStorageItems(storageItems.filter(item => item.type !== 'other'));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="h-4 w-4" />;
      case 'video': return <FileVideo className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'other': return <Folder className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'video': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'document': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'other': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const usedPercentage = (storageConfig.usedStorage / storageConfig.totalStorage) * 100;
  const storageStatus = usedPercentage >= 90 ? 'critical' : usedPercentage >= 70 ? 'warning' : 'good';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <HardDrive className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Storage Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitor and manage storage usage
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Storage</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{formatBytes(storageConfig.totalStorage)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Used</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatBytes(storageConfig.usedStorage)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Available</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatBytes(storageConfig.totalStorage - storageConfig.usedStorage)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Status</p>
            <p className={`text-lg font-bold ${storageStatus === 'good' ? 'text-green-600 dark:text-green-400' : storageStatus === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
              {storageStatus}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Storage Usage</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">{usedPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${storageStatus === 'good' ? 'bg-green-500' : storageStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${usedPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
            <option value="other">Other</option>
          </select>
          <button
            type="button"
            onClick={cleanupOldFiles}
            className="px-3 py-1.5 rounded-lg text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-0 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Cleanup Old Files
          </button>
          <button
            type="button"
            onClick={clearCache}
            className="px-3 py-1.5 rounded-lg text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Clear Cache
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Storage Configuration</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Auto Cleanup</label>
              <select
                value={storageConfig.autoCleanup ? 'enabled' : 'disabled'}
                onChange={(e) => setStorageConfig({ ...storageConfig, autoCleanup: e.target.value === 'enabled' })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              >
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Cleanup Threshold (%)</label>
              <input
                type="number"
                value={storageConfig.cleanupThreshold}
                onChange={(e) => setStorageConfig({ ...storageConfig, cleanupThreshold: parseInt(e.target.value) || 80 })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Retention (days)</label>
              <input
                type="number"
                value={storageConfig.retentionDays}
                onChange={(e) => setStorageConfig({ ...storageConfig, retentionDays: parseInt(e.target.value) || 90 })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Max File Size (MB)</label>
              <input
                type="number"
                value={storageConfig.maxFileSize}
                onChange={(e) => setStorageConfig({ ...storageConfig, maxFileSize: parseInt(e.target.value) || 500 })}
                className="w-full px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Storage Items ({filteredItems.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  {getTypeIcon(item.type)}
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.name}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(item.size)}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{item.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.owner}</span>
                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Storage Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Enable auto cleanup to manage storage automatically</li>
              <li>• Set appropriate retention periods for data</li>
              <li>• Monitor storage usage regularly</li>
              <li>• Clear cache to free up temporary files</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
