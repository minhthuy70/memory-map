'use client';

import { useState } from 'react';
import { Clock, X, RefreshCw, Info, CheckCircle, Settings, Zap, MousePointer } from 'lucide-react';

interface DwellClickingSupportProps {
  onCancel?: () => void;
}

interface DwellConfig {
  element: string;
  dwellTime: number;
  isEnabled: boolean;
  visualFeedback: boolean;
  soundFeedback: boolean;
  progressIndicator: boolean;
}

export default function DwellClickingSupport({ onCancel }: DwellClickingSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(true);
  const [globalDwellTime, setGlobalDwellTime] = useState(2);

  const [dwellConfigs, setDwellConfigs] = useState<DwellConfig[]>([
    { element: 'Primary Button', dwellTime: 2, isEnabled: true, visualFeedback: true, soundFeedback: true, progressIndicator: true },
    { element: 'Secondary Button', dwellTime: 2, isEnabled: true, visualFeedback: true, soundFeedback: true, progressIndicator: true },
    { element: 'Navigation Link', dwellTime: 1.5, isEnabled: true, visualFeedback: true, soundFeedback: false, progressIndicator: true },
    { element: 'Form Input', dwellTime: 1, isEnabled: false, visualFeedback: true, soundFeedback: false, progressIndicator: false },
    { element: 'Select Dropdown', dwellTime: 1.5, isEnabled: true, visualFeedback: true, soundFeedback: false, progressIndicator: true },
    { element: 'Checkbox', dwellTime: 1, isEnabled: false, visualFeedback: true, soundFeedback: false, progressIndicator: false },
  ]);

  const toggleDwell = (element: string) => {
    setDwellConfigs(dwellConfigs.map(config => 
      config.element === element ? { ...config, isEnabled: !config.isEnabled } : config
    ));
  };

  const updateDwellTime = (element: string, dwellTime: number) => {
    setDwellConfigs(dwellConfigs.map(config => 
      config.element === element ? { ...config, dwellTime } : config
    ));
  };

  const applyGlobalSettings = () => {
    setDwellConfigs(dwellConfigs.map(config => ({
      ...config,
      dwellTime: globalDwellTime,
      isEnabled: isGloballyEnabled ? true : config.isEnabled,
    })));
  };

  const testDwellClicking = () => {
    setDwellConfigs(dwellConfigs.map(config => ({ ...config, isEnabled: true })));
    setTimeout(() => {
      setDwellConfigs(dwellConfigs.map(config => 
        config.element === 'Primary Button' || config.element === 'Secondary Button' 
          ? { ...config, isEnabled: true } 
          : { ...config, isEnabled: false }
      ));
    }, 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Dwell Clicking Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click by holding cursor steady
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGloballyEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGloballyEnabled ? 'Global On' : 'Global Off'}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{dwellConfigs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Dwell Enabled</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{dwellConfigs.filter(c => c.isEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Visual Feedback</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{dwellConfigs.filter(c => c.visualFeedback).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Dwell Time</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {(dwellConfigs.reduce((sum, c) => sum + c.dwellTime, 0) / dwellConfigs.length).toFixed(1)}s
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
            <span className="text-slate-700 dark:text-slate-300">Enable Dwell Clicking</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <span className="text-slate-700 dark:text-slate-300">Global Dwell Time:</span>
            <input
              type="number"
              value={globalDwellTime}
              onChange={(e) => setGlobalDwellTime(parseFloat(e.target.value))}
              min="0.5"
              max="5"
              step="0.5"
              className="w-16 px-2 py-1 rounded text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
            />
            <span className="text-slate-500 dark:text-slate-400">s</span>
          </div>
          <button
            type="button"
            onClick={applyGlobalSettings}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Apply to All
          </button>
          <button
            type="button"
            onClick={testDwellClicking}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Clock className="h-3 w-3" />
            Test Dwell
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Dwell Configuration</h4>
          <div className="space-y-2">
            {dwellConfigs.map((config) => (
              <div key={config.element} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <MousePointer className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{config.element}</span>
                      {config.isEnabled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Enabled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Dwell: {config.dwellTime}s</span>
                      {config.visualFeedback && <span>Visual</span>}
                      {config.soundFeedback && <span>Sound</span>}
                      {config.progressIndicator && <span>Progress</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={config.dwellTime}
                    onChange={(e) => updateDwellTime(config.element, parseFloat(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{config.dwellTime}s</span>
                  <button
                    type="button"
                    onClick={() => toggleDwell(config.element)}
                    className={`px-2 py-1 rounded text-xs ${config.isEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {config.isEnabled ? 'On' : 'Off'}
                  </button>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Feedback Options</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Visual Feedback</span>
              </div>
              <button
                type="button"
                onClick={() => setDwellConfigs(dwellConfigs.map(config => ({ ...config, visualFeedback: !config.visualFeedback })))}
                disabled={!isGloballyEnabled}
                className={`px-3 py-1.5 rounded-lg text-xs ${dwellConfigs[0].visualFeedback ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white disabled:opacity-50`}
              >
                {dwellConfigs[0].visualFeedback ? 'On' : 'Off'}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Sound Feedback</span>
              </div>
              <button
                type="button"
                onClick={() => setDwellConfigs(dwellConfigs.map(config => ({ ...config, soundFeedback: !config.soundFeedback })))}
                disabled={!isGloballyEnabled}
                className={`px-3 py-1.5 rounded-lg text-xs ${dwellConfigs[0].soundFeedback ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white disabled:opacity-50`}
              >
                {dwellConfigs[0].soundFeedback ? 'On' : 'Off'}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Progress Indicator</span>
              </div>
              <button
                type="button"
                onClick={() => setDwellConfigs(dwellConfigs.map(config => ({ ...config, progressIndicator: !config.progressIndicator })))}
                disabled={!isGloballyEnabled}
                className={`px-3 py-1.5 rounded-lg text-xs ${dwellConfigs[0].progressIndicator ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white disabled:opacity-50`}
              >
                {dwellConfigs[0].progressIndicator ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Dwell Clicking Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Dwell clicking activates by holding cursor steady</li>
              <li>• Shorter dwell times for faster interaction</li>
              <li>• Visual feedback helps users anticipate click</li>
              <li>• Test dwell time to match user's motor ability</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
