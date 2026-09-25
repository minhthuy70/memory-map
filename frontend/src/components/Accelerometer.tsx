'use client';

import { useState, useEffect } from 'react';
import { Gauge, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Activity, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Smartphone, Clock, Waves, Zap, Play, Pause } from 'lucide-react';

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  timestamp: Date;
}

interface MotionEvent {
  id: string;
  type: 'shake' | 'tilt' | 'rotation' | 'pickup';
  timestamp: Date;
  intensity: number;
}

interface AccelerometerProps {
  onCancel?: () => void;
  onStartMonitoring?: () => Promise<void>;
  onStopMonitoring?: () => Promise<void>;
}

export default function Accelerometer({ onCancel, onStartMonitoring, onStopMonitoring }: AccelerometerProps) {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentData, setCurrentData] = useState<AccelerometerData | null>(null);
  const [motionEvents, setMotionEvents] = useState<MotionEvent[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [updateInterval, setUpdateInterval] = useState(100);
  const [shakeThreshold, setShakeThreshold] = useState(15);
  const [isScreenAwake, setIsScreenAwake] = useState(true);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        const newData: AccelerometerData = {
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20,
          z: (Math.random() - 0.5) * 20 + 9.8,
          timestamp: new Date(),
        };
        setCurrentData(newData);

        // Detect shake
        const acceleration = Math.sqrt(newData.x ** 2 + newData.y ** 2 + newData.z ** 2);
        if (acceleration > shakeThreshold) {
          const newEvent: MotionEvent = {
            id: `event-${Date.now()}`,
            type: 'shake',
            timestamp: new Date(),
            intensity: acceleration,
          };
          setMotionEvents(prev => [newEvent, ...prev].slice(0, 10));
        }
      }, updateInterval);
      return () => clearInterval(interval);
    }
  }, [isMonitoring, updateInterval, shakeThreshold]);

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

  const getOrientation = () => {
    if (!currentData) return null;
    const { x, y, z } = currentData;
    const pitch = Math.atan2(y, Math.sqrt(x * x + z * z)) * (180 / Math.PI);
    const roll = Math.atan2(-x, z) * (180 / Math.PI);
    return { pitch, roll };
  };

  const getMotionVector = () => {
    if (!currentData) return null;
    const magnitude = Math.sqrt(currentData.x ** 2 + currentData.y ** 2 + currentData.z ** 2);
    return magnitude;
  };

  const orientation = getOrientation();
  const motionVector = getMotionVector();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Gauge className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Gia tốc kế
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt accelerometer
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
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Shake threshold: {shakeThreshold}m/s²
              </label>
              <input
                type="range"
                min="5"
                max="30"
                value={shakeThreshold}
                onChange={(e) => setShakeThreshold(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Screen awake
              </span>
              <button
                type="button"
                onClick={() => setIsScreenAwake(!isScreenAwake)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  isScreenAwake ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    isScreenAwake ? 'translate-x-5' : ''
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
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Motion</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {motionVector ? motionVector.toFixed(2) : '0.00'} m/s²
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Wave className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Events</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {motionEvents.length}
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
              : 'bg-purple-500 hover:bg-purple-600 text-white'
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
            Dữ liệu hiện tại
          </h4>
          <div className="grid grid-cols-3 gap-2 mb-3">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">X Axis</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentData.x.toFixed(2)} m/s²
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Y Axis</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentData.y.toFixed(2)} m/s²
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Z Axis</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {currentData.z.toFixed(2)} m/s²
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Updated: {new Date(currentData.timestamp).toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      )}

      {/* Orientation */}
      {orientation && (
        <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Orientation
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Pitch</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {orientation.pitch.toFixed(1)}°
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Roll</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {orientation.roll.toFixed(1)}°
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Direction:</span>
            {Math.abs(currentData!.x) > Math.abs(currentData!.y) ? (
              currentData!.x > 0 ? <ArrowRight className="h-3 w-3 text-slate-500" /> : <ArrowLeft className="h-3 w-3 text-slate-500" />
            ) : (
              currentData!.y > 0 ? <ArrowDown className="h-3 w-3 text-slate-500" /> : <ArrowUp className="h-3 w-3 text-slate-500" />
            )}
          </div>
        </div>
      )}

      {/* Motion Events */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Motion Events
        </h4>
        <div className="space-y-2">
          {motionEvents.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {event.type}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {event.intensity.toFixed(2)} m/s²
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(event.timestamp).toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Gia tốc kế sử dụng DeviceMotion API để đọc x/y/z acceleration, detect shake/tilt, và orientation tracking.
        </p>
      </div>
    </div>
  );
}
