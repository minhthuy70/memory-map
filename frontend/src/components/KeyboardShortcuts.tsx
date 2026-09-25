'use client';

import React, { useEffect, useState } from 'react';
import { Keyboard, X, Command } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
  showHelp?: boolean;
  onToggleHelp?: () => void;
}

export default function KeyboardShortcuts({ 
  shortcuts, 
  showHelp = false, 
  onToggleHelp 
}: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(showHelp);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Toggle help with ? or Ctrl/Cmd + /
      if (event.key === '?' || (event.ctrlKey && event.key === '/')) {
        event.preventDefault();
        setIsOpen(!isOpen);
        if (onToggleHelp) onToggleHelp();
        return;
      }

      // Close help with Escape
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        if (onToggleHelp) onToggleHelp();
        return;
      }

      // Execute shortcuts
      for (const shortcut of shortcuts) {
        if (event.key.toLowerCase() === shortcut.key.toLowerCase()) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, isOpen, onToggleHelp]);

  useEffect(() => {
    setIsOpen(showHelp);
  }, [showHelp]);

  const formatKey = (key: string) => {
    if (key === ' ') return 'Space';
    if (key === 'Escape') return 'Esc';
    return key.toUpperCase();
  };

  return (
    <>
      {/* Help Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (onToggleHelp) onToggleHelp();
        }}
        className="fixed bottom-4 right-4 p-3 bg-slate-800 dark:bg-slate-700 text-white rounded-full shadow-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors z-50"
        title="Phím tắt (?)"
      >
        <Keyboard className="h-5 w-5" />
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Phím tắt</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onToggleHelp) onToggleHelp();
                }}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded text-xs font-mono text-slate-900 dark:text-white shadow-sm">
                      {formatKey(shortcut.key)}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Hiển thị trợ giúp
                  </span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded text-xs font-mono text-slate-900 dark:text-white shadow-sm">
                      <Command className="h-3 w-3" />
                    </kbd>
                    <kbd className="px-2 py-1 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded text-xs font-mono text-slate-900 dark:text-white shadow-sm">
                      /
                    </kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Nhấn <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded text-[10px] font-mono">Esc</kbd> để đóng
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}