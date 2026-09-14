'use client';

import { useState } from 'react';
import { StickyNote, X, RefreshCw, Info, CheckCircle, Settings, Keyboard, Zap } from 'lucide-react';

interface StickyKeysSupportProps {
  onCancel?: () => void;
}

interface StickyKeyConfig {
  modifier: 'shift' | 'ctrl' | 'alt' | 'windows';
  isSticky: boolean;
  timeout: number;
  soundEnabled: boolean;
  visualIndicator: boolean;
}

export default function StickyKeysSupport({ onCancel }: StickyKeysSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(true);

  const [stickyKeys, setStickyKeys] = useState<StickyKeyConfig[]>([
    { modifier: 'shift', isSticky: true, timeout: 5, soundEnabled: true, visualIndicator: true },
    { modifier: 'ctrl', isSticky: true, timeout: 5, soundEnabled: true, visualIndicator: true },
    { modifier: 'alt', isSticky: false, timeout: 3, soundEnabled: true, visualIndicator: true },
    { modifier: 'windows', isSticky: false, timeout: 5, soundEnabled: true, visualIndicator: true },
  ]);

  const toggleStickyKey = (modifier: string) => {
    setStickyKeys(stickyKeys.map(key => 
      key.modifier === modifier ? { ...key, isSticky: !key.isSticky } : key
    ));
  };

  const updateTimeout = (modifier: string, timeout: number) => {
    setStickyKeys(stickyKeys.map(key => 
      key.modifier === modifier ? { ...key, timeout } : key
    ));
  };

  const testStickyKeys = () => {
    setStickyKeys(stickyKeys.map(key => ({ ...key, isSticky: true })));
    setTimeout(() => {
      setStickyKeys(stickyKeys.map(key => 
        key.modifier === 'shift' || key.modifier === 'ctrl' ? { ...key, isSticky: true } : { ...key, isSticky: false }
      ));
    }, 3000);
  };

  const getModifierColor = (modifier: string) => {
    switch (modifier) {
      case 'shift': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'ctrl': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'alt': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'windows': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <StickyNote className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Sticky Keys Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sticky keys for easier keyboard input
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Modifiers</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stickyKeys.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sticky</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stickyKeys.filter(k => k.isSticky).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sound Enabled</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stickyKeys.filter(k => k.soundEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Visual Indicator</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stickyKeys.filter(k => k.visualIndicator).length}</p>
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
            <span className="text-slate-700 dark:text-slate-300">Enable Sticky Keys</span>
          </div>
          <button
            type="button"
            onClick={testStickyKeys}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Test Sticky Keys
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sticky Key Configuration</h4>
          <div className="space-y-2">
            {stickyKeys.map((key) => (
              <div key={key.modifier} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Keyboard className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase">{key.modifier}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getModifierColor(key.modifier)}`}>
                        {key.isSticky ? 'Sticky' : 'Normal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>Timeout: {key.timeout}s</span>
                      {key.soundEnabled && <span>Sound On</span>}
                      {key.visualIndicator && <span>Visual On</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStickyKey(key.modifier)}
                    className={`px-2 py-1 rounded text-xs ${key.isSticky ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {key.isSticky ? 'On' : 'Off'}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quick Settings</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Default Timeout</span>
              </div>
              <select
                className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
              defaultValue="5"
              onChange={(e) => {
                const timeout = parseInt(e.target.value);
                setStickyKeys(stickyKeys.map(key => ({ ...key, timeout })));
              }}
              disabled={!isGloballyEnabled}
              className="disabled:opacity-50"
              >
                <option value="3">3 seconds</option>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
                <option value="30">30 seconds</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Sound Feedback</span>
              </div>
              <button
                type="button"
                onClick={() => setStickyKeys(stickyKeys.map(key => ({ ...key, soundEnabled: !key.soundEnabled })))}
                disabled={!isGloballyEnabled}
                className={`px-3 py-1.5 rounded-lg text-xs ${stickyKeys[0].soundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white disabled:opacity-50`}
              >
                {stickyKeys[0].soundEnabled ? 'On' : 'Off'}
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Visual Indicator</span>
              </div>
              <button
                type="button"
                onClick={() => setStickyKeys(stickyKeys.map(key => ({ ...key, visualIndicator: !key.visualIndicator })))}
                disabled={!isGloballyEnabled}
                className={`px-3 py-1.5 rounded-lg text-xs ${stickyKeys[0].visualIndicator ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white disabled:opacity-50`}
              >
                {stickyKeys[0].visualIndicator ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sticky Keys Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Sticky keys allow pressing modifiers sequentially</li>
              <li>• Timeout prevents keys from being stuck on</li>
              <li>• Sound and visual feedback improve accessibility</li>
              <li>• Test timeout to match user's motor ability</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
