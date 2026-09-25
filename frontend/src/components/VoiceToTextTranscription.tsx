'use client';

import { useState } from 'react';
import { Mic, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, FileText, RefreshCw, Check, Zap as ZapIcon, Plus, Upload, Mic as MicIcon, StopCircle, MessageSquare, Save, Edit, Trash2 as TrashIcon, ExternalLink, Languages, Sparkles, FileAudio, CheckSquare, Copy } from 'lucide-react';

interface Transcription {
  id: string;
  audioId: string;
  originalText: string;
  confidence: number;
  language: string;
  duration: number;
  transcribedAt: Date;
  isEditing: boolean;
  wordCount: number;
}

interface VoiceToTextTranscriptionProps {
  onCancel?: () => void;
  onTranscribe?: (audioFile: File) => Promise<void>;
  onEdit?: (transcriptionId: string, text: string) => Promise<void>;
  onDelete?: (transcriptionId: string) => Promise<void>;
}

const DEFAULT_TRANSCRIPTIONS: Transcription[] = [
  {
    id: 'trans-1',
    audioId: 'audio-1',
    originalText: 'We visited Đà Lạt in January. The weather was perfect with cool breeze and morning mist. We explored the local markets and tried their famous coffee.',
    confidence: 0.95,
    language: 'en',
    duration: 45,
    transcribedAt: new Date('2024-01-12'),
    isEditing: false,
    wordCount: 28,
  },
];

export default function VoiceToTextTranscription({ onCancel, onTranscribe, onEdit, onDelete }: VoiceToTextTranscriptionProps) {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>(DEFAULT_TRANSCRIPTIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [autoDetect, setAutoDetect] = useState(true);
  const [autoPunctuation, setAutoPunctuation] = useState(true);

  const totalTranscriptions = transcriptions.length;
  const avgConfidence = transcriptions.reduce((sum, t) => sum + t.confidence, 0) / totalTranscriptions;
  const totalWords = transcriptions.reduce((sum, t) => sum + t.wordCount, 0);
  const totalDuration = transcriptions.reduce((sum, t) => sum + t.duration, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscribe = async (audioFile: File) => {
    setIsTranscribing(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 100));
    }, 200);
    
    await onTranscribe?.(audioFile);
    
    clearInterval(interval);
    setIsTranscribing(false);
    setProgress(0);
  };

  const handleEdit = async (transcriptionId: string, text: string) => {
    await onEdit?.(transcriptionId, text);
    setTranscriptions(transcriptions.map(t => 
      t.id === transcriptionId ? { ...t, originalText: text, isEditing: false } : t
    ));
  };

  const handleDelete = async (transcriptionId: string) => {
    await onDelete?.(transcriptionId);
    setTranscriptions(transcriptions.filter(t => t.id !== transcriptionId));
  };

  const handleToggleEdit = (transcriptionId: string) => {
    setTranscriptions(transcriptions.map(t => 
      t.id === transcriptionId ? { ...t, isEditing: !t.isEditing } : t
    ));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
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
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Chuyển giọng nói thành văn bản tự động
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalTranscriptions} transcriptions
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
        <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt transcription
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="en">English</option>
                <option value="vi">Vietnamese</option>
                <option value="fr">French</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect language
              </span>
              <button
                type="button"
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetect ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Auto-punctuation
              </span>
              <button
                type="button"
                onClick={() => setAutoPunctuation(!autoPunctuation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoPunctuation ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoPunctuation ? 'translate-x-5' : ''
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
            <FileText className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Transcriptions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalTranscriptions}
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
            <MessageSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Words</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalWords}
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

      {/* Upload Interface */}
      <div className="mb-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="audio-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleTranscribe(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="audio-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Upload audio file for transcription
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports: MP3, WAV, M4A, OGG
            </p>
          </label>
        </div>

        {isTranscribing && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Transcribing audio...
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Transcription List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Transcriptions
        </h4>
        <div className="space-y-2">
          {transcriptions.map((transcription) => (
            <div
              key={transcription.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <FileText className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Transcription #{transcription.id.split('-')[1]}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {transcription.wordCount} words • {formatDuration(transcription.duration)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(transcription.originalText)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  >
                    <Copy className="h-3 w-3 text-slate-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleEdit(transcription.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  >
                    <Edit className="h-3 w-3 text-slate-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(transcription.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className={`text-xs ${getConfidenceColor(transcription.confidence)}`}>
                    {(transcription.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Language</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 uppercase">
                    {transcription.language}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Transcribed</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {transcription.transcribedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              {transcription.isEditing ? (
                <div className="mb-2">
                  <textarea
                    value={transcription.originalText}
                    onChange={(e) => setTranscriptions(transcriptions.map(t => 
                      t.id === transcription.id ? { ...t, originalText: e.target.value } : t
                    ))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                    rows={4}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(transcription.id, transcription.originalText)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Save className="h-3 w-3" />
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleEdit(transcription.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-600/50">
                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                    {transcription.originalText}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-lg">
        <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
          <strong>Lưu ý:</strong> Chuyển giọng nói thành văn bản tự động với audio file upload, real-time transcription progress, confidence scoring, language selection (English/Vietnamese/French/Japanese), auto-detect language, auto-punctuation, edit transcription, copy to clipboard, word count tracking, và comprehensive speech-to-text system.
        </p>
      </div>
    </div>
  );
}