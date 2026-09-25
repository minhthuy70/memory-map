'use client';

import { useState } from 'react';
import { Tag, Plus, X, Check, RefreshCw, Settings, Sparkles, AlertTriangle, Hash } from 'lucide-react';

interface SuggestedTag {
  id: string;
  memoryId: string;
  tag: string;
  confidence: number; // 0-100
  category: 'location' | 'person' | 'activity' | 'emotion' | 'time' | 'other';
  applied: boolean;
  suggestedAt: Date;
}

interface AutoTaggingProps {
  tags?: SuggestedTag[];
  onApplyTag?: (tagId: string) => Promise<void>;
  onRemoveTag?: (tagId: string) => Promise<void>;
  onGenerateTags?: (memoryId: string) => Promise<void>;
  onCancel?: () => void;
  isGenerating?: boolean;
  currentMemoryId?: string;
}

const DEFAULT_TAGS: SuggestedTag[] = [
  {
    id: 'tag-1',
    memoryId: '1',
    tag: 'đà lạt',
    confidence: 95,
    category: 'location',
    applied: false,
    suggestedAt: new Date(),
  },
  {
    id: 'tag-2',
    memoryId: '1',
    tag: 'gia đình',
    confidence: 88,
    category: 'person',
    applied: false,
    suggestedAt: new Date(),
  },
  {
    id: 'tag-3',
    memoryId: '1',
    tag: 'du lịch',
    confidence: 82,
    category: 'activity',
    applied: false,
    suggestedAt: new Date(),
  },
];

export default function AutoTagging({
  tags = DEFAULT_TAGS,
  onApplyTag,
  onRemoveTag,
  onGenerateTags,
  onCancel,
  isGenerating = false,
  currentMemoryId,
}: AutoTaggingProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [autoApply, setAutoApply] = useState(false);
  const [minConfidence, setMinConfidence] = useState(70);
  const [maxTags, setMaxTags] = useState(10);
  const [tagCategories, setTagCategories] = useState<string[]>(['location', 'person', 'activity', 'emotion', 'time', 'other']);

  const handleApply = async (tagId: string) => {
    if (onApplyTag) {
      await onApplyTag(tagId);
    }
  };

  const handleRemove = async (tagId: string) => {
    if (onRemoveTag) {
      await onRemoveTag(tagId);
    }
  };

  const handleGenerate = async (memoryId: string) => {
    if (onGenerateTags) {
      await onGenerateTags(memoryId);
    }
  };

  const handleToggleCategory = (category: string) => {
    setTagCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryLabel = (category: SuggestedTag['category']) => {
    switch (category) {
      case 'location':
        return 'Địa điểm';
      case 'person':
        return 'Người';
      case 'activity':
        return 'Hoạt động';
      case 'emotion':
        return 'Cảm xúc';
      case 'time':
        return 'Thời gian';
      case 'other':
        return 'Khác';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: SuggestedTag['category']) => {
    switch (category) {
      case 'location':
        return 'from-green-400 to-emerald-500';
      case 'person':
        return 'from-blue-400 to-cyan-500';
      case 'activity':
        return 'from-purple-400 to-indigo-500';
      case 'emotion':
        return 'from-pink-400 to-rose-500';
      case 'time':
        return 'from-amber-400 to-orange-500';
      case 'other':
        return 'from-slate-400 to-slate-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
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
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Hash className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tự động gán tag
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tags.filter(t => !t.applied).length} tag chưa áp dụng
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
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt gán tag
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Tự động áp dụng tag
              </span>
              <button
                type="button"
                onClick={() => setAutoApply(!autoApply)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoApply ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
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
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Số lượng tag tối đa: {maxTags}
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={maxTags}
                onChange={(e) => setMaxTags(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>5</span>
                <span>20</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
                Loại tag:
              </label>
              <div className="flex flex-wrap gap-2">
                {['location', 'person', 'activity', 'emotion', 'time', 'other'].map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleToggleCategory(category)}
                    className={`px-2 py-1 text-[10px] font-medium rounded-lg transition-colors ${
                      tagCategories.includes(category)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {getCategoryLabel(category as SuggestedTag['category'])}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
        <p className="text-xs text-purple-700 dark:text-purple-400">
          <strong>Gợi ý:</strong> AI sẽ tự động trích xuất tag từ nội dung kỷ niệm. 
          Tag được phân loại theo loại (địa điểm, người, hoạt động, cảm xúc, thời gian).
        </p>
        </div>
      </div>

      {/* Tags List */}
      <div className="space-y-3">
        {tags.length === 0 ? (
          <div className="text-center py-8">
            <Hash className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có tag nào được đề xuất
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all ${
                    tag.applied
                      ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
                      : 'bg-slate-100 dark:bg-slate-600 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 bg-gradient-to-r ${getCategoryColor(tag.category)} text-white text-[10px] font-bold rounded-full`}>
                      {getCategoryLabel(tag.category)}
                    </span>
                    <span className={`text-sm font-medium ${
                      tag.applied
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      #{tag.tag}
                    </span>
                    <span className={`px-2 py-0.5 bg-gradient-to-r ${getConfidenceColor(tag.confidence)} text-white text-[10px] font-bold rounded-full`}>
                      {tag.confidence}%
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {!tag.applied && (
                      <button
                        type="button"
                        onClick={() => handleApply(tag.id)}
                        className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                        title="Áp dụng tag"
                      >
                        <Plus className="h-3 w-3 text-green-500" />
                      </button>
                    )}
                    {tag.applied && (
                      <button
                        type="button"
                        onClick={() => handleRemove(tag.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                        title="Xóa tag"
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={() => currentMemoryId && handleGenerate(currentMemoryId)}
        disabled={!currentMemoryId || isGenerating}
        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            Đang trích xuất tag...
          </>
        ) : (
          <>
            <Tag className="h-4 w-4" />
            Tạo tag tự động
          </>
        )}
      </button>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Tự động gán tag sử dụng NLP để trích xuất từ khóa và tag từ nội dung. 
          Bạn có thể xem, áp dụng hoặc xóa các tag trước khi lưu.
        </p>
      </div>
    </div>
  );
}