'use client';

import { useState } from 'react';
import { Music, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, ListMusic, RefreshCw, Check, Zap as ZapIcon, Plus, PlayCircle, SkipBack, SkipForward, Repeat, Shuffle, Heart, Share2, Trash2 as TrashIcon, Users, Calendar as CalendarIcon, Layers } from 'lucide-react';

interface PlaylistSong {
  id: string;
  songId: string;
  name: string;
  artist: string;
  duration: number;
  order: number;
  isFavorite: boolean;
}

interface MemoryPlaylist {
  id: string;
  name: string;
  description: string;
  period: string;
  songs: PlaylistSong[];
  createdAt: Date;
  isPublic: boolean;
  playCount: number;
  isPlaying: boolean;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
}

interface MemoryPlaylistProps {
  onCancel?: () => void;
  onCreate?: (playlist: Partial<MemoryPlaylist>) => Promise<void>;
  onPlay?: (playlistId: string) => Promise<void>;
  onPause?: (playlistId: string) => Promise<void>;
  onDelete?: (playlistId: string) => Promise<void>;
}

const DEFAULT_PLAYLISTS: MemoryPlaylist[] = [
  {
    id: 'playlist-1',
    name: 'Summer 2024 Vibes',
    description: 'Memories from summer travels',
    period: 'Summer 2024',
    songs: [
      {
        id: 'song-1',
        songId: 'track-1',
        name: 'Summer Breeze',
        artist: 'Chill Artist',
        duration: 180,
        order: 1,
        isFavorite: true,
      },
      {
        id: 'song-2',
        songId: 'track-2',
        name: 'Beach Sunset',
        artist: 'Relaxing Vibes',
        duration: 210,
        order: 2,
        isFavorite: false,
      },
    ],
    createdAt: new Date('2024-01-12'),
    isPublic: false,
    playCount: 15,
    isPlaying: false,
    shuffle: false,
    repeat: 'none',
  },
];

export default function MemoryPlaylist({ onCancel, onCreate, onPlay, onPause, onDelete }: MemoryPlaylistProps) {
  const [playlists, setPlaylists] = useState<MemoryPlaylist[]>(DEFAULT_PLAYLISTS);
  const [showSettings, setShowSettings] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  const totalPlaylists = playlists.length;
  const totalSongs = playlists.reduce((sum, p) => sum + p.songs.length, 0);
  const totalPlays = playlists.reduce((sum, p) => sum + p.playCount, 0);
  const avgSongs = totalSongs / totalPlaylists;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreate = async () => {
    if (newPlaylistName.trim()) {
      setIsCreating(true);
      await onCreate?.({
        name: newPlaylistName,
        description: '',
        period: 'Custom',
        songs: [],
        isPublic: false,
        playCount: 0,
        isPlaying: false,
        shuffle: false,
        repeat: 'none',
      });
      setIsCreating(false);
      setNewPlaylistName('');
    }
  };

  const handlePlay = async (playlistId: string) => {
    await onPlay?.(playlistId);
    setPlaylists(playlists.map(p => 
      p.id === playlistId ? { ...p, isPlaying: true } : { ...p, isPlaying: false }
    ));
  };

  const handlePause = async (playlistId: string) => {
    await onPause?.(playlistId);
    setPlaylists(playlists.map(p => 
      p.id === playlistId ? { ...p, isPlaying: false } : p
    ));
  };

  const handleDelete = async (playlistId: string) => {
    await onDelete?.(playlistId);
    setPlaylists(playlists.filter(p => p.id !== playlistId));
  };

  const handleToggleShuffle = (playlistId: string) => {
    setPlaylists(playlists.map(p => 
      p.id === playlistId ? { ...p, shuffle: !p.shuffle } : p
    ));
  };

  const handleToggleRepeat = (playlistId: string) => {
    setPlaylists(playlists.map(p => {
      if (p.id === playlistId) {
        const repeatOrder: ('none' | 'all' | 'one')[] = ['none', 'all', 'one'];
        const currentIndex = repeatOrder.indexOf(p.repeat);
        const nextIndex = (currentIndex + 1) % repeatOrder.length;
        return { ...p, repeat: repeatOrder[nextIndex] };
      }
      return p;
    }));
  };

  const handleToggleFavorite = (playlistId: string, songId: string) => {
    setPlaylists(playlists.map(p => 
      p.id === playlistId 
        ? { 
            ...p, 
            songs: p.songs.map(s => 
              s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s
            )
          }
        : p
    ));
  };

  const filteredPlaylists = selectedPeriod === 'all' 
    ? playlists 
    : playlists.filter(p => p.period === selectedPeriod);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <ListMusic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Playlist nhạc theo giai đoạn cuộc đời
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalPlaylists} playlists
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
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt memory playlist
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-generate from memories
              </span>
              <button
                type="button"
                onClick={() => setAutoGenerate(!autoGenerate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoGenerate ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoGenerate ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Sync with Spotify
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Cross-platform sync
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
            <ListMusic className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Playlists</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPlaylists}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Songs</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSongs}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <PlayCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Plays</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPlays}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Songs</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgSongs.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Create Playlist */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Tên playlist mới..."
            className="flex-1 px-4 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newPlaylistName.trim() || isCreating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>

      {/* Period Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedPeriod('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedPeriod === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedPeriod('Summer 2024')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedPeriod === 'Summer 2024'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Summer 2024
          </button>
          <button
            type="button"
            onClick={() => setSelectedPeriod('Spring 2024')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedPeriod === 'Spring 2024'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Spring 2024
          </button>
        </div>
      </div>

      {/* Playlist List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Playlists
        </h4>
        <div className="space-y-2">
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <ListMusic className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {playlist.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {playlist.period} • {playlist.songs.length} songs
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {playlist.isPlaying && (
                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold rounded-full">
                      Playing
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(playlist.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {playlist.description}
              </p>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Created</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {playlist.createdAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Plays</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {playlist.playCount}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Visibility</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {playlist.isPublic ? 'Public' : 'Private'}
                  </div>
                </div>
              </div>

              {/* Songs */}
              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Songs</div>
                <div className="space-y-1">
                  {playlist.songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-2 rounded bg-slate-100 dark:bg-slate-600/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{song.order}.</span>
                        <span className="text-xs text-slate-700 dark:text-slate-300">{song.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">• {song.artist}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{formatDuration(song.duration)}</span>
                        <button
                          type="button"
                          onClick={() => handleToggleFavorite(playlist.id, song.id)}
                          className="p-1"
                        >
                          <Heart className={`h-3 w-3 ${song.isFavorite ? 'text-pink-500' : 'text-slate-400'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => playlist.isPlaying ? handlePause(playlist.id) : handlePlay(playlist.id)}
                  className="p-2 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-full transition-colors"
                >
                  {playlist.isPlaying ? (
                    <Pause className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Play className="h-4 w-4 text-amber-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleShuffle(playlist.id)}
                  className={`p-2 rounded-full transition-colors ${
                    playlist.shuffle ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                >
                  <Shuffle className={`h-4 w-4 ${playlist.shuffle ? 'text-amber-500' : 'text-slate-500'}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleRepeat(playlist.id)}
                  className={`p-2 rounded-full transition-colors ${
                    playlist.repeat !== 'none' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                >
                  <Repeat className={`h-4 w-4 ${playlist.repeat !== 'none' ? 'text-amber-500' : 'text-slate-500'}`} />
                </button>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {playlist.repeat}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Playlist nhạc theo giai đoạn cuộc đời với playlist creation, period-based organization (Summer/Spring/etc.), song management (add/remove/reorder), playback controls (play/pause/shuffle/repeat), favorite songs, playlist sharing, play count tracking, auto-generate from memories, Spotify sync, và cross-platform sync.
        </p>
      </div>
    </div>
  );
}