'use client';

import { useState } from 'react';
import { Fingerprint, X, Shield, Lock, Unlock, RefreshCw, Clock, CheckCircle, AlertTriangle, Settings, Info, BarChart3, Smartphone, Key, Eye, EyeOff, Zap } from 'lucide-react';

interface BiometricAuthenticationProps {
  onCancel?: () => void;
}

interface AuthMethod {
  id: string;
  name: string;
  type: 'fingerprint' | 'face' | 'iris' | 'voice';
  enabled: boolean;
  lastUsed?: string;
  enrolled: boolean;
}

export default function BiometricAuthentication({ onCancel }: BiometricAuthenticationProps) {
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoLockTimeout, setAutoLockTimeout] = useState(5);
  const [showHistory, setShowHistory] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const [authMethods, setAuthMethods] = useState<AuthMethod[]>([
    {
      id: '1',
      name: 'Fingerprint',
      type: 'fingerprint',
      enabled: true,
      lastUsed: '2026-09-14 10:30',
      enrolled: true,
    },
    {
      id: '2',
      name: 'Face ID',
      type: 'face',
      enabled: false,
      enrolled: true,
    },
    {
      id: '3',
      name: 'Iris Scan',
      type: 'iris',
      enabled: false,
      enrolled: false,
    },
    {
      id: '4',
      name: 'Voice Recognition',
      type: 'voice',
      enabled: false,
      enrolled: false,
    },
  ]);

  const [authHistory] = useState([
    { id: '1', method: 'Fingerprint', status: 'success', time: '2026-09-14 10:30', location: 'Hanoi' },
    { id: '2', method: 'Fingerprint', status: 'success', time: '2026-09-14 09:15', location: 'Hanoi' },
    { id: '3', method: 'Fingerprint', status: 'failed', time: '2026-09-13 23:45', location: 'Hanoi' },
    { id: '4', method: 'Fingerprint', status: 'success', time: '2026-09-13 18:20', location: 'Hanoi' },
  ]);

  const toggleMethod = (id: string) => {
    setAuthMethods(authMethods.map(method => {
      if (method.id === id && method.enrolled) {
        return { ...method, enabled: !method.enabled };
      }
      return method;
    }));
  };

  const handleAuthenticate = () => {
    setAuthenticating(true);
    setTimeout(() => {
      setAuthenticating(false);
    }, 2000);
  };

  const enabledCount = authMethods.filter(m => m.enabled).length;
  const enrolledCount = authMethods.filter(m => m.enrolled).length;
  const successCount = authHistory.filter(h => h.status === 'success').length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Fingerprint className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Biometric Authentication
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Secure login with biometrics
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show history"
          >
            {showHistory ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className={`p-4 rounded-lg border ${biometricEnabled ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${biometricEnabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {biometricEnabled ? <Shield className="h-6 w-6 text-white" /> : <Lock className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {biometricEnabled ? 'Biometric Enabled' : 'Biometric Disabled'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {biometricEnabled ? 'Use fingerprint or face to unlock' : 'Password only authentication'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setBiometricEnabled(!biometricEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${biometricEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {biometricEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
          {biometricEnabled && (
            <button
              type="button"
              onClick={handleAuthenticate}
              disabled={authenticating}
              className="w-full py-3 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
            >
              {authenticating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4" />
                  Test Authentication
                </>
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Methods</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabledCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Enrolled</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{enrolledCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto-Lock</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{autoLockTimeout}m</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Success Rate</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{Math.round((successCount / authHistory.length) * 100)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={autoLockTimeout.toString()}
            onChange={(e) => setAutoLockTimeout(parseInt(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="1">1 minute</option>
            <option value="5">5 minutes</option>
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="0">Never</option>
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Key className="h-3 w-3" />
            Change Password
          </button>
        </div>

        {showHistory && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Authentication History</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {authHistory.map((auth) => (
                <div key={auth.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{auth.method}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{auth.time} • {auth.location}</p>
                    </div>
                  </div>
                  {auth.status === 'success' ? (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      <span>Success</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Failed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Authentication Methods</h4>
          <div className="space-y-2">
            {authMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-lg border ${method.enabled ? 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${method.enabled ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <Fingerprint className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{method.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${method.enrolled ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                          {method.enrolled ? 'Enrolled' : 'Not Enrolled'}
                        </span>
                        {method.lastUsed && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">Last: {method.lastUsed}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMethod(method.id)}
                    disabled={!method.enrolled}
                    className={`p-1.5 rounded-lg transition-colors ${method.enabled ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : !method.enrolled ? 'bg-slate-100 text-slate-400 dark:bg-slate-700 cursor-not-allowed' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}
                  >
                    {method.enabled ? <CheckCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Security Settings
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Auto-lock: App locks after inactivity period</li>
            <li>• Multiple methods: Enable backup authentication</li>
            <li>• Failed attempts: Temporary lock after 3 failures</li>
            <li>• Biometric data: Stored securely on device</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Device Requirements
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Biometric hardware required (fingerprint/face sensor)</li>
            <li>• System permissions: Biometric access</li>
            <li>• OS support: iOS 12+ / Android 9+</li>
            <li>• Backup password always required</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
