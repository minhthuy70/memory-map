'use client';

import { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  X, 
  Shield, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Settings, 
  Info, 
  BarChart3, 
  Smartphone, 
  Key, 
  Eye, 
  EyeOff, 
  Zap,
  Trash2,
  Plus,
  AlertCircle,
  Laptop,
  Check
} from 'lucide-react';
import { authApi, WebAuthnCredentialItem } from '@/lib/auth-api';
import { webauthnHelper } from '@/lib/webauthn';

interface BiometricAuthenticationProps {
  onCancel?: () => void;
}

export default function BiometricAuthentication({ onCancel }: BiometricAuthenticationProps) {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [hasPlatformAuthenticator, setHasPlatformAuthenticator] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<WebAuthnCredentialItem[]>([]);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
  
  // UI states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showEnrollModal, setShowEnrollModal] = useState<boolean>(false);
  const [customDeviceName, setCustomDeviceName] = useState<string>('');

  // History log
  const [testHistory, setTestHistory] = useState<Array<{
    id: string;
    method: string;
    status: 'success' | 'failed';
    time: string;
    note: string;
  }>>([]);

  useEffect(() => {
    checkSupportAndLoadData();
  }, []);

  const checkSupportAndLoadData = async () => {
    setIsLoading(true);
    setActionError('');

    const supported = webauthnHelper.isSupported();
    setIsSupported(supported);

    if (supported) {
      const platformAvail = await webauthnHelper.isPlatformAuthenticatorAvailable();
      setHasPlatformAuthenticator(platformAvail);
    }

    try {
      const status = await authApi.getWebAuthnStatus();
      setBiometricEnabled(status.enabled);
      setCredentials(status.credentials || []);
    } catch (err: any) {
      console.warn('Failed to load WebAuthn status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollBiometric = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setActionError('');
    setActionSuccess('');
    setIsActionLoading(true);

    try {
      const deviceName = customDeviceName.trim() || 
        (hasPlatformAuthenticator ? 'Cảm biến vân tay / Khuôn mặt (Windows Hello / Touch ID)' : 'Khóa bảo mật FIDO2');

      const result = await webauthnHelper.registerBiometric(deviceName);

      setActionSuccess(result.message || 'Đăng ký thiết bị sinh trắc học thành công!');
      setShowEnrollModal(false);
      setCustomDeviceName('');

      // Reload credentials
      const updatedCreds = await authApi.getWebAuthnCredentials();
      setCredentials(updatedCreds);
      setBiometricEnabled(true);

      // Add to history
      setTestHistory(prev => [
        {
          id: Date.now().toString(),
          method: deviceName,
          status: 'success',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          note: 'Đăng ký thiết bị mới thành công qua WebAuthn API',
        },
        ...prev,
      ]);
    } catch (err: any) {
      setActionError(err.message || 'Không thể đăng ký sinh trắc học. Vui lòng thử lại.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleTestBiometric = async () => {
    setActionError('');
    setActionSuccess('');
    setIsActionLoading(true);

    try {
      await webauthnHelper.loginWithBiometric();
      setActionSuccess('Xác thực sinh trắc học thành công! Cảm biến hoạt động chuẩn xác.');

      setTestHistory(prev => [
        {
          id: Date.now().toString(),
          method: 'Xác thực sinh trắc học WebAuthn',
          status: 'success',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          note: 'Cảm biến quét nhận diện thành công',
        },
        ...prev,
      ]);
    } catch (err: any) {
      const msg = err.message || 'Xác thực sinh trắc học thất bại.';
      setActionError(msg);

      setTestHistory(prev => [
        {
          id: Date.now().toString(),
          method: 'Xác thực sinh trắc học WebAuthn',
          status: 'failed',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          note: msg,
        },
        ...prev,
      ]);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteCredential = async (id: string, name?: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khóa sinh trắc học "${name || 'Thiết bị này'}"?`)) {
      return;
    }

    setActionError('');
    setActionSuccess('');
    setIsActionLoading(true);

    try {
      await authApi.deleteWebAuthnCredential(id);
      setActionSuccess('Đã gỡ bỏ khóa sinh trắc học thành công.');

      const updated = await authApi.getWebAuthnCredentials();
      setCredentials(updated);
      if (updated.length === 0) {
        setBiometricEnabled(false);
      }
    } catch (err: any) {
      setActionError(err.message || 'Không thể gỡ bỏ thiết bị.');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl border border-purple-500/20">
            <Fingerprint className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Xác thực sinh trắc học (WebAuthn / Passkeys)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Đăng nhập không cần mật khẩu với Touch ID, Face ID, Windows Hello và khóa FIDO2
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={checkSupportAndLoadData}
            disabled={isLoading}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Tải lại"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showHistory 
                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Lịch sử xác thực"
          >
            <BarChart3 className="h-4 w-4" />
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

      {/* Browser Support Alert */}
      {!isSupported && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-900 text-amber-800 dark:text-amber-300 rounded-xl text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <div>
            <strong>Trình duyệt không hỗ trợ WebAuthn:</strong> Hãy sử dụng các trình duyệt hiện đại như Google Chrome, Microsoft Edge, Safari hoặc Firefox trên kết nối an toàn (HTTPS hoặc localhost).
          </div>
        </div>
      )}

      {/* Action Messages */}
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

      {actionSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs sm:text-sm flex items-start gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
          <div className="flex-1 font-medium">{actionSuccess}</div>
          <button 
            type="button" 
            onClick={() => setActionSuccess('')}
            className="text-emerald-600 hover:text-emerald-800 text-xs font-bold"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Main Status Hero Card */}
      <div className={`p-5 sm:p-6 rounded-2xl border mb-6 transition-all ${
        biometricEnabled 
          ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border-purple-300 dark:border-purple-800' 
          : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`p-3.5 rounded-2xl text-white shadow-md shrink-0 ${
              biometricEnabled ? 'bg-gradient-to-br from-purple-600 to-pink-600' : 'bg-slate-400 dark:bg-slate-700'
            }`}>
              {biometricEnabled ? <Fingerprint className="h-7 w-7" /> : <Lock className="h-7 w-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">
                  {biometricEnabled ? 'Sinh trắc học đang hoạt động' : 'Chưa kích hoạt sinh trắc học'}
                </h4>
                {biometricEnabled && (
                  <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-300/40">
                    Bảo vệ cao
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {biometricEnabled
                  ? `Bạn đã liên kết ${credentials.length} khóa sinh trắc học (Touch ID / Face ID / Windows Hello). Có thể đăng nhập tức thì không cần nhập mật khẩu.`
                  : 'Đăng ký cảm biến vân tay hoặc nhận diện khuôn mặt trên thiết bị để tăng tốc đăng nhập và tăng tối đa bảo mật.'}
              </p>
              {hasPlatformAuthenticator && (
                <div className="flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-400 mt-1.5 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Thiết bị hỗ trợ cảm biến sinh trắc học tích hợp (Windows Hello / Apple Touch ID)</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setShowEnrollModal(true)}
              disabled={isActionLoading || !isSupported}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm thiết bị mới</span>
            </button>
            {biometricEnabled && (
              <button
                type="button"
                onClick={handleTestBiometric}
                disabled={isActionLoading}
                className="px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isActionLoading ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                )}
                <span>Quét thử nghiệm</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Enrolled Credentials List */}
      <div className="mb-6">
        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Laptop className="w-4 h-4 text-purple-500" />
            <span>Khóa sinh trắc học đã liên kết ({credentials.length})</span>
          </span>
        </h4>

        {credentials.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Fingerprint className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Chưa có khóa sinh trắc học hoặc Passkey nào được lưu cho tài khoản này.
            </p>
            <button
              type="button"
              onClick={() => setShowEnrollModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
            >
              Đăng ký ngay bây giờ
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-purple-400">
                    <Fingerprint className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {cred.deviceName || 'Thiết bị sinh trắc học'}
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-bold rounded-full">
                        {cred.deviceType === 'multiDevice' ? 'Đồng bộ iCloud/Google' : 'Phần cứng nội bộ'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                      <span>ID: {cred.credentialId.substring(0, 16)}...</span>
                      <span>•</span>
                      <span>Tạo: {new Date(cred.createdAt).toLocaleDateString('vi-VN')}</span>
                      {cred.lastUsedAt && (
                        <>
                          <span>•</span>
                          <span>Dùng gần nhất: {new Date(cred.lastUsedAt).toLocaleDateString('vi-VN')}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCredential(cred.id, cred.deviceName)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="Xóa khóa sinh trắc học"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Modal / Drawer */}
      {showHistory && (
        <div className="mb-6 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 animate-in fade-in">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span>Nhật ký xác thực sinh trắc học phiên hiện tại</span>
            </h5>
            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Đóng
            </button>
          </div>

          {testHistory.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 text-center">
              Chưa có lượt quét sinh trắc học nào trong phiên này. Hãy nhấn "Quét thử nghiệm" để kiểm tra.
            </p>
          ) : (
            <div className="space-y-2">
              {testHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {item.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {item.method}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.note}</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Security Info Box */}
      <div className="p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-xl text-xs text-sky-800 dark:text-sky-300 space-y-1">
        <p className="font-bold flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Bảo mật tối đa với chuẩn FIDO2 / WebAuthn W3C:</span>
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Dữ liệu sinh trắc học (vân tay, khuôn mặt) được lưu trữ an toàn trong chip bảo mật phần cứng (TPM, Secure Enclave) của thiết bị của bạn. Máy chủ chỉ lưu khóa công khai (Public Key) và không bao giờ tiếp cận hay lưu giữ ảnh vân tay của bạn.
        </p>
      </div>

      {/* ENROLL MODAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-purple-600" />
                <span>Đăng ký sinh trắc học mới</span>
              </h4>
              <button
                type="button"
                onClick={() => { setShowEnrollModal(false); setCustomDeviceName(''); }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Hệ thống sẽ kích hoạt cửa sổ xác thực của hệ điều hành (Windows Hello, Touch ID hoặc khóa bảo mật USB FIDO2). Vui lòng đặt ngón tay hoặc nhìn vào camera khi được nhắc.
            </p>

            <form onSubmit={handleEnrollBiometric} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tên gợi nhớ cho thiết bị này:
                </label>
                <input
                  type="text"
                  value={customDeviceName}
                  onChange={(e) => setCustomDeviceName(e.target.value)}
                  placeholder="Ví dụ: MacBook Touch ID, Laptop Dell Windows Hello..."
                  className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowEnrollModal(false); setCustomDeviceName(''); }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isActionLoading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Đang kích hoạt cảm biến...</span>
                    </>
                  ) : (
                    <>
                      <Fingerprint className="h-4 w-4" />
                      <span>Quét vân tay / Khuôn mặt</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
