'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  as,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Eye,
  FileText,
  Filter,
  Globe,
  History,
  Languages,
  RefreshCw,
  Scan,
  Settings,
  Zap,
  ZapIcon
} from 'lucide-react';

interface Translation {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  translatedAt: Date;
  processingTime: number;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

interface TranslationProps {
  onCancel?: () => void;
  onTranslate?: (sourceText: string, sourceLang: string, targetLang: string) => Promise<void>;
}

const LANGUAGES: Language[] = [
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
];

const DEFAULT_TRANSLATIONS: Translation[] = [
  {
    id: 'trans-1',
    sourceText: 'Chuyến đi Đà Lạt thật tuyệt vời',
    targetText: 'The trip to Da Lat was amazing',
    sourceLanguage: 'Vietnamese',
    targetLanguage: 'English',
    confidence: 0.95,
    translatedAt: new Date('2024-01-12'),
    processingTime: 0.8,
  },
  {
    id: 'trans-2',
    sourceText: 'Bữa tối gia đình',
    targetText: 'Family dinner',
    sourceLanguage: 'Vietnamese',
    targetLanguage: 'English',
    confidence: 0.92,
    translatedAt: new Date('2024-01-10'),
    processingTime: 0.6,
  },
];

export default function Translation({ onCancel, onTranslate }: TranslationProps) {
  const [translations, setTranslations] = useState<Translation[]>(DEFAULT_TRANSLATIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('vi');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);
  const [copied, setCopied] = useState(false);

  const totalTranslations = translations.length;
  const avgConfidence = translations.reduce((sum, t) => sum + t.confidence, 0) / totalTranslations;
  const avgProcessingTime = translations.reduce((sum, t) => sum + t.processingTime, 0) / totalTranslations;

  const getLanguageFlag = (code: string) => {
    const lang = LANGUAGES.find(l => l.code === code);
    return lang?.flag || '🌐';
  };

  const getLanguageName = (code: string) => {
    const lang = LANGUAGES.find(l => l.code === code);
    return lang?.name || code;
  };

  const handleTranslate = async () => {
    if (sourceText.trim()) {
      setIsTranslating(true);
      await onTranslate?.(sourceText, sourceLanguage, targetLanguage);
      setTargetText('Translated text...');
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(targetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
    if (targetText) {
      setSourceText(targetText);
      setTargetText(sourceText);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Languages className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Dịch thuật
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalTranslations} translations
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt translation
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect source language
              </span>
              <button
                type="button"
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetect ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoDetect ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Save translation history
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Confidence display
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
            <Languages className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Translations</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalTranslations}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Languages</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {LANGUAGES.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ZapIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgProcessingTime.toFixed(1)}s
          </div>
        </div>
      </div>

      {/* Translation Interface */}
      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Nhập văn bản để dịch..."
              className="w-full px-4 py-3 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={5}
            />
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={handleSwapLanguages}
              className="p-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-full transition-colors"
              title="Swap languages"
            >
              <ArrowRight className="h-5 w-5 text-blue-500" />
            </button>
          </div>

          {/* Target */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>
            <textarea
              value={targetText}
              readOnly
              placeholder="Kết quả dịch sẽ hiển thị ở đây..."
              className="w-full px-4 py-3 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 resize-none"
              rows={5}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleTranslate}
            disabled={!sourceText.trim() || isTranslating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${isTranslating ? 'animate-spin' : ''}`} />
            {isTranslating ? 'Translating...' : 'Languages'}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!targetText}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Translation History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Translation History
        </h4>
        <div className="space-y-2">
          {translations.map((translation) => (
            <div
              key={translation.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {getLanguageFlag(translation.sourceLanguage)} {getLanguageName(translation.sourceLanguage)}
                      {' '}→{' '}
                      {getLanguageFlag(translation.targetLanguage)} {getLanguageName(translation.targetLanguage)}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {(translation.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {translation.translatedAt.toLocaleDateString('vi-VN')}
                </span>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Source</div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {translation.sourceText}
                </p>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Target</div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {translation.targetText}
                </p>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Time: {translation.processingTime}s
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Dịch thuật sử dụng AI để dịch nội dung sang các ngôn ngữ khác với 8 supported languages (Vietnamese/English/French/German/Japanese/Korean/Chinese/Spanish), language swap functionality, translation history, confidence scoring, auto-detect source language, copy translation, và processing time tracking.
        </p>
      </div>
    </div>
  );
}