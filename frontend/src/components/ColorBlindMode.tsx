'use client';

import { useState } from 'react';
import { CheckCircle, Droplet, Eye, Info, Palette, RefreshCw, Settings } from 'lucide-react';

interface ColorBlindModeProps {
  onCancel?: () => void;
}

interface ColorBlindMode {
  id: string;
  name: string;
  description: string;
  type: 'deuteranopia' | 'protanopia' | 'tritanopia' | 'achromatopsia' | 'custom';
  isDefault: boolean;
  isCustom: boolean;
  simulationLevel: number;
}

export default function ColorBlindMode({ onCancel }: ColorBlindModeProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGloballyEnabled, setIsGloballyEnabled] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('none');

  const [colorBlindModes, setColorBlindModes] = useState<ColorBlindMode[]>([
    { id: 'none', name: 'None', description: 'Normal color vision', type: 'custom', isDefault: true, isCustom: false, simulationLevel: 0 },
    { id: 'deuteranopia', name: 'Deuteranopia', description: 'Red-green color blindness (green deficiency)', type: 'deuteranopia', isDefault: false, isCustom: false, simulationLevel: 100 },
    { id: 'protanopia', name: 'Protanopia', description: 'Red-green color blindness (red deficiency)', type: 'protanopia', isDefault: false, isCustom: false, simulationLevel: 100 },
    { id: 'tritanopia', name: 'Tritanopia', description: 'Blue-yellow color blindness', type: 'tritanopia', isDefault: false, isCustom: false, simulationLevel: 100 },
    { id: 'achromatopsia', name: 'Achromatopsia', description: 'Complete color blindness (monochromacy)', type: 'achromatopsia', isDefault: false, isCustom: false, simulationLevel: 100 },
  ]);

  const toggleMode = (id: string) => {
    setSelectedMode(id);
    setIsGloballyEnabled(id !== 'none');
  };

  const createCustomMode = () => {
    const newMode: ColorBlindMode = {
      id: Date.now().toString(),
      name: 'Custom Mode',
      description: 'Custom color blind simulation',
      type: 'custom',
      isDefault: false,
      isCustom: true,
      simulationLevel: 50,
    };
    setColorBlindModes([...colorBlindModes, newMode]);
  };

  const deleteMode = (id: string) => {
    setColorBlindModes(colorBlindModes.filter(mode => mode.id !== id));
  };

  const updateSimulationLevel = (id: string, level: number) => {
    setColorBlindModes(colorBlindModes.map(mode => 
      mode.id === id ? { ...mode, simulationLevel: level } : mode
    ));
  };

  const testMode = () => {
    setIsGloballyEnabled(true);
    setSelectedMode('deuteranopia');
    setTimeout(() => {
      setIsGloballyEnabled(false);
      setSelectedMode('none');
    }, 3000);
  };

  const getModeColor = (mode: ColorBlindMode) => {
    if (mode.isDefault) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (mode.isCustom) return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deuteranopia': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'protanopia': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'tritanopia': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'achromatopsia': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Color Blind Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Color blindness simulation support
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Modes</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{colorBlindModes.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{isGloballyEnabled ? selectedMode : 'None'}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Custom</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{colorBlindModes.filter(m => m.isCustom).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sim Level</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {colorBlindModes.find(m => m.id === selectedMode)?.simulationLevel || 0}%
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
            <span className="text-slate-700 dark:text-slate-300">Enable Color Blind Mode</span>
          </div>
          <button
            type="button"
            onClick={testMode}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            Test Mode
          </button>
          <button
            type="button"
            onClick={createCustomMode}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            Create Mode
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Color Blind Modes</h4>
          <div className="space-y-2">
            {colorBlindModes.map((mode) => (
              <div key={mode.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Palette className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{mode.name}</span>
                      {selectedMode === mode.id && isGloballyEnabled && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getModeColor(mode)}`}>
                        {mode.isDefault ? 'Default' : mode.isCustom ? 'Custom' : 'Preset'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(mode.type)}`}>
                        {mode.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{mode.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Simulation: {mode.simulationLevel}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={mode.simulationLevel}
                    onChange={(e) => updateSimulationLevel(mode.id, parseInt(e.target.value))}
                    className="w-16"
                    disabled={mode.id === 'none'}
                  />
                  <button
                    type="button"
                    onClick={() => toggleMode(mode.id)}
                    className={`px-2 py-1 rounded text-xs ${selectedMode === mode.id && isGloballyEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {selectedMode === mode.id && isGloballyEnabled ? 'Active' : 'Apply'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                  {mode.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteMode(mode.id)}
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Color Preview</h4>
          <div className="grid grid-cols-5 gap-2">
            <div className="p-3 bg-red-500 rounded-lg text-center">
              <p className="text-xs text-white font-semibold">Red</p>
            </div>
            <div className="p-3 bg-green-500 rounded-lg text-center">
              <p className="text-xs text-white font-semibold">Green</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-lg text-center">
              <p className="text-xs text-white font-semibold">Blue</p>
            </div>
            <div className="p-3 bg-yellow-500 rounded-lg text-center">
              <p className="text-xs text-black font-semibold">Yellow</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-lg text-center">
              <p className="text-xs text-white font-semibold">Purple</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {isGloballyEnabled && selectedMode !== 'none' 
              ? `Colors are simulated for ${colorBlindModes.find(m => m.id === selectedMode)?.name}` 
              : 'Normal color vision'}
          </p>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Color Blind Mode Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Deuteranopia: difficulty distinguishing green from red</li>
              <li>• Protanopia: difficulty distinguishing red from green</li>
              <li>• Tritanopia: difficulty distinguishing blue from yellow</li>
              <li>• Achromatopsia: complete inability to see color</li>
              <li>• Simulation level adjusts the intensity of the effect</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
