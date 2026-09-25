'use client';

import { useState } from 'react';
import { MousePointer, X, RefreshCw, Info, CheckCircle, Settings, Target, Zap } from 'lucide-react';

interface LargeClickTargetsProps {
  onCancel?: () => void;
}

interface ClickTargetConfig {
  element: string;
  type: 'button' | 'link' | 'input' | 'select' | 'checkbox' | 'radio';
  currentSize: number;
  minSize: number;
  isCustom: boolean;
  status: 'compliant' | 'non-compliant';
}

export default function LargeClickTargets({ onCancel }: LargeClickTargetsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [globalMinSize, setGlobalMinSize] = useState(44);

  const [clickTargets, setClickTargets] = useState<ClickTargetConfig[]>([
    { element: 'Primary Button', type: 'button', currentSize: 48, minSize: 44, isCustom: false, status: 'compliant' },
    { element: 'Secondary Button', type: 'button', currentSize: 44, minSize: 44, isCustom: false, status: 'compliant' },
    { element: 'Navigation Link', type: 'link', currentSize: 40, minSize: 44, isCustom: false, status: 'non-compliant' },
    { element: 'Form Input', type: 'input', currentSize: 44, minSize: 44, isCustom: false, status: 'compliant' },
    { element: 'Select Dropdown', type: 'select', currentSize: 44, minSize: 44, isCustom: false, status: 'compliant' },
    { element: 'Checkbox', type: 'checkbox', currentSize: 24, minSize: 44, isCustom: false, status: 'non-compliant' },
    { element: 'Radio Button', type: 'radio', currentSize: 24, minSize: 44, isCustom: false, status: 'non-compliant' },
  ]);

  const updateSize = (element: string, size: number) => {
    setClickTargets(clickTargets.map(target => 
      target.element === element ? { ...target, currentSize: size, status: size >= target.minSize ? 'compliant' : 'non-compliant' } : target
    ));
  };

  const applyGlobalMinSize = () => {
    setClickTargets(clickTargets.map(target => ({
      ...target,
      currentSize: Math.max(target.currentSize, globalMinSize),
      status: Math.max(target.currentSize, globalMinSize) >= target.minSize ? 'compliant' : 'non-compliant',
    })));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'non-compliant': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'button': return <MousePointer className="h-3 w-3" />;
      case 'link': return <Target className="h-3 w-3" />;
      case 'input': return <Target className="h-3 w-3" />;
      case 'select': return <Target className="h-3 w-3" />;
      case 'checkbox': return <CheckCircle className="h-3 w-3" />;
      case 'radio': return <CheckCircle className="h-3 w-3" />;
      default: return <MousePointer className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <MousePointer className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Large Click Targets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Minimum 44px clickable areas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Targets</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{clickTargets.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Compliant</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{clickTargets.filter(t => t.status === 'compliant').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Non-Compliant</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{clickTargets.filter(t => t.status === 'non-compliant').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Global Min</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{globalMinSize}px</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <span className="text-slate-700 dark:text-slate-300">Global Min Size:</span>
            <input
              type="number"
              value={globalMinSize}
              onChange={(e) => setGlobalMinSize(parseInt(e.target.value))}
              min="44"
              max="100"
              className="w-16 px-2 py-1 rounded text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
            />
            <span className="text-slate-500 dark:text-slate-400">px</span>
          </div>
          <button
            type="button"
            onClick={applyGlobalMinSize}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Apply to All
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Click Target Sizes</h4>
          <div className="space-y-2">
            {clickTargets.map((target) => (
              <div key={target.element} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {getTypeIcon(target.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{target.element}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(target.status)}`}>
                        {target.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Type: {target.type}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Current: {target.currentSize}px</span>
                      <span>Min: {target.minSize}px</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="24"
                    max="100"
                    value={target.currentSize}
                    onChange={(e) => updateSize(target.element, parseInt(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{target.currentSize}px</span>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">WCAG 2.2 Requirement</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Success Criterion 2.5.5</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Target size at least 44x44 CSS pixels</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-slate-500" />
                <span className="text-text-slate-700 dark:text-slate-300">Enhanced Target Size</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">24x24 for equivalent-sized target</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Click Target Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• 44x44px minimum size helps users with motor impairments</li>
              <li>• Larger targets are easier to hit accurately</li>
              <li>• Touch targets should be even larger on mobile</li>
              <li>• Spacing between targets prevents accidental clicks</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
