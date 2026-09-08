'use client';

import { useState } from 'react';
import { AlertCircle, X, Settings, AlertTriangle } from 'lucide-react';

interface ErrorTrackingProps {
  onCancel?: () => void;
}

export default function ErrorTracking({ onCancel }: ErrorTrackingProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl">
            <AlertCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Theo dõi lỗi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Error tracking and reporting
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
        <p className="text-xs text-red-700 dark:text-red-400">
          <strong>Đang phát triển:</strong> Theo dõi lỗi tự động bắt và báo cáo errors trong app.
        </p>
      </div>
    </div>
  );
}