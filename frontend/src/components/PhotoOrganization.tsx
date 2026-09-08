'use client';

import { useState } from 'react';
import { FolderOpen, X, Settings, AlertTriangle } from 'lucide-react';

interface PhotoOrganizationProps {
  onCancel?: () => void;
}

export default function PhotoOrganization({ onCancel }: PhotoOrganizationProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <FolderOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tổ chức ảnh tự động
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tự động sắp xếp ảnh vào album
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-xs text-teal-700 dark:text-teal-400">
          <strong>Đang phát triển:</strong> Tổ chức ảnh tự động sử dụng AI để phân loại và sắp xếp ảnh vào các album phù hợp.
        </p>
      </div>
    </div>
  );
}