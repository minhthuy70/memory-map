'use client';

import { useState } from 'react';
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  ExternalLink,
  Flame,
  GripVertical,
  Info,
  Layout,
  MapPin,
  Plus,
  RefreshCw,
  Settings,
  Smartphone,
  Star,
  Trash2,
  TrendingUp,
  Zap
} from 'lucide-react';

interface WidgetsProps {
  onCancel?: () => void;
}

interface Widget {
  id: string;
  name: string;
  type: 'memories' | 'streak' | 'stats' | 'map' | 'quick_actions';
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
  position: number;
  refreshInterval: number;
  dataPreview: string;
}

export default function Widgets({ onCancel }: WidgetsProps) {
  const [widgetsEnabled, setWidgetsEnabled] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: '1',
      name: 'Recent Memories',
      type: 'memories',
      size: 'medium',
      enabled: true,
      position: 1,
      refreshInterval: 60,
      dataPreview: '3 recent memories',
    },
    {
      id: '2',
      name: 'Streak Counter',
      type: 'streak',
      size: 'small',
      enabled: true,
      position: 2,
      refreshInterval: 300,
      dataPreview: '15 day streak',
    },
    {
      id: '3',
      name: 'Memory Stats',
      type: 'stats',
      size: 'large',
      enabled: true,
      position: 3,
      refreshInterval: 3600,
      dataPreview: 'Total: 827 memories',
    },
    {
      id: '4',
      name: 'Location Map',
      type: 'map',
      size: 'medium',
      enabled: false,
      position: 4,
      refreshInterval: 1800,
      dataPreview: '25 locations',
    },
    {
      id: '5',
      name: 'Quick Actions',
      type: 'quick_actions',
      size: 'small',
      enabled: false,
      position: 5,
      refreshInterval: 0,
      dataPreview: 'Create, Search, Share',
    },
  ]);

  const getWidgetIcon = (type: string) => {
    switch (type) {
      case 'memories': return <Calendar className="h-5 w-5" />;
      case 'streak': return <Flame className="h-5 w-5" />;
      case 'stats': return <TrendingUp className="h-5 w-5" />;
      case 'map': return <MapPin className="h-5 w-5" />;
      case 'quick_actions': return <Zap className="h-5 w-5" />;
      default: return <Layout className="h-5 w-5" />;
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small': return '2x2';
      case 'medium': return '4x2';
      case 'large': return '4x4';
      default: return 'Unknown';
    }
  };

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map(widget => {
      if (widget.id === id) {
        return { ...widget, enabled: !widget.enabled };
      }
      return widget;
    }));
  };

  const deleteWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  const reorderWidget = (id: string, direction: 'up' | 'down') => {
    const currentIndex = widgets.findIndex(w => w.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < widgets.length) {
      const newWidgets = [...widgets];
      [newWidgets[currentIndex], newWidgets[newIndex]] = [newWidgets[newIndex], newWidgets[currentIndex]];
      newWidgets.forEach((widget, index) => widget.position = index + 1);
      setWidgets(newWidgets);
    }
  };

  const updateRefreshInterval = (id: string, interval: number) => {
    setWidgets(widgets.map(widget => {
      if (widget.id === id) {
        return { ...widget, refreshInterval: interval };
      }
      return widget;
    }));
  };

  const enabledCount = widgets.filter(w => w.enabled).length;
  const totalCount = widgets.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Layout className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Home Screen Widgets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Customize your home screen widgets
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            title={editMode ? 'Exit edit mode' : 'Edit widgets'}
          >
            {editMode ? <CheckCircle className="h-4 w-4" /> : <Edit className="h-4 w-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show preview"
          >
            {showPreview ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className={`p-4 rounded-lg border ${widgetsEnabled ? 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${widgetsEnabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <Layout className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {widgetsEnabled ? 'Widgets Enabled' : 'Widgets Disabled'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {widgetsEnabled ? 'Widgets visible on home screen' : 'Widgets hidden from home screen'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setWidgetsEnabled(!widgetsEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${widgetsEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {widgetsEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabledCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Medium</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{widgets.filter(w => w.size === 'medium').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Large</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{widgets.filter(w => w.size === 'large').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Edit Mode</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{editMode ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-teal-500 text-white border-0 flex items-center gap-1 hover:bg-teal-600 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add Widget
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh All
          </button>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Widget Preview</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {widgets.filter(w => w.enabled).map((widget) => (
                <div
                  key={widget.id}
                  className={`p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 ${widget.size === 'small' ? 'aspect-square' : widget.size === 'medium' ? 'aspect-[2/1]' : 'aspect-square'}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {getWidgetIcon(widget.type)}
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{widget.name}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{widget.dataPreview}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Available Widgets</h4>
          <div className="space-y-2">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className={`p-4 rounded-lg border-2 ${widget.enabled ? 'border-teal-300 dark:border-teal-600 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${widget.enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      {getWidgetIcon(widget.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{widget.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 capitalize">
                          {widget.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{getSizeLabel(widget.size)}</span>
                      </div>
                    </div>
                  </div>
                  {editMode && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => reorderWidget(widget.id, 'up')}
                        disabled={widget.position === 1}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                      >
                        <ExternalLink className="h-3 w-3 text-slate-500 rotate-[-45deg]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderWidget(widget.id, 'down')}
                        disabled={widget.position === widgets.length}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                      >
                        <ExternalLink className="h-3 w-3 text-slate-500 rotate-45" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteWidget(widget.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Refresh: {widget.refreshInterval}s</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Preview: {widget.dataPreview}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleWidget(widget.id)}
                    className={`p-1.5 rounded-lg transition-colors ${widget.enabled ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}
                  >
                    {widget.enabled ? <CheckCircle className="h-4 w-4" /> : <Layout className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Widget Configuration
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Small widgets: 2x2 grid cells</li>
            <li>• Medium widgets: 4x2 grid cells</li>
            <li>• Large widgets: 4x4 grid cells</li>
            <li>• Auto-refresh based on interval settings</li>
            <li>• Tap widgets to open relevant app screen</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Platform Support
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• iOS: Home screen widgets (iOS 14+)</li>
            <li>• TabletSmartphone: Home screen widgets</li>
            <li>• Lock screen widgets (limited support)</li>
            <li>• Dynamic content updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
