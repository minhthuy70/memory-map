'use client';

import { useState, useEffect } from 'react';
import { Check, CheckCircle, Globe, Info, Languages, RefreshCw, Settings } from 'lucide-react';

interface LanguageAutoDetectionProps {
  onCancel?: () => void;
}

interface DetectedLanguage {
  code: string;
  name: string;
  nativeName: string;
  confidence: number;
  isSupported: boolean;
}

interface BrowserInfo {
  language: string;
  languages: string[];
  userAgent: string;
}

export default function LanguageAutoDetection({ onCancel }: LanguageAutoDetectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('vi-VN');
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);

  const [detectedLanguages, setDetectedLanguages] = useState<DetectedLanguage[]>([
    { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt', confidence: 0.95, isSupported: true },
    { code: 'en-US', name: 'English', nativeName: 'English', confidence: 0.85, isSupported: true },
    { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', confidence: 0.75, isSupported: true },
    { code: 'ko-KR', name: 'Korean', nativeName: '한국어', confidence: 0.70, isSupported: true },
    { code: 'zh-CN', name: 'Chinese Simplified', nativeName: '简体中文', confidence: 0.65, isSupported: true },
    { code: 'fr-FR', name: 'French', nativeName: 'Français', confidence: 0.60, isSupported: true },
    { code: 'de-DE', name: 'German', nativeName: 'Deutsch', confidence: 0.55, isSupported: true },
    { code: 'es-ES', name: 'Spanish', nativeName: 'Español', confidence: 0.50, isSupported: true },
    { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', confidence: 0.45, isSupported: true },
    { code: 'th-TH', name: 'Thai', nativeName: 'ไทย', confidence: 0.40, isSupported: true },
    { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia', confidence: 0.35, isSupported: true },
    { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', confidence: 0.30, isSupported: true },
    { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', confidence: 0.25, isSupported: true },
  ]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBrowserInfo({
        language: navigator.language,
        languages: navigator.languages,
        userAgent: navigator.userAgent,
      });
    }
  }, []);

  const getCurrentLanguage = () => {
    return detectedLanguages.find(l => l.code === selectedLanguage) || detectedLanguages[0];
  };

  const currentLanguage = getCurrentLanguage();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (confidence >= 0.5) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  const detectLanguage = () => {
    if (browserInfo) {
      const browserLang = browserInfo.language;
      const matched = detectedLanguages.find(l => l.code === browserLang || l.code.startsWith(browserLang.split('-')[0]));
      if (matched) {
        setSelectedLanguage(matched.code);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Language Auto-Detection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-detect browser language
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {autoDetect && (
            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded flex items-center gap-1">
              <Check className="h-3 w-3" />
              Auto-detect On
            </span>
          )}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{detectedLanguages.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Supported</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{detectedLanguages.filter(l => l.isSupported).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentLanguage.name}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Confidence</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{Math.round(currentLanguage.confidence * 100)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Auto-detect</span>
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            disabled={autoDetect}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 disabled:opacity-50"
          >
            {detectedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={detectLanguage}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Detect
          </button>
        </div>

        {browserInfo && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Browser Information</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">Primary Language</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {browserInfo.language}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-slate-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">All Languages</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {browserInfo.languages.join(', ')}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detected Languages</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {detectedLanguages.map((lang) => (
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
                  {lang.isSupported && (
                    <span className="px-1 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{lang.nativeName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${getConfidenceColor(lang.confidence)}`}>
                    {Math.round(lang.confidence * 100)}%
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{lang.code}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Language Detection Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Browser sends Accept-Language header</li>
              <li>• Detection based on browser settings</li>
              <li>• Users can override auto-detected language</li>
              <li>• Confidence score indicates detection certainty</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
