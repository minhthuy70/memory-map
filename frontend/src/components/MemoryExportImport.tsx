'use client';

import React, { useState } from 'react';
import { memoriesApi } from '@/lib/memories-api';
import { Download, Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function MemoryExportImport() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportData, setExportData] = useState<any[]>([]);
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);
  const [error, setError] = useState('');

  const handleExport = async () => {
    setIsExporting(true);
    setError('');
    setImportResult(null);

    try {
      const data = await memoriesApi.exportMemories();
      setExportData(data);
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `memory-map-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xuất dữ liệu');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setError('');
    setImportResult(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!Array.isArray(data)) {
        throw new Error('File không đúng định dạng');
      }

      const result = await memoriesApi.importMemories(data);
      setImportResult(result);
      
      // Reload page after successful import
      if (result.imported > 0) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể nhập dữ liệu');
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
          Xuất/Nhập dữ liệu
        </h3>
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {importResult && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-xs rounded-lg space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle className="h-4 w-4" />
            <span>Đã nhập thành công {importResult.imported} kỷ niệm</span>
          </div>
          {importResult.errors.length > 0 && (
            <div className="space-y-1">
              <span className="font-medium">Lỗi:</span>
              {importResult.errors.map((err, idx) => (
                <div key={idx} className="text-[10px] opacity-80">- {err}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Export Button */}
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang xuất...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Xuất dữ liệu</span>
            </>
          )}
        </button>

        {/* Import Button */}
        <div className="relative">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            type="button"
            disabled={isImporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang nhập...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Nhập dữ liệu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {exportData.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Đã xuất <span className="font-semibold text-slate-900 dark:text-white">{exportData.length}</span> kỷ niệm
          </p>
        </div>
      )}

      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
        <p>• Xuất dữ liệu: Tải xuống tất cả kỷ niệm dưới dạng file JSON</p>
        <p>• Nhập dữ liệu: Tải lên file JSON để khôi phục kỷ niệm</p>
        <p>• File JSON phải được xuất từ Memory Map</p>
      </div>
    </div>
  );
}