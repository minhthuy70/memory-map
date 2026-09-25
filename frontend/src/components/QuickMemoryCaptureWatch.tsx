'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Clock,
  Info,
  MapPin,
  Mic,
  Plus,
  RefreshCw,
  Settings,
  Smile,
  Trash2,
  Watch
} from 'lucide-react';

interface QuickMemoryCaptureWatchProps {
  onCancel?: () => void;
}

interface CaptureMethod {
  id: string;
  name: string;
  type: 'photo' | 'video' | 'audio' | 'text';
  icon: string;
  isEnabled: boolean;
}

interface QuickCapture {
  id: string;
  deviceId: string;
  deviceName: string;
  method: string;
  memoryTitle: string;
  capturedAt: string;
  status: 'success' | 'failed' | 'pending';
  memoryId?: string;
}

interface CaptureSettings {
  autoUpload: boolean;
  captureLocation: boolean;
  captureMood: boolean;
  defaultMethod: string;
  quickCaptureButton: boolean;
  voiceInput: boolean;
}

export default function QuickMemoryCaptureWatch({ onCancel }: QuickMemoryCaptureWatchProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isQuickCaptureEnabled, setIsQuickCaptureEnabled] = useState(true);

  const [captureMethods, setCaptureMethods] = useState<CaptureMethod[]>([
    { id: '1', name: 'Photo Capture', type: 'photo', icon: 'camera', isEnabled: true },
    { id: '2', name: 'Video Capture', type: 'video', icon: 'video', isEnabled: true },
    { id: '3', name: 'Voice Note', type: 'audio', icon: 'mic', isEnabled: true },
    { id: '4', name: 'Quick Text', type: 'text', icon: 'text', isEnabled: true },
  ]);

  const [quickCaptures, setQuickCaptures] = useState<QuickCapture[]>([
    { id: '1', deviceId: '1', deviceName: 'Apple Watch', method: 'Photo Capture', memoryTitle: 'Sunset at beach', capturedAt: '2024-01-17 18:30', status: 'success', memoryId: 'mem1' },
    { id: '2', deviceId: '2', deviceName: 'Galaxy Watch', method: 'Voice Note', memoryTitle: 'Meeting notes', capturedAt: '2024-01-16 10:15', status: 'success', memoryId: 'mem2' },
  ]);

  const [captureSettings, setCaptureSettings] = useState<CaptureSettings>({
    autoUpload: true,
    captureLocation: true,
    captureMood: true,
    defaultMethod: 'photo',
    quickCaptureButton: true,
    voiceInput: true,
  });

  const toggleMethod = (id: string) => {
    setCaptureMethods(captureMethods.map(method => 
      method.id === id ? { ...method, isEnabled: !method.isEnabled } : method
    ));
  };

  const triggerCapture = (methodId: string) => {
    const method = captureMethods.find(m => m.id === methodId);
    if (!method) return;

    const newCapture: QuickCapture = {
      id: Date.now().toString(),
      deviceId: '1',
      deviceName: 'Apple Watch',
      method: method.name,
      memoryTitle: `New ${method.name}`,
      capturedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'pending',
    };
    setQuickCaptures([...quickCaptures, newCapture]);
    
    setTimeout(() => {
      setQuickCaptures(captures => captures.map(c => 
        c.id === newCapture.id ? { ...c, status: 'success', memoryId: `mem${Date.now()}` } : c
      ));
    }, 2000);
  };

  const deleteCapture = (id: string) => {
    setQuickCaptures(quickCaptures.filter(capture => capture.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="h-4 w-4" />;
      case 'video': return <Camera className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      case 'text': return <Plus className="h-4 w-4" />;
      default: return <Camera className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Watch className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Quick Memory Capture from Watch
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tạo kỷ niệm nhanh từ đồng hồ
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isQuickCaptureEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isQuickCaptureEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Methods</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{captureMethods.filter(m => m.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Captures</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{quickCaptures.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Success</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{quickCaptures.filter(c => c.status === 'success').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Pending</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{quickCaptures.filter(c => c.status === 'pending').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isQuickCaptureEnabled}
              onChange={(e) => setIsQuickCaptureEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Quick Capture</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Watch className="h-3 w-3" />
            Test Capture
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Capture Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Upload</span>
              </div>
              <input
                type="checkbox"
                checked={captureSettings.autoUpload}
                onChange={(e) => setCaptureSettings({ ...captureSettings, autoUpload: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Capture Location</span>
              </div>
              <input
                type="checkbox"
                checked={captureSettings.captureLocation}
                onChange={(e) => setCaptureSettings({ ...captureSettings, captureLocation: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Smile className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Capture Mood</span>
              </div>
              <input
                type="checkbox"
                checked={captureSettings.captureMood}
                onChange={(e) => setCaptureSettings({ ...captureSettings, captureMood: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Camera className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Method</span>
              </div>
              <select
                value={captureSettings.defaultMethod}
                onChange={(e) => setCaptureSettings({ ...captureSettings, defaultMethod: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
                <option value="audio">Voice Note</option>
                <option value="text">Quick Text</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Plus className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Quick Capture Button</span>
              </div>
              <input
                type="checkbox"
                checked={captureSettings.quickCaptureButton}
                onChange={(e) => setCaptureSettings({ ...captureSettings, quickCaptureButton: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Mic className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Voice Input</span>
              </div>
              <input
                type="checkbox"
                checked={captureSettings.voiceInput}
                onChange={(e) => setCaptureSettings({ ...captureSettings, voiceInput: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Capture Methods</h4>
          <div className="space-y-2">
            {captureMethods.map((method) => (
              <div key={method.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      {getMethodIcon(method.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{method.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${method.isEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          {method.isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{method.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleMethod(method.id)}
                      className={`px-2 py-1 rounded text-xs ${method.isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {method.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                    {method.isEnabled && (
                      <button
                        type="button"
                        onClick={() => triggerCapture(method.id)}
                        className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Test
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quick Captures</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {quickCaptures.map((capture) => (
              <div key={capture.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Watch className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{capture.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(capture.status)}`}>
                          {capture.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{capture.deviceName} • {capture.method}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteCapture(capture.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Captured: {capture.capturedAt}</span>
                  {capture.memoryId && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {capture.memoryId}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quick Capture Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Configure capture methods: photo/video/audio/text</li>
              <li>• Quick capture button on watch face</li>
              <li>• Auto-upload captured memories</li>
              <li>• Capture location and mood automatically</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
