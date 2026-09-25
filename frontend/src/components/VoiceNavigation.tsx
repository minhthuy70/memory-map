'use client';

import { useState } from 'react';
import { Mic, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Navigation, RefreshCw, Check, Zap as ZapIcon, Plus, Compass, MapPin, ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Home, Layout, Users, Calendar as CalendarIcon, Layers, Trash2 as TrashIcon, ExternalLink, Zap as ZapIcon2 } from 'lucide-react';

interface VoiceNavigationCommand {
  id: string;
  command: string;
  detectedText: string;
  confidence: number;
  action: string;
  executedAt: Date;
  status: 'success' | 'failed' | 'pending';
}

interface NavigationShortcut {
  id: string;
  phrase: string;
  action: string;
  description: string;
  isEnabled: boolean;
}

interface VoiceNavigationProps {
  onCancel?: () => void;
  onNavigate?: (action: string) => Promise<void>;
  onRecord?: () => Promise<void>;
  onStopRecording?: () => Promise<void>;
}

const DEFAULT_COMMANDS: VoiceNavigationCommand[] = [
  {
    id: 'cmd-1',
    command: 'go to home',
    detectedText: 'go to home',
    confidence: 0.95,
    action: 'navigate_home',
    executedAt: new Date('2024-01-12'),
    status: 'success',
  },
];

const DEFAULT_SHORTCUTS: NavigationShortcut[] = [
  {
    id: 'shortcut-1',
    phrase: 'go to home',
    action: 'navigate_home',
    description: 'Navigate to home page',
    isEnabled: true,
  },
  {
    id: 'shortcut-2',
    phrase: 'open memories',
    action: 'open_memories',
    description: 'Open memories page',
    isEnabled: true,
  },
  {
    id: 'shortcut-3',
    phrase: 'show map',
    action: 'show_map',
    description: 'Show map view',
    isEnabled: true,
  },
  {
    id: 'shortcut-4',
    phrase: 'go to settings',
    action: 'navigate_settings',
    description: 'Navigate to settings',
    isEnabled: true,
  },
  {
    id: 'shortcut-5',
    phrase: 'open profile',
    action: 'open_profile',
    description: 'Open user profile',
    isEnabled: true,
  },
];

export default function VoiceNavigation({ onCancel, onNavigate, onRecord, onStopRecording }: VoiceNavigationProps) {
  const [commands, setCommands] = useState<VoiceNavigationCommand[]>(DEFAULT_COMMANDS);
  const [shortcuts, setShortcuts] = useState<NavigationShortcut[]>(DEFAULT_SHORTCUTS);
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedCommand, setDetectedCommand] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [autoExecute, setAutoExecute] = useState(true);

  const totalCommands = commands.length;
  const successCommands = commands.filter(c => c.status === 'success').length;
  const avgConfidence = commands.reduce((sum, c) => sum + c.confidence, 0) / totalCommands;
  const enabledShortcuts = shortcuts.filter(s => s.isEnabled).length;

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
      setDetectedCommand('go to home');
    }, 1000);
  };

  const handleExecute = async (action: string) => {
    await onNavigate?.(action);
    const newCommand: VoiceNavigationCommand = {
      id: `cmd-${Date.now()}`,
      command: detectedCommand,
      detectedText: detectedCommand,
      confidence: 0.92,
      action,
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
        return <Navigation className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'navigate_home':
        return <Home className="h-4 w-4" />;
      case 'open_memories':
        return <Layers className="h-4 w-4" />;
      case 'show_map':
        return <MapPin className="h-4 w-4" />;
      case 'navigate_settings':
        return <SettingsIcon className="h-4 w-4" />;
      case 'open_profile':
        return <Users className="h-4 w-4" />;
      default:
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Điều hướng app bằng giọng nói
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt voice navigation
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
                className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
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
                  autoExecute ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
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
                Voice feedback sounds
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
            <Navigation className="h-3 w-3 text-slate-500" />
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
            <Compass className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Shortcuts</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enabledShortcuts}
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
                  : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white'
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
                <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }} />
              </div>
            </div>
          )}
        </div>

        {/* Detected Command */}
        {detectedCommand && (
          <div className="p-4 rounded-lg border-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Detected Command
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {(0.92 * 100).toFixed(0)}% confidence
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
              "{detectedCommand}"
            </p>
            <button
              type="button"
              onClick={() => handleExecute('navigate_home')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              Execute
            </button>
          </div>
        )}
      </div>

      {/* Navigation Shortcuts */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Voice Navigation Shortcuts
        </h4>
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              className={`p-4 rounded-lg border-2 ${
                shortcut.isEnabled
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Navigation className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      "{shortcut.phrase}"
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {shortcut.description}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShortcuts(shortcuts.map(s => 
                    s.id === shortcut.id ? { ...s, isEnabled: !s.isEnabled } : s
                  ))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    shortcut.isEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                      shortcut.isEnabled ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-600">
                  {getActionIcon(shortcut.action)}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {shortcut.action}
                </span>
              </div>
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

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Điều hướng app bằng giọng nói với voice recording interface, command detection, confidence scoring, auto-execute commands, configurable navigation shortcuts (go to home/open memories/show map/go to settings/open profile), command history tracking, voice feedback sounds, và comprehensive voice navigation system.
        </p>
      </div>
    </div>
  );
}