'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Pause,
  Play,
  RotateCw,
  Settings,
  SkipForward,
  Smartphone,
  Sparkles,
  Square,
  Zap
} from 'lucide-react';

interface AnimationConfig {
  id: string;
  name: string;
  type: 'fade' | 'slide' | 'scale' | 'rotate' | 'spring' | 'parallax';
  duration: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring';
  status: 'idle' | 'playing' | 'paused' | 'completed';
  timestamp: Date;
}

interface NativeAnimationsProps {
  onCancel?: () => void;
  onPlayAnimation?: (config: AnimationConfig) => Promise<void>;
  onPauseAnimation?: () => Promise<void>;
  onStopAnimation?: () => Promise<void>;
}

const DEFAULT_ANIMATIONS: AnimationConfig[] = [
  {
    id: 'anim-1',
    name: 'Fade In',
    type: 'fade',
    duration: 300,
    easing: 'easeIn',
    status: 'completed',
    timestamp: new Date(),
  },
  {
    id: 'anim-2',
    name: 'Slide Up',
    type: 'slide',
    duration: 400,
    easing: 'easeOut',
    status: 'completed',
    timestamp: new Date(Date.now() - 3600000),
  },
];

export default function NativeAnimations({ onCancel, onPlayAnimation, onPauseAnimation, onStopAnimation }: NativeAnimationsProps) {
  const [animations, setAnimations] = useState<AnimationConfig[]>(DEFAULT_ANIMATIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationConfig | null>(null);
  const [selectedType, setSelectedType] = useState<'fade' | 'slide' | 'scale' | 'rotate' | 'spring' | 'parallax'>('fade');
  const [selectedEasing, setSelectedEasing] = useState<'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'spring'>('easeIn');
  const [duration, setDuration] = useState(300);
  const [enableHardwareAcceleration, setEnableHardwareAcceleration] = useState(true);
  const [useCoreAnimation, setUseCoreAnimation] = useState(true);

  const handlePlay = async (animation: AnimationConfig) => {
    setCurrentAnimation(animation);
    const updatedAnimation = { ...animation, status: 'playing' as const };
    setAnimations(prev => prev.map(a => a.id === animation.id ? updatedAnimation : a));
    if (onPlayAnimation) {
      await onPlayAnimation(updatedAnimation);
    } else {
      await new Promise(resolve => setTimeout(resolve, animation.duration));
    }
    const completedAnimation = { ...updatedAnimation, status: 'completed' as const };
    setAnimations(prev => prev.map(a => a.id === animation.id ? completedAnimation : a));
    setCurrentAnimation(null);
  };

  const handleCreateAndPlay = async () => {
    const newAnimation: AnimationConfig = {
      id: `anim-${Date.now()}`,
      name: `New ${selectedType}`,
      type: selectedType,
      duration,
      easing: selectedEasing,
      status: 'idle',
      timestamp: new Date(),
    };
    setAnimations(prev => [newAnimation, ...prev]);
    await handlePlay(newAnimation);
  };

  const getAnimationIcon = (type: string) => {
    switch (type) {
      case 'fade':
        return <Sparkles className="h-4 w-4" />;
      case 'slide':
        return <SkipForward className="h-4 w-4" />;
      case 'scale':
        return <Activity className="h-4 w-4" />;
      case 'rotate':
        return <RotateCw className="h-4 w-4" />;
      case 'spring':
        return <Zap className="h-4 w-4" />;
      case 'parallax':
        return <Activity className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getAnimationColor = (type: string) => {
    switch (type) {
      case 'fade':
        return 'text-indigo-500';
      case 'slide':
        return 'text-blue-500';
      case 'scale':
        return 'text-green-500';
      case 'rotate':
        return 'text-orange-500';
      case 'spring':
        return 'text-purple-500';
      case 'parallax':
        return 'text-pink-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'playing':
        return 'text-green-500';
      case 'paused':
        return 'text-amber-500';
      case 'completed':
        return 'text-blue-500';
      default:
        return 'text-slate-500';
    }
  };

  const avgDuration = animations.reduce((sum, a) => sum + a.duration, 0) / animations.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Animation native
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {currentAnimation ? `Đang play: ${currentAnimation.name}` : 'Đã sẵn sàng'}
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
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt animation
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Hardware acceleration
              </span>
              <button
                type="button"
                onClick={() => setEnableHardwareAcceleration(!enableHardwareAcceleration)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableHardwareAcceleration ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableHardwareAcceleration ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Core Animation (iOS)
              </span>
              <button
                type="button"
                onClick={() => setUseCoreAnimation(!useCoreAnimation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  useCoreAnimation ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    useCoreAnimation ? 'translate-x-5' : ''
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgDuration.toFixed(0)}ms
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {animations.filter(a => a.status === 'completed').length}
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Hardware</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enableHardwareAcceleration ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Create Animation */}
      <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Tạo Animation Mới
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="scale">Scale</option>
              <option value="rotate">Rotate</option>
              <option value="spring">Spring</option>
              <option value="parallax">Parallax</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Easing
            </label>
            <select
              value={selectedEasing}
              onChange={(e) => setSelectedEasing(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="linear">Linear</option>
              <option value="easeIn">Ease In</option>
              <option value="easeOut">Ease Out</option>
              <option value="easeInOut">Ease In Out</option>
              <option value="spring">Spring</option>
            </select>
          </div>
        </div>
        <div className="mb-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
            Duration: {duration}ms
          </label>
          <input
            type="range"
            min="100"
            max="2000"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleCreateAndPlay}
          disabled={currentAnimation !== null}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {currentAnimation ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Đang play...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Tạo và Play
            </>
          )}
        </button>
      </div>

      {/* Animation List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Animations
        </h4>
        <div className="space-y-2">
          {animations.slice(0, 5).map((animation) => (
            <div
              key={animation.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getAnimationColor(animation.type)}`}>
                    {getAnimationIcon(animation.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {animation.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getStatusColor(animation.status)}`}>
                    {animation.status}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlay(animation)}
                  disabled={currentAnimation !== null}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                  title="Play"
                >
                  <Play className="h-3 w-3 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Type</div>
                  <div className={`text-xs font-semibold ${getAnimationColor(animation.type)}`}>
                    {animation.type}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {animation.duration}ms
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Easing</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {animation.easing}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(animation.timestamp).toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Animation native sử dụng native animation system với fade/slide/scale/rotate/spring/parallax, easing functions, và hardware acceleration.
        </p>
      </div>
    </div>
  );
}