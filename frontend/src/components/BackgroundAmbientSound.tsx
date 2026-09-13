'use client';

import { useState } from 'react';
import { Mic, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Waves, RefreshCw, Check, Zap as ZapIcon, Plus, Mic as MicIcon, StopCircle, PlayCircle, Volume2, Trash2 as TrashIcon, ExternalLink, MapPin, Zap as ZapIcon2, Activity as ActivityIcon, Save, FileAudio } from 'lucide-react';

interface AmbientSound {
  id: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  audioUrl: string;
  duration: number;
  size: number;
  format: string;
  recordedAt: Date;
  category: 'nature' | 'urban' | 'indoor' | 'traffic' | 'other';
  isPlaying: boolean;
  volume: number;
}

interface BackgroundAmbientSoundProps {
  onCancel?: () => void;
  onRecord?: (location: string) => Promise<void>;
  onStopRecording?: () => Promise<void>;
  onPlay?: (soundId: string) => Promise<void>;
  onPause?: (soundId: string) => Promise<void>;
  onDelete?: (soundId: string) => Promise<void>;
}

const DEFAULT_SOUNDS: AmbientSound[] = [
  {
    id: 'sound-1',
    location: 'Đà Lạt Morning',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    description: 'Birds singing in the morning mist',
    audioUrl: '/ambient-1.mp3',
    duration: 180,
    size: 5000000,
    format: 'mp3',
    recordedAt: new Date('2024-01-12'),
    category: 'nature',
    isPlaying: false,
    volume: 80,
  },
];

export default function BackgroundAmbientSound({ onCancel, onRecord, onStopRecording, onPlay, onPause, onDelete }: BackgroundAmbientSoundProps) {
  const [sounds, setSounds] = useState<AmbientSound[]>(DEFAULT_SOUNDS);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [autoDetectLocation, setAutoDetectLocation] = useState(true);
  const [loopPlayback, setLoopPlayback] = useState(false);

  const totalSounds = sounds.length;
  const totalDuration = sounds.reduce((sum, s) => sum + s.duration, 0);
  const totalSize = sounds.reduce((sum, s) => sum + s.size, 0);
  const avgDuration = totalDuration / totalSounds;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const handleRecord = async (location: string) => {
    setIsRecording(true);
    setRecordingDuration(0);
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    await onRecord?.(location);
    clearInterval(interval);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    await onStopRecording?.();
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
      case 'traffic':
        return 'text-red-500';
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
          <div className="p-2 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl">
            <Waves className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Ghi âm tiếng môi trường xung quanh
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
        <div className="mb-4 p-4 bg-lime-50 dark:bg-lime-950/30 border border-lime-200 dark:border-lime-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt ambient sound
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect location
              </span>
              <button
                type="button"
                onClick={() => setAutoDetectLocation(!autoDetectLocation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetectLocation ? 'bg-lime-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoDetectLocation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Loop playback
              </span>
              <button
                type="button"
                onClick={() => setLoopPlayback(!loopPlayback)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  loopPlayback ? 'bg-lime-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    loopPlayback ? 'translate-x-5' : ''
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
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(totalDuration)}
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(avgDuration)}
          </div>
        </div>
      </div>

      {/* Recording Interface */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={isRecording ? handleStopRecording : () => handleRecord('Current Location')}
              className={`p-4 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-6 w-6 animate-pulse" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-6 w-6" />
                  Start Recording
                </>
              )}
            </button>

            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-500 font-medium">
                  Recording... {formatDuration(recordingDuration)}
                </span>
              </div>
            )}
          </div>

          {autoDetectLocation && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3 w-3" />
              <span>Location auto-detected: Current Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-lime-500 text-white'
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
                ? 'bg-lime-500 text-white'
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
                ? 'bg-lime-500 text-white'
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
                ? 'bg-lime-500 text-white'
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
          Ambient Sounds
        </h4>
        <div className="space-y-2">
          {filteredSounds.map((sound) => (
            <div
              key={sound.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-lime-100 dark:bg-lime-900/30">
                    <Waves className="h-4 w-4 text-lime-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {sound.location}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {sound.description}
                    </div>
                  </div>
                </div>
                {sound.isPlaying && (
                  <span className="px-2 py-1 bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400 text-[10px] font-semibold rounded-full">
                    Playing
                  </span>
                )}
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
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Coordinates</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {sound.coordinates.lat.toFixed(4)}, {sound.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => sound.isPlaying ? handlePause(sound.id) : handlePlay(sound.id)}
                  className="p-2 bg-lime-100 dark:bg-lime-900/30 hover:bg-lime-200 dark:hover:bg-lime-900/50 rounded-full transition-colors"
                >
                  {sound.isPlaying ? (
                    <Pause className="h-4 w-4 text-lime-500" />
                  ) : (
                    <PlayCircle className="h-4 w-4 text-lime-500" />
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
                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-lime-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {sound.volume}%
                  </span>
                </div>

                {loopPlayback && (
                  <ActivityIcon className="h-4 w-4 text-lime-500" />
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(sound.id)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-3 w-3 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-lime-50 dark:bg-lime-950/30 border border-lime-200 dark:border-lime-900 rounded-lg">
        <p className="text-[10px] text-lime-700 dark:text-lime-400">
          <strong>Lưu ý:</strong> Ghi âm tiếng môi trường xung quanh with ambient sound recording, location auto-detection (GPS coordinates), categorization (nature/urban/indoor/traffic/other), playback controls (play/pause/volume), loop playback, noise reduction, sound management (download/delete), category filtering, và comprehensive ambient sound capture system.
        </p>
      </div>
    </div>
  );
}