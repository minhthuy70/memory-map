'use client';

import { useState } from 'react';
import { Type, X, RefreshCw, Info, CheckCircle, Settings, Sliders } from 'lucide-react';

interface CustomFontSizeSliderProps {
  onCancel?: () => void;
}

interface FontSizeElement {
  id: string;
  name: string;
  element: string;
  currentSize: number;
  minSize: number;
  maxSize: number;
  unit: 'px' | 'rem' | 'em';
}

export default function CustomFontSizeSlider({ onCancel }: CustomFontSizeSliderProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(false);
  const [globalMultiplier, setGlobalMultiplier] = useState(1);

  const [fontSizeElements, setFontSizeElements] = useState<FontSizeElement[]>([
    { id: 'body', name: 'Body Text', element: 'body', currentSize: 16, minSize: 12, maxSize: 24, unit: 'px' },
    { id: 'h1', name: 'Heading 1', element: 'h1', currentSize: 32, minSize: 24, maxSize: 48, unit: 'px' },
    { id: 'h2', name: 'Heading 2', element: 'h2', currentSize: 24, minSize: 18, maxSize: 36, unit: 'px' },
    { id: 'h3', name: 'Heading 3', element: 'h3', currentSize: 20, minSize: 16, maxSize: 28, unit: 'px' },
    { id: 'button', name: 'Button Text', element: 'button', currentSize: 14, minSize: 12, maxSize: 18, unit: 'px' },
    { id: 'input', name: 'Input Text', element: 'input', currentSize: 14, minSize: 12, maxSize: 18, unit: 'px' },
    { id: 'caption', name: 'Caption Text', element: 'caption', currentSize: 12, minSize: 10, maxSize: 16, unit: 'px' },
    { id: 'code', name: 'Code Text', element: 'code', currentSize: 14, minSize: 12, maxSize: 16, unit: 'px' },
  ]);

  const updateSize = (id: string, size: number) => {
    setFontSizeElements(fontSizeElements.map(element => 
      element.id === id ? { ...element, currentSize: size } : element
    ));
    setIsGloballyEnabled(true);
  };

  const applyGlobalMultiplier = () => {
    setFontSizeElements(fontSizeElements.map(element => ({
      ...element,
      currentSize: Math.min(Math.max(element.currentSize * globalMultiplier, element.minSize), element.maxSize),
    })));
    setIsGloballyEnabled(true);
  };

  const resetToDefaults = () => {
    setFontSizeElements(fontSizeElements.map(element => ({
      ...element,
      currentSize: element.element === 'body' ? 16 : 
                     element.element === 'h1' ? 32 :
                     element.element === 'h2' ? 24 :
                     element.element === 'h3' ? 20 :
                     element.element === 'button' ? 14 :
                     element.element === 'input' ? 14 :
                     element.element === 'caption' ? 12 : 14,
    })));
    setGlobalMultiplier(1);
    setIsGloballyEnabled(false);
  };

  const testSlider = () => {
    setGlobalMultiplier(1.5);
    applyGlobalMultiplier();
    setTimeout(() => {
      resetToDefaults();
    }, 3000);
  };

  const getUnitColor = (unit: string) => {
    switch (unit) {
      case 'px': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'rem': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'em': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Sliders className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Custom Font Size Slider
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Per-element font size adjustment
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Elements</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{fontSizeElements.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {Math.round(fontSizeElements.reduce((sum, e) => sum + e.currentSize, 0) / fontSizeElements.length)}px
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Multiplier</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{globalMultiplier}x</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Unit</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {fontSizeElements[0].unit}
            </p>
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
            <span className="text-slate-700 dark:text-slate-300">Enable Custom Sizes</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <span className="text-slate-700 dark:text-slate-300">Global Multiplier:</span>
            <input
              type="number"
              value={globalMultiplier}
              onChange={(e) => setGlobalMultiplier(parseFloat(e.target.value))}
              min="0.5"
              max="2"
              step="0.1"
              className="w-16 px-2 py-1 rounded text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
            />
            <span className="text-slate-500 dark:text-slate-400">x</span>
          </div>
          <button
            type="button"
            onClick={applyGlobalMultiplier}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Sliders className="h-3 w-3" />
            Apply Multiplier
          </button>
          <button
            type="button"
            onClick={resetToDefaults}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={testSlider}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Type className="h-3 w-3" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Font Size Elements</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {fontSizeElements.map((element) => (
              <div key={element.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Type className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{element.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getUnitColor(element.unit)}`}>
                        {element.unit}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Element: {element.element}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Range: {element.minSize}-{element.maxSize}{element.unit}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={element.minSize}
                    max={element.maxSize}
                    value={element.currentSize}
                    onChange={(e) => updateSize(element.id, parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{element.currentSize}{element.unit}</span>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Preview</h4>
          <div className="space-y-2">
            <h1 style={{ fontSize: `${fontSizeElements.find(e => e.id === 'h1')?.currentSize}px` }}>
              Heading 1
            </h1>
            <h2 style={{ fontSize: `${fontSizeElements.find(e => e.id === 'h2')?.currentSize}px` }}>
              Heading 2
            </h2>
            <h3 style={{ fontSize: `${fontSizeElements.find(e => e.id === 'h3')?.currentSize}px` }}>
              Heading 3
            </h3>
            <p style={{ fontSize: `${fontSizeElements.find(e => e.id === 'body')?.currentSize}px` }}>
              This is body text with the custom font size.
            </p>
            <button 
              style={{ fontSize: `${fontSizeElements.find(e => e.id === 'button')?.currentSize}px` }}
              className="px-3 py-1.5 rounded bg-blue-600 text-white"
            >
              Button
            </button>
            <code style={{ fontSize: `${fontSizeElements.find(e => e.id === 'code')?.currentSize}px` }}>
              Code sample
            </code>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Custom Font Size Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Per-element sizing allows fine-grained control</li>
              <li>• Global multiplier scales all elements proportionally</li>
              <li>• Use relative units (rem/em) for better scaling</li>
              <li>• Test across different viewport sizes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
