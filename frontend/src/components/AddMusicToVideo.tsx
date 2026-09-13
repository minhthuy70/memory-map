'use client';

import { useState } from 'react';
import { Video, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Music, Volume2, VolumeX, PlayCircle, RefreshCw, Check, Zap as ZapIcon, Sliders, Upload, Trash2 as TrashIcon, Plus, Layers, Waveform, SkipBack, SkipForward } from 'lucide-react';

interface AudioTrack {
  id: string;
  name: string;
  type: 'music' | 'voiceover' | 'sound-effect';
  url: string;
  duration: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  startTime: number;
  isMuted: boolean;
}

interface VideoWithMusic {
  id: string;
  videoId: string;
  videoName: string;
  videoVolume: number;
  audioTracks: AudioTrack[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt: Date | null;
}

interface AddMusicToVideoProps {
  onCancel?: () => void;
  onAddTrack?: (videoId: string, track: AudioTrack) => Promise<void>;
  onMixAudio?: (videoId: string) => Promise<void>;
  onPreview?: (videoId: string) => Promise<void>;
}

const DEFAULT_VIDEOS: VideoWithMusic[] = [
  {
    id: 'vwm-1',
    videoId: 'video-1',
    videoName: 'family-vacation.mp4',
    videoVolume: 100,
    audioTracks: [
      {
        id: 'track-1',
        name: 'background-music.mp3',
        type: 'music',
        url: '/music-1.mp3',
        duration: 120,
        volume: 50,
        fadeIn: 2,
        fadeOut: 2,
        startTime: 0,
        isMuted: false,
      },
    ],
    status: 'completed',
    progress: 100,
    startedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
  },
];

export default function AddMusicToVideo({ onCancel, onAddTrack, onMixAudio, onPreview }: AddMusicToVideoProps) {
  const [videos, setVideos] = useState<VideoWithMusic[]>(DEFAULT_VIDEOS);
  const [showSettings, setShowSettings] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoWithMusic | null>(DEFAULT_VIDEOS[0]);
  const [isMixing, setIsMixing] = useState(false);
  const [autoMix, setAutoMix] = useState(true);
  const [normalizeAudio, setNormalizeAudio] = useState(true);

  const totalVideos = videos.length;
  const completedVideos = videos.filter(v => v.status === 'completed').length;
  const totalTracks = videos.reduce((sum, v) => sum + v.audioTracks.length, 0);
  const avgTracks = totalTracks / totalVideos;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-500';
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
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'processing':
        return <Activity className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Music className="h-4 w-4" />;
    }
  };

  const getTrackTypeColor = (type: string) => {
    switch (type) {
      case 'music':
        return 'text-purple-500';
      case 'voiceover':
        return 'text-blue-500';
      case 'sound-effect':
        return 'text-green-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleMix = async (videoId: string) => {
    setIsMixing(true);
    await onMixAudio?.(videoId);
    setIsMixing(false);
  };

  const handlePreview = async (videoId: string) => {
    await onPreview?.(videoId);
  };

  const handleAddTrack = async (videoId: string) => {
    const newTrack: AudioTrack = {
      id: `track-${Date.now()}`,
      name: 'new-track.mp3',
      type: 'music',
      url: '/new-track.mp3',
      duration: 60,
      volume: 50,
      fadeIn: 0,
      fadeOut: 0,
      startTime: 0,
      isMuted: false,
    };
    await onAddTrack?.(videoId, newTrack);
  };

  const handleRemoveTrack = (videoId: string, trackId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { ...v, audioTracks: v.audioTracks.filter(t => t.id !== trackId) }
        : v
    ));
  };

  const handleUpdateTrack = (videoId: string, trackId: string, updates: Partial<AudioTrack>) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { 
            ...v, 
            audioTracks: v.audioTracks.map(t => 
              t.id === trackId ? { ...t, ...updates } : t
            )
          }
        : v
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Music className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thêm nhạc nền vào video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalTracks} audio tracks
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt audio mixing
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-mix on save
              </span>
              <button
                type="button"
                onClick={() => setAutoMix(!autoMix)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoMix ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoMix ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Normalize audio
              </span>
              <button
                type="button"
                onClick={() => setNormalizeAudio(!normalizeAudio)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  normalizeAudio ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    normalizeAudio ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Audio compression
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
            <Video className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Videos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalVideos}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Tracks</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalTracks}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Waveform className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg/Video</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgTracks.toFixed(1)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Mixed</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedVideos}
          </div>
        </div>
      </div>

      {/* Video with Audio Tracks */}
      {currentVideo && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Video className="h-4 w-4 text-purple-500" />
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {currentVideo.videoName}
                  </span>
                  <div className={`text-xs ${getStatusColor(currentVideo.status)} capitalize`}>
                    {currentVideo.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Video Volume */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Video Volume: {currentVideo.videoVolume}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentVideo.videoVolume}
                onChange={(e) => setVideos(videos.map(v => 
                  v.id === currentVideo.id 
                    ? { ...v, videoVolume: parseInt(e.target.value) }
                    : v
                ))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Audio Tracks */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Audio Tracks
                </h4>
                <button
                  type="button"
                  onClick={() => handleAddTrack(currentVideo.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add Track
                </button>
              </div>

              <div className="space-y-2">
                {currentVideo.audioTracks.map((track) => (
                  <div
                    key={track.id}
                    className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getTrackTypeColor(track.type)}`}>
                          <Music className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {track.name}
                          </span>
                          <div className={`text-xs ${getTrackTypeColor(track.type)} capitalize`}>
                            {track.type}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTrack(currentVideo.id, track.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      >
                        <TrashIcon className="h-3 w-3 text-red-500" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Volume: {track.volume}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={track.volume}
                          onChange={(e) => handleUpdateTrack(currentVideo.id, track.id, { volume: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Start: {formatDuration(track.startTime)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max={track.duration}
                          value={track.startTime}
                          onChange={(e) => handleUpdateTrack(currentVideo.id, track.id, { startTime: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Fade In: {track.fadeIn}s
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.5"
                          value={track.fadeIn}
                          onChange={(e) => handleUpdateTrack(currentVideo.id, track.id, { fadeIn: parseFloat(e.target.value) })}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Fade Out: {track.fadeOut}s
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.5"
                          value={track.fadeOut}
                          onChange={(e) => handleUpdateTrack(currentVideo.id, track.id, { fadeOut: parseFloat(e.target.value) })}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePreview(currentVideo.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
              >
                <PlayCircle className="h-4 w-4" />
                Preview
              </button>
              <button
                type="button"
                onClick={() => handleMix(currentVideo.id)}
                disabled={isMixing}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isMixing ? 'animate-spin' : ''}`} />
                {isMixing ? 'Mixing...' : 'Mix Audio'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Thêm nhạc nền vào video với audio track management (music/voiceover/sound-effect), volume control for video and tracks, fade in/out settings, start time adjustment, track add/remove functionality, preview mixed audio, auto-mix on save, normalize audio, và audio compression.
        </p>
      </div>
    </div>
  );
}