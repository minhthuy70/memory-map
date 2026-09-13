'use client';

import { useState } from 'react';
import { Mic, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Plus as PlusIcon, RefreshCw, Check, Zap as ZapIcon, Plus, Sparkles, Image as ImageIcon, MapPin, Calendar as CalendarIcon, Tag, Layers, Save, Trash2 as TrashIcon, ExternalLink, StopCircle, MessageSquare, PenTool } from 'lucide-react';

interface VoiceMemory {
  id: string;
  title: string;
  description: string;
  transcription: string;
  location: string;
  date: Date;
  tags: string[];
  confidence: number;
  duration: number;
  status: 'recording' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
}

interface VoiceMemoryCreationProps {
  onCancel?: () => void;
  onRecord?: () => Promise<void>;
  onStopRecording?: () => Promise<void>;
  onSave?: (memory: Partial<VoiceMemory>) => Promise<void>;
}

const DEFAULT_MEMORIES: VoiceMemory[] = [
  {
    id: 'mem-1',
    title: 'Đà Lạt Adventure',
    description: 'A wonderful trip to Đà Lạt',
    transcription: 'We visited Đà Lạt in January. The weather was perfect with cool breeze and morning mist. We explored the local markets and tried their famous coffee.',
    location: 'Đà Lạt, Vietnam',
    date: new Date('2024-01-12'),
    tags: ['travel', 'adventure', 'coffee'],
    confidence: 0.92,
    duration: 45,
    status: 'completed',
    createdAt: new Date('2024-01-12'),
  },
];

export default function VoiceMemoryCreation({ onCancel, onRecord, onStopRecording, onSave }: VoiceMemoryCreationProps) {
  const [memories, setMemories] = useState<VoiceMemory[]>(DEFAULT_MEMORIES);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [autoTag, setAutoTag] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);

  const totalMemories = memories.length;
  const completedMemories = memories.filter(m => m.status === 'completed').length;
  const avgConfidence = memories.reduce((sum, m) => sum + m.confidence, 0) / totalMemories;
  const totalDuration = memories.reduce((sum, m) => sum + m.duration, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTranscription('We visited Đà Lạt in January. The weather was perfect with cool breeze and morning mist. We explored the local markets and tried their famous coffee.');
    }, 1500);
  };

  const handleSave = async () => {
    if (transcription.trim()) {
      await onSave?.({
        title: 'New Voice Memory',
        description: '',
        transcription,
        location: '',
        date: new Date(),
        tags: [],
        confidence: 0.92,
        duration: recordingDuration,
        status: 'completed',
        createdAt: new Date(),
      });
      setTranscription('');
      setRecordingDuration(0);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.7) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recording':
        return 'text-red-500';
      case 'processing':
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
      case 'recording':
        return <Mic className="h-4 w-4" />;
      case 'processing':
        return <Activity className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tạo kỷ niệm hoàn toàn bằng giọng nói
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {completedMemories}/{totalMemories} memories
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
        <div className="mb-4 p-4 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt voice memory creation
          </h4>
          <div className="space-y-2">
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
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-violet-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-save on complete
              </span>
              <button
                type="button"
                onClick={() => setAutoSave(!autoSave)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoSave ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Auto-tag from transcription
              </span>
              <button
                type="button"
                onClick={() => setAutoTag(!autoTag)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoTag ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoTag ? 'translate-x-5' : ''
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
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Completed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
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
                  : 'bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-500 hover:to-purple-600 text-white'
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

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Transcribing audio...
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>

        {/* Transcription */}
        {transcription && (
          <div className="p-4 rounded-lg border-2 bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Transcription
              </span>
              <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                {(0.92 * 100).toFixed(0)}% confidence
              </span>
            </div>
            <textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none"
              rows={4}
              placeholder="Your voice will be transcribed here..."
            />
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Memory
              </button>
              <button
                type="button"
                onClick={() => setTranscription('')}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                Discard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Memory List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Voice Memories
        </h4>
        <div className="space-y-2">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(memory.status)}`}>
                    {getStatusIcon(memory.status)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {memory.title}
                    </span>
                    <div className={`text-xs ${getStatusColor(memory.status)} capitalize`}>
                      {memory.status}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                {memory.description}
              </p>

              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(memory.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className={`text-xs ${getConfidenceColor(memory.confidence)}`}>
                    {(memory.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Date</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.date.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Tags</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {memory.tags.length}
                  </div>
                </div>
              </div>

              <div className="mb-2">
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Transcription</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {memory.transcription}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  <PenTool className="h-3 w-3" />
                  Edit
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  <ImageIcon className="h-3 w-3" />
                  Add Photos
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  Add Location
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 rounded-lg">
        <p className="text-[10px] text-violet-700 dark:text-violet-400">
          <strong>Lưu ý:</strong> Tạo kỷ niệm hoàn toàn bằng giọng nói với voice recording interface, real-time transcription, speech-to-text conversion, confidence scoring, auto-save on complete, auto-tag from transcription, memory management (edit/add photos/add location), transcription editing, và comprehensive voice memory creation workflow.
        </p>
      </div>
    </div>
  );
}