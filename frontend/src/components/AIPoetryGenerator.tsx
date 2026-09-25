'use client';

import { useState } from 'react';
import { Feather, X, RefreshCw, Info, CheckCircle, Star, Zap, Copy, Heart, BookOpen } from 'lucide-react';

interface AIPoetryGeneratorProps {
  onCancel?: () => void;
}

interface GeneratedPoem {
  id: string;
  memoryId: string;
  memoryTitle: string;
  poem: string;
  style: 'haiku' | 'sonnet' | 'free_verse' | 'limerick' | 'acrostic';
  mood: 'happy' | 'sad' | 'nostalgic' | 'romantic' | 'adventurous';
  lineCount: number;
  createdAt: string;
  isSaved: boolean;
}

interface PoetrySettings {
  autoGenerate: boolean;
  defaultStyle: 'haiku' | 'sonnet' | 'free_verse' | 'limerick' | 'acrostic';
  defaultMood: 'happy' | 'sad' | 'nostalgic' | 'romantic' | 'adventurous';
  rhymeScheme: boolean;
  meter: boolean;
}

export default function AIPoetryGenerator({ onCancel }: AIPoetryGeneratorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGeneratorEnabled, setIsGeneratorEnabled] = useState(true);

  const [generatedPoems, setGeneratedPoems] = useState<GeneratedPoem[]>([
    { id: '1', memoryId: '1', memoryTitle: 'Beach Sunset', poem: 'Golden rays touch the sea,\nWaves dance in gentle motion,\nPeace fills the evening.', style: 'haiku', mood: 'happy', lineCount: 3, createdAt: '2024-01-15', isSaved: true },
    { id: '2', memoryId: '2', memoryTitle: 'Mountain Summit', poem: 'Standing high above the clouds,\nWhere eagles dare to soar,\nThe world below fades into dreams,\nAnd peace is evermore.', style: 'free_verse', mood: 'adventurous', lineCount: 4, createdAt: '2024-02-20', isSaved: false },
  ]);

  const [poetrySettings, setPoetrySettings] = useState<PoetrySettings>({
    autoGenerate: false,
    defaultStyle: 'free_verse',
    defaultMood: 'happy',
    rhymeScheme: true,
    meter: false,
  });

  const generatePoem = () => {
    const styles: Array<'haiku' | 'sonnet' | 'free_verse' | 'limerick' | 'acrostic'> = ['haiku', 'sonnet', 'free_verse', 'limerick', 'acrostic'];
    const moods: Array<'happy' | 'sad' | 'nostalgic' | 'romantic' | 'adventurous'> = ['happy', 'sad', 'nostalgic', 'romantic', 'adventurous'];
    const newPoem: GeneratedPoem = {
      id: Date.now().toString(),
      memoryId: Date.now().toString(),
      memoryTitle: `Memory ${generatedPoems.length + 1}`,
      poem: 'AI-generated poem about the memory,\nWith words that flow like rivers,\nCapturing moments in time,\nWhere memories live forever.',
      style: poetrySettings.defaultStyle,
      mood: poetrySettings.defaultMood,
      lineCount: Math.floor(Math.random() * 8) + 3,
      createdAt: new Date().toISOString().split('T')[0],
      isSaved: false,
    };
    setGeneratedPoems([...generatedPoems, newPoem]);
  };

  const savePoem = (id: string) => {
    setGeneratedPoems(generatedPoems.map(poem => 
      poem.id === id ? { ...poem, isSaved: true } : poem
    ));
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'haiku': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'sonnet': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'free_verse': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'limerick': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'acrostic': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'sad': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'nostalgic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'romantic': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'adventurous': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Feather className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Poetry Generator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create poems from memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGeneratorEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGeneratorEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Poems</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{generatedPoems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Saved</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{generatedPoems.filter(p => p.isSaved).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Lines</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(generatedPoems.reduce((acc, p) => acc + p.lineCount, 0) / generatedPoems.length).toFixed(0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Styles</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{5}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGeneratorEnabled}
              onChange={(e) => setIsGeneratorEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Generator</span>
          </div>
          <button
            type="button"
            onClick={generatePoem}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Feather className="h-3 w-3" />
            Generate Poem
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Poetry Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={poetrySettings.autoGenerate}
                onChange={(e) => setPoetrySettings({ ...poetrySettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Style</span>
              </div>
              <select
                value={poetrySettings.defaultStyle}
                onChange={(e) => setPoetrySettings({ ...poetrySettings, defaultStyle: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="haiku">Haiku</option>
                <option value="sonnet">Sonnet</option>
                <option value="free_verse">Free Verse</option>
                <option value="limerick">Limerick</option>
                <option value="acrostic">Acrostic</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Mood</span>
              </div>
              <select
                value={poetrySettings.defaultMood}
                onChange={(e) => setPoetrySettings({ ...poetrySettings, defaultMood: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="nostalgic">Nostalgic</option>
                <option value="romantic">Romantic</option>
                <option value="adventurous">Adventurous</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Rhyme Scheme</span>
              </div>
              <input
                type="checkbox"
                checked={poetrySettings.rhymeScheme}
                onChange={(e) => setPoetrySettings({ ...poetrySettings, rhymeScheme: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generated Poems</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {generatedPoems.map((poem) => (
              <div key={poem.id} className={`p-3 rounded-lg border ${poem.isSaved ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Feather className="h-4 w-4 text-pink-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{poem.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStyleColor(poem.style)}`}>
                          {poem.style}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getMoodColor(poem.mood)}`}>
                          {poem.mood}
                        </span>
                        {poem.isSaved && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Saved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{poem.lineCount} lines • {poem.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-900 dark:text-white whitespace-pre-line">{poem.poem}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => savePoem(poem.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Heart className="h-3 w-3" />
                    Like
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Poetry Generator Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI generates poems from memory content</li>
              <li>• Styles: haiku, sonnet, free verse, limerick, acrostic</li>
              <li>• Moods: happy, sad, nostalgic, romantic, adventurous</li>
              <li>• Rhyme scheme and meter options available</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
