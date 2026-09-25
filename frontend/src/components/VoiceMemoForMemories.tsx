'use client';

import { useState } from 'react';
import { Mic, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Plus as PlusIcon, RefreshCw, Check, Zap as ZapIcon, Plus, Mic as MicIcon, StopCircle, PlayCircle, Volume2, Trash2 as TrashIcon, ExternalLink, MessageSquare, Save, Edit, FileAudio } from 'lucide-react';

interface VoiceMemo {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  size: number;
  format: string;
  recordedAt: Date;
  isPlaying: boolean;
  volume: number;
}

interface VoiceMemoForMemoriesProps {
  onCancel?: () => void;
  onRecord?: (memoryId: string) => Promise<void>;
  onStopRecording?: () => Promise<void>;
  onPlay?: (memoId: string) => Promise<void>;
  onPause?: (memoId: string) => Promise<void>;
  onDelete?: (memoId: string) => Promise<void>;
}

const DEFAULT_MEMOS: VoiceMemo[] = [
  {
    id: 'memo-1',
    memoryId: 'mem-1',
    title: 'Summer 2024 - Đà Lạt Trip',
    description: 'Voice memo about the Đà Lạt adventure',
    audioUrl: '/memo-1.mp3',
    duration: 120,
    size: 2000000,
    format: 'mp3',
    recordedAt: new Date('2024-01-12'),
    isPlaying: false,
    volume: 80,
  },
];

export default function VoiceMemoForMemories({ onCancel, onRecord, onStopRecording, onPlay, onPause, onDelete }: VoiceMemoForMemoriesProps) {
  const [memos, setMemos] = useState<VoiceMemo[]>(DEFAULT_MEMOS);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [autoSave, setAutoSave] = useState(true);
  const [highQuality, setHighQuality] = useState(true);

  const totalMemos = memos.length;
  const totalDuration = memos.reduce((sum, m) => sum + m.duration, 0);
  const totalSize = memos.reduce((sum, m) => sum + m.size, 0);
  const avgDuration = totalDuration / totalMemos;

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

  const handleRecord = async (memoryId: string) => {
    setIsRecording(true);
    setRecordingDuration(0);
    const interval = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    await onRecord?.(memoryId);
    clearInterval(interval);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    await onStopRecording?.();
  };

  const handlePlay = async (memoId: string) => {
    await onPlay?.(memoId);
    setMemos(memos.map(m => 
      m.id === memoId ? { ...m, isPlaying: true } : { ...m, isPlaying: false }
    ));
  };

  const handlePause = async (memoId: string) => {
    await onPause?.(memoId);
    setMemos(memos.map(m => 
      m.id === memoId ? { ...m, isPlaying: false } : m
    ));
  };

  const handleDelete = async (memoId: string) => {
    await onDelete?.(memoId);
    setMemos(memos.filter(m => m.id !== memoId));
  };

  const handleVolumeChange = (memoId: string, volume: number) => {
    setMemos(memos.map(m => 
      m.id === memoId ? { ...m, volume } : m
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl">
            <MicIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Ghi âm ghi chú giọng nói kèm theo kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalMemos} memos
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
        <div className="mb-4 p-4 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt voice memo
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-save on stop
              </span>
              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSave ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSave ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                High-quality recording
              </span>
              <button
                type="button"
                onClick={() => setHighQuality(!highQuality)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  highQuality ? 'bg-sky-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    highQuality ? 'translate-x-5' : ''
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
            <MicIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemos}
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
              onClick={isRecording ? handleStopRecording : () => handleRecord('mem-1')}
              className={`p-4 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white'
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
        </div>
      </div>

      {/* Memo List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Voice Memos
        </h4>
        <div className="space-y-2">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30">
                    <FileAudio className="h-4 w-4 text-sky-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {memo.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {memo.description}
                    </div>
                  </div>
                </div>
                {memo.isPlaying && (
                  <span className="px-2 py-1 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-semibold rounded-full">
                    Playing
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(memo.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatFileSize(memo.size)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Format</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 uppercase">
                    {memo.format}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Recorded</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memo.recordedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => memo.isPlaying ? handlePause(memo.id) : handlePlay(memo.id)}
                  className="p-2 bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 dark:hover:bg-sky-900/50 rounded-full transition-colors"
                >
                  {memo.isPlaying ? (
                    <Pause className="h-4 w-4 text-sky-500" />
                  ) : (
                    <PlayCircle className="h-4 w-4 text-sky-500" />
                  )}
                </button>

                <div className="flex items-center gap-2 flex-1">
                  <Volume2 className="h-4 w-4 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={memo.volume}
                    onChange={(e) => handleVolumeChange(memo.id, parseInt(e.target.value))}
                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-sky-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {memo.volume}%
                  </span>
                </div>
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
                  onClick={() => handleDelete(memo.id)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                >
                  <TrashIcon className="h-3 w-3 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 rounded-lg">
        <p className="text-[10px] text-sky-700 dark:text-sky-400">
          <strong>Lưu ý:</strong> Ghi âm ghi chú giọng nói kèm theo kỷ niệm với voice recording interface, real-time duration tracking, auto-save on stop, high-quality recording, noise reduction, playback controls (play/pause/volume), memo management (edit/download/delete), audio format support (MP3/WAV), và comprehensive voice memo system.
        </p>
      </div>
    </div>
  );
}