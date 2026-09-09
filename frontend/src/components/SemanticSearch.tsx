'use client';

import { useState } from 'react';
import { Brain, Sparkles, Check, X, RefreshCw, Settings, Search, Filter, TrendingUp } from 'lucide-react';

interface SemanticResult {
  id: string;
  memoryId: string;
  title: string;
  semanticScore: number;
  matchedConcepts: string[];
  preview: string;
}

interface SemanticSearchProps {
  results?: SemanticResult[];
  onSearch?: (query: string) => Promise<SemanticResult[]>;
  onSelectResult?: (memoryId: string) => Promise<void>;
  onCancel?: () => void;
  isSearching?: boolean;
}

const DEFAULT_RESULTS: SemanticResult[] = [
  {
    id: 'sem-1',
    memoryId: '1',
    title: 'Chuyến đi Đà Lạt',
    semanticScore: 92,
    matchedConcepts: ['du lịch', 'đà lạt', 'núi', 'thiên nhiên'],
    preview: 'Một kỷ niệm về chuyến đi đến Đà Lạt với vẻ đẹp thiên nhiên...',
  },
];

export default function SemanticSearch({
  results = DEFAULT_RESULTS,
  onSearch,
  onSelectResult,
  onCancel,
  isSearching = false,
}: SemanticSearchProps) {
  const [query, setQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(70);

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-amber-400 to-orange-500';
    return 'from-slate-400 to-slate-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tìm kiếm ngữ nghĩa
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

      {showSettings && (
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt
          </h4>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Ngưỡng tương đồng: {similarityThreshold}%
            </label>
            <input
              type="range"
              min="50"
              max="95"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Nhập ý nghĩa để tìm kiếm..."
            className="w-full px-4 py-3 pl-12 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-all"
        >
          {isSearching ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Đang tìm kiếm...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4" />
              Tìm kiếm ngữ nghĩa
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Nhập ý nghĩa để bắt đầu tìm kiếm
            </p>
          </div>
        ) : (
          results.map((result) => (
            <div
              key={result.id}
              className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-all"
              onClick={() => handleSelect(result.memoryId)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getScoreColor(result.semanticScore)}`}>
                  <Filter className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                      {result.title}
                    </h4>
                    <span className={`px-2 py-0.5 bg-gradient-to-r ${getScoreColor(result.semanticScore)} text-white text-[10px] font-bold rounded-full`}>
                      {result.semanticScore}% tương đồng
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {result.preview}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {result.matchedConcepts.map((concept, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-[10px] font-medium rounded-full"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}