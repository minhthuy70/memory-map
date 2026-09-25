'use client';

import { useState } from 'react';
import { Vibrate, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Smartphone, Zap, Clock, Activity, Play, Volume2, AlertCircle, Check } from 'lucide-react';

interface HapticPattern {
  id: string;
  name: string;
  type: 'success' | 'warning' | 'error' | 'light' | 'medium' | 'heavy' | 'custom';
  intensity: number;
  duration: number;
  pattern: number[];
}

interface HapticFeedbackProps {
  onCancel?: () => void;
  onTriggerHaptic?: (pattern: HapticPattern) => Promise<void>;
}

const DEFAULT_PATTERNS: HapticPattern[] = [
  {
    id: 'pattern-1',
    name: 'Success',
    type: 'success',
    intensity: 50,
    duration: 100,
    pattern: [50, 50, 50],
  },
  {
    id: 'pattern-2',
    name: 'Warning',
    type: 'warning',
    intensity: 75,
    duration: 200,
    pattern: [100, 50, 100],
  },
  {
    id: 'pattern-3',
    name: 'Error',
    type: 'error',
    intensity: 100,
    duration: 300,
    pattern: [100, 50, 100, 50, 100],
  },
  {
    id: 'pattern-4',
    name: 'Light Tap',
    type: 'light',
    intensity: 25,
    duration: 50,
    pattern: [25],
  },
  {
    id: 'pattern-5',
    name: 'Medium Tap',
    type: 'medium',
    intensity: 50,
    duration: 100,
    pattern: [50],
  },
  {
    id: 'pattern-6',
    name: 'Heavy Tap',
    type: 'heavy',
    intensity: 100,
    duration: 200,
    pattern: [100],
  },
];

export default function HapticFeedback({ onCancel, onTriggerHaptic }: HapticFeedbackProps) {
  const [patterns, setPatterns] = useState<HapticPattern[]>(DEFAULT_PATTERNS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<HapticPattern | null>(null);
  const [isVibrating, setIsVibrating] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [vibrationIntensity, setVibrationIntensity] = useState(75);
  const [useSystemHaptics, setUseSystemHaptics] = useState(true);

  const handleTrigger = async (pattern: HapticPattern) => {
    setIsVibrating(true);
    setSelectedPattern(pattern);
    if (onTriggerHaptic) {
      await onTriggerHaptic(pattern);
    } else {
      if (navigator.vibrate) {
        navigator.vibrate(pattern.pattern);
      }
      await new Promise(resolve => setTimeout(resolve, pattern.duration + 100));
    }
    setIsVibrating(false);
  };

  const getPatternIcon = (type: HapticPattern['type']) => {
    switch (type) {
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Volume2 className="h-4 w-4" />;
    }
  };

  const getPatternColor = (type: HapticPattern['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      case 'light':
        return 'text-blue-500';
      case 'medium':
        return 'text-purple-500';
      case 'heavy':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Vibrate className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phản hồi xúc giác
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {hapticEnabled ? 'Đã bật' : 'Đã tắt'}
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt haptic
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Haptic enabled
              </span>
              <button
                type="button"
                onClick={() => setHapticEnabled(!hapticEnabled)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  hapticEnabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    hapticEnabled ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Intensity: {vibrationIntensity}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={vibrationIntensity}
                onChange={(e) => setVibrationIntensity(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                System haptics
              </span>
              <button
                type="button"
                onClick={() => setUseSystemHaptics(!useSystemHaptics)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  useSystemHaptics ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    useSystemHaptics ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Intensity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {vibrationIntensity}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Patterns</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {patterns.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Platform</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Native
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Status</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {hapticEnabled ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Haptic Patterns */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Haptic Patterns
        </h4>
        <div className="space-y-2">
          {patterns.map((pattern) => (
            <div
              key={pattern.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getPatternColor(pattern.type)}`}>
                    {getPatternIcon(pattern.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {pattern.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTrigger(pattern)}
                  disabled={isVibrating || !hapticEnabled}
                  className="flex items-center gap-1 px-3 py-1 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-[10px] font-semibold rounded transition-colors"
                >
                  {isVibrating && selectedPattern?.id === pattern.id ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Vibrating...
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" />
                      Test
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Intensity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pattern.intensity}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pattern.duration}ms
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Pattern</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {pattern.pattern.join(', ')}
                  </div>
                </div>
              </div>

              {/* Pattern Visualization */}
              <div className="flex items-center gap-1">
                {pattern.pattern.map((value, index) => (
                  <div
                    key={index}
                    className="h-2 rounded-full bg-teal-500"
                    style={{
                      width: `${value / 2}px`,
                      opacity: value / 100,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Vibration */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => {
            if (navigator.vibrate && hapticEnabled) {
              navigator.vibrate([50, 50, 50]);
            }
          }}
          disabled={!hapticEnabled}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Zap className="h-4 w-4" />
          Test Vibration
        </button>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Phản hồi xúc giác sử dụng native Vibration API với customizable patterns, intensity control, và pre-defined haptic feedback.
        </p>
      </div>
    </div>
  );
}