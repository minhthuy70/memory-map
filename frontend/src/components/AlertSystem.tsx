'use client';

import { useState } from 'react';
import { Bell, X, Settings, AlertTriangle } from 'lucide-react';

interface AlertSystemProps {
  onCancel?: () => void;
}

export default function AlertSystem({ onCancel }: AlertSystemProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hệ thống cảnh báo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alert system for issues
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
        <p className="text-xs text-red-700 dark:text-red-400">
          <strong>Đang phát triển:</strong> Hệ thống cảnh báo thông báo khi có vấn đề với server hoặc database.
        </p>
      </div>
    </div>
  );
}