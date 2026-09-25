'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Hand,
  Info,
  MousePointer,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Zap
} from 'lucide-react';

interface GestureAlternativesProps {
  onCancel?: () => void;
}

interface GestureAlternative {
  id: string;
  gesture: string;
  description: string;
  alternativeType: 'button' | 'switch' | 'toggle' | 'slider';
  alternativeControl: string;
  isActive: boolean;
  isCustom: boolean;
}

export default function GestureAlternatives({ onCancel }: GestureAlternativesProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const [gestureAlternatives, setGestureAlternatives] = useState<GestureAlternative[]>([
    { id: '1', gesture: 'Swipe Left', description: 'Navigate to previous item', alternativeType: 'button', alternativeControl: 'Previous Button', isActive: true, isCustom: false },
    { id: '2', gesture: 'Swipe Right', description: 'Navigate to next item', alternativeType: 'button', alternativeControl: 'Next Button', isActive: true, isCustom: false },
    { id: '3', gesture: 'Swipe Up', description: 'Scroll up or show menu', alternativeType: 'button', alternativeControl: 'Scroll Up Button', isActive: true, isCustom: false },
    { id: '4', gesture: 'Swipe Down', description: 'Scroll down or dismiss', alternativeType: 'button', alternativeControl: 'Scroll Down Button', isActive: true, isCustom: false },
    { id: '5', gesture: 'Pinch to Zoom', description: 'Zoom in/out content', alternativeType: 'slider', alternativeControl: 'Zoom Slider', isActive: true, isCustom: false },
    { id: '6', gesture: 'Double Tap', description: 'Like or favorite item', alternativeType: 'button', alternativeControl: 'Like Button', isActive: true, isCustom: false },
    { id: '7', gesture: 'Long Press', description: 'Show context menu', alternativeType: 'button', alternativeControl: 'Menu Button', isActive: true, isCustom: false },
    { id: '8', gesture: 'Rotate', description: 'Rotate image/video', alternativeType: 'slider', alternativeControl: 'Rotation Slider', isActive: false, isCustom: false },
  ]);

  const filteredAlternatives = selectedType === 'all' 
    ? gestureAlternatives 
    : gestureAlternatives.filter(alt => alt.alternativeType === selectedType);

  const types = ['all', ...Array.from(new Set(gestureAlternatives.map(a => a.alternativeType)))];

  const toggleAlternative = (id: string) => {
    setGestureAlternatives(gestureAlternatives.map(alt => 
      alt.id === id ? { ...alt, isActive: !alt.isActive } : alt
    ));
  };

  const addCustomAlternative = () => {
    const newAlternative: GestureAlternative = {
      id: Date.now().toString(),
      gesture: 'Custom Gesture',
      description: 'Custom gesture description',
      alternativeType: 'button',
      alternativeControl: 'Custom Button',
      isActive: true,
      isCustom: true,
    };
    setGestureAlternatives([...gestureAlternatives, newAlternative]);
  };

  const deleteAlternative = (id: string) => {
    setGestureAlternatives(gestureAlternatives.filter(alt => alt.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'button': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'switch': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'toggle': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'slider': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Hand className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Gesture Alternatives
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Button alternatives for touch gestures
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Gestures</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{gestureAlternatives.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{gestureAlternatives.filter(a => a.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Custom</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{gestureAlternatives.filter(a => a.isCustom).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Covered</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {Math.round((gestureAlternatives.filter(a => a.isActive).length / gestureAlternatives.length) * 100)}%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {types.map((type) => (
              <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addCustomAlternative}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Alternative
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Gesture Alternatives ({filteredAlternatives.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredAlternatives.map((alt) => (
              <div key={alt.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Hand className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{alt.gesture}</span>
                      {alt.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      {alt.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{alt.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(alt.alternativeType)}`}>
                        {alt.alternativeType}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">→ {alt.alternativeControl}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAlternative(alt.id)}
                    className={`px-2 py-1 rounded text-xs ${alt.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {alt.isActive ? 'On' : 'Off'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                  {alt.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteAlternative(alt.id)}
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

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Alternative Control Types</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <MousePointer className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Button</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Simple click action</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Switch</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">On/off toggle</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Settings className="h-4 w-4 text-purple-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Toggle</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">State change</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Zap className="h-4 w-4 text-orange-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Slider</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Continuous value</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Gesture Alternative Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Provide button alternatives for all touch gestures</li>
              <li>• Ensure controls are keyboard accessible</li>
              <li>• Maintain consistent placement across pages</li>
              <li>• Test with assistive technologies</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
