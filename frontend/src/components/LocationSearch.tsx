'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, locationName: string) => void;
  placeholder?: string;
}

export default function LocationSearch({
  onLocationSelect,
  placeholder = 'Search for a place...',
}: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
        );
        const data: SearchResult[] = await response.json();
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    onLocationSelect(lat, lng, result.display_name);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
          onFocus={() => setShowResults(true)}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-600 dark:text-slate-400">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-slate-600 dark:text-slate-400">
              No results found
            </div>
          ) : (
            results.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleResultClick(result)}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {result.display_name.split(',')[0]}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      {result.display_name}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
