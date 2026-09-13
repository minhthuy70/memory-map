'use client';

import { useState } from 'react';
import { Mic, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Smile, RefreshCw, Check, Zap as ZapIcon, Plus, Mic as MicIcon, StopCircle, PlayCircle, Volume2, Trash2 as TrashIcon, ExternalLink, Heart, Frown, Meh, Zap as ZapIcon2, AlertCircle, Sparkles, FileAudio, Activity as ActivityIcon, Gauge } from 'lucide-react';

interface EmotionDetection {
  id: string;
  audioId: string;
  emotion: 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious';
  confidence: number;
  detectedAt: Date;
  duration: number;
  audioSegment: string;
}

interface VoiceEmotionDetectionProps {
  onCancel?: () => void;
  onDetect?: (audioFile: File) => Promise<void>;
  onPlay?: (detectionId: string) => Promise<void>;
  onPause?: (detectionId: string) => Promise<void>;
  onDelete?: (detectionId: string) => Promise<void>;
}

const DEFAULT_DETECTIONS: EmotionDetection[] = [
  {
    id: 'emotion-1',
    audioId: 'audio-1',
    emotion: 'happy',
    confidence: 0.92,
    detectedAt: new Date('2024-01-12'),
    duration: 45,
    audioSegment: '00:00 - 00:45',
  },
  {
    id: 'emotion-2',
    audioId: 'audio-2',
    emotion: 'excited',
    confidence: 0.88,
    detectedAt: new Date('2024-01-12'),
    duration: 30,
    audioSegment: '01:00 - 01:30',
  },
];

export default function VoiceEmotionDetection({ onCancel, onDetect, onPlay, onPause, onDelete }: VoiceEmotionDetectionProps) {
  const [detections, setDetections] = useState<EmotionDetection[]>(DEFAULT_DETECTIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [autoDetect, setAutoDetect] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);

  const totalDetections = detections.length;
  const avgConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / totalDetections;
  const happyCount = detections.filter(d => d.emotion === 'happy').length;
  const sadCount = detections.filter(d => d.emotion === 'sad').length;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDetect = async (audioFile: File) => {
    setIsDetecting(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 100));
    }, 200);
    
    await onDetect?.(audioFile);
    
    clearInterval(interval);
    setIsDetecting(false);
    setProgress(0);
  };

  const handlePlay = async (detectionId: string) => {
    await onPlay?.(detectionId);
  };

  const handlePause = async (detectionId: string) => {
    await onPause?.(detectionId);
  };

  const handleDelete = async (detectionId: string) => {
    await onDelete?.(detectionId);
    setDetections(detections.filter(d => d.id !== detectionId));
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return <Smile className="h-4 w-4" />;
      case 'sad':
        return <Frown className="h-4 w-4" />;
      case 'neutral':
        return <Meh className="h-4 w-4" />;
      case 'excited':
        return <ZapIcon2 className="h-4 w-4" />;
      case 'anxious':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
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

  const getEmotionBgColor = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'sad':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'neutral':
        return 'bg-slate-100 dark:bg-slate-600/50';
      case 'excited':
        return 'bg-orange-100 dark:bg-orange-900/30';
      case 'anxious':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'bg-slate-100 dark:bg-slate-600/50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.7) return 'text-amber-500';
    return 'text-red-500';
  };

  const filteredDetections = selectedEmotion === 'all' 
    ? detections 
    : detections.filter(d => d.emotion === selectedEmotion);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Smile className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phát hiện cảm xúc qua giọng nói (buồn/vui/hào hứng)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalDetections} detections
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
            Cài đặt emotion detection
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
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect on recording
              </span>
              <button
                type="button"
                onClick={() => setAutoDetect(!autoDetect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetect ? 'bg-pink-500' : 'bg-slate-300 dark:bg-slate-600'
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
                AI model
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">BERT-based</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Smile className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Detections</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalDetections}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Smile className="h-3 w-3 text-yellow-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Happy</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {happyCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Frown className="h-3 w-3 text-blue-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Sad</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {sadCount}
          </div>
        </div>
      </div>

      {/* Upload Interface */}
      <div className="mb-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-pink-400 dark:hover:border-pink-600 transition-colors">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="audio-detect"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleDetect(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="audio-detect" className="cursor-pointer">
            <Mic className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Upload audio for emotion detection
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports: MP3, WAV, M4A, OGG
            </p>
          </label>
        </div>

        {isDetecting && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Analyzing audio...
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Emotion Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedEmotion('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedEmotion === 'all'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedEmotion('happy')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedEmotion === 'happy'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Happy
          </button>
          <button
            type="button"
            onClick={() => setSelectedEmotion('sad')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedEmotion === 'sad'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Sad
          </button>
          <button
            type="button"
            onClick={() => setSelectedEmotion('excited')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedEmotion === 'excited'
                ? 'bg-pink-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Excited
          </button>
        </div>
      </div>

      {/* Detection List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Emotion Detections
        </h4>
        <div className="space-y-2">
          {filteredDetections.map((detection) => (
            <div
              key={detection.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getEmotionBgColor(detection.emotion)}`}>
                    <span className={getEmotionColor(detection.emotion)}>
                      {getEmotionIcon(detection.emotion)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {detection.emotion}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {detection.audioSegment}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(detection.id)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <TrashIcon className="h-3 w-3 text-red-500" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                  <div className={`text-xs ${getConfidenceColor(detection.confidence)}`}>
                    {(detection.confidence * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(detection.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Detected</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {detection.detectedAt.toLocaleTimeString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Playback */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePlay(detection.id)}
                  className="p-2 bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 rounded-full transition-colors"
                >
                  <PlayCircle className="h-4 w-4 text-pink-500" />
                </button>
                <div className="flex items-center gap-2 flex-1">
                  <Volume2 className="h-4 w-4 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={80}
                    className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-pink-500"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">80%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emotion Distribution */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Emotion Distribution
          </h4>
          <div className="space-y-2">
            {['happy', 'sad', 'neutral', 'excited', 'anxious'].map((emotion) => {
              const count = detections.filter(d => d.emotion === emotion).length;
              const percentage = totalDetections > 0 ? (count / totalDetections) * 100 : 0;
              return (
                <div key={emotion} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getEmotionBgColor(emotion)}`}>
                    <span className={getEmotionColor(emotion)}>
                      {getEmotionIcon(emotion)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                        {emotion}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: emotion === 'happy' ? '#eab308' : 
                                     emotion === 'sad' ? '#3b82f6' :
                                     emotion === 'neutral' ? '#64748b' :
                                     emotion === 'excited' ? '#f97316' : '#a855f7'
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg">
        <p className="text-[10px] text-pink-700 dark:text-pink-400">
          <strong>Lưu ý:</strong> Phát hiện cảm xúc qua giọng nói với emotion detection (happy/sad/neutral/excited/anxious), confidence scoring, audio file upload, detection progress tracking, emotion filtering, playback controls, emotion distribution visualization, auto-detect on recording, confidence threshold, AI model (BERT-based), và comprehensive voice emotion analysis system.
        </p>
      </div>
    </div>
  );
}