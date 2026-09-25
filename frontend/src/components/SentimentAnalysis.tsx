'use client';

import { useState } from 'react';
import { Heart, Frown, Smile, Meh, Zap, BarChart3, Check, X, RefreshCw, Settings, TrendingUp, AlertTriangle } from 'lucide-react';

interface SentimentResult {
  id: string;
  memoryId: string;
  overallSentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-100
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    love: number;
  };
  keywords: string[];
  analyzedAt: Date;
}

interface SentimentAnalysisProps {
  results?: SentimentResult[];
  onAnalyze?: (memoryId: string) => Promise<SentimentResult>;
  onReanalyze?: (resultId: string) => Promise<SentimentResult>;
  onCancel?: () => void;
  isAnalyzing?: boolean;
  currentMemoryId?: string;
}

const DEFAULT_RESULTS: SentimentResult[] = [
  {
    id: 'sentiment-1',
    memoryId: '1',
    overallSentiment: 'positive',
    confidence: 85,
    emotions: {
      joy: 0.7,
      sadness: 0.1,
      anger: 0.05,
      fear: 0.05,
      surprise: 0.2,
      love: 0.6,
    },
    keywords: ['hạnh phúc', 'vui vẻ', 'thưởng thức', 'yêu thương'],
    analyzedAt: new Date(),
  },
];

export default function SentimentAnalysis({
  results = DEFAULT_RESULTS,
  onAnalyze,
  onReanalyze,
  onCancel,
  isAnalyzing = false,
  currentMemoryId,
}: SentimentAnalysisProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [detailedAnalysis, setDetailedAnalysis] = useState(true);
  const [keywordExtraction, setKeywordExtraction] = useState(true);
  const [emotionBreakdown, setEmotionBreakdown] = useState(true);

  const handleAnalyze = async (memoryId: string) => {
    if (onAnalyze) {
      await onAnalyze(memoryId);
    }
  };

  const handleReanalyze = async (resultId: string) => {
    if (onReanalyze) {
      await onReanalyze(resultId);
    }
  };

  const getSentimentIcon = (sentiment: SentimentResult['overallSentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <Smile className="h-4 w-4" />;
      case 'negative':
        return <Frown className="h-4 w-4" />;
      case 'neutral':
        return <Meh className="h-4 w-4" />;
      default:
        return <Meh className="h-4 w-4" />;
    }
  };

  const getSentimentColor = (sentiment: SentimentResult['overallSentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'from-green-400 to-emerald-500';
      case 'negative':
        return 'from-red-400 to-rose-500';
      case 'neutral':
        return 'from-slate-400 to-slate-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getSentimentLabel = (sentiment: SentimentResult['overallSentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'Tích cực';
      case 'negative':
        return 'Tiêu cực';
      case 'neutral':
        return 'Trung lập';
      default:
        return 'Trung lập';
    }
  };

  const getEmotionLabel = (emotion: string) => {
    switch (emotion) {
      case 'joy':
        return 'Vui vẻ';
      case 'sadness':
        return 'Buồn';
      case 'anger':
        return 'Giận';
      case 'fear':
        return 'Sợ';
      case 'surprise':
        return 'Ngạc nhiên';
      case 'love':
        return 'Yêu thương';
      default:
        return emotion;
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'joy':
        return '😊';
      case 'sadness':
        return '😢';
      case 'anger':
        return '😡';
      case 'fear':
        return '😨';
      case 'surprise':
        return '😲';
      case 'love':
        return '❤️';
      default:
        return '😐';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phân tích cảm xúc
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {results.length} kỷ niệm đã phân tích
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
        <div className="mb-6 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt phân tích
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Phân tích chi tiết
              </span>
              <button
                type="button"
                onClick={() => setDetailedAnalysis(!detailedAnalysis)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  detailedAnalysis ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    detailedAnalysis ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Trích xuất từ khóa
              </span>
              <button
                type="button"
                onClick={() => setKeywordExtraction(!keywordExtraction)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  keywordExtraction ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    keywordExtraction ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Phân tích cảm xúc chi tiết
              </span>
              <button
                type="button"
                onClick={() => setEmotionBreakdown(!emotionBreakdown)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  emotionBreakdown ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    emotionBreakdown ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <div className="flex items-start gap-2">
          <BarChart3 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <strong>Thông tin:</strong> Phân tích cảm xúc sử dụng NLP để xác định cảm xúc tổng thể và các cảm xúc cụ thể trong nội dung kỷ niệm.
          </p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có kết quả phân tích nào
            </p>
          </div>
        ) : (
          results.map((result) => (
            <div
              key={result.id}
              className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getSentimentColor(result.overallSentiment)}`}>
                  <div className="text-white">
                    {getSentimentIcon(result.overallSentiment)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        Kỷ niệm #{result.memoryId}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 bg-gradient-to-r ${getSentimentColor(result.overallSentiment)} text-white text-[10px] font-bold rounded-full`}>
                          {getSentimentLabel(result.overallSentiment)}
                        </span>
                        <span className="px-2 py-0.5 bg-cyan-200 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 text-[10px] font-bold rounded-full">
                          {result.confidence}% độ tin cậy
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleReanalyze(result.id)}
                      disabled={isAnalyzing && currentMemoryId === result.memoryId}
                      className="p-1.5 hover:bg-cyan-100 dark:hover:bg-cyan-900 rounded-lg transition-colors"
                      title="Phân tích lại"
                    >
                      <RefreshCw className={`h-3 w-3 text-slate-500 ${isAnalyzing && currentMemoryId === result.memoryId ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {emotionBreakdown && (
                    <div className="mb-3">
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                        Phân tích cảm xúc chi tiết:
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(result.emotions).map(([emotion, value]) => (
                          <div key={emotion} className="text-center">
                            <div className="text-lg mb-1">{getEmotionEmoji(emotion)}</div>
                            <div className="text-[10px] text-slate-600 dark:text-slate-400 mb-1">
                              {getEmotionLabel(emotion)}
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                                style={{ width: `${value * 100}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {(value * 100).toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {keywordExtraction && result.keywords.length > 0 && (
                    <div className="mb-2">
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Từ khóa cảm xúc:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {result.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-[10px] rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span>Đã phân tích: {new Date(result.analyzedAt).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Analyze Button */}
      <button
        type="button"
        onClick={() => currentMemoryId && handleAnalyze(currentMemoryId)}
        disabled={!currentMemoryId || isAnalyzing}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isAnalyzing ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang phân tích...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Phân tích cảm xúc
          </>
        )}
      </button>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
        <p className="text-[10px] text-cyan-700 dark:text-cyan-400">
          <strong>Lưu ý:</strong> Phân tích cảm xúc sử dụng NLP để xác định cảm xúc trong nội dung. 
          Kết quả có thể không chính xác 100% và nên được sử dụng như tham khảo.
        </p>
      </div>
    </div>
  );
}