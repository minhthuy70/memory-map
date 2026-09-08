'use client';

import { useState } from 'react';
import { Fingerprint, X, Settings, AlertTriangle } from 'lucide-react';

interface BiometricAuthEnhancedProps {
  onCancel?: () => void;
}

export default function BiometricAuthEnhanced({ onCancel }: BiometricAuthEnhancedProps) {
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
              Biometric authentication enhanced
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-xs text-purple-700 dark:text-purple-400">
          <strong>Đang phát triển:</strong> Xác thực sinh trắc học nâng cao cho phép Face ID, Touch ID, và fingerprint.
        </p>
      </div>
    </div>
  );
}