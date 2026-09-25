'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Filter,
  Image,
  Info,
  MapPin,
  Mic,
  RefreshCw,
  Search,
  Star,
  Type,
  Zap
} from 'lucide-react';

interface ImageTextCombinedSearchProps {
  onCancel?: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  textMatch: number;
  imageMatch: number;
  combinedScore: number;
  timestamp: string;
  location: string;
}

interface SearchQuery {
  id: string;
  imageInput: string;
  textInput: string;
  imageWeight: number;
  textWeight: number;
  resultsCount: number;
  timestamp: string;
}

export default function ImageTextCombinedSearch({ onCancel }: ImageTextCombinedSearchProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSearchEnabled, setIsSearchEnabled] = useState(true);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([
    { id: '1', title: 'Paris Sunset', description: 'Beautiful sunset at Eiffel Tower', imageUrl: '/images/paris.jpg', textMatch: 0.85, imageMatch: 0.92, combinedScore: 0.89, timestamp: '2024-01-15', location: 'Paris, France' },
    { id: '2', title: 'Beach Day', description: 'Sunny day at the beach with friends', imageUrl: '/images/beach.jpg', textMatch: 0.78, imageMatch: 0.88, combinedScore: 0.83, timestamp: '2024-02-20', location: 'California, USA' },
    { id: '3', title: 'Mountain Hiking', description: 'Reached the summit after long hike', imageUrl: '/images/mountain.jpg', textMatch: 0.92, imageMatch: 0.75, combinedScore: 0.84, timestamp: '2024-03-10', location: 'Swiss Alps' },
    { id: '4', title: 'City Nightlife', description: 'Tokyo at night with neon lights', imageUrl: '/images/tokyo.jpg', textMatch: 0.65, imageMatch: 0.95, combinedScore: 0.80, timestamp: '2024-04-05', location: 'Tokyo, Japan' },
  ]);

  const [searchQueries, setSearchQueries] = useState<SearchQuery[]>([
    { id: '1', imageInput: 'sunset_photo.jpg', textInput: 'sunset evening', imageWeight: 0.6, textWeight: 0.4, resultsCount: 15, timestamp: '2024-01-15 10:30' },
    { id: '2', imageInput: 'beach_scene.jpg', textInput: 'ocean water', imageWeight: 0.5, textWeight: 0.5, resultsCount: 23, timestamp: '2024-02-20 14:45' },
  ]);

  const [imageWeight, setImageWeight] = useState(0.5);
  const [textWeight, setTextWeight] = useState(0.5);
  const [searchText, setSearchText] = useState('');

  const performSearch = () => {
    const newQuery: SearchQuery = {
      id: Date.now().toString(),
      imageInput: 'uploaded_image.jpg',
      textInput: searchText,
      imageWeight,
      textWeight,
      resultsCount: Math.floor(Math.random() * 20) + 10,
      timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
    };
    setSearchQueries([...searchQueries, newQuery]);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (score >= 0.8) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (score >= 0.7) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Search className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Image + Text Combined Search
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-modal search with images and text
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSearchEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSearchEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Results</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{searchResults.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Queries</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{searchQueries.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Score</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(searchResults.reduce((acc, r) => acc + r.combinedScore, 0) / searchResults.length).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Top Match</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{Math.max(...searchResults.map(r => r.combinedScore)).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSearchEnabled}
              onChange={(e) => setIsSearchEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Search</span>
          </div>
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search text..."
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
          />
          <button
            type="button"
            onClick={performSearch}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Search className="h-3 w-3" />
            Search
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Search Weights</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Image className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Image Weight</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={imageWeight}
                  onChange={(e) => setImageWeight(parseFloat(e.target.value))}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{imageWeight.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Type className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Text Weight</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={textWeight}
                  onChange={(e) => setTextWeight(parseFloat(e.target.value))}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{textWeight.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Search Results</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchResults.map((result) => (
              <div key={result.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <Image className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{result.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getScoreColor(result.combinedScore)}`}>
                          {(result.combinedScore * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{result.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {result.timestamp} • {result.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Image: {(result.imageMatch * 100).toFixed(0)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Text: {(result.textMatch * 100).toFixed(0)}%</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    Similar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Search History</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {searchQueries.map((query) => (
              <div key={query.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-indigo-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{query.textInput}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">+ {query.imageInput}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Image: {query.imageWeight.toFixed(1)} • Text: {query.textWeight.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{query.resultsCount} results</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{query.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Multi-modal Search Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Combine image similarity with text matching</li>
              <li>• Adjustable weights for image vs text importance</li>
              <li>• Combined score provides relevance ranking</li>
              <li>• Search history tracks all multi-modal queries</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
