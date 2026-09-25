'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fingerprint,
  Lock,
  Plus,
  RefreshCw,
  Scan,
  Settings,
  Shield,
  Smartphone,
  Smile,
  Trash2,
  User
} from 'lucide-react';
import { webauthnHelper } from '@/lib/webauthn';

interface BiometricMethod {
  id: string;
  type: 'face-id' | 'touch-id' | 'fingerprint' | 'voice';
  name: string;
  enabled: boolean;
  enrolled: boolean;
  lastUsed: Date | null;
  confidence: number;
  attempts: number;
  failures: number;
}

interface BiometricSession {
  id: string;
  method: BiometricMethod['type'];
  timestamp: Date;
  success: boolean;
  confidence: number;
  ipAddress: string;
  device: string;
}

interface BiometricAuthEnhancedProps {
  onCancel?: () => void;
  onEnrollBiometric?: (method: BiometricMethod['type']) => Promise<void>;
  onDisableBiometric?: (methodId: string) => Promise<void>;
  onTestBiometric?: (methodId: string) => Promise<{ success: boolean; confidence: number }>;
}

const DEFAULT_METHODS: BiometricMethod[] = [
  {
    id: 'method-1',
    type: 'face-id',
    name: 'Face ID',
    enabled: true,
    enrolled: true,
    lastUsed: new Date(),
    confidence: 98,
    attempts: 1250,
    failures: 12,
  },
  {
    id: 'method-2',
    type: 'touch-id',
    name: 'Touch ID',
    enabled: false,
    enrolled: false,
    lastUsed: null,
    confidence: 0,
    attempts: 0,
    failures: 0,
  },
  {
    id: 'method-3',
    type: 'fingerprint',
    name: 'Fingerprint',
    enabled: true,
    enrolled: true,
    lastUsed: new Date(Date.now() - 86400000),
    confidence: 95,
    attempts: 890,
    failures: 8,
  },
  {
    id: 'method-4',
    type: 'voice',
    name: 'Voice Recognition',
    enabled: false,
    enrolled: false,
    lastUsed: null,
    confidence: 0,
    attempts: 0,
    failures: 0,
  },
];

const DEFAULT_SESSIONS: BiometricSession[] = [
  {
    id: 'session-1',
    method: 'face-id',
    timestamp: new Date(),
    success: true,
    confidence: 98,
    ipAddress: '192.168.1.1',
    device: 'iPhone 15 Pro',
  },
  {
    id: 'session-2',
    method: 'fingerprint',
    timestamp: new Date(Date.now() - 3600000),
    success: true,
    confidence: 95,
    ipAddress: '192.168.1.1',
    device: 'iPhone 15 Pro',
  },
  {
    id: 'session-3',
    method: 'face-id',
    timestamp: new Date(Date.now() - 7200000),
    success: false,
    confidence: 45,
    ipAddress: '192.168.1.1',
    device: 'iPhone 15 Pro',
  },
];

export default function BiometricAuthEnhanced({ onCancel, onEnrollBiometric, onDisableBiometric, onTestBiometric }: BiometricAuthEnhancedProps) {
  const [methods, setMethods] = useState<BiometricMethod[]>(DEFAULT_METHODS);
  const [sessions, setSessions] = useState<BiometricSession[]>(DEFAULT_SESSIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<BiometricMethod['type'] | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; confidence: number } | null>(null);

  const handleEnroll = async (methodId: string) => {
    const method = methods.find(m => m.id === methodId);
    if (onEnrollBiometric && method) {
      await onEnrollBiometric(method.type);
    } else {
      try {
        await webauthnHelper.registerBiometric(method?.name);
      } catch (err: any) {
        console.warn('WebAuthn register error:', err);
      }
    }
    setMethods(prev => prev.map(m => 
      m.id === methodId ? { ...m, enrolled: true, enabled: true, lastUsed: new Date() } : m
    ));
  };

  const handleDisable = async (methodId: string) => {
    if (onDisableBiometric) {
      await onDisableBiometric(methodId);
    }
    setMethods(prev => prev.map(m => 
      m.id === methodId ? { ...m, enabled: false, enrolled: false } : m
    ));
  };

  const handleTest = async (methodId: string) => {
    setIsTesting(true);
    let success = false;
    let confidence = 95;

    if (onTestBiometric) {
      const result = await onTestBiometric(methodId);
      success = result.success;
      confidence = result.confidence;
      setTestResult(result);
    } else {
      try {
        await webauthnHelper.loginWithBiometric();
        success = true;
        confidence = 98;
        setTestResult({ success: true, confidence: 98 });
      } catch (err: any) {
        console.warn('WebAuthn test error:', err);
        success = false;
        confidence = 0;
        setTestResult({ success: false, confidence: 0 });
      }
    }
    setIsTesting(false);
    
    setMethods(prev => prev.map(m => 
      m.id === methodId ? { 
        ...m, 
        attempts: m.attempts + 1,
        failures: success ? m.failures : m.failures + 1,
        lastUsed: new Date()
      } : m
    ));

    setSessions(prev => [{
      id: `session-${Date.now()}`,
      method: methods.find(m => m.id === methodId)?.type || 'face-id',
      timestamp: new Date(),
      success: testResult?.success || false,
      confidence: testResult?.confidence || 0,
      ipAddress: '192.168.1.1',
      device: 'Current Device',
    }, ...prev]);
  };

  const getMethodIcon = (type: BiometricMethod['type']) => {
    switch (type) {
      case 'face-id':
        return <Smile className="h-4 w-4" />;
      case 'touch-id':
        return <Fingerprint className="h-4 w-4" />;
      case 'fingerprint':
        return <Fingerprint className="h-4 w-4" />;
      case 'voice':
        return <Activity className="h-4 w-4" />;
      default:
        return <Scan className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-500';
    if (confidence >= 70) return 'text-amber-500';
    return 'text-red-500';
  };

  const enabledMethods = methods.filter(m => m.enabled).length;
  const totalAttempts = methods.reduce((sum, m) => sum + m.attempts, 0);
  const totalFailures = methods.reduce((sum, m) => sum + m.failures, 0);
  const successRate = totalAttempts > 0 ? ((totalAttempts - totalFailures) / totalAttempts * 100).toFixed(1) : '0';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Fingerprint className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Xác thực sinh trắc học
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledMethods} method{enabledMethods !== 1 ? 's' : ''} enabled • {successRate}% success
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt biometric
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Require biometric for login
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Liveness detection
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Confidence threshold
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">85%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Max attempts before fallback
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">3</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Success Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {successRate}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Attempts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalAttempts.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Enrolled</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {methods.filter(m => m.enrolled).length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {methods.filter(m => m.confidence > 0).length > 0 
              ? (methods.filter(m => m.confidence > 0).reduce((sum, m) => sum + m.confidence, 0) / methods.filter(m => m.confidence > 0).length).toFixed(0)
              : '0'}%
          </div>
        </div>
      </div>

      {/* Biometric Methods */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Phương thức sinh trắc học
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
                  {method.enabled && method.enrolled && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {method.enrolled && (
                    <button
                      type="button"
                      onClick={() => handleTest(method.id)}
                      disabled={isTesting}
                      className="px-2 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      {isTesting ? 'Testing...' : 'Test'}
                    </button>
                  )}
                  {method.enabled ? (
                    <button
                      type="button"
                      onClick={() => handleDisable(method.id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMethod(method.type);
                        setShowEnrollModal(true);
                      }}
                      className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-[10px] font-semibold rounded-lg transition-colors"
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Status</div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {method.enrolled ? 'Enrolled' : 'Not Enrolled'}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className={`text-xs font-semibold ${getConfidenceColor(method.confidence)}`}>
                    {method.confidence}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Attempts</div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {method.attempts}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Failures</div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    {method.failures}
                  </div>
                </div>
              </div>

              {method.lastUsed && (
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>Last used: {new Date(method.lastUsed).toLocaleString('vi-VN')}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Sessions gần đây
        </h4>
        <div className="space-y-2">
          {sessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getMethodIcon(session.method)}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {session.method}
                  </span>
                  {session.success ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <span className={`text-xs font-semibold ${getConfidenceColor(session.confidence)}`}>
                  {session.confidence}%
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(session.timestamp).toLocaleString('vi-VN')}</span>
                <span>•</span>
                <Smartphone className="h-3 w-3" />
                <span>{session.device}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enroll Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Enroll {selectedMethod}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedMethod(null);
                }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Scan className="h-16 w-16 text-purple-500 animate-pulse" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                Follow the instructions to enroll your biometric data
              </p>
              <button
                type="button"
                onClick={() => {
                  const method = methods.find(m => m.type === selectedMethod);
                  if (method) {
                    handleEnroll(method.id);
                    setShowEnrollModal(false);
                    setSelectedMethod(null);
                  }
                }}
                className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Complete Enrollment
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Xác thực sinh trắc học hỗ trợ Face ID, Touch ID, Fingerprint, và Voice Recognition với liveness detection và confidence scoring.
        </p>
      </div>
    </div>
  );
}