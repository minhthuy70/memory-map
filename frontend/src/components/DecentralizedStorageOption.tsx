'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Cloud,
  Download,
  HardDrive,
  Info,
  RefreshCw,
  Shield,
  Star,
  Upload,
  Zap
} from 'lucide-react';

interface DecentralizedStorageProps {
  onCancel?: () => void;
}

interface StorageProvider {
  id: string;
  name: string;
  type: 'IPFS' | 'Arweave' | 'Filecoin' | 'Storj';
  icon: string;
  isEnabled: boolean;
  storageUsed: number;
  storageLimit: number;
  costPerGB: number;
  replication: number;
  isActive: boolean;
}

interface StoredFile {
  id: string;
  name: string;
  size: number;
  provider: string;
  cid: string;
  uploadedAt: string;
  status: 'pinned' | 'uploading' | 'failed';
}

export default function DecentralizedStorage({ onCancel }: DecentralizedStorageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDecentralizedEnabled, setIsDecentralizedEnabled] = useState(true);

  const [storageProviders, setStorageProviders] = useState<StorageProvider[]>([
    { id: '1', name: 'IPFS', type: 'IPFS', icon: '🌐', isEnabled: true, storageUsed: 2.5, storageLimit: 10, costPerGB: 0, replication: 3, isActive: true },
    { id: '2', name: 'Arweave', type: 'Arweave', icon: '⛓️', isEnabled: true, storageUsed: 1.8, storageLimit: 5, costPerGB: 0.5, replication: 1, isActive: true },
    { id: '3', name: 'Filecoin', type: 'Filecoin', icon: '📁', isEnabled: false, storageUsed: 0, storageLimit: 20, costPerGB: 0.02, replication: 5, isActive: false },
    { id: '4', name: 'Storj', type: 'Storj', icon: '☁️', isEnabled: false, storageUsed: 0, storageLimit: 15, costPerGB: 0.015, replication: 3, isActive: false },
  ]);

  const [storedFiles, setStoredFiles] = useState<StoredFile[]>([
    { id: '1', name: 'memory_photo_1.jpg', size: 2.5, provider: 'IPFS', cid: 'QmXxx...yyy', uploadedAt: '2024-01-15', status: 'pinned' },
    { id: '2', name: 'memory_video_1.mp4', size: 150, provider: 'Arweave', cid: 'ar://abc...def', uploadedAt: '2024-02-20', status: 'pinned' },
    { id: '3', name: 'memory_document.pdf', size: 0.5, provider: 'IPFS', cid: 'QmZzz...www', uploadedAt: '2024-03-10', status: 'pinned' },
  ]);

  const toggleProvider = (id: string) => {
    setStorageProviders(storageProviders.map(provider => 
      provider.id === id ? { ...provider, isEnabled: !provider.isEnabled, isActive: !provider.isActive } : provider
    ));
  };

  const uploadToDecentralized = (providerId: string) => {
    const newFile: StoredFile = {
      id: Date.now().toString(),
      name: `new_file_${Date.now()}.jpg`,
      size: Math.random() * 5,
      provider: storageProviders.find(p => p.id === providerId)?.name || 'IPFS',
      cid: `Qm${Math.random().toString(16).substr(2, 4)}...${Math.random().toString(16).substr(2, 3)}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'pinned',
    };
    setStoredFiles([...storedFiles, newFile]);
  };

  const getFileCID = (fileId: string) => {
    const file = storedFiles.find(f => f.id === fileId);
    return file?.cid || '';
  };

  const getStoragePercentage = (provider: StorageProvider) => {
    return ((provider.storageUsed / provider.storageLimit) * 100).toFixed(1);
  };

  const getProviderColor = (type: string) => {
    switch (type) {
      case 'IPFS': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Arweave': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'Filecoin': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Storj': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl">
            <HardDrive className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Decentralized Storage Option
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              IPFS, Arweave, Filecoin, Storj
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isDecentralizedEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isDecentralizedEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Providers</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{storageProviders.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{storageProviders.filter(p => p.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Files Stored</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{storedFiles.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Storage</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{storageProviders.reduce((acc, p) => acc + p.storageUsed, 0).toFixed(1)} GB</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isDecentralizedEnabled}
              onChange={(e) => setIsDecentralizedEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Decentralized Storage</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Upload className="h-3 w-3" />
            Upload to IPFS
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Storage Providers</h4>
          <div className="space-y-2">
            {storageProviders.map((provider) => (
              <div key={provider.id} className={`p-3 rounded-lg border ${provider.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{provider.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{provider.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getProviderColor(provider.type)}`}>
                          {provider.type}
                        </span>
                        {provider.isActive && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {provider.storageUsed.toFixed(1)} / {provider.storageLimit} GB • ${provider.costPerGB}/GB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{getStoragePercentage(provider)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Used</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${getStoragePercentage(provider)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Replication: {provider.replication}x</span>
                    <span>•</span>
                    <span>Monthly: ${(provider.storageUsed * provider.costPerGB).toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleProvider(provider.id)}
                    className={`px-2 py-1 rounded text-xs ${provider.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {provider.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Stored Files ({storedFiles.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {storedFiles.map((file) => (
              <div key={file.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Cloud className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{file.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getProviderColor(file.provider as any)}`}>
                          {file.provider}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {file.size.toFixed(2)} MB • Uploaded: {file.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{file.cid}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Shield className="h-3 w-3" />
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Decentralized Storage Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• IPFS: Free, peer-to-peer storage with 3x replication</li>
              <li>• Arweave: Permanent storage with one-time payment</li>
              <li>• Filecoin: Cost-effective with 5x replication</li>
              <li>• Storj: Decentralized cloud storage with 3x replication</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
