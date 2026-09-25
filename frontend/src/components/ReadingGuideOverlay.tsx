'use client';

import { useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BarChart3,
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
  Focus,
  Info,
  Minus,
  Plus,
  Ruler,
  Settings,
  Smartphone,
  Zap
} from 'lucide-react';

interface ReadingGuideOverlayProps {
  onCancel?: () => void;
}

interface GuideSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value: number;
  min: number;
  max: number;
  unit: string;
}

export default function ReadingGuideOverlay({ onCancel }: ReadingGuideOverlayProps) {
  const [guideEnabled, setGuideEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [settings, setSettings] = useState<GuideSetting[]>([
    {
      id: '1',
      name: 'Guide Height',
      description: 'Height of the reading guide line',
      enabled: false,
      value: 2,
      min: 1,
      max: 5,
      unit: 'lines',
    },
    {
      id: '2',
      name: 'Guide Opacity',
      description: 'Transparency of the guide overlay',
      enabled: false,
      value: 30,
      min: 10,
      max: 80,
      unit: '%',
    },
    {
      id: '3',
      name: 'Guide Color',
      description: 'Color of the reading guide',
      enabled: false,
      value: 1,
      min: 1,
      max: 5,
      unit: '',
    },
    {
      id: '4',
      name: 'Auto-follow',
      description: 'Guide follows cursor/scroll automatically',
      enabled: false,
      value: 1,
      min: 0,
      max: 1,
      unit: '',
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

  const updateSettingValue = (id: string, value: number) => {
    setSettings(settings.map(setting => {
      if (setting.id === id) {
        return { ...setting, value };
      }
      return setting;
    }));
  };

  const enabledCount = settings.filter(s => s.enabled).length;
  const totalCount = settings.length;

  const colorOptions = ['Yellow', 'Blue', 'Green', 'Pink', 'Orange'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Reading Guide Overlay
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Help focus on current reading line
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
        <div className={`p-4 rounded-lg border ${guideEnabled ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-200 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${guideEnabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {guideEnabled ? <CheckCircle className="h-6 w-6 text-white" /> : <Eye className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {guideEnabled ? 'Reading Guide Active' : 'Reading Guide Off'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {guideEnabled ? 'Guide overlay is visible on text' : 'Guide overlay is hidden'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGuideEnabled(!guideEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${guideEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {guideEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Settings</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabledCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Guide Height</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{settings[0].value} lines</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Opacity</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{settings[1].value}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Auto-follow</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{settings[3].value ? 'On' : 'Off'}</p>
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Reading Guide Preview</h4>
            <div className="relative p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                This is a sample text to demonstrate the reading guide overlay.
                The guide helps focus on the current line being read.
              </p>
              {guideEnabled && (
                <div
                  className="absolute left-0 right-0 border-t-2 border-b-2 bg-yellow-200 dark:bg-yellow-900/30"
                  style={{
                    top: '40%',
                    height: `${settings[0].value * 20}px`,
                    opacity: settings[1].value / 100,
                    backgroundColor: colorOptions[settings[2].value - 1].toLowerCase(),
                  }}
                />
              )}
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Users with dyslexia or reading difficulties often benefit from this feature.
                It reduces line skipping and improves reading comprehension.
              </p>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Guide Settings</h4>
          <div className="space-y-2">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className={`p-4 rounded-lg border ${setting.enabled ? 'border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${setting.enabled ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <Ruler className="h-4 w-4 text-white" />
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
                {setting.enabled && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateSettingValue(setting.id, Math.max(setting.min, setting.value - 1))}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                    >
                      <Minus className="h-4 w-4 text-slate-500" />
                    </button>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all"
                        style={{ width: `${((setting.value - setting.min) / (setting.max - setting.min)) * 100}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettingValue(setting.id, Math.min(setting.max, setting.value + 1))}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                    >
                      <Plus className="h-4 w-4 text-slate-500" />
                    </button>
                    <span className="text-xs text-slate-500 dark:text-slate-400 w-12 text-right">
                      {setting.value}{setting.unit}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Reading Guide Benefits
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Helps users with dyslexia track reading position</li>
            <li>• Reduces line skipping and re-reading</li>
            <li>• Improves reading comprehension and focus</li>
            <li>• Customizable height, color, and opacity</li>
            <li>• Auto-follows cursor for seamless reading</li>
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
            <li>• Yellow guide is recommended for most users</li>
            <li>• Adjust opacity to balance visibility and distraction</li>
            <li>• Higher guide height for longer text lines</li>
            <li>• Enable auto-follow for hands-free reading</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
