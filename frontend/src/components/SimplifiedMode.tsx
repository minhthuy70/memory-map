'use client';

import { useState } from 'react';
import {
  BarChart3,
  CheckCircle,
  Eye,
  EyeOff,
  Focus,
  Info,
  Layers,
  Layout,
  MapPin,
  Maximize,
  Minimize,
  Plus,
  Settings,
  Smartphone,
  Zap
} from 'lucide-react';

interface SimplifiedModeProps {
  onCancel?: () => void;
}

interface SimplifiedSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'ui' | 'content' | 'navigation';
}

export default function SimplifiedMode({ onCancel }: SimplifiedModeProps) {
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [settings, setSettings] = useState<SimplifiedSetting[]>([
    {
      id: '1',
      name: 'Minimal Navigation',
      description: 'Hide advanced menu items',
      enabled: false,
      category: 'navigation',
    },
    {
      id: '2',
      name: 'Large Text',
      description: 'Increase font size for readability',
      enabled: false,
      category: 'ui',
    },
    {
      id: '3',
      name: 'High Contrast',
      description: 'Use high contrast colors',
      enabled: false,
      category: 'ui',
    },
    {
      id: '4',
      name: 'Hide Complex Features',
      description: 'Hide advanced options and settings',
      enabled: false,
      category: 'content',
    },
    {
      id: '5',
      name: 'Single Column Layout',
      description: 'Use single column instead of grid',
      enabled: false,
      category: 'ui',
    },
    {
      id: '6',
      name: 'Reduce Animations',
      description: 'Disable animations and transitions',
      enabled: false,
      category: 'ui',
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(settings.map(setting => {
      if (setting.id === id) {
        return { ...setting, enabled: !setting.enabled };
      }
      return setting;
    }));
  };

  const enabledCount = settings.filter(s => s.enabled).length;
  const totalCount = settings.length;

  const toggleSimplifiedMode = () => {
    setSimplifiedMode(!simplifiedMode);
    if (!simplifiedMode) {
      setSettings(settings.map(s => ({ ...s, enabled: true })));
    } else {
      setSettings(settings.map(s => ({ ...s, enabled: false })));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Minimize className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Simplified Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reduce complexity for easier use
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
        <div className={`p-4 rounded-lg border ${simplifiedMode ? 'bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${simplifiedMode ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {simplifiedMode ? <CheckCircle className="h-6 w-6 text-white" /> : <Layout className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {simplifiedMode ? 'Simplified Mode Active' : 'Simplified Mode Off'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {simplifiedMode ? 'Interface is simplified for easier navigation' : 'Full feature set available'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleSimplifiedMode}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${simplifiedMode ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {simplifiedMode ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Settings</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabledCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">UI Settings</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{settings.filter(s => s.category === 'ui').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Content Settings</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{settings.filter(s => s.category === 'content').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Navigation</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{settings.filter(s => s.category === 'navigation').length}</p>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Interface Preview</h4>
            <div className={`p-4 rounded-lg border ${simplifiedMode ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500'}`}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Layout className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Memory Dashboard</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Create Memory</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">View Map</p>
                </div>
                {simplifiedMode ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">Advanced options hidden</p>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Settings className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Settings</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                        <Layers className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Categories</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Simplified Settings</h4>
          <div className="space-y-2">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className={`p-4 rounded-lg border ${setting.enabled ? 'border-teal-300 dark:border-teal-600 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${setting.enabled ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      {setting.category === 'ui' ? <Layout className="h-4 w-4 text-white" /> : setting.category === 'content' ? <Layers className="h-4 w-4 text-white" /> : <Focus className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">{setting.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{setting.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSetting(setting.id)}
                    className={`p-1.5 rounded-lg transition-colors ${setting.enabled ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-700'}`}
                  >
                    {setting.enabled ? <CheckCircle className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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
              Simplified Mode Benefits
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Easier navigation for users with cognitive impairments</li>
            <li>• Reduced cognitive load with fewer options</li>
            <li>• Larger text and high contrast for readability</li>
            <li>• Single-column layout for simpler scanning</li>
            <li>• Fewer distractions from animations</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Usage Tips
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Enable all settings for maximum simplification</li>
            <li>• Individual settings can be toggled on/off</li>
            <li>• Mode applies globally across the app</li>
            <li>• Can be quickly toggled from settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
