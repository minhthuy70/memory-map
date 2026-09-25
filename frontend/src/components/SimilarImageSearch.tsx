'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Hash,
  Image,
  ImageIcon,
  Layers,
  RefreshCw,
  Scan,
  Search,
  Settings,
  Sparkles,
  Upload,
  Zap,
  ZapIcon
} from 'lucide-react';

interface SimilarImage {
  id: string;
  name: string;
  url: string;
  similarity: number;
  features: string[];
  distance: number;
  matchType: 'exact' | 'high' | 'medium' | 'low';
}

interface SearchResult {
  queryImageId: string;
  queryImageName: string;
  similarImages: SimilarImage[];
  searchedAt: Date;
  searchTime: number;
  method: 'cosine' | 'euclidean' | 'hamming';
}

interface SimilarImageSearchProps {
  onCancel?: () => void;
  onSearch?: (imageId: string) => Promise<void>;
}

const DEFAULT_RESULTS: SearchResult[] = [
  {
    queryImageId: 'img-1',
    queryImageName: 'family-vacation.jpg',
    similarImages: [
      {
        id: 'img-2',
        name: 'beach-trip-2023.jpg',
        url: '/beach-2023.jpg',
        similarity: 0.92,
        features: ['beach', 'ocean', 'sky', 'family'],
        distance: 0.08,
        matchType: 'high',
      },
      {
        id: 'img-3',
        name: 'sunset-beach.jpg',
        url: '/sunset.jpg',
        similarity: 0.85,
        features: ['beach', 'sunset', 'ocean'],
        distance: 0.15,
        matchType: 'high',
      },
      {
        id: 'img-4',
        name: 'park-day.jpg',
        url: '/park.jpg',
        similarity: 0.72,
        features: ['outdoor', 'sky', 'nature'],
        distance: 0.28,
        matchType: 'medium',
      },
      {
        id: 'img-5',
        name: 'indoor-dinner.jpg',
        url: '/dinner.jpg',
        similarity: 0.45,
        features: ['indoor', 'people'],
        distance: 0.55,
        matchType: 'low',
      },
    ],
    searchedAt: new Date('2024-01-12'),
    searchTime: 0.8,
    method: 'cosine',
  },
];

export default function SimilarImageSearch({ onCancel, onSearch }: SimilarImageSearchProps) {
  const [results, setResults] = useState<SearchResult[]>(DEFAULT_RESULTS);
  const [showSettings, setShowSettings] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.7);
  const [selectedMethod, setSelectedMethod] = useState<'cosine' | 'euclidean' | 'hamming'>('cosine');
  const [selectedMatchType, setSelectedMatchType] = useState<string>('all');
  const [isSearching, setIsSearching] = useState(false);

  const totalSimilarImages = results.reduce((sum, r) => sum + r.similarImages.length, 0);
  const avgSimilarity = totalSimilarImages > 0 ? results.reduce((sum, r) => sum + r.similarImages.reduce((s, i) => s + i.similarity, 0), 0) / totalSimilarImages : 0;
  const avgSearchTime = results.reduce((sum, r) => sum + r.searchTime, 0) / results.length;

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return 'text-purple-500';
      case 'high':
        return 'text-green-500';
      case 'medium':
        return 'text-amber-500';
      case 'low':
        return 'text-slate-500';
      default:
        return 'text-slate-500';
    }
  };

  const getMatchTypeLabel = (matchType: string) => {
    switch (matchType) {
      case 'exact':
        return 'Exact';
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  const handleSearch = async (imageId: string) => {
    setIsSearching(true);
    await onSearch?.(imageId);
    setIsSearching(false);
  };

  const filteredImages = results.flatMap(r => 
    r.similarImages.filter(i => 
      i.similarity >= similarityThreshold &&
      (selectedMatchType === 'all' || i.matchType === selectedMatchType)
    )
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tìm kiếm ảnh tương tự
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalSimilarImages} similar images found
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
            Cài đặt similar image search
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Similarity threshold: {(similarityThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Similarity method
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value="cosine">Cosine Similarity</option>
                <option value="euclidean">Euclidean Distance</option>
                <option value="hamming">Hamming Distance</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Feature extraction
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">CNN-based</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Similar Images</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSimilarImages}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Similarity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgSimilarity * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgSearchTime.toFixed(1)}s
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Method</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedMethod}
          </div>
        </div>
      </div>

      {/* Match Type Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedMatchType('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedMatchType === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedMatchType('high')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedMatchType === 'high'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            High
          </button>
          <button
            type="button"
            onClick={() => setSelectedMatchType('medium')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedMatchType === 'medium'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() => setSelectedMatchType('low')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedMatchType === 'low'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Low
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Search Results
        </h4>
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.queryImageId}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Query: {result.queryImageName}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {result.similarImages.length} similar images
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSearch(result.queryImageId)}
                  disabled={isSearching}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <RefreshCw className="h-3 w-3" />
                  {isSearching ? 'Searching...' : 'Re-search'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Searched</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.searchedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Time</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.searchTime}s
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Method</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {result.method}
                  </div>
                </div>
              </div>

              {/* Similar Images */}
              <div className="space-y-2">
                {result.similarImages.filter(i => i.similarity >= similarityThreshold && (selectedMatchType === 'all' || i.matchType === selectedMatchType)).map((image) => (
                  <div
                    key={image.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-slate-500" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {image.name}
                          </span>
                          <div className={`text-xs ${getMatchTypeColor(image.matchType)} capitalize`}>
                            {getMatchTypeLabel(image.matchType)} match
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {(image.similarity * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Similarity</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {(image.similarity * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Distance</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {image.distance.toFixed(3)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Features</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {image.features.length}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {image.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-[10px] rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Tìm kiếm ảnh tương tự sử dụng computer vision để tìm ảnh có vẻ giống nhau với CNN-based feature extraction, similarity methods (cosine/euclidean/hamming), similarity thresholding, match type classification (exact/high/medium/low), feature matching, và re-search functionality.
        </p>
      </div>
    </div>
  );
}