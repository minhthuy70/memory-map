'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Info,
  Mic,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Volume2,
  Zap
} from 'lucide-react';

interface VoiceControlSupportProps {
  onCancel?: () => void;
}

interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  category: string;
  confidence: number;
  isCustom: boolean;
  isActive: boolean;
}

export default function VoiceControlSupport({ onCancel }: VoiceControlSupportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([
    { id: '1', phrase: 'navigate home', action: 'navigate_home', category: 'Navigation', confidence: 95, isCustom: false, isActive: true },
    { id: '2', phrase: 'go to memories', action: 'navigate_memories', category: 'Navigation', confidence: 92, isCustom: false, isActive: true },
    { id: '3', phrase: 'open settings', action: 'open_settings', category: 'Navigation', confidence: 90, isCustom: false, isActive: true },
    { id: '4', phrase: 'create memory', action: 'create_memory', category: 'Actions', confidence: 88, isCustom: false, isActive: true },
    { id: '5', phrase: 'save changes', action: 'save_changes', category: 'Actions', confidence: 94, isCustom: false, isActive: true },
    { id: '6', phrase: 'scroll down', action: 'scroll_down', category: 'Controls', confidence: 96, isCustom: false, isActive: true },
    { id: '7', phrase: 'scroll up', action: 'scroll_up', category: 'Controls', confidence: 95, isCustom: false, isActive: true },
    { id: '8', phrase: 'search for', action: 'initiate_search', category: 'Controls', confidence: 85, isCustom: false, isActive: true },
  ]);

  const filteredCommands = selectedCategory === 'all' 
    ? voiceCommands 
    : voiceCommands.filter(cmd => cmd.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(voiceCommands.map(c => c.category)))];

  const toggleCommand = (id: string) => {
    setVoiceCommands(voiceCommands.map(cmd => 
      cmd.id === id ? { ...cmd, isActive: !cmd.isActive } : cmd
    ));
  };

  const startListening = () => {
    setIsListening(true);
    setTimeout(() => setIsListening(false), 5000);
  };

  const addCustomCommand = () => {
    const newCommand: VoiceCommand = {
      id: Date.now().toString(),
      phrase: 'custom phrase',
      action: 'custom_action',
      category: 'Custom',
      confidence: 75,
      isCustom: true,
      isActive: true,
    };
    setVoiceCommands([...voiceCommands, newCommand]);
  };

  const deleteCommand = (id: string) => {
    setVoiceCommands(voiceCommands.filter(cmd => cmd.id !== id));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (confidence >= 80) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Voice Control Full Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Voice commands for hands-free control
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isListening && (
            <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded flex items-center gap-1 animate-pulse">
              <Volume2 className="h-3 w-3" />
              Listening...
            </span>
          )}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Commands</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{voiceCommands.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{voiceCommands.filter(c => c.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Custom</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{voiceCommands.filter(c => c.isCustom).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Confidence</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {Math.round(voiceCommands.reduce((sum, c) => sum + c.confidence, 0) / voiceCommands.length)}%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={startListening}
            disabled={isListening}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isListening ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {isListening ? 'Stop' : 'Start Listening'}
          </button>
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
            onClick={addCustomCommand}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Command
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Voice Commands ({filteredCommands.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredCommands.map((cmd) => (
              <div key={cmd.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Mic className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">"{cmd.phrase}"</span>
                      {cmd.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      {cmd.isCustom && (
                        <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Action: {cmd.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{cmd.category}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getConfidenceColor(cmd.confidence)}`}>
                        {cmd.confidence}% confidence
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCommand(cmd.id)}
                    className={`px-2 py-1 rounded text-xs ${cmd.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
                  >
                    {cmd.isActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Settings className="h-3 w-3" />
                  </button>
                  {cmd.isCustom && (
                    <button
                      type="button"
                      onClick={() => deleteCommand(cmd.id)}
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Voice Control Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use clear, distinct phrases for better recognition</li>
              <li>• Test voice commands in different environments</li>
              <li>• Provide visual feedback for voice commands</li>
              <li>• Allow custom commands for specific workflows</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
