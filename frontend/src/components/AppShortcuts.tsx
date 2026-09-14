'use client';

import { useState } from 'react';
import { Zap, X, Plus, Trash2, RefreshCw, Clock, CheckCircle, Settings, Info, BarChart3, Smartphone, GripVertical, Edit, ExternalLink, MoreVertical, Star, Heart, MapPin, Camera, Calendar, Search } from 'lucide-react';

interface AppShortcutsProps {
  onCancel?: () => void;
}

interface Shortcut {
  id: string;
  name: string;
  icon: string;
  deepLink: string;
  enabled: boolean;
  position: number;
  isCustom: boolean;
  usageCount: number;
}

export default function AppShortcuts({ onCancel }: AppShortcutsProps) {
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showUsage, setShowUsage] = useState(false);

  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    {
      id: '1',
      name: 'Create Memory',
      icon: 'plus',
      deepLink: '/memories/create',
      enabled: true,
      position: 1,
      isCustom: false,
      usageCount: 45,
    },
    {
      id: '2',
      name: 'Quick Search',
      icon: 'search',
      deepLink: '/search',
      enabled: true,
      position: 2,
      isCustom: false,
      usageCount: 32,
    },
    {
      id: '3',
      name: 'Recent Photos',
      icon: 'camera',
      deepLink: '/photos/recent',
      enabled: true,
      position: 3,
      isCustom: false,
      usageCount: 28,
    },
    {
      id: '4',
      name: 'My Locations',
      icon: 'mapPin',
      deepLink: '/locations',
      enabled: true,
      position: 4,
      isCustom: false,
      usageCount: 15,
    },
    {
      id: '5',
      name: 'Today\'s Memories',
      icon: 'calendar',
      deepLink: '/memories/today',
      enabled: false,
      position: 5,
      isCustom: false,
      usageCount: 0,
    },
    {
      id: '6',
      name: 'Favorites',
      icon: 'heart',
      deepLink: '/favorites',
      enabled: false,
      position: 6,
      isCustom: true,
      usageCount: 0,
    },
  ]);

  const getShortcutIcon = (icon: string) => {
    switch (icon) {
      case 'plus': return <Plus className="h-5 w-5" />;
      case 'search': return <Search className="h-5 w-5" />;
      case 'camera': return <Camera className="h-5 w-5" />;
      case 'mapPin': return <MapPin className="h-5 w-5" />;
      case 'calendar': return <Calendar className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      default: return <Zap className="h-5 w-5" />;
    }
  };

  const toggleShortcut = (id: string) => {
    setShortcuts(shortcuts.map(shortcut => {
      if (shortcut.id === id) {
        return { ...shortcut, enabled: !shortcut.enabled };
      }
      return shortcut;
    }));
  };

  const deleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(shortcut => shortcut.id !== id));
  };

  const reorderShortcut = (id: string, direction: 'up' | 'down') => {
    const currentIndex = shortcuts.findIndex(s => s.id === id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < shortcuts.length) {
      const newShortcuts = [...shortcuts];
      [newShortcuts[currentIndex], newShortcuts[newIndex]] = [newShortcuts[newIndex], newShortcuts[currentIndex]];
      newShortcuts.forEach((shortcut, index) => shortcut.position = index + 1);
      setShortcuts(newShortcuts);
    }
  };

  const enabledCount = shortcuts.filter(s => s.enabled).length;
  const totalCount = shortcuts.length;
  const totalUsage = shortcuts.reduce((sum, s) => sum + s.usageCount, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              App Shortcuts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Quick access to common actions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditMode(!editMode)}
            className={`p-2 rounded-lg transition-colors ${editMode ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            title={editMode ? 'Exit edit mode' : 'Edit shortcuts'}
          >
            {editMode ? <CheckCircle className="h-4 w-4" /> : <Edit className="h-4 w-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={() => setShowUsage(!showUsage)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show usage"
          >
            {showUsage ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className={`p-4 rounded-lg border ${shortcutsEnabled ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${shortcutsEnabled ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {shortcutsEnabled ? 'Shortcuts Enabled' : 'Shortcuts Disabled'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {shortcutsEnabled ? 'Quick access from home screen' : 'Shortcuts hidden from home screen'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShortcutsEnabled(!shortcutsEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${shortcutsEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {shortcutsEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabledCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Custom</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{shortcuts.filter(s => s.isCustom).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Usage</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{totalUsage}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Edit Mode</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{editMode ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-yellow-500 text-white border-0 flex items-center gap-1 hover:bg-yellow-600 transition-colors"
          >
            <Plus className="h-3 w-3" />
            Add Shortcut
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Reset to Default
          </button>
        </div>

        {showUsage && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Usage Statistics</h4>
            <div className="space-y-2">
              {shortcuts
                .filter(s => s.usageCount > 0)
                .sort((a, b) => b.usageCount - a.usageCount)
                .map((shortcut) => (
                  <div key={shortcut.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getShortcutIcon(shortcut.icon)}
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{shortcut.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{shortcut.usageCount} uses</p>
                      <div className="w-16 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${(shortcut.usageCount / totalUsage) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Home Screen Shortcuts</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {shortcuts.map((shortcut) => (
              <div
                key={shortcut.id}
                className={`p-4 rounded-lg border-2 ${shortcut.enabled ? 'border-yellow-300 dark:border-yellow-600 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30 opacity-60'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${shortcut.enabled ? 'bg-yellow-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    {getShortcutIcon(shortcut.icon)}
                  </div>
                  {editMode && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => reorderShortcut(shortcut.id, 'up')}
                        disabled={shortcut.position === 1}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                      >
                        <ExternalLink className="h-3 w-3 text-slate-500 rotate-[-45deg]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => reorderShortcut(shortcut.id, 'down')}
                        disabled={shortcut.position === shortcuts.length}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                      >
                        <ExternalLink className="h-3 w-3 text-slate-500 rotate-45" />
                      </button>
                      {shortcut.isCustom && (
                        <button
                          type="button"
                          onClick={() => deleteShortcut(shortcut.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{shortcut.name}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${shortcut.isCustom ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                    {shortcut.isCustom ? 'Custom' : 'Default'}
                  </span>
                  {shortcut.usageCount > 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">{shortcut.usageCount} uses</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Shortcut Configuration
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Deep links navigate directly to app screens</li>
            <li>• Reorder shortcuts by dragging or using arrows</li>
            <li>• Create custom shortcuts for any app screen</li>
            <li>• Toggle visibility without deleting</li>
            <li>• Track usage to optimize your shortcuts</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Platform Notes
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• iOS: Shortcuts appear in 3D Touch menu</li>
            <li>• Android: Shortcuts appear in app launcher</li>
            <li>• Maximum 4 shortcuts on home screen</li>
            <li>• Custom icons require app update</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
