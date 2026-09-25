'use client';

import { useState } from 'react';
import { Brain, X, RefreshCw, Info, CheckCircle, Star, Zap, TrendingUp, Calendar, MapPin, Activity, Target } from 'lucide-react';

interface AILifePatternRecognitionProps {
  onCancel?: () => void;
}

interface LifePattern {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  confidence: number;
  frequency: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface PatternInsight {
  id: string;
  patternId: string;
  title: string;
  description: string;
  detectedAt: string;
  impact: 'high' | 'medium' | 'low';
}

interface PatternCategory {
  id: string;
  name: string;
  description: string;
  patternsCount: number;
  insightsCount: number;
}

export default function AILifePatternRecognition({ onCancel }: AILifePatternRecognitionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPatternEnabled, setIsPatternEnabled] = useState(true);

  const [lifePatterns, setLifePatterns] = useState<LifePattern[]>([
    { id: '1', name: 'Morning Walk', description: 'Regular morning walks at 7 AM', type: 'daily', confidence: 0.92, frequency: 28, trend: 'increasing' },
    { id: '2', name: 'Weekend Travel', description: 'Travel activities on weekends', type: 'weekly', confidence: 0.85, frequency: 12, trend: 'stable' },
    { id: '3', name: 'Seasonal Hobbies', description: 'Changing hobbies by season', type: 'seasonal', confidence: 0.78, frequency: 4, trend: 'stable' },
    { id: '4', name: 'Monthly Social', description: 'Social gatherings monthly', type: 'monthly', confidence: 0.88, frequency: 6, trend: 'increasing' },
  ]);

  const [patternInsights, setPatternInsights] = useState<PatternInsight[]>([
    { id: '1', patternId: '1', title: 'Health Improvement', description: 'Morning walks correlate with better mood and energy', detectedAt: '2024-01-15', impact: 'high' },
    { id: '2', patternId: '2', title: 'Travel Enrichment', description: 'Weekend travels boost creativity and memory formation', detectedAt: '2024-02-20', impact: 'medium' },
    { id: '3', patternId: '4', title: 'Social Connection', description: 'Monthly social activities strengthen relationships', detectedAt: '2024-03-10', impact: 'high' },
  ]);

  const [patternCategories, setPatternCategories] = useState<PatternCategory[]>([
    { id: '1', name: 'Health & Fitness', description: 'Exercise and wellness patterns', patternsCount: 15, insightsCount: 8 },
    { id: '2', name: 'Social Activities', description: 'Social interaction patterns', patternsCount: 12, insightsCount: 6 },
    { id: '3', name: 'Travel & Exploration', description: 'Movement and location patterns', patternsCount: 10, insightsCount: 5 },
    { id: '4', name: 'Work & Productivity', description: 'Professional activity patterns', patternsCount: 8, insightsCount: 4 },
  ]);

  const analyzePatterns = () => {
    const newInsight: PatternInsight = {
      id: Date.now().toString(),
      patternId: lifePatterns[0].id,
      title: 'New Pattern Insight',
      description: 'AI detected a new life pattern from recent memories',
      detectedAt: new Date().toISOString().split('T')[0],
      impact: 'medium',
    };
    setPatternInsights([...patternInsights, newInsight]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'weekly': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'monthly': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'seasonal': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'decreasing': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'stable': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Life Pattern Recognition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detect life patterns from memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isPatternEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isPatternEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Patterns</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{lifePatterns.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Insights</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{patternInsights.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Categories</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{patternCategories.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Confidence</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{(lifePatterns.reduce((acc, p) => acc + p.confidence, 0) / lifePatterns.length).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isPatternEnabled}
              onChange={(e) => setIsPatternEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Pattern Recognition</span>
          </div>
          <button
            type="button"
            onClick={analyzePatterns}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <TrendingUp className="h-3 w-3" />
            Analyze Patterns
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detected Patterns</h4>
          <div className="space-y-2">
            {lifePatterns.map((pattern) => (
              <div key={pattern.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{pattern.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(pattern.type)}`}>
                          {pattern.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTrendColor(pattern.trend)}`}>
                          {pattern.trend}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{pattern.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{(pattern.confidence * 100).toFixed(0)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">confidence</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Frequency: {pattern.frequency} times</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Pattern Categories</h4>
          <div className="space-y-2">
            {patternCategories.map((category) => (
              <div key={category.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-violet-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{category.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{category.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{category.patternsCount} patterns</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{category.insightsCount} insights</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Pattern Insights</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {patternInsights.map((insight) => (
              <div key={insight.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Brain className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{insight.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getImpactColor(insight.impact)}`}>
                          {insight.impact} impact
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{insight.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{insight.detectedAt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Life Pattern Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI detects daily, weekly, monthly, and seasonal patterns</li>
              <li>• Analyzes frequency and confidence of patterns</li>
              <li>• Provides insights based on detected patterns</li>
              <li>• Categorizes patterns by health, social, travel, work</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
