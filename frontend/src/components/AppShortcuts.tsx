'use client';

import { useState } from 'react';
import { Zap, X, Settings, RefreshCw, CheckCircle, AlertTriangle, Plus, Trash2, MapPin, Camera, Search, Calendar, Star, Smartphone, Apple, Android, Activity, Edit } from 'lucide-react';

interface AppShortcut {
  id: string;
  title: string;
  description: string;
  icon: string;
  deepLink: string;
  enabled: boolean;
  usageCount: number;
  lastUsed: Date | null;
  platform: 'ios' | 'android' | 'both';
}

interface AppShortcutsProps {
  onCancel?: () => void;
  onAddShortcut?: (shortcut: Omit<AppShortcut, 'id' | 'usageCount' | 'lastUsed'>) => Promise<AppShortcut>;
  onRemoveShortcut?: (shortcutId: string) => Promise<void>;
  onUpdateShortcut?: (shortcutId: string, shortcut: Partial<AppShortcut>) => Promise<void>;
}

const DEFAULT_SHORTCUTS: AppShortcut[] = [
  {
    id: 'shortcut-1',
    title: 'Add Memory',
    description: 'Quickly add a new memory',
    icon: 'camera',
    deepLink: 'memorymap://memories/new',
    enabled: true,
    usageCount: 1250,
    lastUsed: new Date(),
    platform: 'both',
  },
  {
    id: 'shortcut-2',
    title: 'View Map',
    description: 'Open the memory map',
    icon: 'map',
    deepLink: 'memorymap://map',
    enabled: true,
    usageCount: 890,
    lastUsed: new Date(Date.now() - 3600000),
    platform: 'both',
  },
  {
    id: 'shortcut-3',
    title: 'Search',
    description: 'Search your memories',
    icon: 'search',
    deepLink: 'memorymap://search',
    enabled: true,
    usageCount: 5420,
    lastUsed: new Date(Date.now() - 86400000),
    platform: 'both',
  },
  {
    id: 'shortcut-4',
    title: 'Favorites',
    description: 'View favorite memories',
    icon: 'star',
    deepLink: 'memorymap://favorites',
    enabled: false,
    usageCount: 320,
    lastUsed: new Date(Date.now() - 86400000 * 7),
    platform: 'both',
  },
];

export default function AppShortcuts({ onCancel, onAddShortcut, onRemoveShortcut, onUpdateShortcut }: AppShortcutsProps) {
  const [shortcuts, setShortcuts] = useState<AppShortcut[]>(DEFAULT_SHORTCUTS);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedShortcut, setSelectedShortcut] = useState<AppShortcut | null>(null);

  const handleAdd = async (shortcut: Omit<AppShortcut, 'id' | 'usageCount' | 'lastUsed'>) => {
    if (onAddShortcut) {
      const newShortcut = await onAddShortcut(shortcut);
      setShortcuts(prev => [newShortcut, ...prev]);
    } else {
      const newShortcut: AppShortcut = {
        ...shortcut,
        id: `shortcut-${Date.now()}`,
        usageCount: 0,
        lastUsed: null,
      };
      setShortcuts(prev => [newShortcut, ...prev]);
    }
    setShowCreateModal(false);
  };

  const handleRemove = async (shortcutId: string) => {
    if (onRemoveShortcut) {
      await onRemoveShortcut(shortcutId);
    }
    setShortcuts(prev => prev.filter(s => s.id !== shortcutId));
  };

  const handleToggle = async (shortcutId: string) => {
    const shortcut = shortcuts.find(s => s.id === shortcutId);
    if (shortcut && onUpdateShortcut) {
      await onUpdateShortcut(shortcutId, { enabled: !shortcut.enabled });
    }
    setShortcuts(prev => prev.map(s => 
      s.id === shortcutId ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const getShortcutIcon = (icon: string) => {
    switch (icon) {
      case 'camera':
        return <Camera className="h-4 w-4" />;
      case 'map':
        return <MapPin className="h-4 w-4" />;
      case 'search':
        return <Search className="h-4 w-4" />;
      case 'star':
        return <Star className="h-4 w-4" />;
      case 'calendar':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const enabledShortcuts = shortcuts.filter(s => s.enabled).length;
  const totalUsage = shortcuts.reduce((sum, s) => sum + s.usageCount, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phím tắt app
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledShortcuts} shortcuts • {totalUsage.toLocaleString()} uses
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Tạo shortcut mới"
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt app shortcuts
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                iOS 3D Touch
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Android Long Press
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Max shortcuts
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300">4</span>
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
              3D Touch, Home Screen Quick Actions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Android className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              App Shortcuts, Long Press
            </span>
          </div>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Enabled</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledShortcuts}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Uses</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalUsage.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Platform</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            Both
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Active</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {shortcuts.length}
          </div>
        </div>
      </div>

      {/* App Shortcuts */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          App Shortcuts
        </h4>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg">
                    {getShortcutIcon(shortcut.icon)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {shortcut.title}
                    </span>
                    {shortcut.enabled && (
                      <CheckCircle className="h-3 w-3 text-green-500 inline ml-2" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggle(shortcut.id)}
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      shortcut.enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                        shortcut.enabled ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(shortcut.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3 text-slate-500" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {shortcut.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Uses</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {shortcut.usageCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Platform</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {shortcut.platform}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Used</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {shortcut.lastUsed ? new Date(shortcut.lastUsed).toLocaleDateString('vi-VN') : 'Never'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <span>Deep Link:</span>
                <code className="text-xs">{shortcut.deepLink}</code>
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
                Tạo App Shortcut
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
                  Title
                </label>
                <input
                  type="text"
                  placeholder="My Shortcut"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Quick action description"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Icon
                </label>
                <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
                  <option value="camera">Camera</option>
                  <option value="map">Map</option>
                  <option value="search">Search</option>
                  <option value="star">Star</option>
                  <option value="calendar">Calendar</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Deep Link
                </label>
                <input
                  type="text"
                  placeholder="memorymap://path"
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  Platform
                </label>
                <select className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
                  <option value="both">Both</option>
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                </select>
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
                      title: 'New Shortcut',
                      description: 'Quick action',
                      icon: 'star',
                      deepLink: 'memorymap://path',
                      enabled: true,
                      platform: 'both',
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Tạo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> App shortcuts hỗ trợ iOS 3D Touch, Home Screen Quick Actions, và Android App Shortcuts với deep linking.
        </p>
      </div>
    </div>
  );
}