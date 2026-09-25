'use client';

import { useState } from 'react';
import { BookOpen, Wand2, Copy, Check, X, RefreshCw, Settings, Sparkles, AlertTriangle, Download, Share2 } from 'lucide-react';

interface GeneratedStory {
  id: string;
  memoryIds: string[];
  title: string;
  content: string;
  style: 'narrative' | 'poetic' | 'humorous' | 'dramatic';
  length: 'short' | 'medium' | 'long';
  generatedAt: Date;
  wordCount: number;
}

interface StoryGenerationProps {
  stories?: GeneratedStory[];
  onGenerateStory?: (memoryIds: string[], style: GeneratedStory['style'], length: GeneratedStory['length']) => Promise<GeneratedStory>;
  onRegenerateStory?: (storyId: string) => Promise<GeneratedStory>;
  onCopyStory?: (story: string) => Promise<void>;
  onDownloadStory?: (story: GeneratedStory) => Promise<void>;
  onShareStory?: (story: GeneratedStory) => Promise<void>;
  onCancel?: () => void;
  isGenerating?: boolean;
  selectedMemoryIds?: string[];
}

const DEFAULT_STORIES: GeneratedStory[] = [
  {
    id: 'story-1',
    memoryIds: ['1', '2', '3'],
    title: 'Những kỷ niệm đáng nhớ',
    content: 'Trong hành trình của cuộc đời, có những khoảnh khắc mãi mã đọng lại trong tâm trí...',
    style: 'narrative',
    length: 'medium',
    generatedAt: new Date(),
    wordCount: 156,
  },
];

export default function StoryGeneration({
  stories = DEFAULT_STORIES,
  onGenerateStory,
  onRegenerateStory,
  onCopyStory,
  onDownloadStory,
  onShareStory,
  onCancel,
  isGenerating = false,
  selectedMemoryIds = [],
}: StoryGenerationProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<GeneratedStory['style']>('narrative');
  const [selectedLength, setSelectedLength] = useState<GeneratedStory['length']>('medium');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  const handleGenerate = async () => {
    if (onGenerateStory && selectedMemoryIds.length > 0) {
      await onGenerateStory(selectedMemoryIds, selectedStyle, selectedLength);
      setShowGenerator(false);
    }
  };

  const handleRegenerate = async (storyId: string) => {
    if (onRegenerateStory) {
      await onRegenerateStory(storyId);
    }
  };

  const handleCopy = async (story: GeneratedStory) => {
    if (onCopyStory) {
      await onCopyStory(story.content);
      setCopiedId(story.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleDownload = async (story: GeneratedStory) => {
    if (onDownloadStory) {
      await onDownloadStory(story);
    }
  };

  const handleShare = async (story: GeneratedStory) => {
    if (onShareStory) {
      await onShareStory(story);
    }
  };

  const getStyleLabel = (style: GeneratedStory['style']) => {
    switch (style) {
      case 'narrative':
        return 'Kể chuyện';
      case 'poetic':
        return 'Thơ ca';
      case 'humorous':
        return 'Hài hước';
      case 'dramatic':
        return 'Kịch tính';
      default:
        return 'Kể chuyện';
    }
  };

  const getStyleColor = (style: GeneratedStory['style']) => {
    switch (style) {
      case 'narrative':
        return 'from-blue-400 to-cyan-500';
      case 'poetic':
        return 'from-purple-400 to-pink-500';
      case 'humorous':
        return 'from-amber-400 to-orange-500';
      case 'dramatic':
        return 'from-red-400 to-rose-500';
      default:
        return 'from-blue-400 to-cyan-500';
    }
  };

  const getLengthLabel = (length: GeneratedStory['length']) => {
    switch (length) {
      case 'short':
        return 'Ngắn';
      case 'medium':
        return 'Trung bình';
      case 'long':
        return 'Dài';
      default:
        return 'Trung bình';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tạo câu chuyện từ kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {stories.length} câu chuyện đã tạo
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGenerator(!showGenerator)}
            className="flex items-center gap-2 px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Wand2 className="h-4 w-4" />
            Tạo câu chuyện
          </button>
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

      {/* Story Generator Panel */}
      {showGenerator && (
        <div className="mb-6 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-xl">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
            Tạo câu chuyện mới
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Phong cách viết
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as GeneratedStory['style'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              >
                <option value="narrative">Kể chuyện</option>
                <option value="poetic">Thơ ca</option>
                <option value="humorous">Hài hước</option>
                <option value="dramatic">Kịch tính</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Độ dài
              </label>
              <select
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value as GeneratedStory['length'])}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
              >
                <option value="short">Ngắn (100-200 từ)</option>
                <option value="medium">Trung bình (200-500 từ)</option>
                <option value="long">Dài (500-1000 từ)</option>
              </select>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                Kỷ niệm đã chọn: {selectedMemoryIds.length}
              </p>
              {selectedMemoryIds.length === 0 && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Vui lòng chọn ít nhất 1 kỷ niệm để tạo câu chuyện
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={selectedMemoryIds.length === 0 || isGenerating}
                className="flex-1 px-3 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3 w-3" />
                    Tạo câu chuyện
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowGenerator(false)}
                className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt mặc định
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Phong cách mặc định
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as GeneratedStory['style'])}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
              >
                <option value="narrative">Kể chuyện</option>
                <option value="poetic">Thơ ca</option>
                <option value="humorous">Hài hước</option>
                <option value="dramatic">Kịch tính</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Độ dài mặc định
              </label>
              <select
                value={selectedLength}
                onChange={(e) => setSelectedLength(e.target.value as GeneratedStory['length'])}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
              >
                <option value="short">Ngắn</option>
                <option value="medium">Trung bình</option>
                <option value="long">Dài</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
        <p className="text-xs text-pink-700 dark:text-pink-400">
          <strong>Gợi ý:</strong> AI sẽ tạo câu chuyện từ các kỷ niệm đã chọn. 
          Bạn có thể chọn phong cách viết và độ dài câu chuyện theo ý muốn.
        </p>
        </div>
      </div>

      {/* Stories List */}
      <div className="space-y-3">
        {stories.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có câu chuyện nào
            </p>
          </div>
        ) : (
          stories.map((story) => (
            <div
              key={story.id}
              className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getStyleColor(story.style)}`}>
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        {story.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 bg-gradient-to-r ${getStyleColor(story.style)} text-white text-[10px] font-bold rounded-full`}>
                          {getStyleLabel(story.style)}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-full">
                          {getLengthLabel(story.length)}
                        </span>
                        <span className="px-2 py-0.5 bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200 text-[10px] font-bold rounded-full">
                          {story.wordCount} từ
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleRegenerate(story.id)}
                        disabled={isGenerating}
                        className="p-1.5 hover:bg-pink-100 dark:hover:bg-pink-900 rounded-lg transition-colors"
                        title="Tạo lại"
                      >
                        <RefreshCw className={`h-3 w-3 text-slate-500 ${isGenerating ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-3">
                    {story.content}
                  </p>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-2">
                    <span>{story.memoryIds.length} kỷ niệm</span>
                    <span>•</span>
                    <span>Đã tạo: {new Date(story.generatedAt).toLocaleString('vi-VN')}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(story)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                      {copiedId === story.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          Đã sao chép
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Sao chép
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownload(story)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      Tải xuống
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare(story)}
                      className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                    >
                      <Share2 className="h-3 w-3" />
                      Chia sẻ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Tạo câu chuyện sử dụng AI để ghép các kỷ niệm thành một câu chuyện mạch lạc. 
          Bạn có thể chọn phong cách viết kể chuyện, thơ ca, hài hước hoặc kịch tính.
        </p>
      </div>
    </div>
  );
}