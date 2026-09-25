'use client';

import { useState } from 'react';
import { Mic, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, BookOpen, RefreshCw, Check, Zap as ZapIcon, Plus, Mic as MicIcon, StopCircle, PlayCircle, Volume2, Trash2 as TrashIcon, ExternalLink, Calendar as CalendarIcon, Save, Edit, FileAudio, Sparkles, MessageSquare, Lock, Unlock } from 'lucide-react';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  audioUrl: string;
  transcription: string;
  date: Date;
  duration: number;
  size: number;
  format: string;
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious';
  isPrivate: boolean;
  isPlaying: boolean;
  volume: number;
}

interface VoiceJournalEntriesProps {
  onCancel?: () => void;
  onRecord?: () => Promise<void>;
  onStopRecording?: () => Promise<void>;
  onPlay?: (entryId: string) => Promise<void>;
  onPause?: (entryId: string) => Promise<void>;
  onDelete?: (entryId: string) => Promise<void>;
}

const DEFAULT_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    title: 'January 12, 2024',
    content: 'Today was a wonderful day exploring Đà Lạt. The morning mist created a magical atmosphere...',
    audioUrl: '/journal-1.mp3',
    transcription: 'Today was a wonderful day exploring Đà Lạt. The morning mist created a magical atmosphere...',
    date: new Date('2024-01-12'),
    duration: 120,
    size: 3000000,
    format: 'mp3',
    mood: 'happy',
    isPrivate: false,
    isPlaying: false,
    volume: 80,
  },
];

export default function VoiceJournalEntries({ onCancel, onRecord, onStopRecording, onPlay, onPause, onDelete }: VoiceJournalEntriesProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(DEFAULT_ENTRIES);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [autoTranscribe, setAutoTranscribe] = useState(true);
  const [defaultPrivacy, setDefaultPrivacy] = useState(false);

  const totalEntries = entries.length;
  const totalDuration = entries.reduce((sum, e) => sum + e.duration, 0);
  const totalSize = entries.reduce((sum, e) => sum + e.size, 0);
  const privateEntries = entries.filter(e => e.isPrivate).length;

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

  const handleRecord = async () => {
    setIsRecording(true);
    setRecordingDuration(0);
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    await onRecord?.();
    clearInterval(interval);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    await onStopRecording?.();
  };

  const handlePlay = async (entryId: string) => {
    await onPlay?.(entryId);
    setEntries(entries.map(e => 
      e.id === entryId ? { ...e, isPlaying: true } : { ...e, isPlaying: false }
    ));
  };

  const handlePause = async (entryId: string) => {
    await onPause?.(entryId);
    setEntries(entries.map(e => 
      e.id === entryId ? { ...e, isPlaying: false } : e
    ));
  };

  const handleDelete = async (entryId: string) => {
    await onDelete?.(entryId);
    setEntries(entries.filter(e => e.id !== entryId));
  };

  const handleVolumeChange = (entryId: string, volume: number) => {
    setEntries(entries.map(e => 
      e.id === entryId ? { ...e, volume } : e
    ));
  };

  const handleTogglePrivacy = (entryId: string) => {
    setEntries(entries.map(e => 
      e.id === entryId ? { ...e, isPrivate: !e.isPrivate } : e
    ));
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy':
        return 'text-yellow-500';
      case 'sad':
        return 'text-blue-500';
      case 'neutral':
        return 'text-slate-500';
      case 'excited':
        return 'text-orange-500';
      case 'anxious':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
    }
  };

  const filteredEntries = selectedMood === 'all' 
    ? entries 
    : entries.filter(e => e.mood === selectedMood);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhật ký giọng nói thay thế gõ phím
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalEntries} entries
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
            Cài đặt voice journal
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-transcribe audio
              </span>
              <button
                type="button"
                onClick={() => setAutoTranscribe(!autoTranscribe)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoTranscribe ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoTranscribe ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Default privacy
              </span>
              <button
                type="button"
                onClick={() => setDefaultPrivacy(!defaultPrivacy)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  defaultPrivacy ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    defaultPrivacy ? 'translate-x-5' : ''
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
            <BookOpen className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Entries</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalEntries}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Private</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {privateEntries}
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
      </div>

      {/* Recording Interface */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={isRecording ? handleStopRecording : handleRecord}
              className={`p-4 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white'
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

          {autoTranscribe && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Sparkles className="h-3 w-3" />
              <span>Auto-transcription enabled</span>
            </div>
          )}
        </div>
      </div>

      {/* Mood Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedMood('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedMood === 'all'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedMood('happy')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedMood === 'happy'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Happy
          </button>
          <button
            type="button"
            onClick={() => setSelectedMood('sad')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedMood === 'sad'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Sad
          </button>
          <button
            type="button"
            onClick={() => setSelectedMood('excited')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedMood === 'excited'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Excited
          </button>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Journal Entries
        </h4>
        <div className="space-y-2">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <BookOpen className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {entry.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.date.toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.isPrivate && (
                    <Lock className="h-3 w-3 text-slate-500" />
                  )}
                  {entry.isPlaying && (
                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-semibold rounded-full">
                      Playing
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                {entry.content}
              </p>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(entry.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(entry.size)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Mood</div>
                  <div className={`text-xs ${getMoodColor(entry.mood)} capitalize`}>
                    {entry.mood}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Privacy</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {entry.isPrivate ? 'Private' : 'Public'}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => entry.isPlaying ? handlePause(entry.id) : handlePlay(entry.id)}
                  className="p-2 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-full transition-colors"
                >
                  {entry.isPlaying ? (
                    <Pause className="h-4 w-4 text-amber-500" />
                  ) : (
                    <PlayCircle className="h-4 w-4 text-amber-500" />
                  )}
                </button>

                <div className="flex items-center gap-2 flex-1">
                  <Volume2 className="h-4 w-4 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={entry.volume}
                    onChange={(e) => handleVolumeChange(entry.id, parseInt(e.target.value))}
                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {entry.volume}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePrivacy(entry.id)}
                  className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full transition-colors"
                >
                  {entry.isPrivate ? (
                    <Lock className="h-4 w-4 text-slate-500" />
                  ) : (
                    <Unlock className="h-4 w-4 text-slate-500" />
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-3 w-3 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Nhật ký giọng nói thay thế gõ phím với voice recording interface, real-time duration tracking, auto-transcription, mood tracking (happy/sad/neutral/excited/anxious), privacy controls (private/public), playback controls (play/pause/volume), journal management (edit/download/delete), mood filtering, và comprehensive voice journal system.
        </p>
      </div>
    </div>
  );
}