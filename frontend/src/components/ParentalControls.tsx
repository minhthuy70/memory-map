'use client';

import { useState } from 'react';
import { Lock, X, Settings, AlertTriangle } from 'lucide-react';

interface ParentalControlsProps {
  onCancel?: () => void;
}

export default function ParentalControls({ onCancel }: ParentalControlsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Kiểm soát phụ huynh
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bảo vệ cho trẻ em
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-xs text-purple-700 dark:text-purple-400">
          <strong>Đang phát triển:</strong> Kiểm soát phụ huynh cho phép quản lý quyền truy cập và hoạt động của tài khoản trẻ em.
        </p>
      </div>
    </div>
  );
}