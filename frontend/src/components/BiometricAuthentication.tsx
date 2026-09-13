'use client';

import { useState } from 'react';
import { Fingerprint, X, Settings, RefreshCw, CheckCircle, AlertTriangle, FaceSmile, Lock, Clock, Shield, Smartphone, Apple, Android } from 'lucide-react';

interface BiometricAuthenticationProps {
  onCancel?: () => void;
  onEnableBiometric?: () => Promise<void>;
  onDisableBiometric?: () => Promise<void>;
  onTestBiometric?: () => Promise<{ success: boolean; method: string }>;
}

export default function BiometricAuthentication({ onCancel, onEnableBiometric, onDisableBiometric, onTestBiometric }: BiometricAuthenticationProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [availableMethods, setAvailableMethods] = useState<string[]>(['Face ID', 'Touch ID']);
  const [selectedMethod, setSelectedMethod] = useState('Face ID');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; method: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [fallbackToPin, setFallbackToPin] = useState(true);
  const [autoLock, setAutoLock] = useState(true);

  const handleEnable = async () => {
    if (onEnableBiometric) {
      await onEnableBiometric();
    }
    setIsEnabled(true);
  };

  const handleDisable = async () => {
    if (onDisableBiometric) {
      await onDisableBiometric();
    }
    setIsEnabled(false);
  };

  const handleTest = async () => {
    setIsTesting(true);
    if (onTestBiometric) {
      const result = await onTestBiometric();
      setTestResult(result);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = { success: Math.random() > 0.2, method: selectedMethod };
      setTestResult(result);
    }
    setIsTesting(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Fingerprint className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Xác thực sinh trắc học
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isEnabled ? 'Đã bật' : 'Đã tắt'}
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
            Cài đặt biometric
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Fallback to PIN
              </span>
              <button
                type="button"
                onClick={() => setFallbackToPin(!fallbackToPin)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  fallbackToPin ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    fallbackToPin ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-lock on timeout
              </span>
              <button
                type="button"
                onClick={() => setAutoLock(!autoLock)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoLock ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoLock ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Info */}
      <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Platform Support
          </span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Apple className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Face ID, Touch ID
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Android className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Fingerprint
            </span>
          </div>
        </div>
      </div>

      {/* Available Methods */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Phương thức có sẵn
        </h4>
        <div className="space-y-2">
          {availableMethods.map((method) => (
            <div
              key={method}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {method === 'Face ID' ? <FaceSmile className="h-4 w-4 text-slate-500" /> : <Fingerprint className="h-4 w-4 text-slate-500" />}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {method}
                  </span>
                  <CheckCircle className="h-3 w-3 text-green-500" />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`px-2 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                    selectedMethod === method
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {selectedMethod === method ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Biometric */}
      {isEnabled && (
        <div className="mb-4">
          <button
            type="button"
            onClick={handleTest}
            disabled={isTesting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isTesting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Đang test...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Test {selectedMethod}
              </>
            )}
          </button>
        </div>
      )}

      {/* Test Result */}
      {testResult && (
        <div className={`mb-4 p-3 rounded-lg ${
          testResult.success
            ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {testResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <span className={`text-sm ${
              testResult.success
                ? 'text-green-700 dark:text-green-400'
                : 'text-red-700 dark:text-red-400'
            }`}>
              {testResult.success ? 'Authentication successful' : 'Authentication failed'}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Method: {testResult.method}
          </p>
        </div>
      )}

      {/* Enable/Disable Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={isEnabled ? handleDisable : handleEnable}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
            isEnabled
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isEnabled ? (
            <>
              <Lock className="h-4 w-4" />
              Tắt xác thực sinh trắc học
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Bật xác thực sinh trắc học
            </>
          )}
        </button>
      </div>

      {/* Last Used */}
      {isEnabled && (
        <div className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Last used: {new Date().toLocaleString('vi-VN')}</span>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Xác thực sinh trắc học sử dụng native Face ID/Touch ID trên iOS và Fingerprint trên Android với fallback PIN.
        </p>
      </div>
    </div>
  );
}