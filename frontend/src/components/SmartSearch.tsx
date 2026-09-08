'use client';

import { useState } from 'react';
import { Search, Sparkles, Filter, Check, X, RefreshCw, Settings, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

interface SmartSearchResult {
  id: string;
  memoryId: string;
  title: string;
  relevanceScore: number; // 0-100
  matchedTerms: string[];
  matchedContext: string;
  category: string;
  mood: string;
  date: Date;
}

interface SmartSearchProps {
  results?: SmartSearchResult[];
  onSearch?: (query: string) => Promise<SmartSearchResult[]>;
  onSelectResult?: (memoryId: string) => Promise<void>;
  onClearResults?: () => Promise<void>;
  onCancel?: () => void;
  isSearching?: boolean;
  currentQuery?: string;
}

const DEFAULT_RESULTS: SmartSearchResult[] = [
  {
    id: 'result-1',
    memoryId: '1',
    title: 'Chuyến đi Đà Lạt với gia đình',
    relevanceScore: 95,
    matchedTerms: ['đà lạt', 'gia đình'],
    matchedContext: 'Chuyến đi đáng nhớ đến Đà Lạt cùng gia đình...',
    category: 'Family',
    mood: 'Vui vẻ',
    date: new Date(),
  },
];

export default function SmartSearch({
  results = DEFAULT_RESULTS,
  onSearch,
  onSelectResult,
  onClearResults,
  onCancel,
  isSearching = false,
  currentQuery = '',
}: SmartSearchProps) {
  const [query, setQuery] = useState(currentQuery);
  const [showSettings, setShowSettings] = useState(false);
  const [searchScope, setSearchScope] = useState('all');
  const [minRelevance, setMinRelevance] = useState(50);
  const [maxResults, setMaxResults] = useState(10);
  const [debounceMs, setDebounceMs] = useState(300);

  const handleSearch = async () => {
    if (onSearch && query.trim()) {
      await onSearch(query);
    }
  };

  const handleSelect = async (memoryId: string) => {
    if (onSelectResult) {
      await onSelectResult(memoryId);
    }
  };

  const handleClear = async () => {
    setQuery('');
    if (onClearResults) {
      await onClearResults();
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-amber-400 to-orange-500';
    return 'from-slate-400 to-slate-500';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Family: '👨‍👩‍👧',
      Friends: '👥',
      Love: '❤️',
      Travel: '✈️',
      Work: '💼',
      Study: '🎓',
      Event: '🎉',
      Personal: '🌱',
      Other: '⭐',
    };
    return icons[category] || '📁';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tìm kiếm thông minh
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {results.length} kết quả
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
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt tìm kiếm
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Phạm vi tìm kiếm
              </label>
              <select
                value={searchScope}
                onChange={(e) => setSearchScope(e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Tất cả</option>
                <option value="title">Tiêu đề</option>
                <option value="content">Nội dung</option>
                <option value="location">Địa điểm</option>
                <option value="tags">Tags</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Độ tương quan tối thiểu: {minRelevance}%
              </label>
              <input
                type="range"
                min="30"
                max="90"
                value={minRelevance}
                onChange={(e) => setMinRelevance(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>30%</span>
                <span>90%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Số kết quả tối đa: {maxResults}
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={maxResults}
                onChange={(e) => setMaxResults(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>5</span>
                <span>20</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Debounce: {debounceMs}ms
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step={50}
                value={debounceMs}
                onChange={(e) => setDebounceMs(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>100ms</span>
                <span>500ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Nhập từ khóa để tìm kiếm..."
            className="w-full px-4 py-3 pl-12 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isSearching ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang tìm kiếm...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Tìm kiếm thông minh
            </>
          )}
        </button>
      </div>

      {/* Info Banner */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <strong>Gợi ý:</strong> Tìm kiếm thông minh sử dụng NLP để hiểu ngữ nghĩa và tìm kiếm theo nội dung, không chỉ từ khóa khớp.
          </p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Nhập từ khóa để bắt đầu tìm kiếm
            </p>
          </div>
        ) : (
          results.map((result) => (
            <div
              key={result.id}
              className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              onClick={() => handleSelect(result.memoryId)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getRelevanceColor(result.relevanceScore)}`}>
                  <Filter className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        {result.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 bg-gradient-to-r ${getRelevanceColor(result.relevanceScore)} text-white text-[10px] font-bold rounded-full`}>
                          {result.relevanceScore}% tương quan
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-full">
                          {getCategoryIcon(result.category)} {result.category}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-full">
                          {result.mood}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {result.matchedContext}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {result.matchedTerms.map((term, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-medium rounded-full"
                      >
                        "{term}"
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span>{new Date(result.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Tìm kiếm thông minh sử dụng NLP để phân tích ngữ nghĩa và tìm kiếm theo nội dung thực tế, 
          không chỉ khớp từ khóa. Kết quả được xếp theo độ tương quan.
        </p>
      </div>
    </div>
  );
}