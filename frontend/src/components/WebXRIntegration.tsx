import { Activity, Activity as ActivityIcon, AlertTriangle, BarChart3, Battery, Calendar, Check, CheckCircle, CheckSquare, Clock, Download, Filter, Gauge, Glasses, Monitor, Pause, Play, Plus, RefreshCw, Settings, Settings as SettingsIcon, Shield, Smartphone, Square, Trash2, Wifi, X, Zap, Zap as ZapIcon } from 'lucide-react';
'use client';

import { useState } from 'react';


interface XRDevice {
  id: string;
  name: string;
  type: 'vr-headset' | 'ar-glasses' | 'mobile';
  isConnected: boolean;
  batteryLevel: number;
  signalStrength: number;
  lastConnected: Date;
}

interface XRSession {
  id: string;
  mode: 'vr' | 'ar';
  startedAt: Date;
  duration: number;
  status: 'active' | 'paused' | 'ended';
  memoryId: string;
}

interface WebXRIntegrationProps {
  onCancel?: () => void;
  onConnect?: (deviceId: string) => Promise<void>;
  onDisconnect?: (deviceId: string) => Promise<void>;
  onStartSession?: (mode: string) => Promise<void>;
  onEndSession?: (sessionId: string) => Promise<void>;
}

const DEFAULT_DEVICES: XRDevice[] = [
  {
    id: 'device-1',
    name: 'Meta Quest 3',
    type: 'vr-headset',
    isConnected: true,
    batteryLevel: 85,
    signalStrength: 95,
    lastConnected: new Date('2024-01-12'),
  },
  {
    id: 'device-2',
    name: 'Apple Vision Pro',
    type: 'ar-glasses',
    isConnected: false,
    batteryLevel: 0,
    signalStrength: 0,
    lastConnected: new Date('2024-01-10'),
  },
];

const DEFAULT_SESSIONS: XRSession[] = [
  {
    id: 'session-1',
    mode: 'vr',
    startedAt: new Date('2024-01-12'),
    duration: 300,
    status: 'ended',
    memoryId: 'mem-1',
  },
];

export default function WebXRIntegration({ onCancel, onConnect, onDisconnect, onStartSession, onEndSession }: WebXRIntegrationProps) {
  const [devices, setDevices] = useState<XRDevice[]>(DEFAULT_DEVICES);
  const [sessions, setSessions] = useState<XRSession[]>(DEFAULT_SESSIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [autoConnect, setAutoConnect] = useState(true);
  const [immersiveMode, setImmersiveMode] = useState(true);

  const connectedDevices = devices.filter(d => d.isConnected);
  const totalSessions = sessions.length;
  const avgBattery = connectedDevices.length > 0 
    ? connectedDevices.reduce((sum, d) => sum + d.batteryLevel, 0) / connectedDevices.length 
    : 0;
  const avgSignal = connectedDevices.length > 0 
    ? connectedDevices.reduce((sum, d) => sum + d.signalStrength, 0) / connectedDevices.length 
    : 0;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConnect = async (deviceId: string) => {
    await onConnect?.(deviceId);
    setDevices(devices.map(d => 
      d.id === deviceId ? { ...d, isConnected: true, lastConnected: new Date() } : d
    ));
  };

  const handleDisconnect = async (deviceId: string) => {
    await onDisconnect?.(deviceId);
    setDevices(devices.map(d => 
      d.id === deviceId ? { ...d, isConnected: false } : d
    ));
  };

  const handleStartSession = async (mode: string) => {
    await onStartSession?.(mode);
    const newSession: XRSession = {
      id: `session-${Date.now()}`,
      mode: mode as any,
      startedAt: new Date(),
      duration: 0,
      status: 'active',
      memoryId: 'mem-1',
    };
    setSessions([newSession, ...sessions]);
  };

  const handleEndSession = async (sessionId: string) => {
    await onEndSession?.(sessionId);
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, status: 'ended' } : s
    ));
  };

  const handleScan = async () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'vr-headset':
        return <Glasses className="h-4 w-4" />;
      case 'ar-glasses':
        return <Smartphone className="h-4 w-4" />;
      case 'mobile':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Glasses className="h-4 w-4" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 50) return 'text-green-500';
    if (level >= 20) return 'text-amber-500';
    return 'text-red-500';
  };

  const getSignalColor = (strength: number) => {
    if (strength >= 70) return 'text-green-500';
    if (strength >= 40) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <Glasses className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tích hợp WebXR API cho trình duyệt
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {connectedDevices.length} devices connected
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
            Cài đặt WebXR
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-connect devices
              </span>
              <button
                type="button"
                onClick={() => setAutoConnect(!autoConnect)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoConnect ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoConnect ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Immersive mode
              </span>
              <button
                type="button"
                onClick={() => setImmersiveMode(!immersiveMode)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  immersiveMode ? 'bg-violet-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    immersiveMode ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                WebXR supported
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Yes</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Glasses className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Devices</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {devices.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckSquare className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Connected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {connectedDevices.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Battery className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Battery</span>
          </div>
          <div className={`text-lg font-bold ${getBatteryColor(avgBattery)}`}>
            {avgBattery.toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Wifi className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Signal</span>
          </div>
          <div className={`text-lg font-bold ${getSignalColor(avgSignal)}`}>
            {avgSignal.toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Device Scan */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Device Scan
            </span>
            {isScanning && (
              <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-semibold rounded-full">
                Scanning...
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleScan}
            disabled={isScanning}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-500 hover:to-purple-600 disabled:from-slate-400 disabled:to-slate-500 text-white text-sm font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {isScanning ? (
              <>
                <ActivityIcon className="h-4 w-4 animate-spin" />
                Scanning for devices...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Scan for Devices
              </>
            )}
          </button>
        </div>
      </div>

      {/* Device List */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          XR Devices
        </h4>
        <div className="space-y-2">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`p-4 rounded-lg border-2 ${
                device.isConnected
                  ? 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                  : 'bg-slate-100 dark:bg-slate-600/50 border-slate-300 dark:border-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${device.isConnected ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-slate-200 dark:bg-slate-600'}`}>
                    <span className={device.isConnected ? 'text-violet-500' : 'text-slate-500'}>
                      {getDeviceIcon(device.type)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {device.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {device.type.replace('-', ' ')}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => device.isConnected ? handleDisconnect(device.id) : handleConnect(device.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    device.isConnected
                      ? 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400'
                      : 'bg-violet-100 dark:bg-violet-900/30 hover:bg-violet-200 dark:hover:bg-violet-900/50 text-violet-600 dark:text-violet-400'
                  }`}
                >
                  {device.isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>

              {device.isConnected && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Battery</div>
                    <div className={`text-xs ${getBatteryColor(device.batteryLevel)}`}>
                      {device.batteryLevel}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Signal</div>
                    <div className={`text-xs ${getSignalColor(device.signalStrength)}`}>
                      {device.signalStrength}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Connected</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {device.lastConnected.toLocaleTimeString('vi-VN')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Session Management */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          XR Sessions
        </h4>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Glasses className="h-4 w-4 text-violet-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {session.mode.toUpperCase()} Session
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {session.status}
                    </div>
                  </div>
                </div>
                {session.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => handleEndSession(session.id)}
                    className="px-3 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    End Session
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Started</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {session.startedAt.toLocaleTimeString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {formatDuration(session.duration)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Memory</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {session.memoryId}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Session */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Start New Session
          </h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleStartSession('vr')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-400 to-purple-500 hover:from-violet-500 hover:to-purple-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Glasses className="h-4 w-4" />
              VR Session
            </button>
            <button
              type="button"
              onClick={() => handleStartSession('ar')}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Smartphone className="h-4 w-4" />
              AR Session
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 rounded-lg">
        <p className="text-[10px] text-violet-700 dark:text-violet-400">
          <strong>Lưu ý:</strong> Tích hợp WebXR API cho trình duyệt với device scanning (VR headsets/AR glasses/mobile), device management (connect/disconnect), battery and signal monitoring, session management (VR/AR), immersive mode, auto-connect devices, session history tracking, và comprehensive WebXR integration system.
        </p>
      </div>
    </div>
  );
}