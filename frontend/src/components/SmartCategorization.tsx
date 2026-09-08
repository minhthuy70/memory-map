'use client';

import { useState } from 'react';
import { FolderOpen, Tag, Check, X, RefreshCw, Settings, Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';

interface CategorySuggestion {
  id: string;
  memoryId: string;
  suggestedCategory: string;
  confidence: number; // 0-100
  reason: string;
  alternatives: Array<{ category: string; confidence: number }>;
  applied: boolean;
  suggestedAt: Date;
}

interface SmartCategorizationProps {
  suggestions?: CategorySuggestion[];
  onApplySuggestion?: (suggestionId: string) => Promise<void>;
  onSuggestAlternative?: (suggestionId: string, alternativeCategory: string) => Promise<void>;
  onGenerateSuggestions?: (memoryId: string) => Promise<void>;
  onCancel?: () => void;
  isGenerating?: boolean;
  currentMemoryId?: string;
}

const DEFAULT_SUGGESTIONS: CategorySuggestion[] = [
  {
    id: 'suggest-1',
    memoryId: '1',
    suggestedCategory: 'Travel',
    confidence: 92,
    reason: 'Nội dung chứa từ khóa: "chuyến đi", "đà lạt", "du lịch"',
    alternatives: [
      { category: 'Family', confidence: 78 },
      { category: 'Personal', confidence: 65 },
    ],
    applied: false,
    suggestedAt: new Date(),
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  Love: '❤️',
  Family: '👨‍👩‍👧',
  Friends: '👥',
  Study: '🎓',
  Work: '💼',
  Travel: '✈️',
  Event: '🎉',
  Personal: '🌱',
  Other: '⭐',
};

export default function SmartCategorization({
  suggestions = DEFAULT_SUGGESTIONS,
  onApplySuggestion,
  onSuggestAlternative,
  onGenerateSuggestions,
  onCancel,
  isGenerating = false,
  currentMemoryId,
}: SmartCategorizationProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [autoApply, setAutoApply] = useState(false);
  const [minConfidence, setMinConfidence] = useState(80);
  const [showAlternatives, setShowAlternatives] = useState(true);

  const handleApply = async (suggestionId: string) => {
    if (onApplySuggestion) {
      await onApplySuggestion(suggestionId);
    }
  };

  const handleApplyAlternative = async (suggestionId: string, alternativeCategory: string) => {
    if (onSuggestAlternative) {
      await onSuggestAlternative(suggestionId, alternativeCategory);
    }
  };

  const handleGenerate = async (memoryId: string) => {
    if (onGenerateSuggestions) {
      await onGenerateSuggestions(memoryId);
    }
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category] || '📁';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'from-green-400 to-emerald-500';
    if (confidence >= 60) return 'from-amber-400 to-orange-500';
    return 'from-slate-400 to-slate-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <FolderOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phân loại thông minh
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {suggestions.filter(s => !s.applied).length} gợi ý chưa áp dụng
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

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt phân loại
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tự động áp dụng gợi ý
              </span>
              <button
                type="button"
                onClick={() => setAutoApply(!autoApply)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoApply ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoApply ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Độ tin cậy tối thiểu: {minConfidence}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={minConfidence}
                onChange={(e) => setMinConfidence(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Hiển thị gợi ý thay thế
              </span>
              <button
                type="button"
                onClick={() => setShowAlternatives(!showAlternatives)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showAlternatives ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showAlternatives ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <strong>Gợi ý:</strong> AI sẽ phân tích nội dung kỷ niệm và đề xuất danh mục phù hợp nhất. 
            Bạn có thể xem các gợi ý thay thế nếu không đồng ý với đề xuất chính.
          </p>
        </div>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có gợi ý phân loại nào
            </p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                suggestion.applied
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700 opacity-60'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  suggestion.applied
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500'
                    : 'bg-gradient-to-br from-orange-400 to-amber-500'
                }`}>
                  <div className="text-white">
                    {suggestion.applied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <FolderOpen className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${
                        suggestion.applied
                          ? 'text-green-900 dark:text-green-100'
                          : 'text-slate-700 dark:text-slate-300'
                      } text-sm`}>
                        Kỷ niệm #{suggestion.memoryId}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-[10px] font-bold rounded-full">
                          {getCategoryIcon(suggestion.suggestedCategory)} {suggestion.suggestedCategory}
                        </span>
                        <span className={`px-2 py-0.5 bg-gradient-to-r ${getConfidenceColor(suggestion.confidence)} text-white text-[10px] font-bold rounded-full`}>
                          {suggestion.confidence}% tin cậy
                        </span>
                        {suggestion.applied && (
                          <span className="px-2 py-0.5 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-[10px] font-bold rounded-full">
                            Đã áp dụng
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {suggestion.reason}
                  </p>

                  {showAlternatives && !suggestion.applied && suggestion.alternatives.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Gợi ý thay thế:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.alternatives.map((alt, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleApplyAlternative(suggestion.id, alt.category)}
                            className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-[10px] rounded-full hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                          >
                            {getCategoryIcon(alt.category)} {alt.category} ({alt.confidence}%)
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span>Đề xuất: {new Date(suggestion.suggestedAt).toLocaleString('vi-VN')}</span>
                  </div>

                  {!suggestion.applied && (
                    <button
                      type="button"
                      onClick={() => handleApply(suggestion.id)}
                      className="mt-2 w-full px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Áp dụng gợi ý
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={() => currentMemoryId && handleGenerate(currentMemoryId)}
        disabled={!currentMemoryId || isGenerating}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang phân tích...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Tạo gợi ý phân loại
          </>
        )}
      </button>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Phân loại thông minh sử dụng AI để đề xuất danh mục dựa trên nội dung kỷ niệm. 
          Bạn có thể chấp nhận hoặc từ chối gợi ý trước khi áp dụng.
        </p>
      </div>
    </div>
  );
}