'use client';

import { useState } from 'react';
import { CheckCircle, Info, Pause, Play, RefreshCw, Settings, Zap } from 'lucide-react';

interface ReduceMotionModeProps {
  onCancel?: () => void;
}

interface MotionSetting {
  id: string;
  name: string;
  description: string;
  category: 'animation' | 'transition' | 'scroll' | 'parallax';
  isReduced: boolean;
  isDefault: boolean;
}

export default function ReduceMotionMode({ onCancel }: ReduceMotionModeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [motionSettings, setMotionSettings] = useState<MotionSetting[]>([
    { id: 'page-transitions', name: 'Page Transitions', description: 'Animate page changes', category: 'transition', isReduced: false, isDefault: false },
    { id: 'scroll-animations', name: 'Scroll Animations', description: 'Animate elements on scroll', category: 'scroll', isReduced: false, isDefault: false },
    { id: 'hover-effects', name: 'Hover Effects', description: 'Animate on hover', category: 'animation', isReduced: false, isDefault: false },
    { id: 'modal-animations', name: 'Modal Animations', description: 'Animate modal open/close', category: 'animation', isReduced: false, isDefault: false },
    { id: 'parallax-effects', name: 'Parallax Effects', description: 'Parallax scrolling', category: 'parallax', isReduced: false, isDefault: false },
    { id: 'carousel-autoplay', name: 'Carousel Autoplay', description: 'Auto-rotate carousels', category: 'animation', isReduced: false, isDefault: false },
    { id: 'loading-animations', name: 'Loading Animations', description: 'Loading spinners', category: 'animation', isReduced: false, isDefault: false },
    { id: 'button-ripples', name: 'Button Ripples', description: 'Button click ripples', category: 'animation', isReduced: false, isDefault: false },
  ]);

  const filteredSettings = selectedCategory === 'all' 
    ? motionSettings 
    : motionSettings.filter(setting => setting.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(motionSettings.map(s => s.category)))];

  const toggleMotion = (id: string) => {
    setMotionSettings(motionSettings.map(setting => 
      setting.id === id ? { ...setting, isReduced: !setting.isReduced } : setting
    ));
  };

  const reduceAllMotion = () => {
    setMotionSettings(motionSettings.map(setting => ({ ...setting, isReduced: true })));
    setIsGloballyEnabled(true);
  };

  const restoreAllMotion = () => {
    setMotionSettings(motionSettings.map(setting => ({ ...setting, isReduced: false })));
    setIsGloballyEnabled(false);
  };

  const testMotion = () => {
    setMotionSettings(motionSettings.map(setting => ({ ...setting, isReduced: true })));
    setIsGloballyEnabled(true);
    setTimeout(() => {
      setMotionSettings(motionSettings.map(setting => ({ ...setting, isReduced: false })));
      setIsGloballyEnabled(false);
    }, 3000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'animation': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'transition': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'scroll': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'parallax': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Reduce Motion Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reduce motion for sensitive users
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGloballyEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGloballyEnabled ? 'Reduced' : 'Normal'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Settings</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{motionSettings.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reduced</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{motionSettings.filter(s => s.isReduced).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Normal</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{motionSettings.filter(s => !s.isReduced).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Coverage</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {Math.round((motionSettings.filter(s => s.isReduced).length / motionSettings.length) * 100)}%
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
            <span className="text-slate-700 dark:text-slate-300">Enable Reduce Motion</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={reduceAllMotion}
            className="px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white border-0 flex items-center gap-1"
          >
            <Pause className="h-3 w-3" />
            Reduce All
          </button>
          <button
            type="button"
            onClick={restoreAllMotion}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Play className="h-3 w-3" />
            Restore All
          </button>
          <button
            type="button"
            onClick={testMotion}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Zap className="h-3 w-3" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Motion Settings ({filteredSettings.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {setting.isReduced ? <Pause className="h-5 w-5 text-slate-400" /> : <Play className="h-5 w-5 text-slate-400" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{setting.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(setting.category)}`}>
                        {setting.category}
                      </span>
                      {setting.isReduced && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Reduced
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{setting.description}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMotion(setting.id)}
                  className={`px-2 py-1 rounded text-xs ${setting.isReduced ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                >
                  {setting.isReduced ? 'Reduced' : 'Normal'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Motion Categories</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Zap className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Animation</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{motionSettings.filter(s => s.category === 'animation').length} items</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Play className="h-4 w-4 text-green-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Transition</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{motionSettings.filter(s => s.category === 'transition').length} items</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Pause className="h-4 w-4 text-purple-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Scroll</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{motionSettings.filter(s => s.category === 'scroll').length} items</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
              <Settings className="h-4 w-4 text-orange-500 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-900 dark:text-white">Parallax</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{motionSettings.filter(s => s.category === 'parallax').length} items</p>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Reduce Motion Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Reducing motion helps users with vestibular disorders</li>
              <li>• WCAG 2.2 requires respecting prefers-reduced-motion</li>
              <li>• Provide instant alternatives to animated interactions</li>
              <li>• Test with actual motion-sensitive users</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
