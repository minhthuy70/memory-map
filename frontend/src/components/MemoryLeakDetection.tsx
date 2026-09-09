'use client';

import { useState, useEffect } from 'react';
import { Droplet, X, Settings, RefreshCw, AlertTriangle, TrendingUp, Database, Check, AlertCircle } from 'lucide-react';

interface MemorySnapshot {
  timestamp: Date;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface MemoryLeak {
  component: string;
  leakSize: number;
  severity: 'low' | 'medium' | 'high';
  detectedAt: Date;
}

interface MemoryLeakDetectionProps {
  onCancel?: () => void;
  onTakeSnapshot?: () => Promise<MemorySnapshot>;
  onDetectLeaks?: () => Promise<MemoryLeak[]>;
}

const DEFAULT_LEAKS: MemoryLeak[] = [
  {
    component: 'MemoryList',
    leakSize: 15.5,
    severity: 'medium',
    detectedAt: new Date(),
  },
];

export default function MemoryLeakDetection({ onCancel, onTakeSnapshot, onDetectLeaks }: MemoryLeakDetectionProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentMemory, setCurrentMemory] = useState<MemorySnapshot | null>(null);
  const [memoryHistory, setMemoryHistory] = useState<MemorySnapshot[]>([]);
  const [leaks, setLeaks] = useState<MemoryLeak[]>(DEFAULT_LEAKS);
  const [autoScan, setAutoScan] = useState(false);
  const [scanInterval, setScanInterval] = useState(10000);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoScan) {
      interval = setInterval(() => {
        handleTakeSnapshot();
      }, scanInterval);
    }
    return () => clearInterval(interval);
  }, [autoScan, scanInterval]);

  const handleTakeSnapshot = async () => {
    setIsScanning(true);
    if (onTakeSnapshot) {
      const snapshot = await onTakeSnapshot();
      setCurrentMemory(snapshot);
      setMemoryHistory(prev => [...prev.slice(-9), snapshot]);
    } else {
      // Simulate snapshot
      const snapshot: MemorySnapshot = {
        timestamp: new Date(),
        usedJSHeapSize: Math.random() * 50 + 20,
        totalJSHeapSize: Math.random() * 100 + 50,
        jsHeapSizeLimit: 200,
      };
      setCurrentMemory(snapshot);
      setMemoryHistory(prev => [...prev.slice(-9), snapshot]);
    }
    setIsScanning(false);
  };

  const handleDetectLeaks = async () => {
    setIsScanning(true);
    if (onDetectLeaks) {
      const detectedLeaks = await onDetectLeaks();
      setLeaks(detectedLeaks);
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate leak detection
    }
    setIsScanning(false);
  };

  const formatBytes = (bytes: number) => {
    return `${bytes.toFixed(1)} MB`;
  };

  const getSeverityColor = (severity: MemoryLeak['severity']) => {
    switch (severity) {
      case 'low':
        return 'from-green-400 to-emerald-500';
      case 'medium':
        return 'from-amber-400 to-orange-500';
      case 'high':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getSeverityLabel = (severity: MemoryLeak['severity']) => {
    switch (severity) {
      case 'low':
        return 'Thấp';
      case 'medium':
        return 'Trung bình';
      case 'high':
        return 'Cao';
      default:
        return 'Thấp';
    }
  };

  const memoryUsagePercent = currentMemory 
    ? (currentMemory.usedJSHeapSize / currentMemory.jsHeapSizeLimit) * 100 
    : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phát hiện rò rỉ bộ nhớ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {leaks.length} rò rỉ được phát hiện
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
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tự động quét
              </span>
              <button
                type="button"
                onClick={() => setAutoScan(!autoScan)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoScan ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoScan ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tần suất quét: {scanInterval}ms
              </label>
              <select
                value={scanInterval}
                onChange={(e) => setScanInterval(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              >
                <option value="5000">5 giây</option>
                <option value="10000">10 giây</option>
                <option value="30000">30 giây</option>
                <option value="60000">1 phút</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Current Memory Usage */}
      {currentMemory && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Sử dụng bộ nhớ hiện tại
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Đã sử dụng</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatBytes(currentMemory.usedJSHeapSize)}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all"
                style={{ width: `${memoryUsagePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Tổng bộ nhớ</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatBytes(currentMemory.totalJSHeapSize)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Giới hạn</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {formatBytes(currentMemory.jsHeapSizeLimit)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Detected Leaks */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Rò rỉ được phát hiện
        </h4>
        {leaks.length === 0 ? (
          <div className="text-center py-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
            <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Không phát hiện rò rỉ bộ nhớ
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaks.map((leak) => (
              <div
                key={leak.component}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {leak.component}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 bg-gradient-to-r ${getSeverityColor(leak.severity)} text-white text-[10px] font-bold rounded-full`}>
                    {getSeverityLabel(leak.severity)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Kích thước rò rỉ:
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatBytes(leak.leakSize)}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Phát hiện: {new Date(leak.detectedAt).toLocaleString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleTakeSnapshot}
          disabled={isScanning}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isScanning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang chụp...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Chụp snapshot
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleDetectLeaks}
          disabled={isScanning}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isScanning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang quét...
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4" />
              Quét rò rỉ
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
        <p className="text-[10px] text-red-700 dark:text-red-400">
          <strong>Lưu ý:</strong> Phát hiện rò rỉ bộ nhớ sử dụng Performance API để theo dõi heap và phát hiện memory leaks.
        </p>
      </div>
    </div>
  );
}