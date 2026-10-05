'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

interface SearchResult {
  entityType: string;
  entityId: string;
  similarity: number;
  metadata: any;
}

export default function SemanticDeepSearch() {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [entityType, setEntityType] = useState<'memory' | 'image' | 'all'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:3001/ai-companion/semantic-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          entityType,
          limit: 10,
        }),
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Natural Semantic Deep Search</h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search concepts like "relaxing by the lake during twilight in Dalat"'
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Searching...' : '🔍 Search'}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEntityType('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              entityType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setEntityType('memory')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              entityType === 'memory'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Memories
          </button>
          <button
            type="button"
            onClick={() => setEntityType('image')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              entityType === 'image'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Images
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Results ({results.length})
        </h3>

        {results.length === 0 && query && !isSearching && (
          <p className="text-gray-500 py-8 text-center">No results found</p>
        )}

        {results.map((result, index) => (
          <div
            key={`${result.entityType}-${result.entityId}`}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    result.entityType === 'memory' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {result.entityType.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
                <p className="text-sm text-gray-600">ID: {result.entityId}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  {(result.similarity * 100).toFixed(1)}% match
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${result.similarity * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {result.metadata && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                <pre className="whitespace-pre-wrap">{JSON.stringify(result.metadata, null, 2)}</pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Powered by Vector Embeddings</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Search by concepts, not exact keywords</li>
          <li>• Uses CLIP/Gemini vector embeddings</li>
          <li>• Find memories by mood, atmosphere, or context</li>
          <li>• Supports natural language queries</li>
        </ul>
      </div>

      {/* Example Queries */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Example Queries</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'relaxing by the lake',
            'happy family moments',
            'sunset at the beach',
            'adventure in the mountains',
            'cozy winter evening',
          ].map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
