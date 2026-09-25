'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Download,
  Eye,
  EyeOff,
  Info,
  Key,
  Lock,
  RefreshCw,
  Shield,
  Star,
  Upload,
  Zap
} from 'lucide-react';

interface EncryptedBackupWithUserKeyProps {
  onCancel?: () => void;
}

interface BackupKey {
  id: string;
  name: string;
  algorithm: string;
  keyLength: number;
  createdAt: string;
  lastUsed: string;
  isActive: boolean;
}

interface EncryptedBackup {
  id: string;
  name: string;
  size: number;
  keyId: string;
  algorithm: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  backupUrl: string;
  checksum: string;
}

interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  compression: boolean;
  checksum: boolean;
}

export default function EncryptedBackupWithUserKey({ onCancel }: EncryptedBackupWithUserKeyProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isBackupEnabled, setIsBackupEnabled] = useState(true);
  const [showKey, setShowKey] = useState(false);

  const [backupKeys, setBackupKeys] = useState<BackupKey[]>([
    { id: '1', name: 'Primary Key', algorithm: 'AES-256', keyLength: 256, createdAt: '2024-01-15', lastUsed: '2024-09-14', isActive: true },
    { id: '2', name: 'Secondary Key', algorithm: 'ChaCha20', keyLength: 256, createdAt: '2024-02-20', lastUsed: '2024-08-20', isActive: false },
    { id: '3', name: 'Archive Key', algorithm: 'AES-256', keyLength: 256, createdAt: '2024-03-10', lastUsed: '2024-07-10', isActive: false },
  ]);

  const [encryptedBackups, setEncryptedBackups] = useState<EncryptedBackup[]>([
    { id: '1', name: 'Monthly Backup - Jan', size: 250, keyId: '1', algorithm: 'AES-256', createdAt: '2024-01-15', status: 'completed', backupUrl: '/backups/jan_2024.enc', checksum: 'abc123...' },
    { id: '2', name: 'Monthly Backup - Feb', size: 280, keyId: '1', algorithm: 'AES-256', createdAt: '2024-02-15', status: 'completed', backupUrl: '/backups/feb_2024.enc', checksum: 'def456...' },
    { id: '3', name: 'Monthly Backup - Mar', size: 320, keyId: '1', algorithm: 'AES-256', createdAt: '2024-03-15', status: 'completed', backupUrl: '/backups/mar_2024.enc', checksum: 'ghi789...' },
  ]);

  const [encryptionConfig, setEncryptionConfig] = useState<EncryptionConfig>({
    algorithm: 'AES-256',
    keyLength: 256,
    compression: true,
    checksum: true,
  });

  const toggleKeyActive = (id: string) => {
    setBackupKeys(backupKeys.map(key => 
      key.id === id ? { ...key, isActive: !key.isActive } : key
    ));
  };

  const createBackup = () => {
    const activeKey = backupKeys.find(k => k.isActive);
    if (!activeKey) return;

    const newBackup: EncryptedBackup = {
      id: Date.now().toString(),
      name: `Monthly Backup - ${new Date().toLocaleString('default', { month: 'short' })}`,
      size: Math.random() * 100 + 200,
      keyId: activeKey.id,
      algorithm: activeKey.algorithm,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
      backupUrl: `/backups/backup_${Date.now()}.enc`,
      checksum: `hash${Math.random().toString(16).substr(2, 8)}`,
    };
    setEncryptedBackups([...encryptedBackups, newBackup]);
  };

  const generateKey = () => {
    const newKey: BackupKey = {
      id: Date.now().toString(),
      name: `New Key ${backupKeys.length + 1}`,
      algorithm: encryptionConfig.algorithm,
      keyLength: encryptionConfig.keyLength,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: '-',
      isActive: false,
    };
    setBackupKeys([...backupKeys, newKey]);
  };

  const getAlgorithmColor = (algorithm: string) => {
    switch (algorithm) {
      case 'AES-256': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'ChaCha20': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'RSA-4096': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Encrypted Backup with User Key
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              User-controlled encryption keys
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isBackupEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isBackupEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Keys</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{backupKeys.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{backupKeys.filter(k => k.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Backups</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{encryptedBackups.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{encryptedBackups.reduce((acc, b) => acc + b.size, 0).toFixed(0)} MB</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isBackupEnabled}
              onChange={(e) => setIsBackupEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Encrypted Backup</span>
          </div>
          <button
            type="button"
            onClick={createBackup}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            Create Backup
          </button>
          <button
            type="button"
            onClick={generateKey}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Key className="h-3 w-3" />
            Generate Key
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Encryption Keys</h4>
          <div className="space-y-2">
            {backupKeys.map((key) => (
              <div key={key.id} className={`p-3 rounded-lg border ${key.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Key className="h-4 w-4 text-rose-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{key.name}</span>
                        {key.isActive && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {key.algorithm} • {key.keyLength} bits
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Created: {key.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Last Used: {key.lastUsed}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleKeyActive(key.id)}
                      className={`px-2 py-1 rounded text-xs ${key.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {key.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                    >
                      {showKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {showKey ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Encryption Configuration</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Algorithm</span>
              </div>
              <select
                value={encryptionConfig.algorithm}
                onChange={(e) => setEncryptionConfig({ ...encryptionConfig, algorithm: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="AES-256">AES-256</option>
                <option value="ChaCha20">ChaCha20</option>
                <option value="RSA-4096">RSA-4096</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Key Length</span>
              </div>
              <select
                value={encryptionConfig.keyLength}
                onChange={(e) => setEncryptionConfig({ ...encryptionConfig, keyLength: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value={128}>128 bits</option>
                <option value={256}>256 bits</option>
                <option value={512}>512 bits</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Download className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Compression</span>
              </div>
              <input
                type="checkbox"
                checked={encryptionConfig.compression}
                onChange={(e) => setEncryptionConfig({ ...encryptionConfig, compression: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Checksum</span>
              </div>
              <input
                type="checkbox"
                checked={encryptionConfig.checksum}
                onChange={(e) => setEncryptionConfig({ ...encryptionConfig, checksum: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Encrypted Backups</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {encryptedBackups.map((backup) => (
              <div key={backup.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Lock className="h-4 w-4 text-rose-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{backup.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getAlgorithmColor(backup.algorithm)}`}>
                          {backup.algorithm}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(backup.status)}`}>
                          {backup.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {backup.size.toFixed(0)} MB • {backup.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Key: {backupKeys.find(k => k.id === backup.keyId)?.name}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Checksum: {backup.checksum}</span>
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
                    className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Upload className="h-3 w-3" />
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Encrypted Backup Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• User-controlled encryption keys for maximum security</li>
              <li>• Multiple encryption algorithms (AES-256, ChaCha20, RSA)</li>
              <li>• Automatic checksum verification for integrity</li>
              <li>• Compression to reduce backup size</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
