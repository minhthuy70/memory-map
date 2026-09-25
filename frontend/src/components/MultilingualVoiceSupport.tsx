'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  CheckSquare,
  Clock,
  Download,
  ExternalLink,
  Filter,
  Globe,
  Languages,
  MessageSquare,
  Mic,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  SettingsIcon,
  Sparkles,
  Square,
  StopCircle,
  Trash2,
  TrashIcon,
  Volume2,
  Zap,
  ZapIcon
} from 'lucide-react';

interface VoiceLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isEnabled: boolean;
  confidence: number;
  usageCount: number;
}

interface MultilingualVoiceSupportProps {
  onCancel?: () => void;
  onLanguageToggle?: (languageCode: string) => Promise<void>;
  onDetectLanguage?: (audio: string) => Promise<string>;
}

const DEFAULT_LANGUAGES: VoiceLanguage[] = [
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    isEnabled: true,
    confidence: 0.95,
    usageCount: 45,
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    isEnabled: true,
    confidence: 0.92,
    usageCount: 32,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    isEnabled: false,
    confidence: 0.88,
    usageCount: 12,
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    isEnabled: false,
    confidence: 0.85,
    usageCount: 8,
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    isEnabled: false,
    confidence: 0.87,
    usageCount: 5,
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    isEnabled: false,
    confidence: 0.90,
    usageCount: 15,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    isEnabled: false,
    confidence: 0.91,
    usageCount: 10,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    isEnabled: false,
    confidence: 0.89,
    usageCount: 7,
  },
];

export default function MultilingualVoiceSupport({ onCancel, onLanguageToggle, onDetectLanguage }: MultilingualVoiceSupportProps) {
  const [languages, setLanguages] = useState<VoiceLanguage[]>(DEFAULT_LANGUAGES);
  const [showSettings, setShowSettings] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [autoDetect, setAutoDetect] = useState(true);
  const [fallbackLanguage, setFallbackLanguage] = useState('en');

  const enabledLanguages = languages.filter(l => l.isEnabled);
  const totalLanguages = languages.length;
  const avgConfidence = languages.reduce((sum, l) => sum + l.confidence, 0) / totalLanguages;
  const totalUsage = languages.reduce((sum, l) => sum + l.usageCount, 0);

  const handleToggleLanguage = async (languageCode: string) => {
    await onLanguageToggle?.(languageCode);
    setLanguages(languages.map(l => 
      l.code === languageCode ? { ...l, isEnabled: !l.isEnabled } : l
    ));
  };

  const handleDetectLanguage = async () => {
    setIsDetecting(true);
    const detected = await onDetectLanguage?.('sample-audio') || 'vi';
    setTimeout(() => {
      setIsDetecting(false);
      setDetectedLanguage(detected);
    }, 1500);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.7) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Languages className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hỗ trợ nhiều ngôn ngữ cho giọng nói
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {enabledLanguages.length}/{totalLanguages} enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt multilingual voice support
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect language
              </span>
              <button
                type="button"
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetect ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoDetect ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Fallback language
              </label>
              <select
                value={fallbackLanguage}
                onChange={(e) => setFallbackLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Language switching hints
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Languages</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalLanguages}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Enabled</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledLanguages.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Usage</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalUsage}
          </div>
        </div>
      </div>

      {/* Language Detection */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Language Detection
            </span>
            {autoDetect && (
              <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                Auto-detect enabled
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleDetectLanguage}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isDetecting ? (
              <>
                <Activity className="h-4 w-4 animate-spin" />
                Detecting...
              </>
            ) : (
              <>
                <Languages className="h-4 w-4" />
                Detect Language from Audio
              </>
            )}
          </button>

          {detectedLanguage && (
            <div className="mt-3 p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {languages.find(l => l.code === detectedLanguage)?.flag}
                </span>
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {languages.find(l => l.code === detectedLanguage)?.name}
                  </span>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Detected from audio input
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Supported Languages
        </h4>
        <div className="space-y-2">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`p-4 rounded-lg border-2 ${
                language.isEnabled
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{language.flag}</span>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {language.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {language.nativeName} • {language.code.toUpperCase()}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleLanguage(language.code)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    language.isEnabled ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      language.isEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className={`text-xs ${getConfidenceColor(language.confidence)}`}>
                    {(language.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Usage</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {language.usageCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Status</div>
                  <div className={`text-xs ${language.isEnabled ? 'text-green-500' : 'text-slate-500'}`}>
                    {language.isEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Usage Statistics
        </h4>
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="space-y-2">
            {languages
              .sort((a, b) => b.usageCount - a.usageCount)
              .slice(0, 5)
              .map((language) => (
                <div key={language.code} className="flex items-center gap-3">
                  <span className="text-xl">{language.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-700 dark:text-slate-300">
                        {language.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {language.usageCount} ({((language.usageCount / totalUsage) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all"
                        style={{ width: `${(language.usageCount / totalUsage) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Hỗ trợ nhiều ngôn ngữ cho giọng nói với 8 supported languages (Vietnamese/English/French/Japanese/Korean/Chinese/Spanish/German), language detection from audio, auto-detect toggle, fallback language selection, enable/disable per language, confidence scoring, usage statistics tracking, và comprehensive multilingual voice support system.
        </p>
      </div>
    </div>
  );
}