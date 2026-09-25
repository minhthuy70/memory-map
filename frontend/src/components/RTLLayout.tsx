'use client';

import { useState } from 'react';
import { AlignLeft, ArrowLeftRight, CheckCircle, Eye, Globe, Info, RefreshCw } from 'lucide-react';

interface RTLLayoutProps {
  onCancel?: () => void;
}

interface RTLConfig {
  locale: string;
  name: string;
  region: string;
  direction: 'ltr' | 'rtl';
  language: string;
  isActive: boolean;
}

export default function RTLLayout({ onCancel }: RTLLayoutProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState<string>('ar-SA');
  const [previewRTL, setPreviewRTL] = useState(true);

  const [rtlConfigs, setRtlConfigs] = useState<RTLConfig[]>([
    { locale: 'ar-SA', name: 'Arabic', region: 'Saudi Arabia', direction: 'rtl', language: 'العربية', isActive: true },
    { locale: 'he-IL', name: 'Hebrew', region: 'Israel', direction: 'rtl', language: 'עברית', isActive: false },
    { locale: 'fa-IR', name: 'Persian', region: 'Iran', direction: 'rtl', language: 'فارسی', isActive: false },
    { locale: 'ur-PK', name: 'Urdu', region: 'Pakistan', direction: 'rtl', language: 'اردو', isActive: false },
    { locale: 'vi-VN', name: 'Vietnamese', region: 'Vietnam', direction: 'ltr', language: 'Tiếng Việt', isActive: false },
    { locale: 'en-US', name: 'English', region: 'United States', direction: 'ltr', language: 'English', isActive: false },
    { locale: 'ja-JP', name: 'Japanese', region: 'Japan', direction: 'ltr', language: '日本語', isActive: false },
  ]);

  const getCurrentConfig = () => {
    return rtlConfigs.find(c => c.locale === selectedLocale) || rtlConfigs[0];
  };

  const currentConfig = getCurrentConfig();

  const toggleRTL = (locale: string) => {
    setRtlConfigs(rtlConfigs.map(config => {
      if (config.locale === locale) {
        return { ...config, isActive: !config.isActive };
      }
      return config;
    }));
  };

  const sampleTextRTL = 'مرحباً بالعالم! هذا نص تجريبي باللغة العربية لعرض التخطيط من اليمين إلى اليسار.';
  const sampleTextLTR = 'Hello World! This is sample text in English for left-to-right layout display.';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <AlignLeft className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Right-to-Left (RTL) Layout
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              RTL layout support for Arabic
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Languages</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{rtlConfigs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">RTL Languages</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{rtlConfigs.filter(c => c.direction === 'rtl').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active RTL</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{rtlConfigs.filter(c => c.direction === 'rtl' && c.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentConfig.name}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLocale}
            onChange={(e) => setSelectedLocale(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {rtlConfigs.map((config) => (
              <option key={config.locale} value={config.locale}>
                {config.name} ({config.region})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setPreviewRTL(!previewRTL)}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${
              previewRTL
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Eye className="h-3 w-3" />
            {previewRTL ? 'RTL Mode' : 'LTR Mode'}
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Layout Preview: {currentConfig.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Direction</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white uppercase">
                {currentConfig.direction}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Language</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentConfig.language}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Active</span>
              </div>
              <span className={`text-sm font-semibold ${currentConfig.isActive ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {currentConfig.isActive ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Text Preview</h4>
          <div
            className={`p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 ${
              previewRTL && currentConfig.direction === 'rtl' ? 'rtl' : 'ltr'
            }`}
            dir={previewRTL && currentConfig.direction === 'rtl' ? 'rtl' : 'ltr'}
          >
            <p className="text-sm text-slate-900 dark:text-white">
              {previewRTL && currentConfig.direction === 'rtl' ? sampleTextRTL : sampleTextLTR}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Language Configurations</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {rtlConfigs.map((config) => (
              <button
                key={config.locale}
                type="button"
                onClick={() => setSelectedLocale(config.locale)}
                className={`p-3 rounded-lg border text-left ${
                  selectedLocale === config.locale
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedLocale === config.locale && <CheckCircle className="h-3 w-3 text-blue-500" />}
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{config.name}</span>
                  {config.direction === 'rtl' && (
                    <span className="px-1 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      RTL
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{config.region}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{config.language}</p>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">RTL Layout Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Arabic and Hebrew require RTL layout</li>
              <li>• RTL mirrors UI elements horizontally</li>
              <li>• Text direction affects alignment and spacing</li>
              <li>• Mix RTL and LTR text with care</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
