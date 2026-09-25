'use client';

import { useState } from 'react';
import {
  Activity,
  Clock,
  Heart,
  Info,
  Moon,
  RefreshCw,
  Star,
  Sun,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

interface WellnessScoreTrackingProps {
  onCancel?: () => void;
}

interface WellnessDimension {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  trend: 'up' | 'down' | 'stable';
}

interface WellnessEntry {
  id: string;
  date: string;
  overallScore: number;
  dimensions: WellnessDimension[];
  factors: string[];
  notes?: string;
}

interface WellnessSettings {
  autoCalculate: boolean;
  calculationFrequency: 'daily' | 'weekly' | 'monthly';
  dimensionWeights: Record<string, number>;
  includeMood: boolean;
  includeSleep: boolean;
  includeExercise: boolean;
}

export default function WellnessScoreTracking({ onCancel }: WellnessScoreTrackingProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);

  const [wellnessEntries, setWellnessEntries] = useState<WellnessEntry[]>([
    { 
      id: '1', 
      date: '2024-01-17', 
      overallScore: 82, 
      dimensions: [
        { name: 'Physical', score: 85, maxScore: 100, weight: 0.3, trend: 'up' },
        { name: 'Mental', score: 80, maxScore: 100, weight: 0.25, trend: 'stable' },
        { name: 'Emotional', score: 82, maxScore: 100, weight: 0.2, trend: 'up' },
        { name: 'Social', score: 75, maxScore: 100, weight: 0.15, trend: 'down' },
        { name: 'Spiritual', score: 90, maxScore: 100, weight: 0.1, trend: 'stable' },
      ],
      factors: ['Good sleep', 'Regular exercise', 'Stress management'],
      notes: 'Overall feeling well this week'
    },
    { 
      id: '2', 
      date: '2024-01-10', 
      overallScore: 78, 
      dimensions: [
        { name: 'Physical', score: 80, maxScore: 100, weight: 0.3, trend: 'stable' },
        { name: 'Mental', score: 75, maxScore: 100, weight: 0.25, trend: 'down' },
        { name: 'Emotional', score: 78, maxScore: 100, weight: 0.2, trend: 'stable' },
        { name: 'Social', score: 80, maxScore: 100, weight: 0.15, trend: 'stable' },
        { name: 'Spiritual', score: 85, maxScore: 100, weight: 0.1, trend: 'stable' },
      ],
      factors: ['Work stress', 'Less sleep'],
      notes: 'Busy week at work'
    },
  ]);

  const [wellnessSettings, setWellnessSettings] = useState<WellnessSettings>({
    autoCalculate: true,
    calculationFrequency: 'weekly',
    dimensionWeights: {
      Physical: 0.3,
      Mental: 0.25,
      Emotional: 0.2,
      Social: 0.15,
      Spiritual: 0.1,
    },
    includeMood: true,
    includeSleep: true,
    includeExercise: true,
  });

  const [currentDimensions, setCurrentDimensions] = useState<WellnessDimension[]>([
    { name: 'Physical', score: 85, maxScore: 100, weight: 0.3, trend: 'stable' },
    { name: 'Mental', score: 80, maxScore: 100, weight: 0.25, trend: 'stable' },
    { name: 'Emotional', score: 82, maxScore: 100, weight: 0.2, trend: 'stable' },
    { name: 'Social', score: 75, maxScore: 100, weight: 0.15, trend: 'stable' },
    { name: 'Spiritual', score: 90, maxScore: 100, weight: 0.1, trend: 'stable' },
  ]);

  const [currentFactors, setCurrentFactors] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');

  const calculateWellnessScore = () => {
    const overallScore = currentDimensions.reduce((acc, dim) => acc + (dim.score * dim.weight), 0);
    const newEntry: WellnessEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      overallScore: Math.round(overallScore),
      dimensions: currentDimensions,
      factors: currentFactors.split(',').map(f => f.trim()).filter(f => f),
      notes: currentNotes,
    };
    setWellnessEntries([...wellnessEntries, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentFactors('');
    setCurrentNotes('');
  };

  const getDimensionColor = (name: string) => {
    switch (name) {
      case 'Physical': return 'text-blue-600 dark:text-blue-400';
      case 'Mental': return 'text-purple-600 dark:text-purple-400';
      case 'Emotional': return 'text-pink-600 dark:text-pink-400';
      case 'Social': return 'text-green-600 dark:text-green-400';
      case 'Spiritual': return 'text-amber-600 dark:text-amber-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      case 'stable': return <Activity className="h-3 w-3 text-slate-500" />;
      default: return <Activity className="h-3 w-3 text-slate-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Wellness Score Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track overall wellness across dimensions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isTrackingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isTrackingEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Current Score</p>
            <p className={`text-lg font-bold ${getScoreColor(wellnessEntries[0]?.overallScore || 0)}`}>
              {wellnessEntries[0]?.overallScore || 0}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Score</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {wellnessEntries.length > 0 ? Math.round(wellnessEntries.reduce((acc, e) => acc + e.overallScore, 0) / wellnessEntries.length) : 0}
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Entries</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{wellnessEntries.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Dimensions</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{currentDimensions.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isTrackingEnabled}
              onChange={(e) => setIsTrackingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Tracking</span>
          </div>
          <button
            type="button"
            onClick={calculateWellnessScore}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Heart className="h-3 w-3" />
            Calculate Score
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Wellness Dimensions</h4>
          <div className="space-y-2">
            {currentDimensions.map((dim, index) => (
              <div key={dim.name} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-emerald-400" />
                    <span className={`text-xs font-semibold ${getDimensionColor(dim.name)}`}>{dim.name}</span>
                    {getTrendIcon(dim.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={dim.score}
                      onChange={(e) => {
                        const newDimensions = [...currentDimensions];
                        newDimensions[index].score = parseInt(e.target.value);
                        setCurrentDimensions(newDimensions);
                      }}
                      className="w-24"
                    />
                    <span className={`text-xs font-bold ${getScoreColor(dim.score)}`}>{dim.score}/100</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Weight: {dim.weight}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Max: {dim.maxScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Factors & Notes</h4>
          <div className="space-y-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Factors (comma-separated)</span>
              </div>
              <input
                type="text"
                value={currentFactors}
                onChange={(e) => setCurrentFactors(e.target.value)}
                placeholder="good sleep, exercise, stress..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Notes</span>
              </div>
              <textarea
                value={currentNotes}
                onChange={(e) => setCurrentNotes(e.target.value)}
                placeholder="Additional notes about your wellness..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Wellness Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Calculate</span>
              </div>
              <input
                type="checkbox"
                checked={wellnessSettings.autoCalculate}
                onChange={(e) => setWellnessSettings({ ...wellnessSettings, autoCalculate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Frequency</span>
              </div>
              <select
                value={wellnessSettings.calculationFrequency}
                onChange={(e) => setWellnessSettings({ ...wellnessSettings, calculationFrequency: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Sleep</span>
              </div>
              <input
                type="checkbox"
                checked={wellnessSettings.includeSleep}
                onChange={(e) => setWellnessSettings({ ...wellnessSettings, includeSleep: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Sun className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Exercise</span>
              </div>
              <input
                type="checkbox"
                checked={wellnessSettings.includeExercise}
                onChange={(e) => setWellnessSettings({ ...wellnessSettings, includeExercise: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Wellness History</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {wellnessEntries.map((entry) => (
              <div key={entry.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{entry.date}</span>
                      <span className={`ml-2 text-xs font-bold ${getScoreColor(entry.overallScore)}`}>
                        {entry.overallScore}/100
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {entry.dimensions.map((dim) => (
                      <span key={dim.name} className={`px-2 py-0.5 rounded text-xs ${getDimensionColor(dim.name)}`}>
                        {dim.name}: {dim.score}
                      </span>
                    ))}
                  </div>
                </div>
                {entry.factors.length > 0 && (
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-1">
                      {entry.factors.map((factor) => (
                        <span key={factor} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">{entry.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Wellness Score Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Track wellness across multiple dimensions</li>
              <li>• Dimensions: Physical, Mental, Emotional, Social, Spiritual</li>
              <li>• Customizable weights for each dimension</li>
              <li>• Auto-calculate based on mood, sleep, and exercise</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
