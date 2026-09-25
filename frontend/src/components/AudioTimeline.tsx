'use client';

import { useState } from 'react';
import { Mic, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Timeline, RefreshCw, Check, Zap as ZapIcon, Plus, PlayCircle, PauseCircle, SkipBack, SkipForward, Volume2, Trash2 as TrashIcon, ExternalLink, Scissors, Layers, FileAudio, ZoomIn, ZoomOut, MoveHorizontal } from 'lucide-react';

interface AudioSegment {
  id: string;
  memoryId: string;
  startTime: number;
  endTime: number;
  label: string;
  color: string;
}

interface AudioTimeline {
  id: string;
  memoryId: string;
  title: string;
  duration: number;
  segments: AudioSegment[];
  waveform: number[];
  currentTime: number;
  isPlaying: boolean;
  volume: number;
  zoom: number;
}

interface AudioTimelineProps {
  onCancel?: () => void;
  onPlay?: (timelineId: string) => Promise<void>;
  onPause?: (timelineId: string) => Promise<void>;
  onSeek?: (timelineId: string, time: number) => Promise<void>;
  onAddSegment?: (timelineId: string, segment: Partial<AudioSegment>) => Promise<void>;
  onDeleteSegment?: (timelineId: string, segmentId: string) => Promise<void>;
}

const DEFAULT_TIMELINES: AudioTimeline[] = [
  {
    id: 'timeline-1',
    memoryId: 'mem-1',
    title: 'Summer 2024 Memories',
    duration: 300,
    segments: [
      {
        id: 'seg-1',
        memoryId: 'mem-1',
        startTime: 0,
        endTime: 60,
        label: 'Arrival',
        color: '#3b82f6',
      },
      {
        id: 'seg-2',
        memoryId: 'mem-1',
        startTime: 60,
        endTime: 180,
        label: 'Exploration',
        color: '#10b981',
      },
      {
        id: 'seg-3',
        memoryId: 'mem-1',
        startTime: 180,
        endTime: 300,
        label: 'Departure',
        color: '#f59e0b',
      },
    ],
    waveform: Array(100).fill(0).map(() => Math.random() * 100),
    currentTime: 45,
    isPlaying: false,
    volume: 80,
    zoom: 1,
  },
];

export default function AudioTimelineComponent({ onCancel, onPlay, onPause, onSeek, onAddSegment, onDeleteSegment }: AudioTimelineProps) {
  const [timelines, setTimelines] = useState<AudioTimeline[]>(DEFAULT_TIMELINES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<AudioTimeline | null>(DEFAULT_TIMELINES[0]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showWaveform, setShowWaveform] = useState(true);

  const totalTimelines = timelines.length;
  const totalSegments = timelines.reduce((sum, t) => sum + t.segments.length, 0);
  const totalDuration = timelines.reduce((sum, t) => sum + t.duration, 0);
  const avgSegments = totalSegments / totalTimelines;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = async (timelineId: string) => {
    await onPlay?.(timelineId);
    setTimelines(timelines.map(t => 
      t.id === timelineId ? { ...t, isPlaying: true } : { ...t, isPlaying: false }
    ));
    if (selectedTimeline?.id === timelineId) {
      setSelectedTimeline({ ...selectedTimeline!, isPlaying: true });
    }
  };

  const handlePause = async (timelineId: string) => {
    await onPause?.(timelineId);
    setTimelines(timelines.map(t => 
      t.id === timelineId ? { ...t, isPlaying: false } : t
    ));
    if (selectedTimeline?.id === timelineId) {
      setSelectedTimeline({ ...selectedTimeline!, isPlaying: false });
    }
  };

  const handleSeek = async (timelineId: string, time: number) => {
    await onSeek?.(timelineId, time);
    setTimelines(timelines.map(t => 
      t.id === timelineId ? { ...t, currentTime: time } : t
    ));
    if (selectedTimeline?.id === timelineId) {
      setSelectedTimeline({ ...selectedTimeline!, currentTime: time });
    }
  };

  const handleAddSegment = async (timelineId: string) => {
    const newSegment: AudioSegment = {
      id: `seg-${Date.now()}`,
      memoryId: timelineId,
      startTime: selectedTimeline?.currentTime || 0,
      endTime: (selectedTimeline?.currentTime || 0) + 30,
      label: 'New Segment',
      color: '#8b5cf6',
    };
    await onAddSegment?.(timelineId, newSegment);
    setTimelines(timelines.map(t => 
      t.id === timelineId ? { ...t, segments: [...t.segments, newSegment] } : t
    ));
  };

  const handleDeleteSegment = async (timelineId: string, segmentId: string) => {
    await onDeleteSegment?.(timelineId, segmentId);
    setTimelines(timelines.map(t => 
      t.id === timelineId ? { ...t, segments: t.segments.filter(s => s.id !== segmentId) } : t
    ));
  };

  const handleZoom = (timelineId: string, delta: number) => {
    setTimelines(timelines.map(t => 
      t.id === timelineId ? { ...t, zoom: Math.max(0.5, Math.min(3, t.zoom + delta)) } : t
    ));
    if (selectedTimeline?.id === timelineId) {
      setSelectedTimeline({ ...selectedTimeline!, zoom: Math.max(0.5, Math.min(3, selectedTimeline.zoom + delta)) });
    }
  };

  const handleVolumeChange = (timelineId: string, volume: number) => {
    setTimelines(timelines.map(t => 
      t.id === timelineId ? { ...t, volume } : t
    ));
    if (selectedTimeline?.id === timelineId) {
      setSelectedTimeline({ ...selectedTimeline!, volume });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Timeline className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Timeline âm thanh của kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalTimelines} timelines
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
            Cài đặt audio timeline
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-scroll on play
              </span>
              <button
                type="button"
                onClick={() => setAutoScroll(!autoScroll)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoScroll ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoScroll ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show waveform
              </span>
              <button
                type="button"
                onClick={() => setShowWaveform(!showWaveform)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showWaveform ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showWaveform ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                High-resolution waveform
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
            <Timeline className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Timelines</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalTimelines}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Segments</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalSegments}
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
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Segments</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgSegments.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      {selectedTimeline && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {selectedTimeline.title}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatDuration(selectedTimeline.duration)}
              </span>
            </div>

            {/* Waveform */}
            {showWaveform && (
              <div className="mb-3 h-16 bg-slate-200 dark:bg-slate-600 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-around px-1">
                  {selectedTimeline.waveform.map((height, index) => (
                    <div
                      key={index}
                      className="w-1 bg-rose-500 rounded-full transition-all"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                {/* Current Time Indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500"
                  style={{ left: `${(selectedTimeline.currentTime / selectedTimeline.duration) * 100}%` }}
                />
              </div>
            )}

            {/* Timeline with Segments */}
            <div className="mb-3 h-8 bg-slate-200 dark:bg-slate-600 rounded-lg relative overflow-hidden">
              {selectedTimeline.segments.map((segment) => (
                <div
                  key={segment.id}
                  className="absolute top-0 bottom-0 flex items-center justify-center px-2 text-[10px] text-white font-medium"
                  style={{
                    left: `${(segment.startTime / selectedTimeline.duration) * 100}%`,
                    width: `${((segment.endTime - segment.startTime) / selectedTimeline.duration) * 100}%`,
                    backgroundColor: segment.color,
                  }}
                >
                  {segment.label}
                </div>
              ))}
              {/* Current Time Indicator */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{ left: `${(selectedTimeline.currentTime / selectedTimeline.duration) * 100}%` }}
              />
            </div>

            {/* Time Display */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>{formatDuration(selectedTimeline.currentTime)}</span>
              <span>{formatDuration(selectedTimeline.duration)}</span>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => selectedTimeline.isPlaying ? handlePause(selectedTimeline.id) : handlePlay(selectedTimeline.id)}
                className="p-2 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 rounded-full transition-colors"
              >
                {selectedTimeline.isPlaying ? (
                  <PauseCircle className="h-4 w-4 text-rose-500" />
                ) : (
                  <PlayCircle className="h-4 w-4 text-rose-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSeek(selectedTimeline.id, Math.max(0, selectedTimeline.currentTime - 10))}
                className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full transition-colors"
              >
                <SkipBack className="h-4 w-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => handleSeek(selectedTimeline.id, Math.min(selectedTimeline.duration, selectedTimeline.currentTime + 10))}
                className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full transition-colors"
              >
                <SkipForward className="h-4 w-4 text-slate-500" />
              </button>

              <div className="flex items-center gap-2 flex-1">
                <Volume2 className="h-4 w-4 text-slate-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedTimeline.volume}
                  onChange={(e) => handleVolumeChange(selectedTimeline.id, parseInt(e.target.value))}
                  className="flex-1 h-1 bg-slate-200 dark:bg-slate-600 rounded-full appearance-none cursor-pointer accent-rose-500"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedTimeline.volume}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleZoom(selectedTimeline.id, -0.5)}
                className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full transition-colors"
              >
                <ZoomOut className="h-4 w-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => handleZoom(selectedTimeline.id, 0.5)}
                className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full transition-colors"
              >
                <ZoomIn className="h-4 w-4 text-slate-500" />
              </button>

              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedTimeline.zoom}x
              </span>
            </div>

            {/* Segment Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAddSegment(selectedTimeline.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-rose-100 dark:bg-rose-900/30 hover:bg-rose-200 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Scissors className="h-3 w-3" />
                Add Segment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Segments List */}
      {selectedTimeline && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Segments
          </h4>
          <div className="space-y-2">
            {selectedTimeline.segments.map((segment) => (
              <div
                key={segment.id}
                className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: segment.color }}
                    />
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {segment.label}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDuration(segment.startTime)} - {formatDuration(segment.endTime)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSegment(selectedTimeline.id, segment.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                  >
                    <TrashIcon className="h-3 w-3 text-red-500" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${((segment.endTime - segment.startTime) / selectedTimeline.duration) * 100}%`,
                        backgroundColor: segment.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDuration(segment.endTime - segment.startTime)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg">
        <p className="text-[10px] text-rose-700 dark:text-rose-400">
          <strong>Lưu ý:</strong> Timeline âm thanh của kỷ niệm với waveform visualization, timeline navigation (play/pause/seek/skip), segment management (add/delete/color label), zoom controls, volume adjustment, current time indicator, auto-scroll on play, high-resolution waveform, và comprehensive audio timeline system.
        </p>
      </div>
    </div>
  );
}