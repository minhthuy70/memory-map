'use client';

import { useState } from 'react';
import { LayoutGrid, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Plus, Trash2, Smartphone, Apple, Android, Calendar, MapPin, Star, Clock, Image, Activity } from 'lucide-react';

interface Widget {
  id: string;
  name: string;
  type: 'small' | 'medium' | 'large';
  description: string;
  enabled: boolean;
  refreshInterval: number;
  lastRefresh: Date | null;
  platform: 'ios' | 'android' | 'both';
}

interface WidgetsProps {
  onCancel?: () => void;
  onAddWidget?: (widget: Omit<Widget, 'id' | 'lastRefresh'>) => Promise<Widget>;
  onRemoveWidget?: (widgetId: string) => Promise<void>;
  onUpdateWidget?: (widgetId: string, widget: Partial<Widget>) => Promise<void>;
}

const DEFAULT_WIDGETS: Widget[] = [
  {
    id: 'widget-1',
    name: 'Memory Count',
    type: 'small',
    description: 'Show total memory count',
    enabled: true,
    refreshInterval: 3600,
    lastRefresh: new Date(),
    platform: 'both',
  },
  {
    id: 'widget-2',
    name: 'Today\'s Memories',
    type: 'medium',
    description: 'Show memories created today',
    enabled: true,
    refreshInterval: 1800,
    lastRefresh: new Date(Date.now() - 1800000),
    platform: 'both',
  },
  {
    id: 'widget-3',
    name: 'Memory Map',
    type: 'large',
    description: 'Interactive map widget',
    enabled: false,
    refreshInterval: 300,
    lastRefresh: null,
    platform: 'both',
  },
];

export default function Widgets({ onCancel, onAddWidget, onRemoveWidget, onUpdateWidget }: WidgetsProps) {
  const [widgets, setWidgets] = useState<Widget[]>(DEFAULT_WIDGETS);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleAdd = async (widget: Omit<Widget, 'id' | 'lastRefresh'>) => {
    if (onAddWidget) {
      const newWidget = await onAddWidget(widget);
      setWidgets(prev => [newWidget, ...prev]);
    } else {
      const newWidget: Widget = {
        ...widget,
        id: `widget-${Date.now()}`,
        lastRefresh: null,
      };
      setWidgets(prev => [newWidget, ...prev]);
    }
    setShowCreateModal(false);
  };

  const handleRemove = async (widgetId: string) => {
    if (onRemoveWidget) {
      await onRemoveWidget(widgetId);
    }
    setWidgets(prev => prev.filter(w => w.id !== widgetId));
  };

  const handleToggle = async (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    if (widget && onUpdateWidget) {
      await onUpdateWidget(widgetId, { enabled: !widget.enabled });
    }
    setWidgets(prev => prev.map(w => 
      w.id === widgetId ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const enabledWidgets = widgets.filter(w => w.enabled).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Widgets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledWidgets} enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo widget mới"
          >
            <Plus className="h-4 w-4 text-slate-500" />
          </button>
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
            Cài đặt widgets
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                iOS Widgets
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Android Widgets
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-refresh
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Platform Info */}
      <div className="mb-4 p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
        <div className="flex items-center gap-2 mb-3">
          <Smartphone className="h-4 w-4 text-slate-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Platform Support
          </span>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Apple className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              iOS 14+, Home Screen
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Android className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Android 5+, Home Screen
            </span>
          </div>
        </div>
      </div>

      {/* Widget Types */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Widget Types
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-center">
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded mx-auto mb-2" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Small</span>
          </div>
          <div className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-center">
            <div className="w-12 h-8 bg-slate-200 dark:bg-slate-600 rounded mx-auto mb-2" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Medium</span>
          </div>
          <div className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-center">
            <div className="w-16 h-8 bg-slate-200 dark:bg-slate-600 rounded mx-auto mb-2" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Large</span>
          </div>
        </div>
      </div>

      {/* Available Widgets */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Available Widgets
        </h4>
        <div className="space-y-2">
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {widget.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    widget.type === 'small'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : widget.type === 'medium'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  }`}>
                    {widget.type}
                  </span>
                  {widget.enabled && (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggle(widget.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      widget.enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        widget.enabled ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(widget.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {widget.description}
              </p>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Refresh</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {widget.refreshInterval}s
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Platform</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {widget.platform}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {widget.lastRefresh ? new Date(widget.lastRefresh).toLocaleTimeString('vi-VN') : 'Never'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Tạo Widget
              </h4>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Widget Name
                </label>
                <input
                  type="text"
                  placeholder="My Widget"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Size
                </label>
                <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Widget description"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-3 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAdd({
                      name: 'New Widget',
                      type: 'medium',
                      description: 'Custom widget',
                      enabled: true,
                      refreshInterval: 1800,
                      platform: 'both',
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Widgets hỗ trợ iOS Home Screen và Android Home Screen với configurable sizes và auto-refresh.
        </p>
      </div>
    </div>
  );
}