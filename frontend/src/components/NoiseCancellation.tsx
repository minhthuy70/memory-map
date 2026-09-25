'use client';

import { useState } from 'react';
import {
  Activity,
  ActivityIcon,
  AlertTriangle,
  as,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Download,
  ExternalLink,
  FileAudio,
  Filter,
  Gauge,
  Mic,
  MicIcon,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  SettingsIcon,
  Shield,
  Sliders,
  StopCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  TrashIcon,
  Volume2,
  Waves,
  Zap,
  ZapIcon
} from 'lucide-react';

interface NoiseLevel {
  id: string;
  timestamp: Date;
  level: number;
  frequency: number;
}

interface NoiseCancellation {
  id: string;
  isEnabled: boolean;
  threshold: number;
  sensitivity: number;
  algorithm: 'basic' | 'advanced' | 'ai';
  noiseHistory: NoiseLevel[];
  reductionLevel: number;
  enhancementLevel: number;
}

interface NoiseCancellationProps {
  onCancel?: () => void;
  onToggle?: (enabled: boolean) => Promise<void>;
  onAdjustThreshold?: (threshold: number) => Promise<void>;
  onAdjustSensitivity?: (sensitivity: number) => Promise<void>;
  onSetAlgorithm?: (algorithm: string) => Promise<void>;
}

const DEFAULT_NOISE_CANCELLATION: NoiseCancellation = {
  id: 'nc-1',
  isEnabled: true,
  threshold: 50,
  sensitivity: 70,
  algorithm: 'advanced',
  noiseHistory: Array(20).fill(0).map((_, i) => ({
    id: `noise-${i}`,
    timestamp: new Date(Date.now() - (19 - i) * 1000),
    level: Math.random() * 100,
    frequency: Math.random() * 1000 + 100,
  })),
  reductionLevel: 85,
  enhancementLevel: 70,
};

export default function NoiseCancellationComponent({ onCancel, onToggle, onAdjustThreshold, onAdjustSensitivity, onSetAlgorithm }: NoiseCancellationProps) {
  const [noiseCancellation, setNoiseCancellation] = useState<NoiseCancellation>(DEFAULT_NOISE_CANCELLATION);
  const [showSettings, setShowSettings] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [realTimeMode, setRealTimeMode] = useState(true);

  const currentNoiseLevel = noiseCancellation.noiseHistory[noiseCancellation.noiseHistory.length - 1]?.level || 0;
  const avgNoiseLevel = noiseCancellation.noiseHistory.reduce((sum, n) => sum + n.level, 0) / noiseCancellation.noiseHistory.length;
  const reductionPercentage = noiseCancellation.reductionLevel;

  const getNoiseLevelColor = (level: number) => {
    if (level < 30) return 'text-green-500';
    if (level < 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const handleToggle = async (enabled: boolean) => {
    await onToggle?.(enabled);
    setNoiseCancellation({ ...noiseCancellation, isEnabled: enabled });
  };

  const handleThresholdChange = async (threshold: number) => {
    await onAdjustThreshold?.(threshold);
    setNoiseCancellation({ ...noiseCancellation, threshold });
  };

  const handleSensitivityChange = async (sensitivity: number) => {
    await onAdjustSensitivity?.(sensitivity);
    setNoiseCancellation({ ...noiseCancellation, sensitivity });
  };

  const handleAlgorithmChange = async (algorithm: string) => {
    await onSetAlgorithm?.(algorithm);
    setNoiseCancellation({ ...noiseCancellation, algorithm: algorithm as any });
  };

  const handleReductionChange = (level: number) => {
    setNoiseCancellation({ ...noiseCancellation, reductionLevel: level });
  };

  const handleEnhancementChange = (level: number) => {
    setNoiseCancellation({ ...noiseCancellation, enhancementLevel: level });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Khử tiếng ồn khi ghi âm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {noiseCancellation.isEnabled ? 'Active' : 'Inactive'}
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
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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
        <div className="mb-4 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt noise cancellation
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Algorithm
              </label>
              <select
                value={noiseCancellation.algorithm}
                onChange={(e) => handleAlgorithmChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                <option value="basic">Basic</option>
                <option value="advanced">Advanced</option>
                <option value="ai">AI-Powered</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Real-time monitoring
              </span>
              <button
                type="button"
                onClick={() => setRealTimeMode(!realTimeMode)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  realTimeMode ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    realTimeMode ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Adaptive threshold
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Status</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {noiseCancellation.isEnabled ? 'On' : 'Off'}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Current</span>
          </div>
          <div className={`text-lg font-bold ${getNoiseLevelColor(currentNoiseLevel)}`}>
            {currentNoiseLevel.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ActivityIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Average</span>
          </div>
          <div className={`text-lg font-bold ${getNoiseLevelColor(avgNoiseLevel)}`}>
            {avgNoiseLevel.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Reduction</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {reductionPercentage}%
          </div>
        </div>
      </div>

      {/* Toggle Switch */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${noiseCancellation.isEnabled ? 'bg-cyan-100 dark:bg-cyan-900/30' : 'bg-slate-200 dark:bg-slate-600'}`}>
                <Shield className={`h-5 w-5 ${noiseCancellation.isEnabled ? 'text-cyan-500' : 'text-slate-500'}`} />
              </div>
              <div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Noise Cancellation
                </span>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {noiseCancellation.isEnabled ? 'Active - Reducing background noise' : 'Inactive - All audio captured'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(!noiseCancellation.isEnabled)}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                noiseCancellation.isEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  noiseCancellation.isEnabled ? 'translate-x-7' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Noise Level Controls */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Noise Level Controls
          </h4>
          
          <div className="mb-3">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Threshold: {noiseCancellation.threshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={noiseCancellation.threshold}
              onChange={(e) => handleThresholdChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              <span>Sensitive</span>
              <span>Lenient</span>
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Sensitivity: {noiseCancellation.sensitivity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={noiseCancellation.sensitivity}
              onChange={(e) => handleSensitivityChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Enhancement */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Audio Enhancement
          </h4>
          
          <div className="mb-3">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Noise Reduction: {noiseCancellation.reductionLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={noiseCancellation.reductionLevel}
              onChange={(e) => handleReductionChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Voice Enhancement: {noiseCancellation.enhancementLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={noiseCancellation.enhancementLevel}
              onChange={(e) => handleEnhancementChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Noise History Chart */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Noise Level History
            </h4>
            {isMonitoring && (
              <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-semibold rounded-full">
                Monitoring
              </span>
            )}
          </div>
          
          <div className="h-24 bg-slate-200 dark:bg-slate-600 rounded-lg relative overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 25, 50, 75, 100].map((level) => (
                <div key={level} className="border-t border-slate-300 dark:border-slate-500 border-dashed" style={{ top: `${100 - level}%` }} />
              ))}
            </div>
            
            {/* Noise bars */}
            <div className="absolute inset-0 flex items-end justify-around px-1">
              {noiseCancellation.noiseHistory.map((noise, index) => (
                <div
                  key={noise.id}
                  className={`w-2 rounded-t transition-all ${
                    noise.level > noiseCancellation.threshold ? 'bg-red-500' : 'bg-cyan-500'
                  }`}
                  style={{ height: `${noise.level}%` }}
                />
              ))}
            </div>

            {/* Threshold line */}
            <div
              className="absolute w-full border-2 border-amber-500 border-dashed"
              style={{ top: `${100 - noiseCancellation.threshold}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2">
            <span>20s ago</span>
            <span>Now</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
        <p className="text-[10px] text-cyan-700 dark:text-cyan-400">
          <strong>Lưu ý:</strong> Khử tiếng ồn khi ghi âm với noise cancellation toggle, threshold control, sensitivity adjustment, algorithm selection (basic/advanced/AI), noise level monitoring, noise history visualization, audio enhancement (noise reduction/voice enhancement), adaptive threshold, real-time monitoring, và comprehensive noise cancellation system.
        </p>
      </div>
    </div>
  );
}