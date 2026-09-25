'use client';

import { useState } from 'react';
import { Sparkles, Lightbulb, ArrowRight, Check, X, RefreshCw, Settings, TrendingUp, AlertTriangle } from 'lucide-react';

interface RecommendedMemory {
  id: string;
  memoryId: string;
  title: string;
  reason: string;
  similarity: number; // 0-100
  matchType: 'content' | 'location' | 'mood' | 'category' | 'date';
  preview: string;
  viewed: boolean;
  recommendedAt: Date;
}

interface MemoryRecommendationsProps {
  recommendations?: RecommendedMemory[];
  onViewMemory?: (memoryId: string) => Promise<void>;
  onDismissRecommendation?: (recommendationId: string) => Promise<void>;
  onGenerateRecommendations?: (memoryId: string) => Promise<void>;
  onCancel?: () => void;
  isGenerating?: boolean;
  currentMemoryId?: string;
}

const DEFAULT_RECOMMENDATIONS: RecommendedMemory[] = [
  {
    id: 'rec-1',
    memoryId: '2',
    title: 'Chuyến đi Đà Lạt năm ngoái',
    reason: 'Tương tự về địa điểm: Đà Lạt',
    similarity: 85,
    matchType: 'location',
    preview: 'Một kỷ niệm khác về Đà Lạt...',
    viewed: false,
    recommendedAt: new Date(),
  },
  {
    id: 'rec-2',
    memoryId: '3',
    title: 'Hẹn hò tại quán cafe',
    reason: 'Tương tự về tâm trạng: Vui vẻ',
    similarity: 72,
    matchType: 'mood',
    preview: 'Kỷ niệm hẹn hò lãng mạn...',
    viewed: false,
    recommendedAt: new Date(),
  },
];

export default function MemoryRecommendations({
  recommendations = DEFAULT_RECOMMENDATIONS,
  onViewMemory,
  onDismissRecommendation,
  onGenerateRecommendations,
  onCancel,
  isGenerating = false,
  currentMemoryId,
}: MemoryRecommendationsProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [maxRecommendations, setMaxRecommendations] = useState(5);
  const [minSimilarity, setMinSimilarity] = useState(60);
  const [matchTypes, setMatchTypes] = useState<string[]>(['content', 'location', 'mood', 'category', 'date']);

  const handleView = async (memoryId: string) => {
    if (onViewMemory) {
      await onViewMemory(memoryId);
    }
  };

  const handleDismiss = async (recommendationId: string) => {
    if (onDismissRecommendation) {
      await onDismissRecommendation(recommendationId);
    }
  };

  const handleGenerate = async (memoryId: string) => {
    if (onGenerateRecommendations) {
      await onGenerateRecommendations(memoryId);
    }
  };

  const handleToggleMatchType = (type: string) => {
    setMatchTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const getMatchTypeLabel = (type: RecommendedMemory['matchType']) => {
    switch (type) {
      case 'content':
        return 'Nội dung';
      case 'location':
        return 'Địa điểm';
      case 'mood':
        return 'Tâm trạng';
      case 'category':
        return 'Danh mục';
      case 'date':
        return 'Ngày tháng';
      default:
        return type;
    }
  };

  const getMatchTypeColor = (type: RecommendedMemory['matchType']) => {
    switch (type) {
      case 'content':
        return 'from-blue-400 to-cyan-500';
      case 'location':
        return 'from-green-400 to-emerald-500';
      case 'mood':
        return 'from-pink-400 to-rose-500';
      case 'category':
        return 'from-purple-400 to-indigo-500';
      case 'date':
        return 'from-amber-400 to-orange-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return 'from-green-400 to-emerald-500';
    if (similarity >= 60) return 'from-amber-400 to-orange-500';
    return 'from-slate-400 to-slate-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Đề xuất kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {recommendations.filter(r => !r.viewed).length} đề xuất chưa xem
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
        <div className="mb-6 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt đề xuất
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Số lượng đề xuất tối đa: {maxRecommendations}
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={maxRecommendations}
                onChange={(e) => setMaxRecommendations(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>3</span>
                <span>10</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Độ tương đồng tối thiểu: {minSimilarity}%
              </label>
              <input
                type="range"
                min="40"
                max="90"
                value={minSimilarity}
                onChange={(e) => setMinSimilarity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>40%</span>
                <span>90%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
                Loại so sánh:
              </label>
              <div className="flex flex-wrap gap-2">
                {['content', 'location', 'mood', 'category', 'date'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleToggleMatchType(type)}
                    className={`px-2 py-1 text-[10px] font-medium rounded-lg transition-colors ${
                      matchTypes.includes(type)
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {getMatchTypeLabel(type as RecommendedMemory['matchType'])}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
          <p className="text-xs text-teal-700 dark:text-teal-400">
            <strong>Gợi ý:</strong> AI sẽ đề xuất các kỷ niệm tương tự dựa trên nội dung, địa điểm, tâm trạng, danh mục hoặc ngày tháng.
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có đề xuất nào
            </p>
          </div>
        ) : (
          recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                recommendation.viewed
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
                  : 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-teal-300 dark:border-teal-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  recommendation.viewed
                    ? 'bg-slate-200 dark:bg-slate-600'
                    : 'bg-gradient-to-br from-teal-400 to-cyan-500'
                }`}>
                  <div className="text-white">
                    {recommendation.viewed ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${
                        recommendation.viewed
                          ? 'text-slate-700 dark:text-slate-300'
                          : 'text-teal-900 dark:text-teal-100'
                      } text-sm`}>
                        {recommendation.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 bg-gradient-to-r ${getMatchTypeColor(recommendation.matchType)} text-white text-[10px] font-bold rounded-full`}>
                          {getMatchTypeLabel(recommendation.matchType)}
                        </span>
                        <span className={`px-2 py-0.5 bg-gradient-to-r ${getSimilarityColor(recommendation.similarity)} text-white text-[10px] font-bold rounded-full`}>
                          {recommendation.similarity}% tương đồng
                        </span>
                        {recommendation.viewed && (
                          <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-full">
                            Đã xem
                          </span>
                        )}
                      </div>
                    </div>
                    {!recommendation.viewed && (
                      <button
                        type="button"
                        onClick={() => handleDismiss(recommendation.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                        title="Bỏ qua"
                      >
                        <X className="h-3 w-3 text-slate-500" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {recommendation.reason}
                  </p>

                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-2 italic">
                    "{recommendation.preview}"
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span>Đề xuất: {new Date(recommendation.recommendedAt).toLocaleString('vi-VN')}</span>
                  </div>

                  {!recommendation.viewed && (
                    <button
                      type="button"
                      onClick={() => handleView(recommendation.memoryId)}
                      className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Xem kỷ niệm
                      <ArrowRight className="h-3 w-3" />
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
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang tạo đề xuất...
          </>
        ) : (
          <>
            <TrendingUp className="h-4 w-4" />
            Tạo đề xuất
          </>
        )}
      </button>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Đề xuất kỷ niệm sử dụng AI để tìm kiếm các kỷ niệm tương tự. 
          Kết quả được xếp theo độ tương đồng và loại so sánh.
        </p>
      </div>
    </div>
  );
}