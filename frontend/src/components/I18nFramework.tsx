'use client';

import { useState } from 'react';
import { CheckCircle, Code, FileText, Globe, Info, Languages, RefreshCw, Settings } from 'lucide-react';

interface I18nFrameworkProps {
  onCancel?: () => void;
}

interface TranslationKey {
  key: string;
  namespace: string;
  value: string;
}

interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  locale: string;
  direction: 'ltr' | 'rtl';
  isEnabled: boolean;
  isDefault: boolean;
  translationCount: number;
}

export default function I18nFramework({ onCancel }: I18nFrameworkProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('vi');
  const [selectedNamespace, setSelectedNamespace] = useState<string>('common');

  const [languages, setLanguages] = useState<LanguageConfig[]>([
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', locale: 'vi-VN', direction: 'ltr', isEnabled: true, isDefault: true, translationCount: 245 },
    { code: 'en', name: 'English', nativeName: 'English', locale: 'en-US', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 245 },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', locale: 'ja-JP', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 230 },
    { code: 'ko', name: 'Korean', nativeName: '한국어', locale: 'ko-KR', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 225 },
    { code: 'zh-CN', name: 'Chinese Simplified', nativeName: '简体中文', locale: 'zh-CN', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 240 },
    { code: 'zh-TW', name: 'Chinese Traditional', nativeName: '繁體中文', locale: 'zh-TW', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 235 },
    { code: 'fr', name: 'French', nativeName: 'Français', locale: 'fr-FR', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 220 },
    { code: 'es', name: 'Spanish', nativeName: 'Español', locale: 'es-ES', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 218 },
    { code: 'de', name: 'German', nativeName: 'Deutsch', locale: 'de-DE', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 215 },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', locale: 'pt-BR', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 210 },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', locale: 'th-TH', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 200 },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', locale: 'id-ID', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 205 },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', locale: 'ar-SA', direction: 'rtl', isEnabled: true, isDefault: false, translationCount: 195 },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', locale: 'hi-IN', direction: 'ltr', isEnabled: true, isDefault: false, translationCount: 190 },
  ]);

  const [namespaces] = useState(['common', 'auth', 'dashboard', 'memories', 'settings', 'errors']);

  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([
    { key: 'welcome', namespace: 'common', value: 'Welcome to Memory Map' },
    { key: 'login', namespace: 'auth', value: 'Login' },
    { key: 'logout', namespace: 'auth', value: 'Logout' },
    { key: 'dashboard', namespace: 'dashboard', value: 'Dashboard' },
    { key: 'memories', namespace: 'memories', value: 'Memories' },
    { key: 'settings', namespace: 'settings', value: 'Settings' },
  ]);

  const getCurrentLanguage = () => {
    return languages.find(l => l.code === selectedLanguage) || languages[0];
  };

  const currentLanguage = getCurrentLanguage();

  const toggleLanguage = (code: string) => {
    setLanguages(languages.map(lang => {
      if (lang.code === code) {
        return { ...lang, isEnabled: !lang.isEnabled };
      }
      return lang;
    }));
  };

  const setDefaultLanguage = (code: string) => {
    setLanguages(languages.map(lang => ({
      ...lang,
      isDefault: lang.code === code,
    })));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Languages className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              i18n Framework (next-intl)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Internationalization framework integration
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{languages.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Enabled</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{languages.filter(l => l.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Namespaces</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{namespaces.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Keys</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentLanguage.translationCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
          <select
            value={selectedNamespace}
            onChange={(e) => setSelectedNamespace(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {namespaces.map((ns) => (
              <option key={ns} value={ns}>{ns}</option>
            ))}
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Current Language: {currentLanguage.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Locale</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentLanguage.locale}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Direction</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white uppercase">
                {currentLanguage.direction}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Translation Keys</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentLanguage.translationCount}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Status</span>
              </div>
              <span className={`text-sm font-semibold ${currentLanguage.isEnabled ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {currentLanguage.isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Language Configurations</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-3 rounded-lg border text-left ${
                  selectedLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedLanguage === lang.code && <CheckCircle className="h-3 w-3 text-blue-500" />}
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{lang.name}</span>
                  {lang.isDefault && (
                    <span className="px-1 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      Default
                    </span>
                  )}
                  {lang.direction === 'rtl' && (
                    <span className="px-1 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      RTL
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{lang.nativeName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{lang.translationCount} keys</span>
                  <span className={`text-xs ${lang.isEnabled ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {lang.isEnabled ? '✓' : '✗'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Translation Keys ({selectedNamespace})</h4>
          <div className="space-y-2">
            {translationKeys.map((key) => (
              <div key={key.key} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-mono text-slate-900 dark:text-white">{key.key}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{key.value}</span>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">i18n Framework Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• next-intl provides server-side rendering support</li>
              <li>• Namespaces organize translations by feature</li>
              <li>• RTL languages require direction configuration</li>
              <li>• Default language falls back if translation missing</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
