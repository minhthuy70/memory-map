'use client';

import { useState } from 'react';
import { Hand, X, Settings, CheckCircle, AlertTriangle, Smartphone, Activity, Clock, Zap, Move, MousePointer2, ZoomIn, Minimize, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface GestureEvent {
  id: string;
  type: 'tap' | 'longPress' | 'swipe' | 'pinch' | 'pan' | 'rotate';
  timestamp: Date;
  duration: number;
  velocity: number;
  direction?: string;
  scale?: number;
}

interface NativeGesturesProps {
  onCancel?: () => void;
  onGestureRecognized?: (gesture: GestureEvent) => void;
}

const DEFAULT_EVENTS: GestureEvent[] = [
  {
    id: 'event-1',
    type: 'swipe',
    timestamp: new Date(),
    duration: 450,
    velocity: 850,
    direction: 'right',
  },
  {
    id: 'event-2',
    type: 'pinch',
    timestamp: new Date(Date.now() - 5000),
    duration: 1200,
    velocity: 300,
    scale: 1.5,
  },
];

export default function NativeGestures({ onCancel, onGestureRecognized }: NativeGesturesProps) {
  const [gestureEvents, setGestureEvents] = useState<GestureEvent[]>(DEFAULT_EVENTS);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledGestures, setEnabledGestures] = useState({
    tap: true,
    longPress: true,
    swipe: true,
    pinch: true,
    pan: true,
    rotate: true,
  });
  const [tapThreshold, setTapThreshold] = useState(10);
  const [longPressDuration, setLongPressDuration] = useState(500);
  const [swipeVelocity, setSwipeVelocity] = useState(500);

  const handleGesture = (type: GestureEvent['type']) => {
    const newEvent: GestureEvent = {
      id: `event-${Date.now()}`,
      type,
      timestamp: new Date(),
      duration: Math.floor(Math.random() * 1000) + 100,
      velocity: Math.floor(Math.random() * 1000) + 100,
      direction: type === 'swipe' ? ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)] : undefined,
      scale: type === 'pinch' ? Math.random() * 2 + 0.5 : undefined,
    };
    if (onGestureRecognized) {
      onGestureRecognized(newEvent);
    }
    setGestureEvents(prev => [newEvent, ...prev].slice(0, 10));
  };

  const getGestureIcon = (type: string) => {
    switch (type) {
      case 'tap':
        return <MousePointer2 className="h-4 w-4" />;
      case 'longPress':
        return <Activity className="h-4 w-4" />;
      case 'swipe':
        return <ArrowRight className="h-4 w-4" />;
      case 'pinch':
        return <ZoomIn className="h-4 w-4" />;
      case 'pan':
        return <Move className="h-4 w-4" />;
      case 'rotate':
        return <Hand className="h-4 w-4" />;
      default:
        return <Hand className="h-4 w-4" />;
    }
  };

  const getGestureColor = (type: string) => {
    switch (type) {
      case 'tap':
        return 'text-blue-500';
      case 'longPress':
        return 'text-purple-500';
      case 'swipe':
        return 'text-green-500';
      case 'pinch':
        return 'text-orange-500';
      case 'pan':
        return 'text-teal-500';
      case 'rotate':
        return 'text-pink-500';
      default:
        return 'text-slate-500';
    }
  };

  const avgVelocity = gestureEvents.reduce((sum, e) => sum + e.velocity, 0) / gestureEvents.length;
  const typeCount = gestureEvents.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Hand className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Cử chỉ native
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {gestureEvents.length} events
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
            Cài đặt gestures
          </h4>
          <div className="space-y-2">
            {Object.entries(enabledGestures).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                  {key}
                </span>
                <button
                  type="button"
                  onClick={() => setEnabledGestures(prev => ({ ...prev, [key]: !value }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    value ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      value ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tap threshold: {tapThreshold}px
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={tapThreshold}
                onChange={(e) => setTapThreshold(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Long press duration: {longPressDuration}ms
              </label>
              <input
                type="range"
                min="300"
                max="1000"
                value={longPressDuration}
                onChange={(e) => setLongPressDuration(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Swipe velocity: {swipeVelocity}px/s
              </label>
              <input
                type="range"
                min="300"
                max="1000"
                value={swipeVelocity}
                onChange={(e) => setSwipeVelocity(parseInt(e.target.value))}
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Velocity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgVelocity.toFixed(0)} px/s
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Enabled</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {Object.values(enabledGestures).filter(Boolean).length}
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Events</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {gestureEvents.length}
          </div>
        </div>
      </div>

      {/* Gesture Buttons */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Test Gestures
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleGesture('tap')}
            disabled={!enabledGestures.tap}
            className="p-3 rounded-lg border-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex flex-col items-center gap-1">
              <MousePointer2 className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Tap</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleGesture('longPress')}
            disabled={!enabledGestures.longPress}
            className="p-3 rounded-lg border-2 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex flex-col items-center gap-1">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Long Press</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleGesture('swipe')}
            disabled={!enabledGestures.swipe}
            className="p-3 rounded-lg border-2 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex flex-col items-center gap-1">
              <ArrowRight className="h-4 w-4 text-green-500" />
              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Swipe</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleGesture('pinch')}
            disabled={!enabledGestures.pinch}
            className="p-3 rounded-lg border-2 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex flex-col items-center gap-1">
              <ZoomIn className="h-4 w-4 text-orange-500" />
              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Pinch</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleGesture('pan')}
            disabled={!enabledGestures.pan}
            className="p-3 rounded-lg border-2 bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex flex-col items-center gap-1">
              <Move className="h-4 w-4 text-teal-500" />
              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Pan</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleGesture('rotate')}
            disabled={!enabledGestures.rotate}
            className="p-3 rounded-lg border-2 bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="flex flex-col items-center gap-1">
              <Hand className="h-4 w-4 text-pink-500" />
              <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300">Rotate</span>
            </div>
          </button>
        </div>
      </div>

      {/* Gesture Events */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Gesture Events
        </h4>
        <div className="space-y-2">
          {gestureEvents.slice(0, 5).map((event) => (
            <div
              key={event.id}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getGestureColor(event.type)}`}>
                    {getGestureIcon(event.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {event.type}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {event.velocity} px/s
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {event.duration}ms
                  </div>
                </div>
                {event.direction && (
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Direction</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                      {event.direction}
                    </div>
                  </div>
                )}
                {event.scale && (
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Scale</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {event.scale.toFixed(2)}x
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(event.timestamp).toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Cử chỉ native sử dụng native gesture recognizers với tap, long press, swipe, pinch, pan, rotate, và configurable thresholds.
        </p>
      </div>
    </div>
  );
}