'use client';

import { useState } from 'react';
import { Heading, X, RefreshCw, Info, CheckCircle, Star, Zap, Copy, Lightbulb } from 'lucide-react';

interface AITitleSuggesterProps {
  onCancel?: () => void;
}

interface SuggestedTitle {
  id: string;
  title: string;
  relevance: number;
  category: 'emotional' | 'descriptive' | 'creative' | 'simple';
  memoryContext: string;
  createdAt: string;
  isAccepted: boolean;
}

interface SuggestionSettings {
  autoSuggest: boolean;
  maxSuggestions: number;
  categoryFilter: string;
  lengthPreference: 'short' | 'medium' | 'long';
}

export default function AITitleSuggester({ onCancel }: AITitleSuggesterProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSuggesterEnabled, setIsSuggesterEnabled] = useState(true);

  const [suggestedTitles, setSuggestedTitles] = useState<SuggestedTitle[]>([
    { id: '1', title: 'Golden Sunset Paradise', relevance: 95, category: 'emotional', memoryContext: 'Beach sunset with family', createdAt: '2024-01-15', isAccepted: false },
    { id: '2', title: 'Summer Beach Adventure', relevance: 88, category: 'descriptive', memoryContext: 'Beach day activities', createdAt: '2024-02-20', isAccepted: true },
    { id: '3', title: 'Ocean Breeze Memories', relevance: 82, category: 'creative', memoryContext: 'Beach memories', createdAt: '4-03-10', isAccepted: false },
  ]);

  const [suggestionSettings, setSuggestionSettings] = useState<SuggestionSettings>({
    autoSuggest: false,
    maxSuggestions: 5,
    categoryFilter: 'all',
    lengthPreference: 'medium',
  });

  const suggestTitles = () => {
    const categories: Array<'emotional' | 'descriptive' | 'creative' | 'simple'> = ['emotional', 'descriptive', 'creative', 'simple'];
    const newTitleSuggestions = ['Beautiful Moment', 'Unforgettable Day', 'Perfect Memory', 'Amazing Experience'];
    const newTitles = newTitleSuggestions.map((newTitle, index) => ({
      id: (Date.now() + index).toString(),
      title: newTitle,
      relevance: Math.floor(Math.random() * 20) + 80,
      category: categories[Math.floor(Math.random() * categories.length)],
      memoryContext: 'Memory context',
      createdAt: new Date().toISOString().split('T')[0],
      isAccepted: false,
    }));
    setSuggestedTitles([...suggestedTitles, ...newTitles]);
  };

  const acceptTitle = (id: string) => {
    setSuggestedTitles(suggestedTitles.map(title => 
      title.id === id ? { ...title, isAccepted: true } : { ...title, isAccepted: false }
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emotional': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'descriptive': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'creative': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'simple': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
            <Heading className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Title Suggester
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Suggest creative titles for memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSuggesterEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSuggesterEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Suggested</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{suggestedTitles.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accepted</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{suggestedTitles.filter(t => t.isAccepted).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Relevance</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(suggestedTitles.reduce((acc, t) => acc + t.relevance, 0) / suggestedTitles.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Categories</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{4}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSuggesterEnabled}
              onChange={(e) => setIsSuggesterEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Suggester</span>
          </div>
          <button
            type="button"
            onClick={suggestTitles}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Lightbulb className="h-3 w-3" />
            Suggest Titles
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Suggestion Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Suggest</span>
              </div>
              <input
                type="checkbox"
                checked={suggestionSettings.autoSuggest}
                onChange={(e) => setSuggestionSettings({ ...suggestionSettings, autoSuggest: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Max Suggestions</span>
              </div>
              <input
                type="number"
                value={suggestionSettings.maxSuggestions}
                onChange={(e) => setSuggestionSettings({ ...suggestionSettings, maxSuggestions: parseInt(e.target.value) })}
                className="w-20 px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Heading className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Length Preference</span>
              </div>
              <select
                value={suggestionSettings.lengthPreference}
                onChange={(e) => setSuggestionSettings({ ...suggestionSettings, lengthPreference: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Suggested Titles</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {suggestedTitles.map((title) => (
              <div key={title.id} className={`p-3 rounded-lg border ${title.isAccepted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{title.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(title.category)}`}>
                          {title.category}
                        </span>
                        {title.isAccepted && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Accepted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{title.memoryContext}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{title.relevance}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">relevance</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Created: {title.createdAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => acceptTitle(title.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Accept
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Title Suggester Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI suggests creative titles based on memory context</li>
              <li>• Categories: emotional, descriptive, creative, simple</li>
              <li>• Relevance scoring for title quality</li>
              <li>• Length preference: short, medium, long</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
