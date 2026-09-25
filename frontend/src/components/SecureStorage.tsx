'use client';

import { useState } from 'react';
import { Shield, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Key, Lock, Database, HardDrive, Globe, Check, FileText, Clock, Ban } from 'lucide-react';

interface StorageItem {
  id: string;
  name: string;
  type: 'token' | 'secret' | 'certificate' | 'data';
  storageType: 'keychain' | 'keystore' | 'encrypted-localstorage' | 'encrypted-sessionstorage';
  size: string;
  encrypted: boolean;
  algorithm: string;
  lastAccessed: Date;
  expiresAt: Date | null;
  status: 'active' | 'expired' | 'revoked';
}

interface SecureStorageProps {
  onCancel?: () => void;
  onRevokeItem?: (itemId: string) => Promise<void>;
  onRefreshStorage?: () => Promise<StorageItem[]>;
}

const DEFAULT_ITEMS: StorageItem[] = [
  {
    id: 'item-1',
    name: 'auth_token',
    type: 'token',
    storageType: 'keychain',
    size: '128 bytes',
    encrypted: true,
    algorithm: 'AES-256-GCM',
    lastAccessed: new Date(),
    expiresAt: new Date(Date.now() + 86400000 * 7),
    status: 'active',
  },
  {
    id: 'item-2',
    name: 'api_secret',
    type: 'secret',
    storageType: 'keystore',
    size: '256 bytes',
    encrypted: true,
    algorithm: 'AES-256-GCM',
    lastAccessed: new Date(Date.now() - 3600000),
    expiresAt: null,
    status: 'active',
  },
  {
    id: 'item-3',
    name: 'ssl_certificate',
    type: 'certificate',
    storageType: 'keychain',
    size: '2.4 KB',
    encrypted: true,
    algorithm: 'RSA-2048',
    lastAccessed: new Date(Date.now() - 86400000),
    expiresAt: new Date(Date.now() + 86400000 * 30),
    status: 'active',
  },
  {
    id: 'item-4',
    name: 'user_preferences',
    type: 'data',
    storageType: 'encrypted-localstorage',
    size: '15.2 KB',
    encrypted: true,
    algorithm: 'AES-256-GCM',
    lastAccessed: new Date(Date.now() - 1800000),
    expiresAt: null,
    status: 'active',
  },
  {
    id: 'item-5',
    name: 'session_data',
    type: 'data',
    storageType: 'encrypted-sessionstorage',
    size: '8.5 KB',
    encrypted: true,
    algorithm: 'AES-256-GCM',
    lastAccessed: new Date(),
    expiresAt: new Date(Date.now() + 3600000),
    status: 'active',
  },
];

export default function SecureStorage({ onCancel, onRevokeItem, onRefreshStorage }: SecureStorageProps) {
  const [items, setItems] = useState<StorageItem[]>(DEFAULT_ITEMS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'token' | 'secret' | 'certificate' | 'data'>('all');
  const [selectedStorage, setSelectedStorage] = useState<'all' | 'keychain' | 'keystore' | 'encrypted-localstorage' | 'encrypted-sessionstorage'>('all');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefreshStorage) {
      const refreshedItems = await onRefreshStorage();
      setItems(refreshedItems);
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setIsRefreshing(false);
  };

  const handleRevoke = async (itemId: string) => {
    if (onRevokeItem) {
      await onRevokeItem(itemId);
    }
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, status: 'revoked' as const } : item
    ));
  };

  const getTypeIcon = (type: StorageItem['type']) => {
    switch (type) {
      case 'token':
        return <Key className="h-4 w-4" />;
      case 'secret':
        return <Lock className="h-4 w-4" />;
      case 'certificate':
        return <FileText className="h-4 w-4" />;
      case 'data':
        return <Database className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStorageIcon = (storageType: StorageItem['storageType']) => {
    switch (storageType) {
      case 'keychain':
        return <Key className="h-4 w-4" />;
      case 'keystore':
        return <Lock className="h-4 w-4" />;
      case 'encrypted-localstorage':
        return <HardDrive className="h-4 w-4" />;
      case 'encrypted-sessionstorage':
        return <Globe className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: StorageItem['status']) => {
    switch (status) {
      case 'active':
        return 'from-green-400 to-emerald-500';
      case 'expired':
        return 'from-red-400 to-rose-500';
      case 'revoked':
        return 'from-slate-400 to-slate-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const filteredItems = items.filter(item => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStorage = selectedStorage === 'all' || item.storageType === selectedStorage;
    return matchesType && matchesStorage;
  });

  const totalSize = items.reduce((sum, item) => {
    const size = parseFloat(item.size);
    const unit = item.size.split(' ')[1];
    if (unit === 'KB') return sum + size;
    if (unit === 'MB') return sum + size * 1024;
    return sum + size;
  }, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Lưu trữ an toàn
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} items • {(totalSize / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt secure storage
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Default storage
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">Keychain</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Encryption algorithm
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">AES-256-GCM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-expire tokens
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        >
          <option value="all">Tất cả types</option>
          <option value="token">Token</option>
          <option value="secret">Secret</option>
          <option value="certificate">Certificate</option>
          <option value="data">Data</option>
        </select>
        <select
          value={selectedStorage}
          onChange={(e) => setSelectedStorage(e.target.value as any)}
          className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        >
          <option value="all">Tất cả storage</option>
          <option value="keychain">Keychain</option>
          <option value="keystore">Keystore</option>
          <option value="encrypted-localstorage">Encrypted LocalStorage</option>
          <option value="encrypted-sessionstorage">Encrypted SessionStorage</option>
        </select>
      </div>

      {/* Storage Items */}
      <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(item.type)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStatusColor(item.status)} text-white text-[10px] font-bold rounded-full`}>
                  {item.status}
                </span>
                {item.encrypted && (
                  <Lock className="h-3 w-3 text-green-500" />
                )}
              </div>
              {item.status === 'active' && (
                <button
                  type="button"
                  onClick={() => handleRevoke(item.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  title="Revoke"
                >
                  <Ban className="h-3 w-3 text-slate-500" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {getStorageIcon(item.storageType)}
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">Storage</span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {item.storageType}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {item.size}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Algorithm</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {item.algorithm}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Expires</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {item.expiresAt 
                    ? `${Math.floor((item.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d`
                    : 'Never'
                  }
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" />
              <span>Last accessed: {new Date(item.lastAccessed).toLocaleString('vi-VN')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Key className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Keychain</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {items.filter(i => i.storageType === 'keychain').length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Keystore</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {items.filter(i => i.storageType === 'keystore').length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">LocalStorage</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {items.filter(i => i.storageType === 'encrypted-localstorage').length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">SessionStorage</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {items.filter(i => i.storageType === 'encrypted-sessionstorage').length}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isRefreshing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang cập nhật...
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            Cập nhật storage
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Lưu trữ an toàn sử dụng keychain, keystore, encrypted localStorage/sessionStorage với AES-256-GCM encryption.
        </p>
      </div>
    </div>
  );
}