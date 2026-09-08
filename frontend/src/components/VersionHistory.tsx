'use client';

import { useState } from 'react';
import { History, X, Settings, AlertTriangle } from 'lucide-react';

interface VersionHistoryProps {
  onCancel?: () => void;
}

export default function VersionHistory({ onCancel }: VersionHistoryProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Lịch sử phiên bản
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Theo dõi thay đổi kỷ niệm
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Đang phát triển:</strong> Lịch sử phiên bản lưu lại mọi thay đổi của kỷ niệm và cho phép khôi phục.
        </p>
      </div>
    </div>
  );
}