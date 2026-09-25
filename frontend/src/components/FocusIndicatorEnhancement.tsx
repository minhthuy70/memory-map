'use client';

import { useState } from 'react';
import { CheckCircle, Circle, Crosshair, Info, RefreshCw, Settings, Target } from 'lucide-react';

interface FocusIndicatorEnhancementProps {
  onCancel?: () => void;
}

interface FocusStyle {
  id: string;
  name: string;
  description: string;
  color: string;
  width: number;
  style: 'solid' | 'dashed' | 'dotted' | 'double';
  offset: number;
  isDefault: boolean;
}

export default function FocusIndicatorEnhancement({ onCancel }: FocusIndicatorEnhancementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<string>('default');

  const [focusStyles, setFocusStyles] = useState<FocusStyle[]>([
    { id: 'default', name: 'Default', description: 'Browser default focus', color: '#0000FF', width: 2, style: 'solid', offset: 0, isDefault: true },
    { id: 'thick-blue', name: 'Thick Blue', description: 'Thick blue outline', color: '#3B82F6', width: 4, style: 'solid', offset: 0, isDefault: false },
    { id: 'thick-orange', name: 'Thick Orange', description: 'Thick orange outline', color: '#F97316', width: 4, style: 'solid', offset: 0, isDefault: false },
    { id: 'dashed-purple', name: 'Dashed Purple', description: 'Dashed purple outline', color: '#8B5CF6', width: 3, style: 'dashed', offset: 0, isDefault: false },
    { id: 'double-green', name: 'Double Green', description: 'Double green outline', color: '#22C55E', width: 3, style: 'double', offset: 0, isDefault: false },
    { id: 'high-contrast', name: 'High Contrast', description: 'High contrast yellow on black', color: '#FFFF00', width: 4, style: 'solid', offset: 2, isDefault: false },
  ]);

  const applyStyle = (id: string) => {
    setSelectedStyle(id);
    setIsGloballyEnabled(true);
  };

  const createCustomStyle = () => {
    const newStyle: FocusStyle = {
      id: Date.now().toString(),
      name: 'Custom Style',
      description: 'Custom focus indicator',
      color: '#3B82F6',
      width: 3,
      style: 'solid',
      offset: 0,
      isDefault: false,
    };
    setFocusStyles([...focusStyles, newStyle]);
  };

  const deleteStyle = (id: string) => {
    setFocusStyles(focusStyles.filter(style => style.id !== id));
  };

  const testFocus = () => {
    setSelectedStyle('thick-blue');
    setIsGloballyEnabled(true);
    setTimeout(() => {
      setSelectedStyle('default');
    }, 3000);
  };

  const getStyleColor = (style: FocusStyle) => {
    if (style.isDefault) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (selectedStyle === style.id && isGloballyEnabled) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  const getBorderStyle = (borderStyle: string) => {
    switch (borderStyle) {
      case 'solid': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'dashed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'dotted': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'double': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const activeStyle = focusStyles.find(s => s.id === selectedStyle);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Focus Indicator Enhancement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enhanced keyboard focus indicators
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Styles</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{focusStyles.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{selectedStyle}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Border Width</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{activeStyle?.width || 2}px</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Offset</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{activeStyle?.offset || 0}px</p>
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
            <span className="text-slate-700 dark:text-slate-300">Enhance Focus</span>
          </div>
          <button
            type="button"
            onClick={testFocus}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Crosshair className="h-3 w-3" />
            Test Focus
          </button>
          <button
            type="button"
            onClick={createCustomStyle}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Create Style
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Focus Styles</h4>
          <div className="space-y-2">
            {focusStyles.map((style) => (
              <div key={style.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ 
                      border: `${style.width}px ${style.style} ${style.color}`,
                      outlineOffset: `${style.offset}px`
                    }}
                  >
                    <Target className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{style.name}</span>
                      {selectedStyle === style.id && isGloballyEnabled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getStyleColor(style)}`}>
                        {style.isDefault ? 'Default' : 'Custom'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getBorderStyle(style.style)}`}>
                        {style.style}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{style.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: style.color }} title="Color" />
                      <span className="text-xs text-slate-500 dark:text-slate-400">{style.width}px</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">offset: {style.offset}px</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applyStyle(style.id)}
                    className={`px-2 py-1 rounded text-xs ${selectedStyle === style.id && isGloballyEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {selectedStyle === style.id && isGloballyEnabled ? 'Active' : 'Apply'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                  {!style.isDefault && (
                    <button
                      type="button"
                      onClick={() => deleteStyle(style.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview</h4>
          <div className="space-y-3">
            <button 
              className="px-4 py-2 rounded bg-blue-600 text-white"
              style={{ 
                outline: isGloballyEnabled ? `${activeStyle?.width || 2}px ${activeStyle?.style || 'solid'} ${activeStyle?.color || '#0000FF'}` : 'none',
                outlineOffset: `${activeStyle?.offset || 0}px`
              }}
            >
              Sample Button
            </button>
            <input 
              type="text" 
              placeholder="Sample input"
              className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600"
              style={{ 
                outline: isGloballyEnabled ? `${activeStyle?.width || 2}px ${activeStyle?.style || 'solid'} ${activeStyle?.color || '#0000FF'}` : 'none',
                outlineOffset: `${activeStyle?.offset || 0}px`
              }}
            />
            <div 
              className="p-3 border border-slate-300 dark:border-slate-600 rounded cursor-pointer"
              style={{ 
                outline: isGloballyEnabled ? `${activeStyle?.width || 2}px ${activeStyle?.style || 'solid'} ${activeStyle?.color || '#0000FF'}` : 'none',
                outlineOffset: `${activeStyle?.offset || 0}px`
              }}
            >
              Focusable Element
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Focus Indicator Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Clear focus indicators are essential for keyboard navigation</li>
              <li>• WCAG SC 2.4.7 requires visible focus indicators</li>
              <li>• 3:1 contrast ratio for focus indicators against adjacent colors</li>
              <li>• Test focus indicators across all interactive elements</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
