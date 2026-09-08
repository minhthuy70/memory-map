'use client';

import { useState } from 'react';
import { Heart, X, Settings, AlertTriangle } from 'lucide-react';

interface ReactionsProps {
  onCancel?: () => void;
}

export default function Reactions({ onCancel }: ReactionsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phản ứng
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Like, love, và các emoji
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-xs text-pink-700 dark:text-pink-400">
          <strong>Đang phát triển:</strong> Phản ứng cho phép người dùng like, love, và emoji trên kỷ niệm.
        </p>
      </div>
    </div>
  );
}