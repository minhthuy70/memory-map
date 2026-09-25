'use client';

import { useState } from 'react';
import { PenTool, X, RefreshCw, Info, CheckCircle, Star, Zap, Copy, BookOpen, TrendingUp } from 'lucide-react';

interface AIWritingStyleCoachProps {
  onCancel?: () => void;
}

interface StyleSuggestion {
  id: string;
  originalText: string;
  suggestedText: string;
  style: 'formal' | 'casual' | 'academic' | 'creative' | 'professional' | 'concise';
  reason: string;
  readabilityScore: number;
  isApplied: boolean;
  createdAt: string;
}

interface WritingMetrics {
  clarity: number;
  conciseness: number;
  engagement: number;
  tone: string;
}

interface StyleCoachSettings {
  autoCoach: boolean;
  targetStyle: string;
  readabilityThreshold: number;
  suggestImprovements: boolean;
}

export default function AIWritingStyleCoach({ onCancel }: AIWritingStyleCoachProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCoachEnabled, setIsCoachEnabled] = useState(true);

  const [styleSuggestions, setStyleSuggestions] = useState<StyleSuggestion[]>([
    { id: '1', originalText: 'The thing is that we need to go', suggestedText: 'We need to go', style: 'concise', reason: 'Remove unnecessary words for clarity', readabilityScore: 85, isApplied: true, createdAt: '2024-01-15' },
    { id: '2', originalText: 'very happy', suggestedText: 'delighted', style: 'formal', reason: 'Use more precise vocabulary', readabilityScore: 78, isApplied: false, createdAt: '2024-02-20' },
    { id: '3', originalText: 'I think that perhaps', suggestedText: 'I believe', style: 'professional', reason: 'Avoid filler words in professional writing', readabilityScore: 92, isApplied: true, createdAt: '2024-03-10' },
  ]);

  const [writingMetrics, setWritingMetrics] = useState<WritingMetrics>({
    clarity: 85,
    conciseness: 78,
    engagement: 82,
    tone: 'balanced',
  });

  const [styleCoachSettings, setStyleCoachSettings] = useState<StyleCoachSettings>({
    autoCoach: false,
    targetStyle: 'professional',
    readabilityThreshold: 70,
    suggestImprovements: true,
  });

  const analyzeStyle = () => {
    const styles: Array<'formal' | 'casual' | 'academic' | 'creative' | 'professional'> = ['formal', 'casual', 'academic', 'creative', 'professional'];
    const newSuggestion: StyleSuggestion = {
      id: Date.now().toString(),
      originalText: 'sample text to analyze',
      suggestedText: 'improved text sample',
      style: styles[Math.floor(Math.random() * styles.length)],
      reason: 'AI style improvement suggestion',
      readabilityScore: Math.floor(Math.random() * 20) + 75,
      isApplied: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStyleSuggestions([...styleSuggestions, newSuggestion]);
    setWritingMetrics({
      clarity: Math.floor(Math.random() * 20) + 75,
      conciseness: Math.floor(Math.random() * 20) + 75,
      engagement: Math.floor(Math.random() * 20) + 75,
      tone: ['formal', 'casual', 'professional'][Math.floor(Math.random() * 3)],
    });
  };

  const applySuggestion = (id: string) => {
    setStyleSuggestions(styleSuggestions.map(suggestion => 
      suggestion.id === id ? { ...suggestion, isApplied: true } : suggestion
    ));
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'formal': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'casual': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'academic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'creative': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'professional': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'concise': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <PenTool className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Writing Style Coach
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Guide writing style and improve quality
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCoachEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCoachEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Suggestions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{styleSuggestions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Applied</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{styleSuggestions.filter(s => s.isApplied).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Readability</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(styleSuggestions.reduce((acc, s) => acc + s.readabilityScore, 0) / styleSuggestions.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Tone</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{writingMetrics.tone}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCoachEnabled}
              onChange={(e) => setIsCoachEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Coach</span>
          </div>
          <button
            type="button"
            onClick={analyzeStyle}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <PenTool className="h-3 w-3" />
            Analyze Style
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Writing Metrics</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Clarity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${writingMetrics.clarity}%` }}></div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{writingMetrics.clarity}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-900 dark:text-white">Conciseness</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${writingMetrics.conciseness}%` }}></div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{writingMetrics.conciseness}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${writingMetrics.engagement}%` }}></div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{writingMetrics.engagement}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Style Coach Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Coach</span>
              </div>
              <input
                type="checkbox"
                checked={styleCoachSettings.autoCoach}
                onChange={(e) => setStyleCoachSettings({ ...styleCoachSettings, autoCoach: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <PenTool className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Target Style</span>
              </div>
              <select
                value={styleCoachSettings.targetStyle}
                onChange={(e) => setStyleCoachSettings({ ...styleCoachSettings, targetStyle: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="academic">Academic</option>
                <option value="creative">Creative</option>
                <option value="professional">Professional</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Readability Threshold</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={styleCoachSettings.readabilityThreshold}
                  onChange={(e) => setStyleCoachSettings({ ...styleCoachSettings, readabilityThreshold: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{styleCoachSettings.readabilityThreshold}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Style Suggestions</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {styleSuggestions.map((suggestion) => (
              <div key={suggestion.id} className={`p-3 rounded-lg border ${suggestion.isApplied ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <PenTool className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${getStyleColor(suggestion.style)}`}>
                          {suggestion.style}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{suggestion.readabilityScore}% readability</span>
                        {suggestion.isApplied && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Applied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{suggestion.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-red-600 dark:text-red-400 line-through">{suggestion.originalText}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                    <span className="text-xs text-green-600 dark:text-green-400">{suggestion.suggestedText}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{suggestion.reason}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applySuggestion(suggestion.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Apply
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Style Coach Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI analyzes writing style and suggests improvements</li>
              <li>• Styles: formal, casual, academic, creative, professional</li>
              <li>• Metrics: clarity, conciseness, engagement, tone</li>
              <li>• Readability scoring for accessibility</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
