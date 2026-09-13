'use client';

import { useState } from 'react';
import { Video, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Type, RefreshCw, Check, Zap as ZapIcon, Layers, Plus, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, Move, Palette, Sliders, Eye, EyeOff, Trash2 as TrashIcon } from 'lucide-react';

interface TextOverlay {
  id: string;
  text: string;
  position: { x: number; y: number };
  alignment: 'left' | 'center' | 'right';
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  opacity: number;
  startTime: number;
  endTime: number;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isVisible: boolean;
}

interface VideoWithText {
  id: string;
  videoId: string;
  videoName: string;
  overlays: TextOverlay[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt: Date | null;
}

interface AddTextOverlayProps {
  onCancel?: () => void;
  onAddOverlay?: (videoId: string, overlay: TextOverlay) => Promise<void>;
  onRender?: (videoId: string) => Promise<void>;
  onPreview?: (videoId: string) => Promise<void>;
}

const DEFAULT_VIDEOS: VideoWithText[] = [
  {
    id: 'vwt-1',
    videoId: 'video-1',
    videoName: 'family-vacation.mp4',
    overlays: [
      {
        id: 'overlay-1',
        text: 'Summer 2024',
        position: { x: 50, y: 10 },
        alignment: 'center',
        fontSize: 48,
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
        opacity: 0.8,
        startTime: 0,
        endTime: 120,
        isBold: true,
        isItalic: false,
        isUnderline: false,
        isVisible: true,
      },
    ],
    status: 'completed',
    progress: 100,
    startedAt: new Date('2024-01-12'),
    completedAt: new Date('2024-01-12'),
  },
];

export default function AddTextOverlay({ onCancel, onAddOverlay, onRender, onPreview }: AddTextOverlayProps) {
  const [videos, setVideos] = useState<VideoWithText[]>(DEFAULT_VIDEOS);
  const [showSettings, setShowSettings] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoWithText | null>(DEFAULT_VIDEOS[0]);
  const [isRendering, setIsRendering] = useState(false);
  const [autoRender, setAutoRender] = useState(true);
  const [textEffects, setTextEffects] = useState(true);

  const totalVideos = videos.length;
  const completedVideos = videos.filter(v => v.status === 'completed').length;
  const totalOverlays = videos.reduce((sum, v) => sum + v.overlays.length, 0);
  const avgOverlays = totalOverlays / totalVideos;

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
        return <Type className="h-4 w-4" />;
    }
  };

  const handleRender = async (videoId: string) => {
    setIsRendering(true);
    await onRender?.(videoId);
    setIsRendering(false);
  };

  const handlePreview = async (videoId: string) => {
    await onPreview?.(videoId);
  };

  const handleAddOverlay = async (videoId: string) => {
    const newOverlay: TextOverlay = {
      id: `overlay-${Date.now()}`,
      text: 'New Text',
      position: { x: 50, y: 50 },
      alignment: 'center',
      fontSize: 32,
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      opacity: 0.7,
      startTime: 0,
      endTime: 60,
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isVisible: true,
    };
    await onAddOverlay?.(videoId, newOverlay);
  };

  const handleRemoveOverlay = (videoId: string, overlayId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { ...v, overlays: v.overlays.filter(o => o.id !== overlayId) }
        : v
    ));
  };

  const handleUpdateOverlay = (videoId: string, overlayId: string, updates: Partial<TextOverlay>) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { 
            ...v, 
            overlays: v.overlays.map(o => 
              o.id === overlayId ? { ...o, ...updates } : o
            )
          }
        : v
    ));
  };

  const handleToggleVisibility = (videoId: string, overlayId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { 
            ...v, 
            overlays: v.overlays.map(o => 
              o.id === overlayId ? { ...o, isVisible: !o.isVisible } : o
            )
          }
        : v
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Type className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Thêm chữ overlay lên video
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalOverlays} overlays
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
            Cài đặt text overlay
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-render on save
              </span>
              <button
                type="button"
                onClick={() => setAutoRender(!autoRender)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoRender ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoRender ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Text effects
              </span>
              <button
                type="button"
                onClick={() => setTextEffects(!textEffects)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  textEffects ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    textEffects ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Shadow effects
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Overlays</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalOverlays}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Type className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg/Video</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgOverlays.toFixed(1)}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Rendered</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {completedVideos}
          </div>
        </div>
      </div>

      {/* Video with Text Overlays */}
      {currentVideo && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Video className="h-4 w-4 text-amber-500" />
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

            {/* Text Overlays */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Text Overlays
                </h4>
                <button
                  type="button"
                  onClick={() => handleAddOverlay(currentVideo.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  Add Overlay
                </button>
              </div>

              <div className="space-y-2">
                {currentVideo.overlays.map((overlay) => (
                  <div
                    key={overlay.id}
                    className={`p-3 rounded-lg border-2 ${
                      overlay.isVisible
                        ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                        : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                          <Type className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {overlay.text}
                          </span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {overlay.fontSize}px • {overlay.fontFamily}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(currentVideo.id, overlay.id)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                        >
                          {overlay.isVisible ? (
                            <Eye className="h-3 w-3 text-slate-500" />
                          ) : (
                            <EyeOff className="h-3 w-3 text-slate-500" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveOverlay(currentVideo.id, overlay.id)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        >
                          <TrashIcon className="h-3 w-3 text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Text Input */}
                    <div className="mb-2">
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                        Text
                      </label>
                      <input
                        type="text"
                        value={overlay.text}
                        onChange={(e) => handleUpdateOverlay(currentVideo.id, overlay.id, { text: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Position */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          X Position: {overlay.position.x}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={overlay.position.x}
                          onChange={(e) => handleUpdateOverlay(currentVideo.id, overlay.id, { 
                            position: { ...overlay.position, x: parseInt(e.target.value) }
                          })}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Y Position: {overlay.position.y}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={overlay.position.y}
                          onChange={(e) => handleUpdateOverlay(currentVideo.id, overlay.id, { 
                            position: { ...overlay.position, y: parseInt(e.target.value) }
                          })}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="mb-2">
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                        Font Size: {overlay.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="120"
                        value={overlay.fontSize}
                        onChange={(e) => handleUpdateOverlay(currentVideo.id, overlay.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    {/* Colors */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Text Color
                        </label>
                        <input
                          type="color"
                          value={overlay.color}
                          onChange={(e) => handleUpdateOverlay(currentVideo.id, overlay.id, { color: e.target.value })}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Background Color
                        </label>
                        <input
                          type="color"
                          value={overlay.backgroundColor}
                          onChange={(e) => handleUpdateOverlay(currentVideo.id, overlay.id, { backgroundColor: e.target.value })}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Alignment */}
                    <div className="mb-2">
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                        Alignment
                      </label>
                      <div className="flex gap-2">
                        {(['left', 'center', 'right'] as const).map((align) => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => handleUpdateOverlay(currentVideo.id, overlay.id, { alignment: align })}
                            className={`flex-1 p-2 rounded-lg border-2 transition-colors ${
                              overlay.alignment === align
                                ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
                                : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'
                            }`}
                          >
                            {align === 'left' && <AlignLeft className="h-4 w-4" />}
                            {align === 'center' && <AlignCenter className="h-4 w-4" />}
                            {align === 'right' && <AlignRight className="h-4 w-4" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Style */}
                    <div className="mb-2">
                      <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                        Text Style
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateOverlay(currentVideo.id, overlay.id, { isBold: !overlay.isBold })}
                          className={`flex-1 p-2 rounded-lg border-2 transition-colors ${
                            overlay.isBold
                              ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
                              : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'
                          }`}
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateOverlay(currentVideo.id, overlay.id, { isItalic: !overlay.isItalic })}
                          className={`flex-1 p-2 rounded-lg border-2 transition-colors ${
                            overlay.isItalic
                              ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
                              : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'
                          }`}
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateOverlay(currentVideo.id, overlay.id, { isUnderline: !overlay.isUnderline })}
                          className={`flex-1 p-2 rounded-lg border-2 transition-colors ${
                            overlay.isUnderline
                              ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800'
                              : 'bg-slate-200 dark:bg-slate-600 border-slate-300 dark:border-slate-500'
                          }`}
                        >
                          <Underline className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          Start: {formatDuration(overlay.startTime)}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max={overlay.endTime}
                          value={overlay.startTime}
                          onChange={(e) => handleUpdateOverlay(currentVideo.id, overlay.id, { startTime: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">
                          End: {formatDuration(overlay.endTime)}
                        </label>
                        <input
                          type="range"
                          min={overlay.startTime}
                          max="300"
                          value={overlay.endTime}
                          onChange={(e) => handleUpdateOverlay(currentVideo.id, overlay.id, { endTime: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
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
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                type="button"
                onClick={() => handleRender(currentVideo.id)}
                disabled={isRendering}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isRendering ? 'animate-spin' : ''}`} />
                {isRendering ? 'Rendering...' : 'Render'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Thêm chữ overlay lên video với text overlay management, positioning (X/Y position sliders), alignment (left/center/right), font styling (size/family/color/background), text style (bold/italic/underline), opacity control, timing (start/end), visibility toggle, preview functionality, auto-render on save, text effects, và shadow effects.
        </p>
      </div>
    </div>
  );
}