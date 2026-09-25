'use client';

import { useState } from 'react';
import { Lock, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Key, Shield, FileText, Database, Clock, Eye, EyeOff, RotateCw } from 'lucide-react';

interface EncryptionKey {
  id: string;
  name: string;
  algorithm: string;
  keySize: number;
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'expired' | 'revoked';
  lastRotated: Date;
}

interface ProtectedDataType {
  name: string;
  encrypted: boolean;
  algorithm: string;
  lastEncrypted: Date;
  dataSize: string;
}

interface EndToEndEncryptionProps {
  onCancel?: () => void;
  onRotateKey?: (keyId: string) => Promise<void>;
  onGenerateKey?: () => Promise<EncryptionKey>;
  onEncryptData?: (dataType: string) => Promise<void>;
}

const DEFAULT_KEYS: EncryptionKey[] = [
  {
    id: 'key-1',
    name: 'Master Key',
    algorithm: 'AES-256-GCM',
    keySize: 256,
    createdAt: new Date(Date.now() - 86400000 * 90),
    expiresAt: new Date(Date.now() + 86400000 * 90),
    status: 'active',
    lastRotated: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: 'key-2',
    name: 'User Data Key',
    algorithm: 'AES-256-GCM',
    keySize: 256,
    createdAt: new Date(Date.now() - 86400000 * 60),
    expiresAt: new Date(Date.now() + 86400000 * 60),
    status: 'active',
    lastRotated: new Date(Date.now() - 86400000 * 30),
  },
];

const DEFAULT_DATA_TYPES: ProtectedDataType[] = [
  { name: 'Personal Information', encrypted: true, algorithm: 'AES-256-GCM', lastEncrypted: new Date(), dataSize: '2.5 GB' },
  { name: 'Memory Content', encrypted: true, algorithm: 'AES-256-GCM', lastEncrypted: new Date(), dataSize: '8.2 GB' },
  { name: 'User Preferences', encrypted: true, algorithm: 'AES-256-GCM', lastEncrypted: new Date(), dataSize: '0.8 GB' },
  { name: 'Location Data', encrypted: true, algorithm: 'AES-256-GCM', lastEncrypted: new Date(), dataSize: '1.2 GB' },
  { name: 'Media Files', encrypted: false, algorithm: 'None', lastEncrypted: new Date(), dataSize: '15.3 GB' },
];

export default function EndToEndEncryption({ onCancel, onRotateKey, onGenerateKey, onEncryptData }: EndToEndEncryptionProps) {
  const [keys, setKeys] = useState<EncryptionKey[]>(DEFAULT_KEYS);
  const [dataTypes, setDataTypes] = useState<ProtectedDataType[]>(DEFAULT_DATA_TYPES);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyDetails, setShowKeyDetails] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationInterval, setRotationInterval] = useState(90);

  const handleRotateKey = async (keyId: string) => {
    if (onRotateKey) {
      await onRotateKey(keyId);
    }
    setKeys(prev => prev.map(key => 
      key.id === keyId 
        ? { ...key, lastRotated: new Date(), createdAt: new Date() }
        : key
    ));
  };

  const handleGenerateKey = async () => {
    if (onGenerateKey) {
      const newKey = await onGenerateKey();
      setKeys(prev => [...prev, newKey]);
    } else {
      const newKey: EncryptionKey = {
        id: `key-${Date.now()}`,
        name: 'New Key',
        algorithm: 'AES-256-GCM',
        keySize: 256,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000 * 90),
        status: 'active',
        lastRotated: new Date(),
      };
      setKeys(prev => [...prev, newKey]);
    }
  };

  const handleEncryptData = async (dataTypeName: string) => {
    if (onEncryptData) {
      await onEncryptData(dataTypeName);
    }
    setDataTypes(prev => prev.map(data => 
      data.name === dataTypeName 
        ? { ...data, encrypted: true, algorithm: 'AES-256-GCM', lastEncrypted: new Date() }
        : data
    ));
  };

  const getKeyStatusColor = (status: EncryptionKey['status']) => {
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

  const getDaysUntilExpiry = (expiresAt: Date) => {
    const days = Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Mã hóa end-to-end
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {keys.length} keys • {dataTypes.filter(d => d.encrypted).length} encrypted types
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt encryption
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-rotate keys
              </span>
              <button
                type="button"
                onClick={() => setAutoRotate(!autoRotate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoRotate ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRotate ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Rotation interval: {rotationInterval} days
              </label>
              <select
                value={rotationInterval}
                onChange={(e) => setRotationInterval(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="30">30 ngày</option>
                <option value="60">60 ngày</option>
                <option value="90">90 ngày</option>
                <option value="180">180 ngày</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Encryption Keys */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            Encryption Keys
          </h4>
          <button
            type="button"
            onClick={handleGenerateKey}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Key className="h-3 w-3" />
            Generate Key
          </button>
        </div>
        <div className="space-y-2">
          {keys.map((key) => (
            <div
              key={key.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {key.name}
                  </span>
                  <span className={`px-2 py-0.5 bg-gradient-to-r ${getKeyStatusColor(key.status)} text-white text-[10px] font-bold rounded-full`}>
                    {key.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRotateKey(key.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  title="Rotate key"
                >
                  <RotateCw className="h-3 w-3 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div>
                  <span>Algorithm:</span>
                  <span className="text-slate-700 dark:text-slate-300 ml-1">{key.algorithm}</span>
                </div>
                <div>
                  <span>Key Size:</span>
                  <span className="text-slate-700 dark:text-slate-300 ml-1">{key.keySize} bits</span>
                </div>
                <div>
                  <span>Expires:</span>
                  <span className="text-slate-700 dark:text-slate-300 ml-1">{getDaysUntilExpiry(key.expiresAt)} days</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                <Clock className="h-3 w-3" />
                <span>Last rotated: {new Date(key.lastRotated).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protected Data Types */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Protected Data Types
        </h4>
        <div className="space-y-2">
          {dataTypes.map((dataType) => (
            <div
              key={dataType.name}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {dataType.encrypted ? (
                    <Shield className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {dataType.name}
                  </span>
                </div>
                {!dataType.encrypted && (
                  <button
                    type="button"
                    onClick={() => handleEncryptData(dataType.name)}
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Encrypt
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div>
                  <span>Algorithm:</span>
                  <span className="text-slate-700 dark:text-slate-300 ml-1">{dataType.algorithm}</span>
                </div>
                <div>
                  <span>Size:</span>
                  <span className="text-slate-700 dark:text-slate-300 ml-1">{dataType.dataSize}</span>
                </div>
                <div>
                  <span>Last:</span>
                  <span className="text-slate-700 dark:text-slate-300 ml-1">{new Date(dataType.lastEncrypted).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Key className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active Keys</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {keys.filter(k => k.status === 'active').length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Encrypted Data</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {dataTypes.filter(d => d.encrypted).length}/{dataTypes.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Database className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            28.0 GB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Next Rotation</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {rotationInterval}d
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Mã hóa end-to-end sử dụng AES-256-GCM với automatic key rotation và comprehensive data type protection.
        </p>
      </div>
    </div>
  );
}