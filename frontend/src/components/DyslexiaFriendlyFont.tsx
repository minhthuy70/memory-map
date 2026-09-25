'use client';

import { useState } from 'react';
import { Type as TypeIcon, X, CheckCircle, Settings, Info, BarChart3, Smartphone, Eye, EyeOff, Minus, Plus, Zap, Focus, BookOpen } from 'lucide-react';

interface DyslexiaFriendlyFontProps {
  onCancel?: () => void;
}

interface FontSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  value: number;
  min: number;
  max: number;
  unit: string;
}

export default function DyslexiaFriendlyFont({ onCancel }: DyslexiaFriendlyFontProps) {
  const [fontEnabled, setFontEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [settings, setSettings] = useState<FontSetting[]>([
    {
      id: '1',
      name: 'Font Size',
      description: 'Base font size for all text',
      enabled: false,
      value: 18,
      min: 14,
      max: 24,
      unit: 'px',
    },
    {
      id: '2',
      name: 'Letter Spacing',
      description: 'Space between letters',
      enabled: false,
      value: 1,
      min: 0,
      max: 3,
      unit: 'px',
    },
    {
      id: '3',
      name: 'Line Height',
      description: 'Space between lines of text',
      enabled: false,
      value: 1.6,
      min: 1.2,
      max: 2.2,
      unit: '',
    },
    {
      id: '4',
      name: 'Word Spacing',
      description: 'Space between words',
      enabled: false,
      value: 1,
      min: 0,
      max: 2,
      unit: 'px',
    },
  ]);

  const [selectedFont, setSelectedFont] = useState('OpenDyslexic');

  const fonts = [
    { id: 'OpenDyslexic', name: 'OpenDyslexic', description: 'Designed for readability' },
    { id: 'Arial', name: 'Arial', description: 'Standard sans-serif font' },
    { id: 'Verdana', name: 'Verdana', description: 'Wide, easy to read' },
    { id: 'Comic Sans', name: 'Comic Sans MS', description: 'Informal, distinctive' },
  ];

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

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Type className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Dyslexia-Friendly Font
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Optimize typography for dyslexic users
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
        <div className={`p-4 rounded-lg border ${fontEnabled ? 'bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${fontEnabled ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {fontEnabled ? <CheckCircle className="h-6 w-6 text-white" /> : <BookOpen className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {fontEnabled ? 'Dyslexia Font Active' : 'Dyslexia Font Off'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {fontEnabled ? 'Using optimized typography settings' : 'Using default typography'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFontEnabled(!fontEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${fontEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {fontEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active Settings</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enabledCount}/{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Font Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{settings[0].value}px</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Line Height</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{settings[2].value}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected Font</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{selectedFont}</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Font Selection</h4>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map((font) => (
              <button
                key={font.id}
                onClick={() => setSelectedFont(font.id)}
                className={`p-3 rounded-lg border-2 text-left ${selectedFont === font.id ? 'border-pink-300 dark:border-pink-600 bg-pink-50 dark:bg-pink-900/20' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'}`}
              >
                <p className="font-semibold text-slate-900 dark:text-white text-sm" style={{ fontFamily: font.id }}>
                  {font.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{font.description}</p>
              </button>
            ))}
          </div>
        </div>

        {showPreview && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Text Preview</h4>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <p
                className="text-slate-900 dark:text-white"
                style={{
                  fontFamily: selectedFont,
                  fontSize: `${settings[0].value}px`,
                  letterSpacing: `${settings[1].value}px`,
                  lineHeight: settings[2].value,
                  wordSpacing: `${settings[3].value}px`,
                }}
              >
                This is a sample text to demonstrate the dyslexia-friendly font settings.
                OpenDyslexic is designed to make reading easier for people with dyslexia.
                The unique letter shapes help distinguish between similar letters like b, d, p, and q.
              </p>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Typography Settings</h4>
          <div className="space-y-2">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className={`p-4 rounded-lg border ${setting.enabled ? 'border-pink-300 dark:border-pink-600 bg-white dark:bg-slate-800' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/30'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${setting.enabled ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <TypeIcon className="h-4 w-4 text-white" />
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
                      onClick={() => updateSettingValue(setting.id, Math.max(setting.min * 10, setting.value * 10 - 1) / 10)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded"
                    >
                      <Minus className="h-4 w-4 text-slate-500" />
                    </button>
                    <div className="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${((setting.value - setting.min) / (setting.max - setting.min)) * 100}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => updateSettingValue(setting.id, Math.min(setting.max * 10, setting.value * 10 + 1) / 10)}
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
              Dyslexia-Friendly Benefits
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• OpenDyslexic has unique letter shapes to reduce confusion</li>
            <li>• Increased letter spacing improves readability</li>
            <li>• Larger line height prevents line skipping</li>
            <li>• Optimized spacing reduces reading fatigue</li>
            <li>• Helps users with visual processing difficulties</li>
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
            <li>• OpenDyslexic is recommended for dyslexic users</li>
            <li>• Font size 18-20px is optimal for most readers</li>
            <li>• Line height 1.6-1.8 improves readability</li>
            <li>• Letter spacing of 1-2px reduces letter confusion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
