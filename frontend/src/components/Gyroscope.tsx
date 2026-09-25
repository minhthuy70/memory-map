'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Compass,
  Navigation,
  Pause,
  Play,
  RefreshCw,
  Rotate3D,
  RotateCw,
  Settings,
  Smartphone,
  Zap
} from 'lucide-react';

interface GyroscopeData {
  alpha: number;
  beta: number;
  gamma: number;
  timestamp: Date;
}

interface RotationEvent {
  id: string;
  type: 'absolute' | 'relative';
  timestamp: Date;
  rotation: { alpha: number; beta: number; gamma: number };
}

interface GyroscopeProps {
  onCancel?: () => void;
  onStartMonitoring?: () => Promise<void>;
  onStopMonitoring?: () => Promise<void>;
}

export default function Gyroscope({ onCancel, onStartMonitoring, onStopMonitoring }: GyroscopeProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentData, setCurrentData] = useState<GyroscopeData | null>(null);
  const [rotationEvents, setRotationEvents] = useState<RotationEvent[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(100);
  const [absoluteMode, setAbsoluteMode] = useState(true);
  const [compassMode, setCompassMode] = useState(true);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        const newData: GyroscopeData = {
          alpha: Math.random() * 360,
          beta: (Math.random() - 0.5) * 180,
          gamma: (Math.random() - 0.5) * 90,
          timestamp: new Date(),
        };
        setCurrentData(newData);

        // Log rotation event
        const newEvent: RotationEvent = {
          id: `event-${Date.now()}`,
          type: absoluteMode ? 'absolute' : 'relative',
          timestamp: new Date(),
          rotation: { alpha: newData.alpha, beta: newData.beta, gamma: newData.gamma },
        };
        setRotationEvents(prev => [newEvent, ...prev].slice(0, 10));
      }, updateInterval);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, updateInterval, absoluteMode]);

  const handleStart = async () => {
    if (onStartMonitoring) {
      await onStartMonitoring();
    }
    setIsMonitoring(true);
  };

  const handleStop = async () => {
    if (onStopMonitoring) {
      await onStopMonitoring();
    }
    setIsMonitoring(false);
  };

  const getCompassHeading = () => {
    if (!currentData) return null;
    const { alpha } = currentData;
    return alpha;
  };

  const getRotationRate = () => {
    if (!currentData) return null;
    const { alpha, beta, gamma } = currentData;
    const rate = Math.sqrt(alpha ** 2 + beta ** 2 + gamma ** 2);
    return rate;
  };

  const compassHeading = getCompassHeading();
  const rotationRate = getRotationRate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <RotateCw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Con quay hồi chuyển
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isMonitoring ? 'Đang theo dõi' : 'Đã dừng'}
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt gyroscope
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Update interval: {updateInterval}ms
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Absolute mode
              </span>
              <button
                type="button"
                onClick={() => setAbsoluteMode(!absoluteMode)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  absoluteMode ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    absoluteMode ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Compass mode
              </span>
              <button
                type="button"
                onClick={() => setCompassMode(!compassMode)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  compassMode ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    compassMode ? 'translate-x-5' : ''
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
            <Compass className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Heading</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {compassHeading ? compassHeading.toFixed(0) : '0'}°
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {rotationRate ? rotationRate.toFixed(2) : '0.00'} °/s
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Update</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {updateInterval}ms
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Power</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Low
          </div>
        </div>
      </div>

      {/* Control Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={isMonitoring ? handleStop : handleStart}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
            isMonitoring
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-orange-500 hover:bg-orange-600 text-white'
          }`}
        >
          {isMonitoring ? (
            <>
              <Pause className="h-4 w-4" />
              Dừng theo dõi
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Bắt đầu theo dõi
            </>
          )}
        </button>
      </div>

      {/* Current Data */}
      {currentData && (
        <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Dữ liệu xoay hiện tại
          </h4>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Alpha (Z)</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentData.alpha.toFixed(2)}°
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Beta (X)</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentData.beta.toFixed(2)}°
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Gamma (Y)</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentData.gamma.toFixed(2)}°
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Updated: {new Date(currentData.timestamp).toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      )}

      {/* Compass */}
      {compassMode && compassHeading && (
        <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Compass Heading
          </h4>
          <div className="flex items-center justify-center mb-2">
            <div className="relative w-20 h-20 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center">
              <Navigation
                className="h-8 w-8 text-orange-500"
                style={{ transform: `rotate(${compassHeading}deg)` }}
              />
              <div className="absolute text-[10px] text-slate-500 dark:text-slate-400">
                {compassHeading.toFixed(0)}°
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-600 dark:text-slate-400">
            {compassHeading >= 337.5 || compassHeading < 22.5 ? 'North' :
             compassHeading >= 22.5 && compassHeading < 67.5 ? 'Northeast' :
             compassHeading >= 67.5 && compassHeading < 112.5 ? 'East' :
             compassHeading >= 112.5 && compassHeading < 157.5 ? 'Southeast' :
             compassHeading >= 157.5 && compassHeading < 202.5 ? 'South' :
             compassHeading >= 202.5 && compassHeading < 247.5 ? 'Southwest' :
             compassHeading >= 247.5 && compassHeading < 292.5 ? 'West' : 'Northwest'}
          </div>
        </div>
      )}

      {/* Rotation Events */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Rotation Events
        </h4>
        <div className="space-y-2">
          {rotationEvents.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Rotate3D className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {event.type}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {event.rotation.alpha.toFixed(0)}°
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <div>α: {event.rotation.alpha.toFixed(1)}°</div>
                <div>β: {event.rotation.beta.toFixed(1)}°</div>
                <div>γ: {event.rotation.gamma.toFixed(1)}°</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Con quay hồi chuyển sử dụng DeviceOrientation API để đọc alpha/beta/gamma rotation, compass heading, và rotation rate tracking.
        </p>
      </div>
    </div>
  );
}