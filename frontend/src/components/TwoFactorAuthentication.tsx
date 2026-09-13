'use client';

import { useState } from 'react';
import { ShieldCheck, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Key, Smartphone, Mail, QrCode, Clock, Lock, Plus, Trash2, Eye, EyeOff, Download, Smartphone as Device } from 'lucide-react';

interface TwoFactorMethod {
  id: string;
  type: 'totp' | 'sms' | 'email' | 'hardware';
  name: string;
  enabled: boolean;
  primary: boolean;
  lastUsed: Date | null;
  verified: boolean;
}

interface BackupCode {
  code: string;
  used: boolean;
  usedAt: Date | null;
}

interface TrustedDevice {
  id: string;
  name: string;
  deviceType: string;
  lastUsed: Date;
  expiresAt: Date;
}

interface TwoFactorAuthenticationProps {
  onCancel?: () => void;
  onEnable2FA?: (method: TwoFactorMethod['type']) => Promise<void>;
  onDisable2FA?: (methodId: string) => Promise<void>;
  onGenerateBackupCodes?: () => Promise<BackupCode[]>;
  onAddTrustedDevice?: (device: Omit<TrustedDevice, 'id'>) => Promise<TrustedDevice>;
  onRemoveTrustedDevice?: (deviceId: string) => Promise<void>;
}

const DEFAULT_METHODS: TwoFactorMethod[] = [
  {
    id: 'method-1',
    type: 'totp',
    name: 'Authenticator App',
    enabled: true,
    primary: true,
    lastUsed: new Date(),
    verified: true,
  },
  {
    id: 'method-2',
    type: 'sms',
    name: 'SMS Verification',
    enabled: false,
    primary: false,
    lastUsed: null,
    verified: false,
  },
  {
    id: 'method-3',
    type: 'email',
    name: 'Email Verification',
    enabled: false,
    primary: false,
    lastUsed: null,
    verified: false,
  },
  {
    id: 'method-4',
    type: 'hardware',
    name: 'Security Key (YubiKey)',
    enabled: false,
    primary: false,
    lastUsed: null,
    verified: false,
  },
];

const DEFAULT_BACKUP_CODES: BackupCode[] = [
  { code: 'ABCD-EFGH-IJKL-MNOP', used: false, usedAt: null },
  { code: 'QRST-UVWX-YZAB-CDEF', used: false, usedAt: null },
  { code: 'GHIJ-KLMN-OPQR-STUV', used: false, usedAt: null },
  { code: 'WXYZ-ABCD-EFGH-IJKL', used: false, usedAt: null },
  { code: 'MNOP-QRST-UVWX-YZAB', used: false, usedAt: null },
  { code: 'CDEF-GHIJ-KLMN-OPQR', used: false, usedAt: null },
  { code: 'STUV-WXYZ-ABCD-EFGH', used: false, usedAt: null },
  { code: 'IJKL-MNOP-QRST-UVWX', used: false, usedAt: null },
  { code: 'YZAB-CDEF-GHIJ-KLMN', used: false, usedAt: null },
  { code: 'OPQR-STUV-WXYZ-ABCD', used: false, usedAt: null },
];

const DEFAULT_TRUSTED_DEVICES: TrustedDevice[] = [
  {
    id: 'device-1',
    name: 'MacBook Pro',
    deviceType: 'Desktop',
    lastUsed: new Date(),
    expiresAt: new Date(Date.now() + 86400000 * 30),
  },
  {
    id: 'device-2',
    name: 'iPhone 15 Pro',
    deviceType: 'Mobile',
    lastUsed: new Date(Date.now() - 86400000),
    expiresAt: new Date(Date.now() + 86400000 * 30),
  },
];

export default function TwoFactorAuthentication({ onCancel, onEnable2FA, onDisable2FA, onGenerateBackupCodes, onAddTrustedDevice, onRemoveTrustedDevice }: TwoFactorAuthenticationProps) {
  const [methods, setMethods] = useState<TwoFactorMethod[]>(DEFAULT_METHODS);
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>(DEFAULT_BACKUP_CODES);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>(DEFAULT_TRUSTED_DEVICES);
  const [showSettings, setShowSettings] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodesVisible, setBackupCodesVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod['type'] | null>(null);
  const [setupStep, setSetupStep] = useState<'scan' | 'verify' | 'complete'>('scan');
  const [verificationCode, setVerificationCode] = useState('');

  const handleEnableMethod = async (methodId: string) => {
    const method = methods.find(m => m.id === methodId);
    if (method && onEnable2FA) {
      await onEnable2FA(method.type);
    }
    setMethods(prev => prev.map(m => 
      m.id === methodId ? { ...m, enabled: true, verified: true } : m
    ));
  };

  const handleDisableMethod = async (methodId: string) => {
    if (onDisable2FA) {
      await onDisable2FA(methodId);
    }
    setMethods(prev => prev.map(m => 
      m.id === methodId ? { ...m, enabled: false, verified: false, primary: false } : m
    ));
  };

  const handleSetPrimary = (methodId: string) => {
    setMethods(prev => prev.map(m => 
      m.id === methodId ? { ...m, primary: true } : { ...m, primary: false }
    ));
  };

  const handleGenerateBackupCodes = async () => {
    if (onGenerateBackupCodes) {
      const newCodes = await onGenerateBackupCodes();
      setBackupCodes(newCodes);
    } else {
      const newCodes: BackupCode[] = Array.from({ length: 10 }, (_, i) => ({
        code: `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        used: false,
        usedAt: null,
      }));
      setBackupCodes(newCodes);
    }
    setShowBackupCodes(true);
  };

  const handleRemoveTrustedDevice = async (deviceId: string) => {
    if (onRemoveTrustedDevice) {
      await onRemoveTrustedDevice(deviceId);
    }
    setTrustedDevices(prev => prev.filter(d => d.id !== deviceId));
  };

  const getMethodIcon = (type: TwoFactorMethod['type']) => {
    switch (type) {
      case 'totp':
        return <Smartphone className="h-4 w-4" />;
      case 'sms':
        return <Smartphone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'hardware':
        return <Key className="h-4 w-4" />;
      default:
        return <ShieldCheck className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (type: TwoFactorMethod['type']) => {
    switch (type) {
      case 'totp':
        return 'Authenticator App';
      case 'sms':
        return 'SMS';
      case 'email':
        return 'Email';
      case 'hardware':
        return 'Security Key';
      default:
        return type;
    }
  };

  const enabledMethods = methods.filter(m => m.enabled).length;
  const unusedBackupCodes = backupCodes.filter(c => !c.used).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Xác thực hai yếu tố (2FA)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledMethods} method{enabledMethods !== 1 ? 's' : ''} enabled
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
            Cài đặt 2FA
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Require 2FA for login
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Remember trusted devices
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">30 days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Backup codes
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">{unusedBackupCodes}/10 available</span>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Methods */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Phương thức xác thực
        </h4>
        <div className="space-y-2">
          {methods.map((method) => (
            <div
              key={method.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getMethodIcon(method.type)}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {method.name}
                  </span>
                  {method.primary && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-full">
                      Primary
                    </span>
                  )}
                  {method.enabled && method.verified && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {method.enabled && !method.primary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(method.id)}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      Set Primary
                    </button>
                  )}
                  {method.enabled ? (
                    <button
                      type="button"
                      onClick={() => handleDisableMethod(method.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMethod(method.type);
                        setShowSetupModal(true);
                      }}
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      Enable
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span>{getMethodLabel(method.type)}</span>
                {method.lastUsed && (
                  <>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>Last used: {new Date(method.lastUsed).toLocaleDateString('vi-VN')}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup Codes */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            Backup Codes
          </h4>
          <button
            type="button"
            onClick={handleGenerateBackupCodes}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Generate New
          </button>
        </div>
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Available codes: {unusedBackupCodes}/10
            </span>
            {showBackupCodes && (
              <button
                type="button"
                onClick={() => setBackupCodesVisible(!backupCodesVisible)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
              >
                {backupCodesVisible ? <EyeOff className="h-3 w-3 text-slate-500" /> : <Eye className="h-3 w-3 text-slate-500" />}
              </button>
            )}
          </div>
          {showBackupCodes && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border ${
                    code.used
                      ? 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <code className={`text-xs font-mono ${
                    backupCodesVisible ? 'text-slate-900 dark:text-white' : 'blur-sm'
                  }`}>
                    {code.code}
                  </code>
                  {code.used && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      Used: {code.usedAt ? new Date(code.usedAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trusted Devices */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Trusted Devices
        </h4>
        <div className="space-y-2">
          {trustedDevices.map((device) => (
            <div
              key={device.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Device className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {device.name}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-[10px] text-slate-600 dark:text-slate-400">
                    {device.deviceType}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveTrustedDevice(device.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  title="Remove device"
                >
                  <Trash2 className="h-3 w-3 text-slate-500" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>Last used: {new Date(device.lastUsed).toLocaleDateString('vi-VN')}</span>
                <span>•</span>
                <span>Expires: {new Date(device.expiresAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Modal */}
      {showSetupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Setup {getMethodLabel(selectedMethod || 'totp')}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowSetupModal(false);
                  setSelectedMethod(null);
                  setSetupStep('scan');
                  setVerificationCode('');
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {setupStep === 'scan' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-48 h-48 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center">
                    <QrCode className="h-32 w-32 text-slate-400" />
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                  Scan this QR code with your authenticator app
                </p>
                <button
                  type="button"
                  onClick={() => setSetupStep('verify')}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {setupStep === 'verify' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Enter verification code
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-center tracking-widest"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSetupStep('complete')}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Verify
                </button>
              </div>
            )}

            {setupStep === 'complete' && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
                  2FA enabled successfully!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowSetupModal(false);
                    setSelectedMethod(null);
                    setSetupStep('scan');
                    setVerificationCode('');
                    if (selectedMethod) {
                      const method = methods.find(m => m.type === selectedMethod);
                      if (method) handleEnableMethod(method.id);
                    }
                  }}
                  className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Xác thực hai yếu tố bảo vệ tài khoản với TOTP/SMS/Email/Hardware key methods, backup codes, và trusted devices.
        </p>
      </div>
    </div>
  );
}