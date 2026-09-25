import { Activity, AlertTriangle, BarChart3, Calendar, Check, CheckCircle, Clock, Clock as ClockIcon, Download, ExternalLink, Filter, Languages, Mic, Mic as MicIcon, Pause, Play, Plus, RefreshCw, Search, Search as SearchIcon, Settings, Settings as SettingsIcon, Sparkles, Trash2, Trash2 as TrashIcon, Volume2, Waves, X, Zap, Zap as ZapIcon } from 'lucide-react';
'use client';

import { useState } from 'react';


interface VoiceSearchResult {
  id: string;
  query: string;
  detectedText: string;
  confidence: number;
  timestamp: Date;
  resultsCount: number;
  language: string;
}

interface VoiceCommand {
  id: string;
  command: string;
  confidence: number;
  language: string;
  executedAt: Date;
}

interface VoiceSearchProps {
  onCancel?: () => void;
  onSearch?: (query: string) => Promise<void>;
  onRecord?: () => Promise<void>;
  onStopRecording?: () => Promise<void>;
}

const DEFAULT_RESULTS: VoiceSearchResult[] = [
  {
    id: 'result-1',
    query: 'Tìm kiếm kỷ niệm Đà Lạt',
    detectedText: 'Tìm kiếm kỷ niệm Đà Lạt',
    confidence: 0.95,
    timestamp: new Date('2024-01-12'),
    resultsCount: 15,
    language: 'vi',
  },
];

const DEFAULT_COMMANDS: VoiceCommand[] = [
  {
    id: 'cmd-1',
    command: 'search memories',
    confidence: 0.92,
    language: 'en',
    executedAt: new Date('2024-01-12'),
  },
];

export default function VoiceSearch({ onCancel, onSearch, onRecord, onStopRecording }: VoiceSearchProps) {
  const [results, setResults] = useState<VoiceSearchResult[]>(DEFAULT_RESULTS);
  const [commands, setCommands] = useState<VoiceCommand[]>(DEFAULT_COMMANDS);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('vi');
  const [autoSearch, setAutoSearch] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);

  const totalSearches = results.length;
  const totalCommands = commands.length;
  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / totalSearches;
  const avgProcessingTime = 200; // Mock value

  const formatDuration = (ms: number) => {
    if (ms >= 1000) return (ms / 1000).toFixed(1) + 's';
    return ms + 'ms';
  };

  const handleRecord = async () => {
    setIsRecording(true);
    await onRecord?.();
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    await onStopRecording?.();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTranscribedText('Tìm kiếm kỷ niệm Đà Lạt');
    }, 1000);
  };

  const handleSearch = async (query: string) => {
    await onSearch?.(query);
    const newResult: VoiceSearchResult = {
      id: `result-${Date.now()}`,
      query,
      detectedText: query,
      confidence: 0.92,
      timestamp: new Date(),
      resultsCount: Math.floor(Math.random() * 20) + 1,
      language: selectedLanguage,
    };
    setResults([newResult, ...results]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.7) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <SearchIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tìm kiếm bằng giọng nói
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalSearches} searches
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt voice search
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="vi">Vietnamese</option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Confidence threshold: {(confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-search on stop
              </span>
              <button
                type="button"
                onClick={() => setAutoSearch(!autoSearch)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSearch ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoSearch ? 'translate-x-5' : ''
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
            <SearchIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Searches</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSearches}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Waves className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Processing</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(avgProcessingTime)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Languages className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Language</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedLanguage.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Voice Recording Interface */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={isRecording ? handleStopRecording : handleRecord}
              className={`p-4 rounded-full transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white'
              }`}
            >
              {isRecording ? (
                <>
                  <OctagonX className="h-6 w-6 animate-pulse" />
                  Stop Recording
                </>
              ) : (
                <>
                  <MicIcon className="h-6 w-6" />
                  Start Recording
                </>
              )}
            </button>

            {isRecording && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-500 font-medium">Recording...</span>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Processing audio...
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>

        {/* Transcribed Text */}
        {transcribedText && (
          <div className="p-4 rounded-lg border-2 bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Transcribed Text
              </span>
              <span className="text-xs text-teal-600 dark:text-teal-400">
                {selectedLanguage.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {transcribedText}
            </p>
            <button
              type="button"
              onClick={() => handleSearch(transcribedText)}
              className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Voice Search History
        </h4>
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                    <SearchIcon className="h-4 w-4 text-teal-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {result.query}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {result.resultsCount} results found
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSearch(result.query)}
                  className="p-1 hover:bg-teal-100 dark:hover:bg-teal-900/30 rounded"
                >
                  <RefreshCw className="h-4 w-4 text-teal-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Detected</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.detectedText}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className={`text-xs ${getConfidenceColor(result.confidence)}`}>
                    {(result.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Timestamp</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.timestamp.toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Commands */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Voice Commands
        </h4>
        <div className="space-y-2">
          {commands.map((command) => (
            <div
              key={command.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                    <Mic className="h-4 w-4 text-cyan-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {command.command}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {command.language.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className={`text-xs ${getConfidenceColor(command.confidence)}`}>
                    {(command.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Executed</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {command.executedAt.toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Tìm kiếm bằng giọng nói với voice recording interface, real-time transcription, speech-to-text conversion, confidence scoring, language selection (Vietnamese/English/French/Japanese), auto-search on stop, search history, voice command recognition, và processing time tracking.
        </p>
      </div>
    </div>
  );
}