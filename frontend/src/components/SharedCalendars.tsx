'use client';

import { useState } from 'react';
import { Calendar, X, Settings, AlertTriangle } from 'lucide-react';

interface SharedCalendarsProps {
  onCancel?: () => void;
}

export default function SharedCalendars({ onCancel }: SharedCalendarsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Lịch chia sẻ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lịch gia đình chung
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-xs text-green-700 dark:text-green-400">
          <strong>Đang phát triển:</strong> Lịch chia sẻ cho phép gia đình tạo và chia sẻ lịch chung cho các sự kiện kỷ niệm.
        </p>
      </div>
    </div>
  );
}