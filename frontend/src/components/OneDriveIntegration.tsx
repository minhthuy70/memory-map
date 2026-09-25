'use client';

import { useState } from 'react';
import { HardDrive, Upload, Download, CheckCircle, XCircle, AlertCircle, Settings, RefreshCw, FolderOpen, FileText } from 'lucide-react';

interface OneDriveIntegrationProps {
  onBackup?: () => Promise<void>;
  onRestore?: (fileId: string) => Promise<void>;
  onDisconnect?: () => Promise<void>;
  isBackingUp?: boolean;
  isRestoring?: boolean;
  isConnected?: boolean;
  lastBackupTime?: Date;
  backupErrors?: string[];
  availableBackups?: Array<{ id: string; name: string; created: Date; size: number }>;
}

export default function OneDriveIntegration({
  onBackup,
  onRestore,
  onDisconnect,
  isBackingUp = false,
  isRestoring = false,
  isConnected = false,
  lastBackupTime,
  backupErrors = [],
  availableBackups = [],
}: OneDriveIntegrationProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [autoBackup, setAutoBackup] = useState(false);
  const [backupInterval, setBackupInterval] = useState('weekly');
  const [showBackupList, setShowBackupList] = useState(false);

  const handleBackup = async () => {
    if (onBackup) {
      await onBackup();
    }
  };

  const handleRestore = async (fileId: string) => {
    if (onRestore) {
      await onRestore(fileId);
    }
  };

  const handleDisconnect = async () => {
    if (onDisconnect) {
      await onDisconnect();
    }
  };

  const formatLastBackup = (date?: Date) => {
    if (!date) return 'Chưa sao lưu';
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">OneDrive</h3>
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
            {isConnected ? 'Đã kết nối với OneDrive' : 'Chưa kết nối với OneDrive'}
          </span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Backup cuối: {formatLastBackup(lastBackupTime)}
        </span>
      </div>

      {/* Backup Errors */}
      {backupErrors.length > 0 && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-red-700 dark:text-red-400 mb-1">
                Lỗi sao lưu ({backupErrors.length})
              </p>
              <ul className="text-xs text-red-600 dark:text-red-500 space-y-1">
                {backupErrors.slice(0, 2).map((error, index) => (
                  <li key={index} className="truncate">• {error}</li>
                ))}
                {backupErrors.length > 2 && (
                  <li className="text-xs">... và {backupErrors.length - 2} lỗi khác</li>
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
              Tự động sao lưu
            </label>
            <button
              type="button"
              onClick={() => setAutoBackup(!autoBackup)}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                autoBackup ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  autoBackup ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Tần suất sao lưu
            </label>
            <select
              value={backupInterval}
              onChange={(e) => setBackupInterval(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="daily">Hàng ngày</option>
              <option value="weekly">Hàng tuần</option>
              <option value="monthly">Hàng tháng</option>
              <option value="manual">Chỉ thủ công</option>
            </select>
          </div>
        </div>
      )}

      {/* Available Backups */}
      {isConnected && availableBackups.length > 0 && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowBackupList(!showBackupList)}
            className="w-full flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Bản sao lưu ({availableBackups.length})
              </span>
            </div>
            <span className="text-xs text-slate-500">{showBackupList ? '▼' : '▶'}</span>
          </button>
          
          {showBackupList && (
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {availableBackups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="h-3 w-3 text-slate-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                        {backup.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {formatFileSize(backup.size)} • {new Date(backup.created).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRestore(backup.id)}
                    disabled={isRestoring}
                    className="p-1 hover:bg-blue-50 dark:hover:bg-blue-950 rounded transition-colors"
                    title="Khôi phục"
                  >
                    <Download className="h-3 w-3 text-blue-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isConnected ? (
          <>
            <button
              type="button"
              onClick={handleBackup}
              disabled={isBackingUp}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {isBackingUp ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Đang sao lưu...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Sao lưu ngay
                </>
              )}
            </button>
            {availableBackups.length > 0 && (
              <button
                type="button"
                onClick={() => setShowBackupList(!showBackupList)}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <HardDrive className="h-4 w-4" />
            Kết nối OneDrive
          </button>
        )}
      </div>

      {/* Info Text */}
      <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> OneDrive sẽ lưu trữ toàn bộ dữ liệu kỷ niệm của bạn 
          an toàn trên đám mây Microsoft. Bạn có thể khôi phục dữ liệu bất cứ lúc nào.
        </p>
      </div>
    </div>
  );
}