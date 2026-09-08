'use client';

import { useState } from 'react';
import { Lightbulb, X, Settings, AlertTriangle } from 'lucide-react';

interface TextSuggestionsProps {
  onCancel?: () => void;
}

export default function TextSuggestions({ onCancel }: TextSuggestionsProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Gợi ý văn bản
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gợi ý câu và từ ngữ
            </p>
          </div>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          <strong>Đang phát triển:</strong> Gợi ý văn bản sử dụng AI để đề xuất câu và từ ngữ phù hợp.
        </p>
      </div>
    </div>
  );
}