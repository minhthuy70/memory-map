'use client';

import { useState } from 'react';
import { MapPin, X, Settings, AlertTriangle } from 'lucide-react';

interface BackgroundLocationTrackingProps {
  onCancel?: () => void;
}

export default function BackgroundLocationTracking({ onCancel }: BackgroundLocationTrackingProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Theo dõi vị trí nền
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Background location tracking
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          <strong>Đang phát triển:</strong> Theo dõi vị trí nền cho phép theo dõi vị trí ngay cả khi app đang chạy nền.
        </p>
      </div>
    </div>
  );
}