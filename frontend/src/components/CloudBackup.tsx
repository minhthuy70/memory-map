'use client';

import React, { useState } from 'react';
import { Cloud, Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';

interface CloudBackupProps {
  onBackup: () => Promise<string>;
  onRestore: (data: string) => Promise<void>;
}

export default function CloudBackup({ onBackup, onRestore }: CloudBackupProps) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupUrl, setBackupUrl] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBackup = async () => {
    setIsBackingUp(true);
    setMessage(null);
    try {
      const url = await onBackup();
      setBackupUrl(url);
      setMessage({ type: 'success', text: 'Sao lưu thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Sao lưu thất bại. Vui lòng thử lại.' });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setMessage(null);
    try {
      const text = await file.text();
      await onRestore(text);
      setMessage({ type: 'success', text: 'Khôi phục thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Khôi phục thất bại. File không hợp lệ.' });
    } finally {
      setIsRestoring(false);
      event.target.value = '';
    }
  };

  const downloadBackup = () => {
    if (!backupUrl) return;
    const link = document.createElement('a');
    link.href = backupUrl;
    link.download = `memory-map-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Sao lưu đám mây
        </h3>
      </div>

      {/* Backup Button */}
      <button
        onClick={handleBackup}
        disabled={isBackingUp}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Sao lưu dữ liệu"
      >
        <Upload className="h-4 w-4" />
        <span>{isBackingUp ? 'Đang sao lưu...' : 'Sao lưu dữ liệu'}</span>
      </button>

      {/* Backup URL Display */}
      {backupUrl && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
            Link sao lưu:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={backupUrl}
              readOnly
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300"
            />
            <button
              onClick={downloadBackup}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors"
              aria-label="Tải xuống"
            >
              <Download className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
      )}

      {/* Restore Button */}
      <div className="relative">
        <input
          type="file"
          accept=".json"
          onChange={handleRestore}
          disabled={isRestoring}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          aria-label="Chọn file để khôi phục"
        />
        <button
          disabled={isRestoring}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          <span>{isRestoring ? 'Đang khôi phục...' : 'Khôi phục từ file'}</span>
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Sao lưu dữ liệu của bạn để an toàn. Bạn có thể tải xuống file sao lưu hoặc khôi phục từ file đã lưu.
      </p>
    </div>
  );
}
