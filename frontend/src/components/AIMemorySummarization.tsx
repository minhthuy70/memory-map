'use client';

import { useState } from 'react';
import { Sparkles, FileText, Copy, Check, X, RefreshCw, Settings, Lightbulb, AlertTriangle } from 'lucide-react';

interface MemorySummary {
  id: string;
  memoryId: string;
  summary: string;
  keyPoints: string[];
  mood: string;
  generatedAt: Date;
  wordCount: number;
}

interface AIMemorySummarizationProps {
  memories?: MemorySummary[];
  onGenerateSummary?: (memoryId: string) => Promise<MemorySummary>;
  onRegenerateSummary?: (summaryId: string) => Promise<MemorySummary>;
  onCopySummary?: (summary: string) => Promise<void>;
  onCancel?: () => void;
  isGenerating?: boolean;
  currentMemoryId?: string;
}

const DEFAULT_SUMMARIES: MemorySummary[] = [
  {
    id: 'summary-1',
    memoryId: '1',
    summary: 'Một chuyến đi đáng nhớ đến Đà Lạt với gia đình vào mùa thu. Chúng tôi đã ngắm nhìn vẻ đẹp của đồi thông, tham quan các khu vườn hoa và thưởng thức đặc sản địa phương.',
    keyPoints: [
      'Chuyến đi gia đình',
      'Mùa thu Đà Lạt',
      'Đồi thông xanh mát',
      'Khu vườn hoa',
      'Đặc sản địa phương'
    ],
    mood: 'Vui vẻ',
    generatedAt: new Date(),
    wordCount: 24,
  },
];

export default function AIMemorySummarization({
  memories = DEFAULT_SUMMARIES,
  onGenerateSummary,
  onRegenerateSummary,
  onCopySummary,
  onCancel,
  isGenerating = false,
  currentMemoryId,
}: AIMemorySummarizationProps) {
  const [selectedSummary, setSelectedSummary] = useState<MemorySummary | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [includeMood, setIncludeMood] = useState(true);
  const [includeKeyPoints, setIncludeKeyPoints] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async (memoryId: string) => {
    if (onGenerateSummary) {
      await onGenerateSummary(memoryId);
    }
  };

  const handleRegenerate = async (summaryId: string) => {
    if (onRegenerateSummary) {
      await onRegenerateSummary(summaryId);
    }
  };

  const handleCopy = async (summary: MemorySummary) => {
    if (onCopySummary) {
      await onCopySummary(summary.summary);
      setCopiedId(summary.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getLengthLabel = (length: string) => {
    switch (length) {
      case 'short':
        return 'Ngắn (50-100 từ)';
      case 'medium':
        return 'Trung bình (100-200 từ)';
      case 'long':
        return 'Dài (200-300 từ)';
      default:
        return 'Trung bình';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tóm tắt kỷ niệm AI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {memories.length} kỷ niệm đã tóm tắt
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
        <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt tóm tắt
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Độ dài tóm tắt
              </label>
              <select
                value={summaryLength}
                onChange={(e) => setSummaryLength(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="short">Ngắn</option>
                <option value="medium">Trung bình</option>
                <option value="long">Dài</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Bao gồm tâm trạng
              </span>
              <button
                type="button"
                onClick={() => setIncludeMood(!includeMood)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeMood ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeMood ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Bao gồm điểm chính
              </span>
              <button
                type="button"
                onClick={() => setIncludeKeyPoints(!includeKeyPoints)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  includeKeyPoints ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    includeKeyPoints ? 'translate-x-5' : ''
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
            <strong>Gợi ý:</strong> AI sẽ tự động tóm tắt kỷ niệm của bạn theo {getLengthLabel(summaryLength)}. 
            Bạn có thể điều chỉnh cài đặt để thay đổi độ dài và nội dung tóm tắt.
          </p>
        </div>
      </div>

      {/* Summaries List */}
      <div className="space-y-3">
        {memories.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có tóm tắt nào
            </p>
          </div>
        ) : (
          memories.map((summary) => (
            <div
              key={summary.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedSummary?.id === summary.id
                  ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-300 dark:border-purple-700'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedSummary?.id === summary.id
                    ? 'bg-gradient-to-br from-purple-400 to-pink-500'
                    : 'bg-slate-200 dark:bg-slate-600'
                }`}>
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className={`font-semibold ${
                        selectedSummary?.id === summary.id
                          ? 'text-purple-900 dark:text-purple-100'
                          : 'text-slate-700 dark:text-slate-300'
                      } text-sm`}>
                        Kỷ niệm #{summary.memoryId}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-[10px] font-bold rounded-full">
                          {summary.wordCount} từ
                        </span>
                        {includeMood && (
                          <span className="px-2 py-0.5 bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 text-[10px] font-bold rounded-full">
                            {summary.mood}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleRegenerate(summary.id)}
                        disabled={isGenerating && currentMemoryId === summary.memoryId}
                        className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
                        title="Tạo lại tóm tắt"
                      >
                        <RefreshCw className={`h-3 w-3 text-slate-500 ${isGenerating && currentMemoryId === summary.memoryId ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(summary)}
                        className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg transition-colors"
                        title="Sao chép"
                      >
                        {copiedId === summary.id ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <p className={`text-xs mb-2 ${
                    selectedSummary?.id === summary.id
                      ? 'text-purple-800 dark:text-purple-200'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {summary.summary}
                  </p>

                  {includeKeyPoints && summary.keyPoints.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                        Điểm chính:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {summary.keyPoints.map((point, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-[10px] rounded-full"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500">
                    <span>Đã tạo: {new Date(summary.generatedAt).toLocaleString('vi-VN')}</span>
                  </div>
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
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang tạo tóm tắt...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Tạo tóm tắt AI
          </>
        )}
      </button>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Tóm tắt AI sử dụng trí tuệ nhân tạo để phân tích và tóm tắt nội dung kỷ niệm. 
          Kết quả có thể không hoàn hảo và cần được kiểm tra lại.
        </p>
      </div>
    </div>
  );
}