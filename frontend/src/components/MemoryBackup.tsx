'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Cloud, Database, RefreshCw, CheckCircle, AlertCircle, Calendar, FileText } from 'lucide-react';
import { memoriesApi } from '@/lib/memories-api';

interface BackupData {
  memories: any[];
  backupDate: string;
  version: string;
  userId: string;
}

export default function MemoryBackup() {
  const [backups, setBackups] = useState<BackupData[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    loadBackups();
    loadLastBackupInfo();
  }, []);

  const loadBackups = () => {
    const savedBackups = localStorage.getItem('memoryBackups');
    if (savedBackups) {
      try {
        setBackups(JSON.parse(savedBackups));
      } catch (error) {
        console.error('Error loading backups:', error);
      }
    }
  };

  const loadLastBackupInfo = () => {
    const lastBackup = localStorage.getItem('lastBackupDate');
    if (lastBackup) {
      setLastBackupDate(lastBackup);
    }

    const count = localStorage.getItem('memoryCount');
    if (count) {
      setMemoryCount(parseInt(count, 10));
    }
  };

  const createBackup = async () => {
    setIsCreatingBackup(true);
    try {
      const memories = await memoriesApi.getAll();
      
      const backupData: BackupData = {
        memories,
        backupDate: new Date().toISOString(),
        version: '1.0',
        userId: localStorage.getItem('userId') || 'unknown',
      };

      // Save to localStorage
      const existingBackups = [...backups, backupData];
      // Keep only last 5 backups
      const recentBackups = existingBackups.slice(-5);
      localStorage.setItem('memoryBackups', JSON.stringify(recentBackups));
      
      // Update last backup date
      localStorage.setItem('lastBackupDate', new Date().toISOString());
      localStorage.setItem('memoryCount', memories.length.toString());
      
      setBackups(recentBackups);
      setLastBackupDate(new Date().toISOString());
      setMemoryCount(memories.length);
      
      // Also download as JSON file
      downloadBackupFile(backupData);
      
    } catch (error) {
      console.error('Error creating backup:', error);
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const downloadBackupFile = (backupData: BackupData) => {
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `memory-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const restoreBackup = async (backupData: BackupData) => {
    setIsRestoring(true);
    try {
      // Import memories from backup
      await memoriesApi.importMemories(backupData.memories);
      
      // Update memory count
      localStorage.setItem('memoryCount', backupData.memories.length.toString());
      setMemoryCount(backupData.memories.length);
      
      alert('Khôi phục dữ liệu thành công! Vui lòng tải lại trang để xem thay đổi.');
      window.location.reload();
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Khôi phục dữ liệu thất bại. Vui lòng thử lại.');
    } finally {
      setIsRestoring(false);
    }
  };

  const deleteBackup = (index: number) => {
    const updatedBackups = backups.filter((_, i) => i !== index);
    setBackups(updatedBackups);
    localStorage.setItem('memoryBackups', JSON.stringify(updatedBackups));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);
      
      if (confirm(`Bạn có chắc muốn khôi phục dữ liệu từ file này?\n\nNgày sao lưu: ${new Date(backupData.backupDate).toLocaleDateString('vi-VN')}\nSố kỷ niệm: ${backupData.memories.length}`)) {
        await restoreBackup(backupData);
      }
    } catch (error) {
      console.error('Error reading backup file:', error);
      alert('File không hợp lệ. Vui lòng chọn file sao lưu đúng định dạng.');
    }
    
    // Reset file input
    event.target.value = '';
  };

  const formatBackupDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Backup Status Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              Trạng thái sao lưu
            </h3>
            
            {lastBackupDate ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>Sao lưu lần cuối: {formatBackupDate(lastBackupDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span>{memoryCount} kỷ niệm</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                <AlertCircle className="w-3 h-3" />
                <span>Chưa có sao lưu nào</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backup Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={createBackup}
          disabled={isCreatingBackup}
          className="flex items-center justify-center gap-2 p-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingBackup ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang sao lưu...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Sao lưu ngay</span>
            </>
          )}
        </button>

        <label className="flex items-center justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium text-sm cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Khôi phục từ file</span>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isRestoring}
          />
        </label>
      </div>

      {/* Backup History */}
      {backups.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Lịch sử sao lưu</span>
          </h4>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {backups.map((backup, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Cloud className="w-3 h-3" />
                    <span className="font-medium">{formatBackupDate(backup.backupDate)}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                    {backup.memories.length} kỷ niệm
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => restoreBackup(backup)}
                    disabled={isRestoring}
                    className="p-1.5 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Khôi phục bản sao lưu này"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => downloadBackupFile(backup)}
                    className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded transition-colors"
                    title="Tải xuống bản sao lưu"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteBackup(index)}
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition-colors"
                    title="Xóa bản sao lưu"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 rounded-lg">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Mẹo:</strong> Sao lưu dữ liệu định kỳ để tránh mất mát. Hệ thống tự động lưu tối đa 5 bản sao lưu gần nhất trong trình duyệt.
        </p>
      </div>
    </div>
  );
}
