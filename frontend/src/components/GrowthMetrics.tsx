'use client';

import { useState } from 'react';
import { BarChart3, X, Settings, AlertTriangle } from 'lucide-react';

interface GrowthMetricsProps {
  onCancel?: () => void;
}

export default function GrowthMetrics({ onCancel }: GrowthMetricsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chỉ số tăng trưởng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Growth metrics tracking
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-xs text-indigo-700 dark:text-indigo-400">
          <strong>Đang phát triển:</strong> Chỉ số tăng trưởng theo dõi sự phát triển của bộ sưu tập kỷ niệm theo thời gian.
        </p>
      </div>
    </div>
  );
}