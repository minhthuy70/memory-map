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
  Compass,
  Crosshair,
  Download,
  ExternalLink,
  Filter,
  Globe,
  Layers,
  Locate,
  Map,
  MapPin,
  Mic,
  Move,
  Navigation,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCw,
  Settings,
  SettingsIcon,
  StopCircle,
  Trash2,
  TrashIcon,
  Zap,
  ZapIcon,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface VoiceMapCommand {
  id: string;
  command: string;
  detectedText: string;
  confidence: number;
  action: string;
  parameters: Record<string, any>;
  executedAt: Date;
  status: 'success' | 'failed' | 'pending';
}

interface MapState {
  zoom: number;
  center: { lat: number; lng: number };
  rotation: number;
  pitch: number;
  layer: 'standard' | 'satellite' | 'terrain';
}

interface VoiceActivatedMapProps {
  onCancel?: () => void;
  onExecuteCommand?: (command: string, parameters: Record<string, any>) => Promise<void>;
  onRecord?: () => Promise<void>;
  onStopRecording?: () => Promise<void>;
}

const DEFAULT_COMMANDS: VoiceMapCommand[] = [
  {
    id: 'cmd-1',
    command: 'zoom in',
    detectedText: 'zoom in',
    confidence: 0.95,
    action: 'zoom_in',
    parameters: { level: 1 },
    executedAt: new Date('2024-01-12'),
    status: 'success',
  },
];

const DEFAULT_MAP_STATE: MapState = {
  zoom: 12,
  center: { lat: 21.0285, lng: 105.8542 },
  rotation: 0,
  pitch: 0,
  layer: 'standard',
};

export default function VoiceActivatedMap({ onCancel, onExecuteCommand, onRecord, onStopRecording }: VoiceActivatedMapProps) {
  const [commands, setCommands] = useState<VoiceMapCommand[]>(DEFAULT_COMMANDS);
  const [mapState, setMapState] = useState<MapState>(DEFAULT_MAP_STATE);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedCommand, setDetectedCommand] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [autoExecute, setAutoExecute] = useState(true);

  const totalCommands = commands.length;
  const successCommands = commands.filter(c => c.status === 'success').length;
  const avgConfidence = commands.reduce((sum, c) => sum + c.confidence, 0) / totalCommands;

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
      setDetectedCommand('zoom in');
    }, 1000);
  };

  const handleExecute = async (action: string, parameters: Record<string, any>) => {
    await onExecuteCommand?.(action, parameters);
    
    // Update map state based on action
    if (action === 'zoom_in') {
      setMapState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 20) }));
    } else if (action === 'zoom_out') {
      setMapState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }));
    } else if (action === 'rotate_left') {
      setMapState(prev => ({ ...prev, rotation: prev.rotation - 45 }));
    } else if (action === 'rotate_right') {
      setMapState(prev => ({ ...prev, rotation: prev.rotation + 45 }));
    } else if (action === 'center_on_location') {
      setMapState(prev => ({ ...prev, center: parameters.location || prev.center }));
    }

    const newCommand: VoiceMapCommand = {
      id: `cmd-${Date.now()}`,
      command: detectedCommand,
      detectedText: detectedCommand,
      confidence: 0.92,
      action,
      parameters,
      executedAt: new Date(),
      status: 'success',
    };
    setCommands([newCommand, ...commands]);
    setDetectedCommand('');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.7) return 'text-amber-500';
    return 'text-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-amber-500';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <Map className="h-4 w-4" />;
    }
  };

  const voiceCommands = [
    { phrase: 'zoom in', action: 'zoom_in', description: 'Zoom in by 1 level' },
    { phrase: 'zoom out', action: 'zoom_out', description: 'Zoom out by 1 level' },
    { phrase: 'pan left', action: 'pan_left', description: 'Pan map to the left' },
    { phrase: 'pan right', action: 'pan_right', description: 'Pan map to the right' },
    { phrase: 'pan up', action: 'pan_up', description: 'Pan map up' },
    { phrase: 'pan down', action: 'pan_down', description: 'Pan map down' },
    { phrase: 'rotate left', action: 'rotate_left', description: 'Rotate map left 45°' },
    { phrase: 'rotate right', action: 'rotate_right', description: 'Rotate map right 45°' },
    { phrase: 'center on location', action: 'center_on_location', description: 'Center on specified location' },
    { phrase: 'show my location', action: 'show_my_location', description: 'Show current location' },
    { phrase: 'switch to satellite', action: 'switch_layer', description: 'Switch to satellite view' },
    { phrase: 'switch to standard', action: 'switch_layer', description: 'Switch to standard view' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Điều khiển bản đồ bằng giọng nói
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {successCommands}/{totalCommands} successful
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
        <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt voice-activated map
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
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-execute commands
              </span>
              <button
                type="button"
                onClick={() => setAutoExecute(!autoExecute)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoExecute ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoExecute ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Voice feedback
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
            <Map className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Commands</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalCommands}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Success</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {successCommands}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ZoomIn className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Zoom</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {mapState.zoom}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Compass className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Rotation</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {mapState.rotation}°
          </div>
        </div>
      </div>

      {/* Map Preview */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Map State
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {mapState.layer}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Zoom Level</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {mapState.zoom}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Center</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {mapState.center.lat.toFixed(4)}, {mapState.center.lng.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Rotation</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {mapState.rotation}°
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Pitch</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {mapState.pitch}°
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMapState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 1, 1) }))}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <ZoomOut className="h-4 w-4" />
              Zoom Out
            </button>
            <button
              type="button"
              onClick={() => setMapState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 1, 20) }))}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
              Zoom In
            </button>
            <button
              type="button"
              onClick={() => setMapState(prev => ({ ...prev, rotation: 0 }))}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              <Compass className="h-4 w-4" />
              Reset
            </button>
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
                  : 'bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white'
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
                <span className="text-sm text-red-500 font-medium">Listening...</span>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Processing command...
                </span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>

        {/* Detected Command */}
        {detectedCommand && (
          <div className="p-4 rounded-lg border-2 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Detected Command
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {(0.92 * 100).toFixed(0)}% confidence
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
              "{detectedCommand}"
            </p>
            <button
              type="button"
              onClick={() => handleExecute('zoom_in', { level: 1 })}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Navigation className="h-4 w-4" />
              Execute
            </button>
          </div>
        )}
      </div>

      {/* Voice Commands Reference */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Voice Commands Reference
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {voiceCommands.map((cmd, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-3 w-3 text-emerald-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  "{cmd.phrase}"
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {cmd.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Command History */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Command History
        </h4>
        <div className="space-y-2">
          {commands.map((command) => (
            <div
              key={command.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(command.status)}`}>
                    {getStatusIcon(command.status)}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {command.command}
                    </span>
                    <div className={`text-xs ${getStatusColor(command.status)} capitalize`}>
                      {command.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Detected</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {command.detectedText}
                  </div>
                </div>
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

      <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg">
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
          <strong>Lưu ý:</strong> Điều khiển bản đồ bằng giọng nói với voice recording interface, command detection, confidence scoring, auto-execute commands, map state tracking (zoom/rotation/pitch/center), voice commands (zoom in/out/pan/rotate/center/switch layer), command history, voice feedback, và comprehensive voice-activated map control system.
        </p>
      </div>
    </div>
  );
}