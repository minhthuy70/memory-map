'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Flower2,
  Info,
  Play,
  RefreshCw,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';

interface MindfulnessMemoryPromptsProps {
  onCancel?: () => void;
}

interface MindfulnessPrompt {
  id: string;
  prompt: string;
  category: 'breathing' | 'reflection' | 'gratitude' | 'grounding' | 'visualization';
  memoryId?: string;
  memoryTitle?: string;
  generatedAt: string;
  isCompleted: boolean;
}

interface PromptSettings {
  autoGenerate: boolean;
  dailyFrequency: number;
  defaultCategory: 'breathing' | 'reflection' | 'gratitude' | 'grounding' | 'visualization';
  useMemories: boolean;
  reminderTime: string;
}

export default function MindfulnessMemoryPrompts({ onCancel }: MindfulnessMemoryPromptsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPromptsEnabled, setIsPromptsEnabled] = useState(true);

  const [mindfulnessPrompts, setMindfulnessPrompts] = useState<MindfulnessPrompt[]>([
    { id: '1', prompt: 'Take a moment to focus on your breath. Inhale deeply for 4 counts, hold for 4, exhale for 4. What do you notice about your breath?', category: 'breathing', memoryId: 'mem_1', memoryTitle: 'Beach sunset', generatedAt: '2024-01-15', isCompleted: true },
    { id: '2', prompt: 'Reflect on this memory. What emotions do you feel when you think about this moment? What made it special?', category: 'reflection', memoryId: 'mem_2', memoryTitle: 'Family dinner', generatedAt: '2024-01-16', isCompleted: false },
    { id: '3', prompt: 'Ground yourself in the present moment. What do you see, hear, smell, or feel right now? How does this connect to your memory?', category: 'grounding', memoryId: undefined, memoryTitle: undefined, generatedAt: '2024-01-17', isCompleted: true },
  ]);

  const [promptSettings, setPromptSettings] = useState<PromptSettings>({
    autoGenerate: false,
    dailyFrequency: 3,
    defaultCategory: 'reflection',
    useMemories: true,
    reminderTime: '10:00',
  });

  const generatePrompt = () => {
    const categories: Array<'breathing' | 'reflection' | 'gratitude' | 'grounding' | 'visualization'> = ['breathing', 'reflection', 'gratitude', 'grounding', 'visualization'];
    const newPrompt: MindfulnessPrompt = {
      id: Date.now().toString(),
      prompt: 'Close your eyes and visualize a peaceful place. What do you see? How does it make you feel?',
      category: promptSettings.defaultCategory,
      memoryId: promptSettings.useMemories ? 'mem_' + Date.now() : undefined,
      memoryTitle: promptSettings.useMemories ? 'Sample memory' : undefined,
      generatedAt: new Date().toISOString().split('T')[0],
      isCompleted: false,
    };
    setMindfulnessPrompts([...mindfulnessPrompts, newPrompt]);
  };

  const completePrompt = (id: string) => {
    setMindfulnessPrompts(mindfulnessPrompts.map(prompt => 
      prompt.id === id ? { ...prompt, isCompleted: true } : prompt
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'breathing': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'reflection': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'gratitude': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'grounding': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'visualization': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-lime-400 to-green-500 rounded-xl">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Mindfulness Memory Prompts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI prompts for mindfulness from your memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isPromptsEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isPromptsEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Prompts</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{mindfulnessPrompts.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Completed</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{mindfulnessPrompts.filter(p => p.isCompleted).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Linked Memories</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{mindfulnessPrompts.filter(p => p.memoryId).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Categories</p>
            <p className="text-lg font-bold text-lime-600 dark:text-lime-400">{5}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isPromptsEnabled}
              onChange={(e) => setIsPromptsEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Prompts</span>
          </div>
          <button
            type="button"
            onClick={generatePrompt}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            Generate Prompt
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Prompt Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-lime-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={promptSettings.autoGenerate}
                onChange={(e) => setPromptSettings({ ...promptSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Flower2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Category</span>
              </div>
              <select
                value={promptSettings.defaultCategory}
                onChange={(e) => setPromptSettings({ ...promptSettings, defaultCategory: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="breathing">Breathing</option>
                <option value="reflection">Reflection</option>
                <option value="gratitude">Gratitude</option>
                <option value="grounding">Grounding</option>
                <option value="visualization">Visualization</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Daily Frequency</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={promptSettings.dailyFrequency}
                  onChange={(e) => setPromptSettings({ ...promptSettings, dailyFrequency: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{promptSettings.dailyFrequency}/day</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Use Memories</span>
              </div>
              <input
                type="checkbox"
                checked={promptSettings.useMemories}
                onChange={(e) => setPromptSettings({ ...promptSettings, useMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Reminder Time</span>
              </div>
              <input
                type="time"
                value={promptSettings.reminderTime}
                onChange={(e) => setPromptSettings({ ...promptSettings, reminderTime: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mindfulness Prompts</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {mindfulnessPrompts.map((prompt) => (
              <div key={prompt.id} className={`p-3 rounded-lg border ${prompt.isCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-lime-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(prompt.category)}`}>
                          {prompt.category}
                        </span>
                        {prompt.isCompleted && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{prompt.generatedAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-900 dark:text-white">{prompt.prompt}</p>
                </div>
                {prompt.memoryTitle && (
                  <div className="mb-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Linked: {prompt.memoryTitle}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => completePrompt(prompt.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Complete
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Flower2 className="h-3 w-3" />
                    Reflect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mindfulness Prompts Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI generates mindfulness prompts from your memories</li>
              <li>• Categories: breathing, reflection, gratitude, grounding, visualization</li>
              <li>• Auto-link to related memories</li>
              <li>• Daily frequency and reminder settings</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
