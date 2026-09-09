'use client';

import { useState } from 'react';
import { Layers, X, Settings, Check, RefreshCw, Image, FileText, Video, Calendar, Clock, TrendingUp, AlertTriangle } from 'lucide-react';

interface LazyComponent {
  name: string;
  type: 'image' | 'route' | 'data' | 'video' | 'calendar';
  priority: 'high' | 'medium' | 'low';
  loaded: boolean;
  loadTime: number;
  strategy: 'viewport' | 'user-interaction' | 'idle' | 'scroll';
}

interface LazyLoadingStrategiesProps {
  onCancel?: () => void;
  onConfigureStrategy?: (component: string, strategy: LazyComponent['strategy']) => Promise<void>;
  onLoadComponent?: (component: string) => Promise<void>;
}

const DEFAULT_COMPONENTS: LazyComponent[] = [
  { name: 'MapLayer', type: 'image', priority: 'high', loaded: true, loadTime: 150, strategy: 'viewport' },
  { name: 'MemoryList', type: 'route', priority: 'high', loaded: true, loadTime: 200, strategy: 'viewport' },
  { name: 'MemoryEditor', type: 'route', priority: 'medium', loaded: false, loadTime: 0, strategy: 'user-interaction' },
  { name: 'Gallery', type: 'image', priority: 'medium', loaded: false, loadTime: 0, strategy: 'scroll' },
  { name: 'VideoPlayer', type: 'video', priority: 'low', loaded: false, loadTime: 0, strategy: 'user-interaction' },
  { name: 'CalendarView', type: 'calendar', priority: 'medium', loaded: false, loadTime: 0, strategy: 'idle' },
  { name: 'Analytics', type: 'data', priority: 'low', loaded: false, loadTime: 0, strategy: 'idle' },
  { name: 'Settings', type: 'route', priority: 'low', loaded: false, loadTime: 0, strategy: 'user-interaction' },
];

export default function LazyLoadingStrategies({ onCancel, onConfigureStrategy, onLoadComponent }: LazyLoadingStrategiesProps) {
  const [components, setComponents] = useState<LazyComponent[]>(DEFAULT_COMPONENTS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<LazyComponent['strategy']>('viewport');

  const handleConfigure = async (componentName: string, strategy: LazyComponent['strategy']) => {
    if (onConfigureStrategy) {
      await onConfigureStrategy(componentName, strategy);
    }
    setComponents(prev => prev.map(comp => 
      comp.name === componentName 
        ? { ...comp, strategy }
        : comp
    ));
  };

  const handleLoad = async (componentName: string) => {
    setComponents(prev => prev.map(comp => 
      comp.name === componentName 
        ? { ...comp, loaded: true, loadTime: Math.random() * 300 + 100 }
        : comp
    ));
    if (onLoadComponent) {
      await onLoadComponent(componentName);
    }
  };

  const handleLoadAll = async () => {
    const unloaded = components.filter(c => !c.loaded);
    for (const comp of unloaded) {
      await handleLoad(comp.name);
    }
  };

  const getTypeIcon = (type: LazyComponent['type']) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'route':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      case 'data':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: LazyComponent['priority']) => {
    switch (priority) {
      case 'high':
        return 'from-red-400 to-rose-500';
      case 'medium':
        return 'from-amber-400 to-orange-500';
      case 'low':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getStrategyLabel = (strategy: LazyComponent['strategy']) => {
    switch (strategy) {
      case 'viewport':
        return 'Viewport';
      case 'user-interaction':
        return 'User Interaction';
      case 'idle':
        return 'Idle';
      case 'scroll':
        return 'Scroll';
      default:
        return 'Viewport';
    }
  };

  const getStrategyColor = (strategy: LazyComponent['strategy']) => {
    switch (strategy) {
      case 'viewport':
        return 'from-blue-400 to-cyan-500';
      case 'user-interaction':
        return 'from-purple-400 to-pink-500';
      case 'idle':
        return 'from-teal-400 to-emerald-500';
      case 'scroll':
        return 'from-orange-400 to-amber-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chiến lược lazy loading
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {components.filter(c => c.loaded).length}/{components.length} đã tải
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
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt chiến lược mặc định
          </h4>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Chiến lược mặc định cho component mới
            </label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value as LazyComponent['strategy'])}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              <option value="viewport">Viewport (tải khi vào viewport)</option>
              <option value="user-interaction">User Interaction (tải khi tương tác)</option>
              <option value="idle">Idle (tải khi rảnh)</option>
              <option value="scroll">Scroll (tải khi cuộn)</option>
            </select>
          </div>
        </div>
      )}

      {/* Components List */}
      <div className="space-y-2 mb-4">
        {components.map((component) => (
          <div
            key={component.name}
            className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(component.type)}
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {component.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getPriorityColor(component.priority)} text-white text-[10px] font-bold rounded-full`}>
                  {component.priority}
                </span>
                {component.loaded && (
                  <Check className="h-3 w-3 text-green-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-slate-500" />
                <span className={`px-2 py-0.5 bg-gradient-to-r ${getStrategyColor(component.strategy)} text-white text-[10px] font-bold rounded-full`}>
                  {getStrategyLabel(component.strategy)}
                </span>
                {component.loaded && (
                  <span className="text-[10px] text-slate-500">
                    • {component.loadTime.toFixed(0)}ms
                  </span>
                )}
              </div>
              {!component.loaded && (
                <button
                  type="button"
                  onClick={() => handleLoad(component.name)}
                  className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Tải
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleLoadAll}
          disabled={components.every(c => c.loaded)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <Layers className="h-4 w-4" />
          Tải tất cả
        </button>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Lazy loading tải component/image chỉ khi cần thiết để giảm initial load time và bandwidth.
        </p>
      </div>
    </div>
  );
}