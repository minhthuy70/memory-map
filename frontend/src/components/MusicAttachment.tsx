'use client';

import { useState } from 'react';
import { Music, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Upload, RefreshCw, Check, Zap as ZapIcon, Plus, PlayCircle, SkipBack, SkipForward, Volume2, Music2, FileAudio, ListMusic, Shuffle, Repeat } from 'lucide-react';

interface AttachedMusic {
  id: string;
  memoryId: string;
  musicName: string;
  artist: string;
  album: string;
  duration: number;
  size: number;
  format: string;
  url: string;
  attachedAt: Date;
  isPlaying: boolean;
  volume: number;
  loop: boolean;
}

interface MusicAttachmentProps {
  onCancel?: () => void;
  onAttach?: (memoryId: string, musicFile: File) => Promise<void>;
  onPlay?: (musicId: string) => Promise<void>;
  onPause?: (musicId: string) => Promise<void>;
  onRemove?: (musicId: string) => Promise<void>;
}

const DEFAULT_MUSIC: AttachedMusic[] = [
  {
    id: 'music-1',
    memoryId: 'mem-1',
    musicName: 'Summer Vibes',
    artist: 'Chill Vibes',
    album: 'Summer Collection',
    duration: 240,
    size: 5000000,
    format: 'mp3',
    url: '/music-1.mp3',
    attachedAt: new Date('2024-01-12'),
    isPlaying: false,
    volume: 80,
    loop: false,
  },
];

export default function MusicAttachment({ onCancel, onAttach, onPlay, onPause, onRemove }: MusicAttachmentProps) {
  const [musicList, setMusicList] = useState<AttachedMusic[]>(DEFAULT_MUSIC);
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [crossfade, setCrossfade] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const totalMusic = musicList.length;
  const playingCount = musicList.filter(m => m.isPlaying).length;
  const totalSize = musicList.reduce((sum, m) => sum + m.size, 0);
  const totalDuration = musicList.reduce((sum, m) => sum + m.duration, 0);

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAttach = async (memoryId: string, musicFile: File) => {
    setIsUploading(true);
    await onAttach?.(memoryId, musicFile);
    setIsUploading(false);
  };

  const handlePlay = async (musicId: string) => {
    await onPlay?.(musicId);
    setMusicList(musicList.map(m => 
      m.id === musicId ? { ...m, isPlaying: true } : { ...m, isPlaying: false }
    ));
  };

  const handlePause = async (musicId: string) => {
    await onPause?.(musicId);
    setMusicList(musicList.map(m => 
      m.id === musicId ? { ...m, isPlaying: false } : m
    ));
  };

  const handleRemove = async (musicId: string) => {
    await onRemove?.(musicId);
    setMusicList(musicList.filter(m => m.id !== musicId));
  };

  const handleVolumeChange = (musicId: string, volume: number) => {
    setMusicList(musicList.map(m => 
      m.id === musicId ? { ...m, volume } : m
    ));
  };

  const handleToggleLoop = (musicId: string) => {
    setMusicList(musicList.map(m => 
      m.id === musicId ? { ...m, loop: !m.loop } : m
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Music className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Đính kèm nhạc nền cho kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalMusic} tracks
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
        <div className="mb-4 p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt music attachment
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-play on load
              </span>
              <button
                type="button"
                onClick={() => setAutoPlay(!autoPlay)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoPlay ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoPlay ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Crossfade between tracks
              </span>
              <button
                type="button"
                onClick={() => setCrossfade(!crossfade)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  crossfade ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    crossfade ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Shuffle playback
              </span>
              <button
                type="button"
                onClick={() => setShuffle(!shuffle)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  shuffle ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    shuffle ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Music className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Tracks</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMusic}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <PlayCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Playing</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {playingCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <FileAudio className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalSize / 1048576).toFixed(1)}MB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(totalDuration)}
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-pink-400 dark:hover:border-pink-600 transition-colors">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Kéo và thả file nhạc vào đây hoặc click để chọn
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hỗ trợ: MP3, WAV, FLAC, AAC, OGG
          </p>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="music-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleAttach('mem-1', e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="music-upload"
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Chọn Nhạc
          </label>
        </div>
      </div>

      {/* Music List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Đính kèm nhạc
        </h4>
        <div className="space-y-2">
          {musicList.map((music) => (
            <div
              key={music.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
                    <Music2 className="h-4 w-4 text-pink-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {music.musicName}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {music.artist} • {music.album}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {music.isPlaying && (
                    <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-[10px] font-semibold rounded-full">
                      Playing
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(music.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(music.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(music.size)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Format</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 uppercase">
                    {music.format}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Attached</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {music.attachedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => music.isPlaying ? handlePause(music.id) : handlePlay(music.id)}
                  className="p-2 bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 rounded-full transition-colors"
                >
                  {music.isPlaying ? (
                    <Pause className="h-4 w-4 text-pink-500" />
                  ) : (
                    <Play className="h-4 w-4 text-pink-500" />
                  )}
                </button>

                <div className="flex items-center gap-2 flex-1">
                  <Volume2 className="h-4 w-4 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={music.volume}
                    onChange={(e) => handleVolumeChange(music.id, parseInt(e.target.value))}
                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-pink-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {music.volume}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleLoop(music.id)}
                  className={`p-2 rounded-full transition-colors ${
                    music.loop ? 'bg-pink-100 dark:bg-pink-900/30' : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                >
                  <Repeat className={`h-4 w-4 ${music.loop ? 'text-pink-500' : 'text-slate-500'}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Đính kèm nhạc nền cho kỷ niệm với drag-and-drop upload, supported formats (MP3/WAV/FLAC/AAC/OGG), play/pause controls, volume adjustment, loop toggle, track management, auto-play on load, crossfade between tracks, shuffle playback, và playback statistics.
        </p>
      </div>
    </div>
  );
}