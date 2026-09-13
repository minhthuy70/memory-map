'use client';

import { useState } from 'react';
import { Music, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Mic, RefreshCw, Check, Zap as ZapIcon, Plus, PlayCircle, StopCircle, MapPin, Volume2, Waves, FileAudio, Ear, Share2, Trash2 as TrashIcon } from 'lucide-react';

interface SoundMemory {
  id: string;
  memoryId: string;
  title: string;
  location: string;
  coordinates: { lat: number; lng: number };
  recordingDate: Date;
  duration: number;
  size: number;
  format: string;
  url: string;
  category: 'nature' | 'urban' | 'indoor' | 'music' | 'voice' | 'other';
  description: string;
  isPlaying: boolean;
  volume: number;
}

interface SoundMemoryProps {
  onCancel?: () => void;
  onRecord?: (memoryId: string, duration: number) => Promise<void>;
  onPlay?: (soundId: string) => Promise<void>;
  onPause?: (soundId: string) => Promise<void>;
  onDelete?: (soundId: string) => Promise<void>;
}

const DEFAULT_SOUNDS: SoundMemory[] = [
  {
    id: 'sound-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt Morning Birds',
    location: 'Đà Lạt, Vietnam',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    recordingDate: new Date('2024-01-12'),
    duration: 180,
    size: 8000000,
    format: 'wav',
    url: '/sound-1.wav',
    category: 'nature',
    description: 'Birds singing in the morning mist',
    isPlaying: false,
    volume: 80,
  },
];

export default function SoundMemory({ onCancel, onRecord, onPlay, onPause, onDelete }: SoundMemoryProps) {
  const [sounds, setSounds] = useState<SoundMemory[]>(DEFAULT_SOUNDS);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [autoDetect, setAutoDetect] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const totalSounds = sounds.length;
  const playingCount = sounds.filter(s => s.isPlaying).length;
  const totalSize = sounds.reduce((sum, s) => sum + s.size, 0);
  const totalDuration = sounds.reduce((sum, s) => sum + s.duration, 0);

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

  const handleRecord = async (memoryId: string) => {
    setIsRecording(true);
    setRecordingDuration(0);
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    await onRecord?.(memoryId, recordingDuration);
    
    clearInterval(interval);
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const handlePlay = async (soundId: string) => {
    await onPlay?.(soundId);
    setSounds(sounds.map(s => 
      s.id === soundId ? { ...s, isPlaying: true } : { ...s, isPlaying: false }
    ));
  };

  const handlePause = async (soundId: string) => {
    await onPause?.(soundId);
    setSounds(sounds.map(s => 
      s.id === soundId ? { ...s, isPlaying: false } : s
    ));
  };

  const handleDelete = async (soundId: string) => {
    await onDelete?.(soundId);
    setSounds(sounds.filter(s => s.id !== soundId));
  };

  const handleVolumeChange = (soundId: string, volume: number) => {
    setSounds(sounds.map(s => 
      s.id === soundId ? { ...s, volume } : s
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'nature':
        return 'text-green-500';
      case 'urban':
        return 'text-slate-500';
      case 'indoor':
        return 'text-amber-500';
      case 'music':
        return 'text-purple-500';
      case 'voice':
        return 'text-blue-500';
      default:
        return 'text-slate-500';
    }
  };

  const filteredSounds = selectedCategory === 'all' 
    ? sounds 
    : sounds.filter(s => s.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Kỷ niệm âm thanh (tiếng địa điểm)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalSounds} sounds
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
        <div className="mb-4 p-4 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt sound memory
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect location
              </span>
              <button
                type="button"
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetect ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoDetect ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Noise reduction
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                High-quality recording
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
            <Waves className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Sounds</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSounds}
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

      {/* Recording Button */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => handleRecord('mem-1')}
          disabled={isRecording}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-500 hover:to-teal-600 text-white'
          }`}
        >
          {isRecording ? (
            <>
              <StopCircle className="h-5 w-5 animate-pulse" />
              Recording... {formatDuration(recordingDuration)}
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Record Ambient Sound
            </>
          )}
        </button>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('nature')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'nature'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Nature
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('urban')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'urban'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Urban
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('indoor')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'indoor'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Indoor
          </button>
        </div>
      </div>

      {/* Sound List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Kỷ niệm âm thanh
        </h4>
        <div className="space-y-2">
          {filteredSounds.map((sound) => (
            <div
              key={sound.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                    <Waves className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {sound.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {sound.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sound.isPlaying && (
                    <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-semibold rounded-full">
                      Playing
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(sound.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(sound.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(sound.size)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Category</div>
                  <div className={`text-xs ${getCategoryColor(sound.category)} capitalize`}>
                    {sound.category}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Recorded</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {sound.recordingDate.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {sound.description}
              </p>

              {/* Playback Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => sound.isPlaying ? handlePause(sound.id) : handlePlay(sound.id)}
                  className="p-2 bg-cyan-100 dark:bg-cyan-900/30 hover:bg-cyan-200 dark:hover:bg-cyan-900/50 rounded-full transition-colors"
                >
                  {sound.isPlaying ? (
                    <Pause className="h-4 w-4 text-cyan-500" />
                  ) : (
                    <Play className="h-4 w-4 text-cyan-500" />
                  )}
                </button>

                <div className="flex items-center gap-2 flex-1">
                  <Volume2 className="h-4 w-4 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sound.volume}
                    onChange={(e) => handleVolumeChange(sound.id, parseInt(e.target.value))}
                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {sound.volume}%
                  </span>
                </div>

                <button
                  type="button"
                  className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full transition-colors"
                >
                  <MapPin className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 rounded-lg">
        <p className="text-[10px] text-cyan-700 dark:text-cyan-400">
          <strong>Lưu ý:</strong> Kỷ niệm âm thanh (tiếng địa điểm) với ambient sound recording, location association (GPS coordinates), categorization (nature/urban/indoor/music/voice/other), playback controls, volume adjustment, sound management, auto-detect location, noise reduction, high-quality recording, và location mapping.
        </p>
      </div>
    </div>
  );
}