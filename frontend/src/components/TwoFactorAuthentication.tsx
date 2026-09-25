'use client';

import { useState, useEffect } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  as,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Device,
  Download,
  Eye,
  EyeOff,
  Key,
  Lock,
  Mail,
  Plus,
  QrCode,
  RefreshCw,
  Settings,
  ShieldCheck,
  Smartphone,
  Trash2
} from 'lucide-react';
import { authApi } from '@/lib/auth-api';

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

const INITIAL_METHODS: TwoFactorMethod[] = [
  {
    id: 'totp',
    type: 'totp',
    name: 'Ứng dụng Authenticator (Google / Authy / Microsoft)',
    enabled: false,
    primary: false,
    lastUsed: null,
    verified: false,
  },
  {
    id: 'sms',
    type: 'sms',
    name: 'Xác thực tin nhắn SMS',
    enabled: false,
    primary: false,
    lastUsed: null,
    verified: false,
  },
  {
    id: 'email',
    type: 'email',
    name: 'Xác thực qua hộp thư Email',
    enabled: false,
    primary: false,
    lastUsed: null,
    verified: false,
  },
  {
    id: 'hardware',
    type: 'hardware',
    name: 'Khóa bảo mật phần cứng (FIDO2 / YubiKey)',
    enabled: false,
    primary: false,
    lastUsed: null,
    verified: false,
  },
];

const DEFAULT_TRUSTED_DEVICES: TrustedDevice[] = [
  {
    id: 'device-1',
    name: 'Trình duyệt hiện tại (Chrome / Edge)',
    deviceType: 'Desktop',
    lastUsed: new Date(),
    expiresAt: new Date(Date.now() + 86400000 * 30),
  },
];

export default function TwoFactorAuthentication({ 
  onCancel, 
  onEnable2FA, 
  onDisable2FA, 
  onGenerateBackupCodes, 
  onAddTrustedDevice, 
  onRemoveTrustedDevice 
}: TwoFactorAuthenticationProps) {
  const [methods, setMethods] = useState<TwoFactorMethod[]>(INITIAL_METHODS);
  const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
  const [backupCodesCount, setBackupCodesCount] = useState<number>(0);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>(DEFAULT_TRUSTED_DEVICES);
  const [showSettings, setShowSettings] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [backupCodesVisible, setBackupCodesVisible] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<TwoFactorMethod['type'] | null>(null);
  const [setupStep, setSetupStep] = useState<'scan' | 'verify' | 'complete'>('scan');
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  
  // API states
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [qrData, setQrData] = useState<{ secret: string; qrCodeUrl: string; otpauthUrl: string } | null>(null);
  const [newGeneratedBackupCodes, setNewGeneratedBackupCodes] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Fetch status on mount
  useEffect(() => {
    load2FAStatus();
  }, []);

  const load2FAStatus = async () => {
    try {
      setIsLoading(true);
      setActionError('');
      const status = await authApi.get2FAStatus();
      
      setMethods(prev => prev.map(m => {
        if (m.type === 'totp') {
          return {
            ...m,
            enabled: status.enabled,
            verified: status.enabled,
            primary: status.enabled,
            lastUsed: status.lastUsedAt ? new Date(status.lastUsedAt) : null,
          };
        }
        return m;
      }));
      setBackupCodesCount(status.backupCodesCount || 0);
    } catch (err: any) {
      console.warn('Could not load 2FA status from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartEnableTOTP = async () => {
    setActionError('');
    setIsActionLoading(true);
    try {
      const data = await authApi.generate2FA();
      setQrData(data);
      setSelectedMethod('totp');
      setSetupStep('scan');
      setVerificationCode('');
      setShowSetupModal(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể tạo mã bí mật 2FA. Vui lòng thử lại.';
      setActionError(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleVerifyAndEnableTOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verificationCode || verificationCode.trim().length !== 6) {
      setActionError('Mã xác thực phải gồm đúng 6 chữ số.');
      return;
    }

    setActionError('');
    setIsActionLoading(true);
    try {
      const res = await authApi.enable2FA(verificationCode.trim());
      setNewGeneratedBackupCodes(res.backupCodes || []);
      setBackupCodesCount(res.backupCodes?.length || 10);
      
      // Update local state
      setMethods(prev => prev.map(m => 
        m.type === 'totp' ? { ...m, enabled: true, verified: true, primary: true, lastUsed: new Date() } : m
      ));
      
      const parsedCodes: BackupCode[] = (res.backupCodes || []).map(code => ({
        code,
        used: false,
        usedAt: null,
      }));
      setBackupCodes(parsedCodes);
      setShowBackupCodes(true);

      setSetupStep('complete');
      if (onEnable2FA) await onEnable2FA('totp');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Mã xác thực không hợp lệ. Vui lòng kiểm tra lại đồng hồ thiết bị.';
      setActionError(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleConfirmDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    setIsActionLoading(true);

    try {
      await authApi.disable2FA({ password: disablePassword.trim() });
      
      setMethods(prev => prev.map(m => 
        m.type === 'totp' ? { ...m, enabled: false, verified: false, primary: false } : m
      ));
      setBackupCodes([]);
      setBackupCodesCount(0);
      setShowDisableModal(false);
      setDisablePassword('');
      if (onDisable2FA) await onDisable2FA('totp');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Mật khẩu xác nhận không chính xác.';
      setActionError(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleGenerateNewBackupCodes = async () => {
    setActionError('');
    setIsActionLoading(true);
    try {
      if (onGenerateBackupCodes) {
        const newCodes = await onGenerateBackupCodes();
        setBackupCodes(newCodes);
        setBackupCodesCount(newCodes.length);
      } else {
        const res = await authApi.generateBackupCodes();
        const codes = res.backupCodes || [];
        setNewGeneratedBackupCodes(codes);
        const parsed: BackupCode[] = codes.map(c => ({ code: c, used: false, usedAt: null }));
        setBackupCodes(parsed);
        setBackupCodesCount(codes.length);
      }
      setShowBackupCodes(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể tạo mã dự phòng mới.';
      setActionError(msg);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadBackupCodes = () => {
    const list = backupCodes.length > 0 ? backupCodes.map(b => b.code) : newGeneratedBackupCodes;
    const content = `MEMORY MAP - MÃ DỰ PHÒNG XÁC THỰC 2 BƯỚC (2FA)\n` +
      `Ngày tạo: ${new Date().toLocaleString('vi-VN')}\n` +
      `-----------------------------------------------------\n` +
      list.map((c, i) => `${i + 1}. ${c}`).join('\n') +
      `\n-----------------------------------------------------\n` +
      `LƯU Ý: Mỗi mã chỉ sử dụng được duy nhất một lần. Lưu trữ cẩn thận nơi an toàn!`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `memory-map-2fa-backup-codes-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
        return <Smartphone className="h-5 w-5 text-primary" />;
      case 'sms':
        return <Smartphone className="h-5 w-5 text-slate-400" />;
      case 'email':
        return <Mail className="h-5 w-5 text-slate-400" />;
      case 'hardware':
        return <Key className="h-5 w-5 text-slate-400" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-primary" />;
    }
  };

  const enabledMethodsCount = methods.filter(m => m.enabled).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-primary/10 dark:bg-primary/20 text-primary rounded-xl border border-primary/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Xác thực hai yếu tố (2FA / TOTP)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {enabledMethodsCount > 0 
                ? `Đã kích hoạt bảo mật 2 lớp (${enabledMethodsCount} phương thức)` 
                : 'Chưa kích hoạt. Bảo vệ tài khoản của bạn ngay hôm nay!'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load2FAStatus}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Tải lại trạng thái"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Cài đặt 2FA"
          >
            <Settings className="h-4 w-4" />
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Global Action Error */}
      {actionError && (
        <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-xl text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1 font-medium">{actionError}</div>
          <button 
            type="button" 
            onClick={() => setActionError('')}
            className="text-rose-600 hover:text-rose-800 text-xs font-bold"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
            Chính sách bảo mật tài khoản
          </h4>
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span>Bắt buộc 2FA khi đăng nhập thiết bị mới:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Bật</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span>Thời hạn tin cậy thiết bị:</span>
            <span className="font-semibold text-slate-900 dark:text-white">30 ngày</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
            <span>Mã dự phòng khả dụng:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{backupCodesCount}/10 mã</span>
          </div>
        </div>
      )}

      {/* 2FA Methods List */}
      <div className="mb-6">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3">
          Phương thức xác thực hai yếu tố
        </h4>
        <div className="space-y-3">
          {methods.map((method) => (
            <div
              key={method.id}
              className={`p-4 rounded-xl border transition-all ${
                method.enabled
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                    {getMethodIcon(method.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {method.name}
                      </span>
                      {method.primary && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                          Chính
                        </span>
                      )}
                      {method.enabled && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                          <CheckCircle className="h-3.5 w-3.5" />
                          <span>Đã bật</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {method.type === 'totp' && (
                        <span>Google Authenticator, Microsoft Authenticator, Authy</span>
                      )}
                      {method.lastUsed && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Dùng lần cuối: {new Date(method.lastUsed).toLocaleDateString('vi-VN')}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {method.type === 'totp' ? (
                    method.enabled ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActionError('');
                          setShowDisableModal(true);
                        }}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-400 text-xs font-semibold rounded-lg transition-colors border border-rose-200 dark:border-rose-800 cursor-pointer"
                      >
                        Tắt 2FA
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStartEnableTOTP}
                        disabled={isActionLoading}
                        className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {isActionLoading ? 'Đang tạo...' : 'Kích hoạt ngay'}
                      </button>
                    )
                  ) : (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 italic px-2">
                      Sắp hỗ trợ
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup Codes Section */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              <span>Mã dự phòng (Backup Codes)</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sử dụng khi bạn mất điện thoại hoặc không thể truy cập ứng dụng Authenticator.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {methods.find(m => m.type === 'totp')?.enabled && (
              <button
                type="button"
                onClick={handleGenerateNewBackupCodes}
                disabled={isActionLoading}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Tạo 10 mã mới</span>
              </button>
            )}
            {(backupCodes.length > 0 || newGeneratedBackupCodes.length > 0) && (
              <button
                type="button"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {showBackupCodes ? 'Ẩn danh sách' : 'Hiện danh sách'}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs py-2 px-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="text-slate-600 dark:text-slate-400">
            Số lượng mã dự phòng còn khả dụng:
          </span>
          <span className="font-bold text-primary text-sm">
            {backupCodesCount} mã
          </span>
        </div>

        {/* Display Backup Codes Grid */}
        {showBackupCodes && (backupCodes.length > 0 || newGeneratedBackupCodes.length > 0) && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Danh sách mã khôi phục tài khoản:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBackupCodesVisible(!backupCodesVisible)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 rounded-lg transition-colors cursor-pointer"
                  title={backupCodesVisible ? 'Ẩn mã' : 'Hiện mã'}
                >
                  {backupCodesVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadBackupCodes}
                  className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  title="Tải về file .txt"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Tải file</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              {(backupCodes.length > 0 ? backupCodes.map(b => b.code) : newGeneratedBackupCodes).map((code, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-900 dark:text-white">
                    <span className="text-slate-400 text-[10px] w-4">{idx + 1}.</span>
                    <span className={backupCodesVisible ? '' : 'blur-xs select-none'}>
                      {code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(code, `code-${idx}`)}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary rounded transition-colors cursor-pointer"
                    title="Sao chép"
                  >
                    {copiedKey === `code-${idx}` ? (
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Hãy lưu các mã này vào nơi an toàn. Mỗi mã chỉ dùng được 1 lần để đăng nhập khẩn cấp.</span>
            </p>
          </div>
        )}
      </div>

      {/* Trusted Devices Section */}
      <div className="mb-6 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
          <Device className="w-4 h-4 text-primary" />
          <span>Thiết bị tin cậy (Trusted Devices)</span>
        </h4>
        <div className="space-y-2">
          {trustedDevices.map((device) => (
            <div
              key={device.id}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Device className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {device.name}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-[10px] font-bold">
                      {device.deviceType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Hết hạn: {new Date(device.expiresAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveTrustedDevice(device.id)}
                className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                title="Xóa thiết bị tin cậy"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SETUP MODAL */}
      {showSetupModal && qrData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Kích hoạt Authenticator (2FA)</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowSetupModal(false);
                  setQrData(null);
                  setActionError('');
                }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {setupStep === 'scan' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center leading-relaxed">
                  Dùng ứng dụng <strong>Google Authenticator</strong> hoặc <strong>Microsoft Authenticator</strong> trên điện thoại để quét mã QR bên dưới:
                </p>

                {/* Real QR Code Display */}
                <div className="flex justify-center p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner w-56 h-56 mx-auto">
                  <img
                    src={qrData.qrCodeUrl}
                    alt="2FA QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Secret Key Text for Manual Entry */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-[11px] text-slate-500 block mb-1">
                    Không quét được? Nhập khóa thủ công:
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-xs font-mono font-bold text-primary select-all">
                      {qrData.secret}
                    </code>
                    <button
                      type="button"
                      onClick={() => handleCopy(qrData.secret, 'secret')}
                      className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                      title="Sao chép khóa"
                    >
                      {copiedKey === 'secret' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSetupStep('verify')}
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Tôi đã quét mã xong, Tiếp tục
                </button>
              </div>
            )}

            {setupStep === 'verify' && (
              <form onSubmit={handleVerifyAndEnableTOTP} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                  Nhập mã số gồm <strong>6 chữ số</strong> hiển thị trên ứng dụng Authenticator để hoàn tất kích hoạt:
                </p>

                {actionError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{actionError}</span>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    autoFocus
                    required
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full py-3 px-4 text-center text-2xl font-mono font-bold tracking-widest border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-inner"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setSetupStep('scan'); setActionError(''); }}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Xem lại mã QR
                  </button>
                  <button
                    type="submit"
                    disabled={isActionLoading || verificationCode.length !== 6}
                    className="flex-1 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isActionLoading ? 'Đang xác thực...' : 'Xác thực & Bật 2FA'}
                  </button>
                </div>
              </form>
            )}

            {setupStep === 'complete' && (
              <div className="space-y-4 text-center">
                <div className="w-14 h-14 mx-auto bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                  <h5 className="text-base font-bold text-slate-900 dark:text-white">
                    Kích hoạt 2FA thành công!
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hệ thống đã tạo 10 mã dự phòng cho tài khoản của bạn.
                  </p>
                </div>

                {newGeneratedBackupCodes.length > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-left border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Mã dự phòng (10 mã):
                      </span>
                      <button
                        type="button"
                        onClick={handleDownloadBackupCodes}
                        className="text-primary hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Tải file .txt</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
                      {newGeneratedBackupCodes.map((code, idx) => (
                        <div key={idx} className="p-1.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-center font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                          {code}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowSetupModal(false);
                    setQrData(null);
                    setSetupStep('scan');
                    setVerificationCode('');
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Hoàn tất
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DISABLE 2FA CONFIRMATION MODAL */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span>Tắt xác thực hai yếu tố?</span>
              </h4>
              <button
                type="button"
                onClick={() => { setShowDisableModal(false); setDisablePassword(''); }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Việc tắt 2FA sẽ làm giảm đáng kể mức độ an toàn của tài khoản. Để xác nhận hành động này, vui lòng nhập mật khẩu tài khoản của bạn:
            </p>

            {actionError && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDisable2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mật khẩu tài khoản:
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowDisableModal(false); setDisablePassword(''); }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading || !disablePassword}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isActionLoading ? 'Đang tắt...' : 'Xác nhận tắt 2FA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}