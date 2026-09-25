'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
}

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, locationName: string) => void;
  placeholder?: string;
}

const getResultIcon = (result: SearchResult): string => {
  const cls = result.class || '';
  const type = result.type || '';
  if (cls === 'amenity' || type === 'restaurant' || type === 'cafe') return '🍽️';
  if (type === 'hotel' || type === 'hostel') return '🏨';
  if (cls === 'shop') return '🛍️';
  if (cls === 'tourism' || type === 'museum' || type === 'attraction') return '🏛️';
  if (cls === 'natural' || type === 'park' || type === 'forest') return '🌿';
  if (cls === 'highway' || type === 'road' || type === 'street') return '🛣️';
  if (type === 'city' || type === 'town' || type === 'village') return '🏙️';
  if (cls === 'place') return '📍';
  return '📍';
};

export default function LocationSearch({
  onLocationSelect,
  placeholder = 'Tìm kiếm địa điểm...',
}: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      setShowResults(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      setShowResults(true);
      setHasSearched(false);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`
        );
        const data: SearchResult[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
        setHasSearched(true);
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
    setHasSearched(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setHasSearched(false);
  };

  const showDropdown = showResults && (isLoading || hasSearched);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0 || hasSearched) setShowResults(true); }}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm shadow-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
          aria-label="Tìm kiếm địa điểm"
          autoComplete="off"
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
            title="Xóa tìm kiếm"
            aria-label="Xóa tìm kiếm"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {showDropdown && (
        <div className="absolute z-[2000] w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 p-4 text-sm text-slate-500 dark:text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>Đang tìm kiếm địa điểm...</span>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Không tìm thấy kết quả
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                Thử từ khóa khác hoặc kiểm tra chính tả
              </p>
            </div>
          ) : (
            <>
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase px-3 pt-2 pb-1">
                {results.length} kết quả tìm kiếm
              </p>
              {results.map((result) => (
                <button
                  key={result.place_id}
                  type="button"
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-base shrink-0 mt-0.5">{getResultIcon(result)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {result.display_name.split(',')[0]}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        <MapPin className="inline h-3 w-3 mr-0.5 -mt-0.5 text-slate-400" />
                        {result.display_name}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
