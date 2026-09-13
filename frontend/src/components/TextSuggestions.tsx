'use client';

import { useState } from 'react';
import { Lightbulb, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Sparkles, Zap as ZapIcon, Check, X as XIcon, RefreshCw, Edit2, Copy, Languages, MessageSquare, FileText, PenTool } from 'lucide-react';

interface TextSuggestion {
  id: string;
  originalText: string;
  suggestedText: string;
  type: 'completion' | 'vocabulary' | 'tone' | 'grammar' | 'style';
  confidence: number;
  reason: string;
  applied: boolean;
}

interface SuggestionHistory {
  id: string;
  original: string;
  applied: string;
  type: string;
  timestamp: Date;
}

interface TextSuggestionsProps {
  onCancel?: () => void;
  onApplySuggestion?: (suggestionId: string) => Promise<void>;
  onRejectSuggestion?: (suggestionId: string) => Promise<void>;
}

const DEFAULT_SUGGESTIONS: TextSuggestion[] = [
  {
    id: 'sugg-1',
    originalText: 'Chuyến đi vui',
    suggestedText: 'Chuyến đi thật vui và đáng nhớ',
    type: 'completion',
    confidence: 0.92,
    reason: 'Complete the sentence with more descriptive words',
    applied: false,
  },
  {
    id: 'sugg-2',
    originalText: 'đẹp',
    suggestedText: 'tuyệt vời',
    type: 'vocabulary',
    confidence: 0.88,
    reason: 'More expressive vocabulary',
    applied: false,
  },
  {
    id: 'sugg-3',
    originalText: 'Tôi đi đến biển',
    suggestedText: 'Tôi đã đến biển',
    type: 'grammar',
    confidence: 0.95,
    reason: 'Correct verb tense',
    applied: false,
  },
];

const DEFAULT_HISTORY: SuggestionHistory[] = [
  {
    id: 'hist-1',
    original: 'đẹp',
    applied: 'tuyệt vời',
    type: 'vocabulary',
    timestamp: new Date('2024-01-12'),
  },
];

export default function TextSuggestions({ onCancel, onApplySuggestion, onRejectSuggestion }: TextSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TextSuggestion[]>(DEFAULT_SUGGESTIONS);
  const [history, setHistory] = useState<SuggestionHistory[]>(DEFAULT_HISTORY);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [enableAutoApply, setEnableAutoApply] = useState(false);

  const totalSuggestions = suggestions.length;
  const appliedCount = suggestions.filter(s => s.applied).length;
  const avgConfidence = suggestions.reduce((sum, s) => sum + s.confidence, 0) / totalSuggestions;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'completion':
        return <MessageSquare className="h-4 w-4" />;
      case 'vocabulary':
        return <Languages className="h-4 w-4" />;
      case 'tone':
        return <PenTool className="h-4 w-4" />;
      case 'grammar':
        return <FileText className="h-4 w-4" />;
      case 'style':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'completion':
        return 'text-blue-500';
      case 'vocabulary':
        return 'text-green-500';
      case 'tone':
        return 'text-purple-500';
      case 'grammar':
        return 'text-red-500';
      case 'style':
        return 'text-amber-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleApply = async (suggestionId: string) => {
    await onApplySuggestion?.(suggestionId);
    setSuggestions(suggestions.map(s => 
      s.id === suggestionId ? { ...s, applied: true } : s
    ));
  };

  const handleReject = async (suggestionId: string) => {
    await onRejectSuggestion?.(suggestionId);
    setSuggestions(suggestions.filter(s => s.id !== suggestionId));
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.confidence >= confidenceThreshold &&
    (selectedType === 'all' || s.type === selectedType)
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Lightbulb className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Gợi ý văn bản
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {appliedCount}/{totalSuggestions} applied
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
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt text suggestions
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
                Auto-apply high confidence
              </span>
              <button
                type="button"
                onClick={() => setEnableAutoApply(!enableAutoApply)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableAutoApply ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableAutoApply ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Real-time suggestions
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
            <Lightbulb className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Suggestions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSuggestions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Applied</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {appliedCount}
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
            <RefreshCw className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">History</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {history.length}
          </div>
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
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('completion')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'completion'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Complete
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('vocabulary')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'vocabulary'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Vocab
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('grammar')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedType === 'grammar'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Grammar
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
              className={`p-4 rounded-lg border-2 ${
                suggestion.applied
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getTypeColor(suggestion.type)}`}>
                    {getTypeIcon(suggestion.type)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {suggestion.type}
                    </span>
                    <div className={`text-xs ${getTypeColor(suggestion.type)}`}>
                      {(suggestion.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                </div>
                {suggestion.applied && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full">
                    Applied
                  </span>
                )}
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Original</div>
                <p className="text-sm text-slate-700 dark:text-slate-300 line-through opacity-60">
                  {suggestion.originalText}
                </p>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Suggested</div>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {suggestion.suggestedText}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {suggestion.reason}
              </p>

              {!suggestion.applied && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApply(suggestion.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Check className="h-3 w-3" />
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(suggestion.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <XIcon className="h-3 w-3" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Applied History
        </h4>
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                      {item.type}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {item.timestamp.toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-1">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Original</div>
                <p className="text-xs text-slate-700 dark:text-slate-300 line-through opacity-60">
                  {item.original}
                </p>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Applied</div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {item.applied}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Gợi ý văn bản sử dụng AI để đề xuất câu và từ ngữ phù hợp với suggestion types (completion/vocabulary/tone/grammar/style), confidence scoring, apply/reject workflow, history tracking, real-time suggestions, và auto-apply high confidence.
        </p>
      </div>
    </div>
  );
}