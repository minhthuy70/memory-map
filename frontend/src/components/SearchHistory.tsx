'use client';

import React, { useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';

interface SearchHistoryProps {
  onSelect: (query: string) => void;
  onClear: () => void;
}

const MAX_HISTORY = 10;

export default function SearchHistory({ onSelect, onClear }: SearchHistoryProps) {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    const trimmed = query.trim();
    const filtered = history.filter((h) => h !== trimmed);
    const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY);
    setHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const removeFromHistory = (query: string) => {
    const updated = history.filter((h) => h !== query);
    setHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
    onClear();
  };

  // Expose addToHistory function to parent
  useEffect(() => {
    (window as any).addSearchHistory = addToHistory;
    return () => {
      delete (window as any).addSearchHistory;
    };
  }, [history]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Clock className="h-3.5 w-3.5" />
          <span>Tìm kiếm gần đây</span>
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-1">
        {history.map((query, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(query)}
            className="w-full flex items-center justify-between p-2 text-left rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
          >
            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
              {query}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFromHistory(query);
              }}
              className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
