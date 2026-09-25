'use client';

import { useState } from 'react';
import { CheckCircle, Info, Maximize, RefreshCw, Settings, Type, ZoomIn, ZoomOut } from 'lucide-react';

interface LargeTextModeProps {
  onCancel?: () => void;
}

interface TextSizePreset {
  id: string;
  name: string;
  description: string;
  fontSize: number;
  lineHeight: number;
  isDefault: boolean;
}

export default function LargeTextMode({ onCancel }: LargeTextModeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('normal');
  const [customFontSize, setCustomFontSize] = useState(16);
  const [customLineHeight, setCustomLineHeight] = useState(1.5);

  const [textSizePresets, setTextSizePresets] = useState<TextSizePreset[]>([
    { id: 'normal', name: 'Normal', description: 'Standard text size', fontSize: 16, lineHeight: 1.5, isDefault: true },
    { id: 'large', name: 'Large', description: '125% of normal', fontSize: 20, lineHeight: 1.6, isDefault: false },
    { id: 'extra-large', name: 'Extra Large', description: '150% of normal', fontSize: 24, lineHeight: 1.7, isDefault: false },
    { id: 'huge', name: 'Huge', description: '200% of normal', fontSize: 32, lineHeight: 1.8, isDefault: false },
  ]);

  const applyPreset = (id: string) => {
    const preset = textSizePresets.find(p => p.id === id);
    if (preset) {
      setSelectedPreset(id);
      setCustomFontSize(preset.fontSize);
      setCustomLineHeight(preset.lineHeight);
      setIsGloballyEnabled(true);
    }
  };

  const increaseFontSize = () => {
    const newSize = Math.min(customFontSize + 2, 48);
    setCustomFontSize(newSize);
    setIsGloballyEnabled(true);
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(customFontSize - 2, 12);
    setCustomFontSize(newSize);
    setIsGloballyEnabled(true);
  };

  const resetToDefault = () => {
    const defaultPreset = textSizePresets.find(p => p.isDefault);
    if (defaultPreset) {
      applyPreset(defaultPreset.id);
    }
  };

  const getPresetColor = (preset: TextSizePreset) => {
    if (preset.isDefault) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (selectedPreset === preset.id && isGloballyEnabled) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Type className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Large Text Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Large text for better readability
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGloballyEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGloballyEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{textSizePresets.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Font Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{customFontSize}px</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Line Height</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{customLineHeight}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Scale</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{Math.round((customFontSize / 16) * 100)}%</p>
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
            <span className="text-slate-700 dark:text-slate-300">Enable Large Text</span>
          </div>
          <button
            type="button"
            onClick={decreaseFontSize}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <ZoomOut className="h-3 w-3" />
            Decrease
          </button>
          <button
            type="button"
            onClick={increaseFontSize}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <ZoomIn className="h-3 w-3" />
            Increase
          </button>
          <button
            type="button"
            onClick={resetToDefault}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Reset Default
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Size Presets</h4>
          <div className="space-y-2">
            {textSizePresets.map((preset) => (
              <div key={preset.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Type className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{preset.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getPresetColor(preset)}`}>
                        {preset.isDefault ? 'Default' : selectedPreset === preset.id && isGloballyEnabled ? 'Active' : 'Preset'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{preset.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Font: {preset.fontSize}px</span>
                      <span>Line: {preset.lineHeight}</span>
                    </div>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Custom Size</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Font Size (12-48px)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={customFontSize}
                  onChange={(e) => {
                    setCustomFontSize(parseInt(e.target.value));
                    setIsGloballyEnabled(true);
                  }}
                  className="w-24"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{customFontSize}px</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Maximize className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Line Height (1.0-2.5)</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={customLineHeight}
                  onChange={(e) => {
                    setCustomLineHeight(parseFloat(e.target.value));
                    setIsGloballyEnabled(true);
                  }}
                  className="w-24"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{customLineHeight}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview</h4>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
            <p 
              className="mb-2"
              style={{ fontSize: `${customFontSize}px`, lineHeight: customLineHeight }}
            >
              This is sample text with the selected font size and line height. Large text mode helps users with low vision read content more comfortably.
            </p>
            <button 
              className="px-3 py-1.5 rounded text-xs"
              style={{ fontSize: `${customFontSize}px` }}
            >
              Sample Button
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Large Text Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Large text improves readability for low vision users</li>
              <li>• WCAG recommends supporting 200% zoom without horizontal scroll</li>
              <li>• Line height should be at least 1.5 times font size</li>
              <li>• Custom sizing accommodates individual preferences</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
