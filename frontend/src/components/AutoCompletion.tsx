'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  as,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Edit2,
  Filter,
  History,
  Lightbulb,
  Settings,
  Sparkles,
  Star,
  Trash2,
  Type,
  Zap,
  ZapIcon
} from 'lucide-react';

interface Suggestion {
  id: string;
  text: string;
  type: 'keyword' | 'phrase' | 'template' | 'category';
  confidence: number;
  frequency: number;
  lastUsed: Date;
}

interface CompletionHistory {
  id: string;
  query: string;
  selected: string;
  timestamp: Date;
}

interface AutoCompletionProps {
  onCancel?: () => void;
  onSelectSuggestion?: (suggestion: string) => Promise<void>;
}

const DEFAULT_SUGGESTIONS: Suggestion[] = [
  {
    id: 'sugg-1',
    text: 'Chuyến đi Đà Lạt',
    type: 'keyword',
    confidence: 0.95,
    frequency: 45,
    lastUsed: new Date('2024-01-12'),
  },
  {
    id: 'sugg-2',
    text: 'Sinh nhật gia đình',
    type: 'phrase',
    confidence: 0.88,
    frequency: 32,
    lastUsed: new Date('2024-01-10'),
  },
  {
    id: 'sugg-3',
    text: 'Kỷ niệm đầu tiên',
    type: 'template',
    confidence: 0.82,
    frequency: 28,
    lastUsed: new Date('2024-01-08'),
  },
  {
    id: 'sugg-4',
    text: 'Du lịch biển',
    type: 'category',
    confidence: 0.75,
    frequency: 25,
    lastUsed: new Date('2024-01-05'),
  },
];

const DEFAULT_HISTORY: CompletionHistory[] = [
  {
    id: 'hist-1',
    query: 'đà lạt',
    selected: 'Chuyến đi Đà Lạt',
    timestamp: new Date('2024-01-12'),
  },
  {
    id: 'hist-2',
    query: 'sinh nhật',
    selected: 'Sinh nhật gia đình',
    timestamp: new Date('2024-01-10'),
  },
];

export default function AutoCompletion({ onCancel, onSelectSuggestion }: AutoCompletionProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(DEFAULT_SUGGESTIONS);
  const [history, setHistory] = useState<CompletionHistory[]>(DEFAULT_HISTORY);
  const [showSettings, setShowSettings] = useState(false);
  const [inputText, setInputText] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [enableContext, setEnableContext] = useState(true);

  const totalSuggestions = suggestions.length;
  const avgConfidence = suggestions.reduce((sum, s) => sum + s.confidence, 0) / totalSuggestions;
  const totalHistory = history.length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keyword':
        return <Type className="h-4 w-4" />;
      case 'phrase':
        return <Lightbulb className="h-4 w-4" />;
      case 'template':
        return <Sparkles className="h-4 w-4" />;
      case 'category':
        return <Filter className="h-4 w-4" />;
      default:
        return <Type className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'keyword':
        return 'text-blue-500';
      case 'phrase':
        return 'text-green-500';
      case 'template':
        return 'text-purple-500';
      case 'category':
        return 'text-amber-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleSelect = async (suggestion: string) => {
    await onSelectSuggestion?.(suggestion);
    setInputText(suggestion);
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.confidence >= confidenceThreshold &&
    (selectedType === 'all' || s.type === selectedType) &&
    (inputText === '' || s.text.toLowerCase().includes(inputText.toLowerCase()))
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Type className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tự động hoàn thành
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalSuggestions} suggestions
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
        <div className="mb-4 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt auto-completion
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
                Context-aware suggestions
              </span>
              <button
                type="button"
                onClick={() => setEnableContext(!enableContext)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableContext ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableContext ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Learning from history
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
            <Type className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Suggestions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSuggestions}
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
            <History className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">History</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalHistory}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Favorites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {suggestions.filter(s => s.frequency > 30).length}
          </div>
        </div>
      </div>

      {/* Input Field */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập để nhận gợi ý..."
            className="w-full px-4 py-3 pl-12 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
          />
          <Type className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'all'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('keyword')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'keyword'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Keywords
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('phrase')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'phrase'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Phrases
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('template')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'template'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Templates
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Suggestions
        </h4>
        <div className="space-y-2">
          {filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 cursor-pointer hover:border-cyan-300 dark:hover:border-cyan-700 transition-all"
              onClick={() => handleSelect(suggestion.text)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(suggestion.type)}`}>
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {suggestion.text}
                    </span>
                    <div className={`text-xs ${getTypeColor(suggestion.type)} capitalize`}>
                      {suggestion.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-amber-500" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {suggestion.frequency}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {(suggestion.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Used</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {suggestion.lastUsed.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Recent History
        </h4>
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.query}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      → {item.selected}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {item.timestamp.toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
        <p className="text-[10px] text-cyan-700 dark:text-cyan-400">
          <strong>Lưu ý:</strong> Tự động hoàn thành sử dụng AI để gợi ý từ khóa khi người dùng nhập với suggestion types (keyword/phrase/template/category), confidence scoring, frequency tracking, history logging, context-aware suggestions, và learning from user behavior.
        </p>
      </div>
    </div>
  );
}