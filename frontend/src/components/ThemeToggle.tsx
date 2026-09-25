'use client';

import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  showText?: boolean;
}

export default function ThemeToggle({
  className = '',
  showText = false,
}: ThemeToggleProps) {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 group"
        title={actualTheme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
        aria-label="Toggle theme"
      >
        <div className="relative w-4 h-4">
          <Sun
            className={`w-4 h-4 text-amber-500 absolute inset-0 transition-all duration-300 transform ${
              actualTheme === 'dark'
                ? 'rotate-90 scale-0 opacity-0'
                : 'rotate-0 scale-100 opacity-100'
            }`}
          />
          <Moon
            className={`w-4 h-4 text-indigo-400 absolute inset-0 transition-all duration-300 transform ${
              actualTheme === 'dark'
                ? 'rotate-0 scale-100 opacity-100'
                : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </div>
      </button>

      {showText && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {actualTheme === 'dark' ? 'Giao diện tối' : 'Giao diện sáng'}
        </span>
      )}
    </div>
  );
}
