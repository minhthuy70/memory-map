'use client';

import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowUp,
  CheckCircle,
  Clock,
  Info,
  Layers,
  Maximize,
  Minimize,
  RefreshCw,
  Settings,
  Smartphone,
  Zap
} from 'lucide-react';

interface ModalConfig {
  id: string;
  title: string;
  type: 'sheet' | 'fullscreen' | 'alert' | 'popover' | 'bottomsheet';
  animated: boolean;
  dismissible: boolean;
  duration: number;
  timestamp: Date;
}

interface NativeModalsProps {
  onCancel?: () => void;
  onPresentModal?: (config: ModalConfig) => Promise<void>;
  onDismissModal?: (modalId: string) => Promise<void>;
}

const DEFAULT_MODALS: ModalConfig[] = [
  {
    id: 'modal-1',
    title: 'Settings Sheet',
    type: 'sheet',
    animated: true,
    dismissible: true,
    duration: 300,
    timestamp: new Date(),
  },
  {
    id: 'modal-2',
    title: 'Photo Viewer',
    type: 'fullscreen',
    animated: true,
    dismissible: true,
    duration: 400,
    timestamp: new Date(Date.now() - 3600000),
  },
];

export default function NativeModals({ onCancel, onPresentModal, onDismissModal }: NativeModalsProps) {
  const [modals, setModals] = useState<ModalConfig[]>(DEFAULT_MODALS);
  const [showSettings, setShowSettings] = useState(false);
  const [currentType, setCurrentType] = useState<'sheet' | 'fullscreen' | 'alert' | 'popover' | 'bottomsheet'>('sheet');
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [dismissOnBackgroundTap, setDismissOnBackgroundTap] = useState(true);
  const [swipeToDismiss, setSwipeToDismiss] = useState(true);

  const handlePresent = async () => {
    const newModal: ModalConfig = {
      id: `modal-${Date.now()}`,
      title: 'New Modal',
      type: currentType,
      animated: enableAnimation,
      dismissible: true,
      duration: 300,
      timestamp: new Date(),
    };
    if (onPresentModal) {
      await onPresentModal(newModal);
    }
    setModals(prev => [...prev, newModal]);
  };

  const handleDismiss = async (modalId: string) => {
    if (onDismissModal) {
      await onDismissModal(modalId);
    }
    setModals(prev => prev.filter(m => m.id !== modalId));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sheet':
        return <Layers className="h-4 w-4" />;
      case 'fullscreen':
        return <Maximize className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      case 'popover':
        return <Info className="h-4 w-4" />;
      case 'bottomsheet':
        return <ArrowUp className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sheet':
        return 'text-purple-500';
      case 'fullscreen':
        return 'text-blue-500';
      case 'alert':
        return 'text-red-500';
      case 'popover':
        return 'text-green-500';
      case 'bottomsheet':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Maximize className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Modal native
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {modals.length} modals active
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
            Cài đặt modal
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Enable animation
              </span>
              <button
                type="button"
                onClick={() => setEnableAnimation(!enableAnimation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableAnimation ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableAnimation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Dismiss on background tap
              </span>
              <button
                type="button"
                onClick={() => setDismissOnBackgroundTap(!dismissOnBackgroundTap)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  dismissOnBackgroundTap ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    dismissOnBackgroundTap ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Swipe to dismiss
              </span>
              <button
                type="button"
                onClick={() => setSwipeToDismiss(!swipeToDismiss)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  swipeToDismiss ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    swipeToDismiss ? 'translate-x-5' : ''
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
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {modals.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Type</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {currentType}
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
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Animation</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enableAnimation ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Present Modal */}
      <div className="mb-4">
        <div className="mb-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
            Modal Type
          </label>
          <select
            value={currentType}
            onChange={(e) => setCurrentType(e.target.value as any)}
            className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="sheet">Sheet</option>
            <option value="fullscreen">Fullscreen</option>
            <option value="alert">Alert</option>
            <option value="popover">Popover</option>
            <option value="bottomsheet">Bottom Sheet</option>
          </select>
        </div>
        <button
          type="button"
          onClick={handlePresent}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Maximize className="h-4 w-4" />
          Present Modal
        </button>
      </div>

      {/* Active Modals */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Active Modals
        </h4>
        <div className="space-y-2">
          {modals.map((modal) => (
            <div
              key={modal.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(modal.type)}`}>
                    {getTypeIcon(modal.type)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {modal.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDismiss(modal.id)}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                  title="Dismiss"
                >
                  <Minimize className="h-3 w-3 text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Type</div>
                  <div className={`text-xs font-semibold ${getTypeColor(modal.type)}`}>
                    {modal.type}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {modal.duration}ms
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Animated</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {modal.animated ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(modal.timestamp).toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Types */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Available Modal Types
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { type: 'sheet', name: 'Sheet', desc: 'Half-screen modal' },
            { type: 'fullscreen', name: 'Fullscreen', desc: 'Full-screen modal' },
            { type: 'alert', name: 'Alert', desc: 'Alert dialog' },
            { type: 'popover', name: 'Popover', desc: 'Popover menu' },
            { type: 'bottomsheet', name: 'Bottom Sheet', desc: 'Bottom sheet' },
          ].map((item) => (
            <div
              key={item.type}
              className={`p-3 rounded-lg border-2 ${
                currentType === item.type
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {getTypeIcon(item.type)}
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {item.name}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Modal native sử dụng native modal presentation với sheet/fullscreen/alert/popover/bottomsheet, animation, và dismissal options.
        </p>
      </div>
    </div>
  );
}