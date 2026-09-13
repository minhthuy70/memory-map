'use client';

import { useState } from 'react';
import { Music, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Search, RefreshCw, Check, Zap as ZapIcon, Plus, PlayCircle, ExternalLink, Heart, Share2, ListMusic, Spotify, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';

interface SpotifySong {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  uri: string;
  previewUrl: string;
  popularity: number;
  isSaved: boolean;
}

interface MemorySongTag {
  id: string;
  memoryId: string;
  song: SpotifySong;
  taggedAt: Date;
  isFavorite: boolean;
}

interface SpotifySongTaggingProps {
  onCancel?: () => void;
  onSearch?: (query: string) => Promise<SpotifySong[]>;
  onTag?: (memoryId: string, song: SpotifySong) => Promise<void>;
  onUntag?: (tagId: string) => Promise<void>;
  onPlayPreview?: (songId: string) => Promise<void>;
}

const DEFAULT_SONGS: SpotifySong[] = [
  {
    id: 'song-1',
    name: 'Summer Vibes',
    artist: 'Chill Artist',
    album: 'Summer Collection',
    albumArt: '/album-1.jpg',
    duration: 210,
    uri: 'spotify:track:1',
    previewUrl: '/preview-1.mp3',
    popularity: 85,
    isSaved: false,
  },
];

const DEFAULT_TAGS: MemorySongTag[] = [
  {
    id: 'tag-1',
    memoryId: 'mem-1',
    song: DEFAULT_SONGS[0],
    taggedAt: new Date('2024-01-12'),
    isFavorite: true,
  },
];

export default function SpotifySongTagging({ onCancel, onSearch, onTag, onUntag, onPlayPreview }: SpotifySongTaggingProps) {
  const [searchResults, setSearchResults] = useState<SpotifySong[]>([]);
  const [tags, setTags] = useState<MemorySongTag[]>(DEFAULT_TAGS);
  const [showSettings, setShowSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [autoTag, setAutoTag] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);

  const totalTags = tags.length;
  const favoriteTags = tags.filter(t => t.isFavorite).length;
  const totalDuration = tags.reduce((sum, t) => sum + t.song.duration, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const results = await onSearch?.(searchQuery) || [];
      setSearchResults(results);
      setIsSearching(false);
    }
  };

  const handleTag = async (memoryId: string, song: SpotifySong) => {
    await onTag?.(memoryId, song);
    const newTag: MemorySongTag = {
      id: `tag-${Date.now()}`,
      memoryId,
      song,
      taggedAt: new Date(),
      isFavorite: false,
    };
    setTags([...tags, newTag]);
    setSearchResults(searchResults.filter(s => s.id !== song.id));
  };

  const handleUntag = async (tagId: string) => {
    await onUntag?.(tagId);
    setTags(tags.filter(t => t.id !== tagId));
  };

  const handleToggleFavorite = (tagId: string) => {
    setTags(tags.map(t => 
      t.id === tagId ? { ...t, isFavorite: !t.isFavorite } : t
    ));
  };

  const handlePlayPreview = async (songId: string) => {
    await onPlayPreview?.(songId);
  };

  const filteredTags = showFavorites ? tags.filter(t => t.isFavorite) : tags;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Spotify className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Gắn bài hát Spotify vào kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalTags} tagged songs
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
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt Spotify integration
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-tag from listening history
              </span>
              <button
                type="button"
                onClick={() => setAutoTag(!autoTag)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoTag ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoTag ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Spotify connected
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Premium features
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Spotify className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Tagged</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalTags}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Favorites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {favoriteTags}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <PlayCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(totalDuration)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ListMusic className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Popularity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(tags.reduce((sum, t) => sum + t.song.popularity, 0) / totalTags).toFixed(0)}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm kiếm bài hát trên Spotify..."
            className="w-full px-4 py-3 pl-12 text-sm border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={!searchQuery.trim() || isSearching}
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
          {isSearching ? 'Searching...' : 'Search Spotify'}
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Kết quả tìm kiếm
          </h4>
          <div className="space-y-2">
            {searchResults.map((song) => (
              <div
                key={song.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <Music className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {song.name}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {song.artist} • {song.album}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handlePlayPreview(song.id)}
                          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                        >
                          <PlayCircle className="h-4 w-4 text-green-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => window.open(`https://open.spotify.com/track/${song.id}`, '_blank')}
                          className="p-1 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                        >
                          <ExternalLink className="h-4 w-4 text-green-500" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span>{formatDuration(song.duration)}</span>
                        <span>Popularity: {song.popularity}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTag('mem-1', song)}
                        className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                        Tag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFavorites(false)}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              !showFavorites
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setShowFavorites(true)}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              showFavorites
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>

      {/* Tagged Songs */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Bài hát đã gắn
        </h4>
        <div className="space-y-2">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <Music className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {tag.song.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {tag.song.artist}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(tag.id)}
                    className={`p-1 rounded ${tag.isFavorite ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-slate-200 dark:bg-slate-600'}`}
                  >
                    <Heart className={`h-4 w-4 ${tag.isFavorite ? 'text-pink-500' : 'text-slate-500'}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUntag(tag.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(tag.song.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Tagged</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {tag.taggedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Popularity</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {tag.song.popularity}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Gắn bài hát Spotify vào kỷ niệm với Spotify search integration, song tagging/untaging, favorite toggle, preview playback, external link to Spotify, tag management, auto-tag from listening history, popularity tracking, và Spotify connected status.
        </p>
      </div>
    </div>
  );
}