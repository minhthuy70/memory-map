'use client';

import { useState } from 'react';
import { CheckCircle, Contrast, Info, Moon, Palette, RefreshCw, Settings, Sun } from 'lucide-react';

interface HighContrastModeProps {
  onCancel?: () => void;
}

interface ContrastTheme {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  isCustom: boolean;
  foreground: string;
  background: string;
  accent: string;
}

export default function HighContrastMode({ onCancel }: HighContrastModeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('high-contrast-black');

  const [contrastThemes, setContrastThemes] = useState<ContrastTheme[]>([
    { id: 'high-contrast-black', name: 'High Contrast Black', description: 'Black background, white text', isDefault: true, isCustom: false, foreground: '#FFFFFF', background: '#000000', accent: '#FFFF00' },
    { id: 'high-contrast-white', name: 'High Contrast White', description: 'White background, black text', isDefault: false, isCustom: false, foreground: '#000000', background: '#FFFFFF', accent: '#0000FF' },
    { id: 'high-contrast-yellow', name: 'High Contrast Yellow', description: 'Yellow background, black text', isDefault: false, isCustom: false, foreground: '#000000', background: '#FFFF00', accent: '#FF0000' },
    { id: 'high-contrast-blue', name: 'High Contrast Blue', description: 'Blue background, white text', isDefault: false, isCustom: false, foreground: '#FFFFFF', background: '#0000FF', accent: '#FFFF00' },
  ]);

  const toggleTheme = (id: string) => {
    setSelectedTheme(id);
    setIsGloballyEnabled(true);
  };

  const createCustomTheme = () => {
    const newTheme: ContrastTheme = {
      id: Date.now().toString(),
      name: 'Custom Theme',
      description: 'Custom high contrast theme',
      isDefault: false,
      isCustom: true,
      foreground: '#FFFFFF',
      background: '#000000',
      accent: '#FFFF00',
    };
    setContrastThemes([...contrastThemes, newTheme]);
  };

  const deleteTheme = (id: string) => {
    setContrastThemes(contrastThemes.filter(theme => theme.id !== id));
  };

  const testContrast = () => {
    setIsGloballyEnabled(true);
    setTimeout(() => setIsGloballyEnabled(false), 3000);
  };

  const getThemeColor = (theme: ContrastTheme) => {
    if (theme.isDefault) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (theme.isCustom) return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-600 to-black rounded-xl">
            <Contrast className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              High Contrast Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              High contrast for visual accessibility
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Themes</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{contrastThemes.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Default</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{contrastThemes.filter(t => t.isDefault).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Custom</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{contrastThemes.filter(t => t.isCustom).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{isGloballyEnabled ? selectedTheme : 'None'}</p>
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
            <span className="text-slate-700 dark:text-slate-300">Enable High Contrast</span>
          </div>
          <button
            type="button"
            onClick={testContrast}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Palette className="h-3 w-3" />
            Test Contrast
          </button>
          <button
            type="button"
            onClick={createCustomTheme}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Create Theme
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Contrast Themes</h4>
          <div className="space-y-2">
            {contrastThemes.map((theme) => (
              <div key={theme.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: theme.background, color: theme.foreground }}
                  >
                    <Contrast className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{theme.name}</span>
                      {selectedTheme === theme.id && isGloballyEnabled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getThemeColor(theme)}`}>
                        {theme.isDefault ? 'Default' : theme.isCustom ? 'Custom' : 'Preset'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{theme.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.foreground }} title="Foreground" />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.background }} title="Background" />
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: theme.accent }} title="Accent" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleTheme(theme.id)}
                    className={`px-2 py-1 rounded text-xs ${selectedTheme === theme.id && isGloballyEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {selectedTheme === theme.id && isGloballyEnabled ? 'Active' : 'Apply'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                  {theme.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteTheme(theme.id)}
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
          <div 
            className="p-4 rounded-lg border"
            style={{ 
              backgroundColor: isGloballyEnabled ? contrastThemes.find(t => t.id === selectedTheme)?.background : '#F8FAFC',
              color: isGloballyEnabled ? contrastThemes.find(t => t.id === selectedTheme)?.foreground : '#1E293B'
            }}
          >
            <p className="text-sm font-semibold mb-2">Sample Text</p>
            <p className="text-xs mb-2">This is how text appears with the selected high contrast theme.</p>
            <button 
              className="px-3 py-1.5 rounded text-xs"
              style={{ 
                backgroundColor: isGloballyEnabled ? contrastThemes.find(t => t.id === selectedTheme)?.accent : '#3B82F6',
                color: isGloballyEnabled ? '#000000' : '#FFFFFF'
              }}
            >
              Sample Button
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">High Contrast Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• High contrast improves readability for low vision users</li>
              <li>• WCAG AA requires 4.5:1 contrast ratio for normal text</li>
              <li>• WCAG AAA requires 7:1 contrast ratio for normal text</li>
              <li>• Custom themes can be tailored to individual needs</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
