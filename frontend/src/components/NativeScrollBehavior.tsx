'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  Clock,
  Gauge,
  Scroll,
  Settings,
  Smartphone,
  Zap
} from 'lucide-react';

interface ScrollMetric {
  id: string;
  timestamp: Date;
  scrollPosition: number;
  scrollSpeed: number;
  direction: 'up' | 'down';
  bounce: boolean;
}

interface NativeScrollBehaviorProps {
  onCancel?: () => void;
  onScroll?: (position: number) => void;
}

const DEFAULT_METRICS: ScrollMetric[] = [
  {
    id: 'metric-1',
    timestamp: new Date(),
    scrollPosition: 1250,
    scrollSpeed: 150,
    direction: 'down',
    bounce: false,
  },
  {
    id: 'metric-2',
    timestamp: new Date(Date.now() - 5000),
    scrollPosition: 1100,
    scrollSpeed: 200,
    direction: 'down',
    bounce: true,
  },
];

export default function NativeScrollBehavior({ onCancel, onScroll }: NativeScrollBehaviorProps) {
  const [metrics, setMetrics] = useState<ScrollMetric[]>(DEFAULT_METRICS);
  const [showSettings, setShowSettings] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(1250);
  const [currentSpeed, setCurrentSpeed] = useState(150);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const [enableBounce, setEnableBounce] = useState(true);
  const [enableMomentum, setEnableMomentum] = useState(true);
  const [scrollDamping, setScrollDamping] = useState(0.97);
  const [decelerationRate, setDecelerationRate] = useState(0.998);

  const handleScroll = (newPosition: number) => {
    const delta = newPosition - currentPosition;
    const newDirection = delta > 0 ? 'down' : 'up';
    const newSpeed = Math.abs(delta);
    setCurrentPosition(newPosition);
    setCurrentSpeed(newSpeed);
    setDirection(newDirection);
    if (onScroll) {
      onScroll(newPosition);
    }
  };

  const addMetric = () => {
    const newMetric: ScrollMetric = {
      id: `metric-${Date.now()}`,
      timestamp: new Date(),
      scrollPosition: currentPosition,
      scrollSpeed: currentSpeed,
      direction,
      bounce: enableBounce && Math.random() > 0.7,
    };
    setMetrics(prev => [newMetric, ...prev].slice(0, 10));
  };

  const avgSpeed = metrics.reduce((sum, m) => sum + m.scrollSpeed, 0) / metrics.length;
  const bounceCount = metrics.filter(m => m.bounce).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Scroll className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hành vi cuộn native
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Position: {currentPosition}px • Speed: {currentSpeed}px/s
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
            Cài đặt scroll
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Enable bounce
              </span>
              <button
                type="button"
                onClick={() => setEnableBounce(!enableBounce)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableBounce ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableBounce ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Enable momentum
              </span>
              <button
                type="button"
                onClick={() => setEnableMomentum(!enableMomentum)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableMomentum ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableMomentum ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Scroll damping: {scrollDamping}
              </label>
              <input
                type="range"
                min="0.9"
                max="0.99"
                step="0.01"
                value={scrollDamping}
                onChange={(e) => setScrollDamping(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Deceleration rate: {decelerationRate}
              </label>
              <input
                type="range"
                min="0.99"
                max="0.999"
                step="0.001"
                value={decelerationRate}
                onChange={(e) => setDecelerationRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Speed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgSpeed.toFixed(0)} px/s
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Bounces</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {bounceCount}
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
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Momentum</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enableMomentum ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Scroll Position Control */}
      <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Scroll Position
        </h4>
        <div className="flex items-center gap-2 mb-2">
          {direction === 'up' ? <ArrowUp className="h-4 w-4 text-slate-500" /> : <ArrowDown className="h-4 w-4 text-slate-500" />}
          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300"
              style={{ width: `${(currentPosition / 2000) * 100}%` }}
            />
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {currentPosition}px
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2000"
          value={currentPosition}
          onChange={(e) => handleScroll(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => handleScroll(0)}
            className="flex-1 px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded transition-colors"
          >
            Top
          </button>
          <button
            type="button"
            onClick={() => handleScroll(2000)}
            className="flex-1 px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white text-xs font-semibold rounded transition-colors"
          >
            Bottom
          </button>
          <button
            type="button"
            onClick={addMetric}
            className="flex-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded transition-colors"
          >
            Log Metric
          </button>
        </div>
      </div>

      {/* Scroll Metrics */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Scroll Metrics
        </h4>
        <div className="space-y-2">
          {metrics.slice(0, 5).map((metric) => (
            <div
              key={metric.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {metric.direction === 'up' ? <ArrowUp className="h-4 w-4 text-slate-500" /> : <ArrowDown className="h-4 w-4 text-slate-500" />}
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {metric.direction}
                  </span>
                  {metric.bounce && (
                    <Gauge className="h-3 w-3 text-orange-500" />
                  )}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {metric.scrollSpeed} px/s
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Position</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {metric.scrollPosition}px
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Time</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {new Date(metric.timestamp).toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Hành vi cuộn native sử dụng native scroll physics với bounce effects, momentum scrolling, configurable damping, và deceleration rate.
        </p>
      </div>
    </div>
  );
}