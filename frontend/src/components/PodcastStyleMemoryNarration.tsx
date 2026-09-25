'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  ClockIcon,
  Download,
  ExternalLink,
  FileAudio,
  Filter,
  Languages,
  MessageSquare,
  Mic,
  Music,
  Pause,
  Play,
  PlayCircle,
  Plus,
  Podcast,
  RefreshCw,
  Settings,
  SettingsIcon,
  Share2,
  Sparkles,
  StopCircle,
  Trash2,
  TrashIcon,
  Volume2,
  Zap,
  ZapIcon,
  ZapIcon2
} from 'lucide-react';

interface NarrationSegment {
  id: string;
  memoryId: string;
  text: string;
  voice: string;
  duration: number;
  timestamp: number;
}

interface PodcastNarration {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  segments: NarrationSegment[];
  totalDuration: number;
  voice: string;
  language: string;
  speed: number;
  pitch: number;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  progress: number;
  createdAt: Date;
  generatedAt: Date | null;
  audioUrl: string;
  isPlaying: boolean;
}

interface PodcastStyleMemoryNarrationProps {
  onCancel?: () => void;
  onGenerate?: (memoryId: string, voice: string, language: string) => Promise<void>;
  onPlay?: (narrationId: string) => Promise<void>;
  onPause?: (narrationId: string) => Promise<void>;
  onDelete?: (narrationId: string) => Promise<void>;
  onExport?: (narrationId: string, format: string) => Promise<void>;
}

const DEFAULT_NARRATIONS: PodcastNarration[] = [
  {
    id: 'narration-1',
    memoryId: 'mem-1',
    title: 'Summer 2024 - Da Lat Adventure',
    description: 'Podcast-style narration of the Da Lat trip',
    segments: [
      {
        id: 'seg-1',
        memoryId: 'mem-1',
        text: 'We arrived in Da Lat early in the morning...',
        voice: 'natural-female',
        duration: 15,
        timestamp: 0,
      },
      {
        id: 'seg-2',
        memoryId: 'mem-1',
        text: 'The misty mountains created a magical atmosphere...',
        voice: 'natural-female',
        duration: 12,
        timestamp: 15,
      },
    ],
    totalDuration: 27,
    voice: 'natural-female',
    language: 'vi',
    speed: 1.0,
    pitch: 1.0,
    status: 'completed',
    progress: 100,
    createdAt: new Date('2024-01-12'),
    generatedAt: new Date('2024-01-12'),
    audioUrl: '/narration-1.mp3',
    isPlaying: false,
  },
];

const VOICES = [
  { id: 'natural-female', name: 'Natural Female', language: 'vi' },
  { id: 'natural-male', name: 'Natural Male', language: 'vi' },
  { id: 'enthusiastic', name: 'Enthusiastic', language: 'vi' },
  { id: 'calm', name: 'Calm', language: 'vi' },
  { id: 'professional', name: 'Professional', language: 'en' },
];

const LANGUAGES = [
  { code: 'vi', name: 'Vietnamese' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' },
];

export default function PodcastStyleMemoryNarration({ onCancel, onGenerate, onPlay, onPause, onDelete, onExport }: PodcastStyleMemoryNarrationProps) {
  const [narrations, setNarrations] = useState<PodcastNarration[]>(DEFAULT_NARRATIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('natural-female');
  const [selectedLanguage, setSelectedLanguage] = useState('vi');
  const [selectedSpeed, setSelectedSpeed] = useState(1.0);
  const [selectedPitch, setSelectedPitch] = useState(1.0);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState('mp3');

  const totalNarrations = narrations.length;
  const completedNarrations = narrations.filter(n => n.status === 'completed').length;
  const totalDuration = narrations.reduce((sum, n) => sum + n.totalDuration, 0);
  const avgDuration = totalDuration / totalNarrations;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerate = async (memoryId: string) => {
    setIsGenerating(true);
    await onGenerate?.(memoryId, selectedVoice, selectedLanguage);
    setIsGenerating(false);
  };

  const handlePlay = async (narrationId: string) => {
    await onPlay?.(narrationId);
    setNarrations(narrations.map(n => 
      n.id === narrationId ? { ...n, isPlaying: true } : { ...n, isPlaying: false }
    ));
  };

  const handlePause = async (narrationId: string) => {
    await onPause?.(narrationId);
    setNarrations(narrations.map(n => 
      n.id === narrationId ? { ...n, isPlaying: false } : n
    ));
  };

  const handleDelete = async (narrationId: string) => {
    await onDelete?.(narrationId);
    setNarrations(narrations.filter(n => n.id !== narrationId));
  };

  const handleExport = async (narrationId: string) => {
    await onExport?.(narrationId, selectedFormat);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
      case 'generating':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'generating':
        return <Activity className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Podcast className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Podcast className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tự động tạo narration podcast từ kỷ niệm bằng AI TTS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedNarrations}/{totalNarrations} generated
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
        <div className="mb-4 p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt podcast narration
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-generate on memory create
              </span>
              <button
                type="button"
                onClick={() => setAutoGenerate(!autoGenerate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoGenerate ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'
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
                AI TTS provider
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Azure TTS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Neural voice synthesis
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
            <Podcast className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Narrations</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalNarrations}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Generated</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedNarrations}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(totalDuration)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(avgDuration)}
          </div>
        </div>
      </div>

      {/* Generation Settings */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          TTS Settings
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            >
              {VOICES.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Speed: {selectedSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={selectedSpeed}
              onChange={(e) => setSelectedSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Pitch: {selectedPitch}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={selectedPitch}
              onChange={(e) => setSelectedPitch(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Narration List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Podcast Narrations
        </h4>
        <div className="space-y-2">
          {narrations.map((narration) => (
            <div
              key={narration.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(narration.status)}`}>
                    {getStatusIcon(narration.status)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {narration.title}
                    </span>
                    <div className={`text-xs ${getStatusColor(narration.status)} capitalize`}>
                      {narration.status}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {narration.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleGenerate(narration.memoryId)}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-3 py-2 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
                      {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(narration.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              {narration.status === 'generating' && (
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {narration.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 transition-all"
                      style={{ width: `${narration.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {narration.description}
              </p>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(narration.totalDuration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Voice</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {VOICES.find(v => v.id === narration.voice)?.name}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Language</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {LANGUAGES.find(l => l.code === narration.language)?.name}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Segments</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {narration.segments.length}
                  </div>
                </div>
              </div>

              {/* Segments */}
              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Segments</div>
                <div className="space-y-1">
                  {narration.segments.map((segment) => (
                    <div
                      key={segment.id}
                      className="p-2 rounded bg-slate-100 dark:bg-slate-600/50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDuration(segment.timestamp)}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDuration(segment.duration)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                        {segment.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Playback Controls */}
              {narration.status === 'completed' && (
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => narration.isPlaying ? handlePause(narration.id) : handlePlay(narration.id)}
                    className="p-2 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 rounded-full transition-colors"
                  >
                    {narration.isPlaying ? (
                      <Pause className="h-4 w-4 text-rose-500" />
                    ) : (
                      <Play className="h-4 w-4 text-rose-500" />
                    )}
                  </button>

                  <div className="flex items-center gap-2 flex-1">
                    <Volume2 className="h-4 w-4 text-slate-500" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={80}
                      className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-rose-500"
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">80%</span>
                  </div>
                </div>
              )}

              {/* Export */}
              {narration.status === 'completed' && (
                <div className="flex items-center gap-2">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                  >
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="m4a">M4A</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleExport(narration.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open(narration.audioUrl, '_blank')}
                    className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg">
        <p className="text-[10px] text-rose-700 dark:text-rose-400">
          <strong>Lưu ý:</strong> Tự động tạo narration podcast từ kỷ niệm bằng AI TTS với multiple voice options (Natural Female/Male/Enthusiastic/Calm/Professional), multi-language support (Vietnamese/English/French/Japanese), TTS settings (speed/pitch control), segment-based narration, progress tracking, audio playback controls, export options (MP3/WAV/M4A), auto-generate on memory create, và neural voice synthesis.
        </p>
      </div>
    </div>
  );
}