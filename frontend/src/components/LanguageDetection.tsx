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
  Clock,
  Eye,
  FileText,
  Filter,
  FilterIcon,
  Globe,
  Languages,
  MessageSquare,
  RefreshCw,
  Scan,
  Settings,
  Sparkles,
  Zap,
  ZapIcon
} from 'lucide-react';

interface DetectedLanguage {
  id: string;
  language: string;
  code: string;
  confidence: number;
  sampleText: string;
  detectedAt: Date;
}

interface DetectionResult {
  textId: string;
  textSample: string;
  detectedLanguage: string;
  confidence: number;
  detectedAt: Date;
  processingTime: number;
}

interface LanguageDetectionProps {
  onCancel?: () => void;
  onDetectLanguage?: (text: string) => Promise<void>;
}

const SUPPORTED_LANGUAGES = [
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
];

const DEFAULT_RESULTS: DetectionResult[] = [
  {
    textId: 'text-1',
    textSample: 'Chuyến đi Đà Lạt thật tuyệt vời',
    detectedLanguage: 'Vietnamese',
    confidence: 0.98,
    detectedAt: new Date('2024-01-12'),
    processingTime: 0.3,
  },
  {
    textId: 'text-2',
    textSample: 'The trip to Da Lat was amazing',
    detectedLanguage: 'English',
    confidence: 0.95,
    detectedAt: new Date('2024-01-10'),
    processingTime: 0.2,
  },
];

export default function LanguageDetection({ onCancel, onDetectLanguage }: LanguageDetectionProps) {
  const [results, setResults] = useState<DetectionResult[]>(DEFAULT_RESULTS);
  const [showSettings, setShowSettings] = useState(false);
  const [inputText, setInputText] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.8);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [isDetecting, setIsDetecting] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);

  const totalDetections = results.length;
  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / totalDetections;
  const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / totalDetections;

  const getLanguageFlag = (language: string) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.name === language);
    return lang?.flag || '🌐';
  };

  const handleDetect = async () => {
    if (inputText.trim()) {
      setIsDetecting(true);
      await onDetectLanguage?.(inputText);
      setIsDetecting(false);
    }
  };

  const filteredResults = results.filter(r => 
    r.confidence >= confidenceThreshold &&
    (selectedLanguage === 'all' || r.detectedLanguage === selectedLanguage)
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phát hiện ngôn ngữ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalDetections} detections
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
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt language detection
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Confidence threshold: {(confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect on input
              </span>
              <button
                type="button"
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetect ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Supported languages
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                {SUPPORTED_LANGUAGES.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Detections</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalDetections}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Languages className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Languages</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {Array.from(new Set(results.map(r => r.detectedLanguage))).length}
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
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgProcessingTime.toFixed(2)}s
          </div>
        </div>
      </div>

      {/* Input Field */}
      <div className="mb-4">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập văn bản để phát hiện ngôn ngữ..."
            className="w-full px-4 py-3 pl-12 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
            rows={3}
          />
          <Globe className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={handleDetect}
          disabled={!inputText.trim() || isDetecting}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${isDetecting ? 'animate-spin' : ''}`} />
          {isDetecting ? 'Detecting...' : 'Detect Language'}
        </button>
      </div>

      {/* Language Filter */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
          Filter by Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        >
          <option value="all">All Languages</option>
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.name}>{lang.flag} {lang.name}</option>
          ))}
        </select>
      </div>

      {/* Detection Results */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Detection Results
        </h4>
        <div className="space-y-2">
          {filteredResults.map((result) => (
            <div
              key={result.textId}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <span className="text-xl">{getLanguageFlag(result.detectedLanguage)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {result.detectedLanguage}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {(result.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Sample Text</div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {result.textSample}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Detected</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.detectedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Time</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.processingTime}s
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported Languages */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Supported Languages
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-center"
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {lang.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Phát hiện ngôn ngữ sử dụng NLP để xác định ngôn ngữ của nội dung với 8 supported languages (Vietnamese/English/French/German/Japanese/Korean/Chinese/Spanish), confidence scoring, detection history, auto-detect on input, processing time tracking, và language filtering.
        </p>
      </div>
    </div>
  );
}