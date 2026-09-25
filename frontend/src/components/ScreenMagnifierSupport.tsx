'use client';

import { useState } from 'react';
import { CheckCircle, Info, Maximize, Minimize, RefreshCw, Search, Settings, ZoomIn } from 'lucide-react';

interface ScreenMagnifierSupportProps {
  onCancel?: () => void;
}

interface MagnifierPreset {
  id: string;
  name: string;
  description: string;
  zoomLevel: number;
  isDefault: boolean;
}

export default function ScreenMagnifierSupport({ onCancel }: ScreenMagnifierSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('100');
  const [customZoom, setCustomZoom] = useState(100);
  const [lensSize, setLensSize] = useState(150);
  const [followCursor, setFollowCursor] = useState(true);

  const [magnifierPresets, setMagnifierPresets] = useState<MagnifierPreset[]>([
    { id: '100', name: '100%', description: 'No zoom', zoomLevel: 100, isDefault: true },
    { id: '150', name: '150%', description: '1.5x zoom', zoomLevel: 150, isDefault: false },
    { id: '200', name: '200%', description: '2x zoom', zoomLevel: 200, isDefault: false },
    { id: '300', name: '300%', description: '3x zoom', zoomLevel: 300, isDefault: false },
    { id: '400', name: '400%', description: '4x zoom', zoomLevel: 400, isDefault: false },
  ]);

  const applyPreset = (id: string) => {
    const preset = magnifierPresets.find(p => p.id === id);
    if (preset) {
      setSelectedPreset(id);
      setCustomZoom(preset.zoomLevel);
      setIsGloballyEnabled(preset.zoomLevel > 100);
    }
  };

  const increaseZoom = () => {
    const newZoom = Math.min(customZoom + 25, 500);
    setCustomZoom(newZoom);
    setIsGloballyEnabled(newZoom > 100);
  };

  const decreaseZoom = () => {
    const newZoom = Math.max(customZoom - 25, 100);
    setCustomZoom(newZoom);
    setIsGloballyEnabled(newZoom > 100);
  };

  const resetZoom = () => {
    const defaultPreset = magnifierPresets.find(p => p.isDefault);
    if (defaultPreset) {
      applyPreset(defaultPreset.id);
    }
  };

  const testMagnifier = () => {
    setCustomZoom(200);
    setIsGloballyEnabled(true);
    setTimeout(() => {
      setCustomZoom(100);
      setIsGloballyEnabled(false);
    }, 3000);
  };

  const getPresetColor = (preset: MagnifierPreset) => {
    if (preset.isDefault) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (selectedPreset === preset.id && isGloballyEnabled) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <ZoomIn className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Screen Magnifier Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Screen magnification for low vision
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGloballyEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGloballyEnabled ? `${customZoom}%` : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Presets</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{magnifierPresets.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Zoom Level</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{customZoom}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Lens Size</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{lensSize}px</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Follow Cursor</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{followCursor ? 'On' : 'Off'}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGloballyEnabled}
              onChange={(e) => setIsGloballyEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Magnifier</span>
          </div>
          <button
            type="button"
            onClick={decreaseZoom}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Minimize className="h-3 w-3" />
            Zoom Out
          </button>
          <button
            type="button"
            onClick={increaseZoom}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Maximize className="h-3 w-3" />
            Zoom In
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Reset
          </button>
          <button
            type="button"
            onClick={testMagnifier}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Search className="h-3 w-3" />
            Test
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Zoom Presets</h4>
          <div className="space-y-2">
            {magnifierPresets.map((preset) => (
              <div key={preset.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <ZoomIn className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{preset.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getPresetColor(preset)}`}>
                        {preset.isDefault ? 'Default' : selectedPreset === preset.id && isGloballyEnabled ? 'Active' : 'Preset'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{preset.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={`px-2 py-1 rounded text-xs ${selectedPreset === preset.id && isGloballyEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                >
                  {selectedPreset === preset.id && isGloballyEnabled ? 'Active' : 'Apply'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Magnifier Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Zoom Level (100-500%)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="100"
                  max="500"
                  step="25"
                  value={customZoom}
                  onChange={(e) => {
                    setCustomZoom(parseInt(e.target.value));
                    setIsGloballyEnabled(parseInt(e.target.value) > 100);
                  }}
                  className="w-24"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{customZoom}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Lens Size (100-300px)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="100"
                  max="300"
                  step="25"
                  value={lensSize}
                  onChange={(e) => setLensSize(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{lensSize}px</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Follow Cursor</span>
              </div>
              <button
                type="button"
                onClick={() => setFollowCursor(!followCursor)}
                className={`px-3 py-1.5 rounded-lg text-xs ${followCursor ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
              >
                {followCursor ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview</h4>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
            <p className="text-sm mb-2">This is sample text at normal size.</p>
            <p 
              className="text-sm mb-2"
              style={{ transform: `scale(${customZoom / 100})`, transformOrigin: 'left top' }}
            >
              This is sample text at {customZoom}% zoom.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {isGloballyEnabled ? `Magnifier active at ${customZoom}% zoom` : 'Magnifier disabled'}
            </p>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Screen Magnifier Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Screen magnifier helps users with low vision read content</li>
              <li>• WCAG supports up to 200% zoom without horizontal scroll</li>
              <li>• Follow cursor mode provides hands-free magnification</li>
              <li>• Adjust lens size based on user preference</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
