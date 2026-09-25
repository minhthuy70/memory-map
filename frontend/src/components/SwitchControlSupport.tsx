'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Info,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  ToggleLeft,
  Trash2,
  Zap
} from 'lucide-react';

interface SwitchControlSupportProps {
  onCancel?: () => void;
}

interface SwitchAction {
  id: string;
  name: string;
  action: string;
  keyBinding: string;
  isCustom: boolean;
  isActive: boolean;
}

export default function SwitchControlSupport({ onCancel }: SwitchControlSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [scanSpeed, setScanSpeed] = useState(50);

  const [switchActions, setSwitchActions] = useState<SwitchAction[]>([
    { id: '1', name: 'Navigate Next', action: 'focus_next', keyBinding: 'Space', isCustom: false, isActive: true },
    { id: '2', name: 'Navigate Previous', action: 'focus_previous', keyBinding: 'Shift+Space', isCustom: false, isActive: true },
    { id: '3', name: 'Select/Activate', action: 'activate', keyBinding: 'Enter', isCustom: false, isActive: true },
    { id: '4', name: 'Go Back', action: 'navigate_back', keyBinding: 'Escape', isCustom: false, isActive: true },
    { id: '5', name: 'Scroll Down', action: 'scroll_down', keyBinding: 'ArrowDown', isCustom: false, isActive: true },
    { id: '6', name: 'Scroll Up', action: 'scroll_up', keyBinding: 'ArrowUp', isCustom: false, isActive: true },
  ]);

  const toggleAction = (id: string) => {
    setSwitchActions(switchActions.map(action => 
      action.id === id ? { ...action, isActive: !action.isActive } : action
    ));
  };

  const addCustomAction = () => {
    const newAction: SwitchAction = {
      id: Date.now().toString(),
      name: 'Custom Action',
      action: 'custom_action',
      keyBinding: 'Custom',
      isCustom: true,
      isActive: true,
    };
    setSwitchActions([...switchActions, newAction]);
  };

  const deleteAction = (id: string) => {
    setSwitchActions(switchActions.filter(action => action.id !== id));
  };

  const testScan = () => {
    setScanSpeed(75);
    setTimeout(() => setScanSpeed(50), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
            <ToggleLeft className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Switch Control Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch control for motor accessibility
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Actions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{switchActions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{switchActions.filter(a => a.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Custom</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{switchActions.filter(a => a.isCustom).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Scan Speed</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{scanSpeed}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Switch Control</span>
          </div>
          <button
            type="button"
            onClick={testScan}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
            Test Scan
          </button>
          <button
            type="button"
            onClick={addCustomAction}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Action
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Scan Speed</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-700 dark:text-slate-300">Scan Speed:</span>
              <input
                type="range"
                min="10"
                max="100"
                value={scanSpeed}
                onChange={(e) => setScanSpeed(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">{scanSpeed}%</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Play className="h-3 w-3" />
              <span>Slow scan for precision, fast scan for efficiency</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Switch Actions ({switchActions.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {switchActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <ToggleLeft className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{action.name}</span>
                      {action.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      {action.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Action: {action.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Key: {action.keyBinding}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAction(action.id)}
                    className={`px-2 py-1 rounded text-xs ${action.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {action.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                  {action.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteAction(action.id)}
                      className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Switch Control Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Switch control enables navigation without fine motor control</li>
              <li>• Adjust scan speed based on user ability</li>
              <li>• Custom actions can be mapped to specific needs</li>
              <li>• Test with actual switch devices for best results</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
