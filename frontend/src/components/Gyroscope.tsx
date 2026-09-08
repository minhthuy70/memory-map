'use client';

import { useState } from 'react';
import { RotateCw, X, Settings, AlertTriangle } from 'lucide-react';

interface GyroscopeProps {
  onCancel?: () => void;
}

export default function Gyroscope({ onCancel }: GyroscopeProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <RotateCw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Con quay hồi chuyển
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gyroscope sensor access
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-xs text-orange-700 dark:text-orange-400">
          <strong>Đang phát triển:</strong> Con quay hồi chuyển cho phép phát hiện xoay và hướng thiết bị.
        </p>
      </div>
    </div>
  );
}