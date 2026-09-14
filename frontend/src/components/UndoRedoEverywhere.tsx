'use client';

import { useState } from 'react';
import { RotateCcw, X, CheckCircle, ArrowLeft, ArrowRight, Clock, Settings, Info, BarChart3, Smartphone, Eye, EyeOff, Trash2, Zap, History, Undo, Redo } from 'lucide-react';

interface UndoRedoEverywhereProps {
  onCancel?: () => void;
}

interface Action {
  id: string;
  type: 'create' | 'edit' | 'delete' | 'move' | 'change';
  description: string;
  timestamp: string;
  canUndo: boolean;
  canRedo: boolean;
}

export default function UndoRedoEverywhere({ onCancel }: UndoRedoEverywhereProps) {
  const [undoRedoEnabled, setUndoRedoEnabled] = useState(true);
  const [maxHistory, setMaxHistory] = useState(50);
  const [showHistory, setShowHistory] = useState(false);

  const [undoStack, setUndoStack] = useState<Action[]>([
    {
      id: '1',
      type: 'create',
      description: 'Created memory "Summer Trip"',
      timestamp: '2026-09-14 10:30',
      canUndo: true,
      canRedo: false,
    },
    {
      id: '2',
      type: 'edit',
      description: 'Edited memory title "Hanoi Trip"',
      timestamp: '2026-09-14 10:25',
      canUndo: true,
      canRedo: false,
    },
    {
      id: '3',
      type: 'delete',
      description: 'Deleted photo "sunset.jpg"',
      timestamp: '2026-09-14 10:20',
      canUndo: true,
      canRedo: false,
    },
    {
      id: '4',
      type: 'move',
      description: 'Moved memory to "Travel" category',
      timestamp: '2026-09-14 10:15',
      canUndo: true,
      canRedo: false,
    },
    {
      id: '5',
      type: 'change',
      description: 'Changed mood to "Happy"',
      timestamp: '2026-09-14 10:10',
      canUndo: true,
      canRedo: false,
    },
  ]);

  const [redoStack, setRedoStack] = useState<Action[]>([
    {
      id: '6',
      type: 'edit',
      description: 'Edited memory content',
      timestamp: '2026-09-14 10:28',
      canUndo: false,
      canRedo: true,
    },
  ]);

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const action = undoStack[0];
      setRedoStack([action, ...redoStack]);
      setUndoStack(undoStack.slice(1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const action = redoStack[0];
      setUndoStack([action, ...undoStack]);
      setRedoStack(redoStack.slice(1));
    }
  };

  const clearHistory = () => {
    setUndoStack([]);
    setRedoStack([]);
  };

  const undoCount = undoStack.length;
  const redoCount = redoStack.length;
  const totalCount = undoCount + redoCount;

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'create': return <CheckCircle className="h-4 w-4" />;
      case 'edit': return <RotateCcw className="h-4 w-4" />;
      case 'delete': return <Trash2 className="h-4 w-4" />;
      case 'move': return <ArrowRight className="h-4 w-4" />;
      case 'change': return <Zap className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'create': return 'from-green-400 to-emerald-500';
      case 'edit': return 'from-blue-400 to-cyan-500';
      case 'delete': return 'from-red-400 to-rose-500';
      case 'move': return 'from-purple-400 to-pink-500';
      case 'change': return 'from-yellow-400 to-orange-500';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl">
            <RotateCcw className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Undo/Redo Everywhere
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Global undo/redo for all actions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show history"
          >
            {showHistory ? <BarChart3 className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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
        <div className={`p-4 rounded-lg border ${undoRedoEnabled ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-purple-800' : 'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${undoRedoEnabled ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                {undoRedoEnabled ? <CheckCircle className="h-6 w-6 text-white" /> : <History className="h-6 w-6 text-white" />}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-lg">
                  {undoRedoEnabled ? 'Undo/Redo Enabled' : 'Undo/Redo Disabled'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {undoRedoEnabled ? 'Can undo and redo any action' : 'History tracking disabled'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUndoRedoEnabled(!undoRedoEnabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${undoRedoEnabled ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {undoRedoEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Undo Available</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{undoCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Redo Available</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{redoCount}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Max History</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{maxHistory}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Actions</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{totalCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={undoCount === 0}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${undoCount > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 cursor-not-allowed'}`}
          >
            <Undo className="h-4 w-4" />
            Undo ({undoCount})
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={redoCount === 0}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${redoCount > 0 ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-slate-100 text-slate-400 dark:bg-slate-700 cursor-not-allowed'}`}
          >
            <Redo className="h-4 w-4" />
            Redo ({redoCount})
          </button>
          <select
            value={maxHistory.toString()}
            onChange={(e) => setMaxHistory(parseInt(e.target.value))}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="10">10 actions</option>
            <option value="25">25 actions</option>
            <option value="50">50 actions</option>
            <option value="100">100 actions</option>
          </select>
          <button
            type="button"
            onClick={clearHistory}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Trash2 className="h-3 w-3" />
            Clear History
          </button>
        </div>

        {showHistory && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Action History</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <div className="mb-2">
                <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Redo Stack</p>
                {redoStack.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No actions to redo</p>
                ) : (
                  redoStack.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 bg-gradient-to-br ${getActionColor(action.type)} rounded text-white`}>
                          {getActionIcon(action.type)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{action.description}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{action.timestamp}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 capitalize">
                        {action.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Undo Stack</p>
                {undoStack.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">No actions to undo</p>
                ) : (
                  undoStack.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 bg-gradient-to-br ${getActionColor(action.type)} rounded text-white`}>
                          {getActionIcon(action.type)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{action.description}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{action.timestamp}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">
                        {action.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Undo/Redo Configuration
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Tracks all user actions across the application</li>
            <li>• Unlimited undo with configurable history limit</li>
            <li>• Redo stack to restore undone actions</li>
            <li>• Clear history to free up memory</li>
            <li>• Keyboard shortcuts: Ctrl+Z / Ctrl+Y (Cmd+Z / Cmd+Y)</li>
          </ul>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Supported Actions
            </h4>
          </div>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Create: Creating memories, photos, categories</li>
            <li>• Edit: Modifying content, settings, metadata</li>
            <li>• Delete: Removing items, content, data</li>
            <li>• Move: Reordering, changing categories, locations</li>
            <li>• Change: Updating settings, preferences, toggles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
