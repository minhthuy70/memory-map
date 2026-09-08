'use client';

import { useState } from 'react';
import { Calendar, Sync, CheckCircle, XCircle, AlertCircle, Settings, RefreshCw, Download } from 'lucide-react';

interface AppleCalendarSyncProps {
  onSync?: () => Promise<void>;
  onExportICS?: () => Promise<string>;
  onDisconnect?: () => Promise<void>;
  isSyncing?: boolean;
  isExporting?: boolean;
  isConnected?: boolean;
  lastSyncTime?: Date;
  syncErrors?: string[];
}

export default function AppleCalendarSync({
  onSync,
  onExportICS,
  onDisconnect,
  isSyncing = false,
  isExporting = false,
  isConnected = false,
  lastSyncTime,
  syncErrors = [],
}: AppleCalendarSyncProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [syncInterval, setSyncInterval] = useState('daily');

  const handleSync = async () => {
    if (onSync) {
      await onSync();
    }
  };

  const handleExportICS = async () => {
    if (onExportICS) {
      const icsContent = await onExportICS();
      // Create and download ICS file
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memory-map-calendar-${new Date().toISOString().split('T')[0]}.ics`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDisconnect = async () => {
    if (onDisconnect) {
      await onDisconnect();
    }
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Chưa đồng bộ';
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isConnected 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
          }`}>
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Apple Calendar</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
          </button>
          {isConnected && (
            <button
              type="button"
              onClick={handleDisconnect}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
              title="Ngắt kết nối"
            >
              <XCircle className="h-4 w-4 text-red-500" />
            </button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg mb-3">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          )}
          <span className="text-xs text-slate-700 dark:text-slate-300">
            {isConnected ? 'Đã kết nối với Apple Calendar' : 'Chưa kết nối với Apple Calendar'}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Lần sync cuối: {formatLastSync(lastSyncTime)}
        </span>
      </div>

      {/* Sync Errors */}
      {syncErrors.length > 0 && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                Lỗi đồng bộ ({syncErrors.length})
              </p>
              <ul className="text-xs text-red-600 dark:text-red-500 space-y-1">
                {syncErrors.slice(0, 2).map((error, index) => (
                  <li key={index} className="truncate">• {error}</li>
                ))}
                {syncErrors.length > 2 && (
                  <li className="text-xs">... và {syncErrors.length - 2} lỗi khác</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Tự động đồng bộ
            </label>
            <button
              type="button"
              onClick={() => setAutoSync(!autoSync)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                autoSync ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  autoSync ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Tần suất đồng bộ
            </label>
            <select
              value={syncInterval}
              onChange={(e) => setSyncInterval(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="hourly">Mỗi giờ</option>
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="manual">Chỉ thủ công</option>
            </select>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isConnected ? (
          <>
            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Đang đồng bộ...
                </>
              ) : (
                <>
                  <Sync className="h-4 w-4" />
                  Đồng bộ ngay
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleExportICS}
              disabled={isExporting}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
              title="Xuất file ICS"
            >
              {isExporting ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Calendar className="h-4 w-4" />
            Kết nối Apple Calendar
          </button>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Apple Calendar hỗ trợ đồng bộ qua iCloud. Bạn cũng có thể xuất file ICS 
          để nhập thủ công vào Calendar trên Mac hoặc iOS.
        </p>
      </div>
    </div>
  );
}