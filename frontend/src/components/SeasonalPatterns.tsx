'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Cloud,
  Filter,
  Flower,
  Leaf,
  Settings,
  Snowflake,
  Sparkles,
  Sun,
  TrendingUp,
  Zap
} from 'lucide-react';

interface SeasonalData {
  season: string;
  months: string[];
  memoryCount: number;
  moodDistribution: { happy: number; sad: number; neutral: number; excited: number; nostalgic: number };
  averageRating: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface SeasonalPattern {
  id: string;
  name: string;
  season: string;
  description: string;
  strength: number;
  prediction: string;
}

interface SeasonalPatternsProps {
  onCancel?: () => void;
  onAnalyzePatterns?: () => Promise<void>;
}

const DEFAULT_SEASONAL_DATA: SeasonalData[] = [
  {
    season: 'Spring',
    months: ['Mar', 'Apr', 'May'],
    memoryCount: 75,
    moodDistribution: { happy: 40, sad: 12, neutral: 18, excited: 28, nostalgic: 17 },
    averageRating: 4.5,
    trend: 'up',
    confidence: 0.88,
  },
  {
    season: 'Summer',
    months: ['Jun', 'Jul', 'Aug'],
    memoryCount: 95,
    moodDistribution: { happy: 55, sad: 10, neutral: 15, excited: 40, nostalgic: 25 },
    averageRating: 4.7,
    trend: 'up',
    confidence: 0.92,
  },
  {
    season: 'Autumn',
    months: ['Sep', 'Oct', 'Nov'],
    memoryCount: 68,
    moodDistribution: { happy: 35, sad: 15, neutral: 20, excited: 20, nostalgic: 18 },
    averageRating: 4.3,
    trend: 'down',
    confidence: 0.85,
  },
  {
    season: 'Winter',
    months: ['Dec', 'Jan', 'Feb'],
    memoryCount: 52,
    moodDistribution: { happy: 28, sad: 18, neutral: 22, excited: 15, nostalgic: 20 },
    averageRating: 4.1,
    trend: 'stable',
    confidence: 0.82,
  },
];

const DEFAULT_PATTERNS: SeasonalPattern[] = [
  {
    id: 'pattern-1',
    name: 'Summer Travel Peak',
    season: 'Summer',
    description: 'Highest memory creation during summer months due to travel',
    strength: 0.92,
    prediction: 'Expect 15% increase in travel memories',
  },
  {
    id: 'pattern-2',
    name: 'Holiday Season Uplift',
    season: 'Winter',
    description: 'Increase in family and celebration memories',
    strength: 0.85,
    prediction: 'Expect more nostalgic and happy memories',
  },
  {
    id: 'pattern-3',
    name: 'Spring Renewal',
    season: 'Spring',
    description: 'Rising activity and excited moods',
    strength: 0.78,
    prediction: 'Expect growth in outdoor activities',
  },
];

export default function SeasonalPatterns({ onCancel, onAnalyzePatterns }: SeasonalPatternsProps) {
  const [seasonalData, setSeasonalData] = useState<SeasonalData[]>(DEFAULT_SEASONAL_DATA);
  const [patterns, setPatterns] = useState<SeasonalPattern[]>(DEFAULT_PATTERNS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState('Summer');
  const [comparisonYear, setComparisonYear] = useState(2023);
  const [showPredictions, setShowPredictions] = useState(true);

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'Spring':
        return <Flower className="h-4 w-4" />;
      case 'Summer':
        return <Sun className="h-4 w-4" />;
      case 'Autumn':
        return <Leaf className="h-4 w-4" />;
      case 'Winter':
        return <Snowflake className="h-4 w-4" />;
      default:
        return <Cloud className="h-4 w-4" />;
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'Spring':
        return 'text-green-500';
      case 'Summer':
        return 'text-orange-500';
      case 'Autumn':
        return 'text-amber-500';
      case 'Winter':
        return 'text-blue-500';
      default:
        return 'text-slate-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />;
      default:
        return <Activity className="h-3 w-3 text-slate-500" />;
    }
  };

  const selectedSeasonData = seasonalData.find(s => s.season === selectedSeason);
  const totalMemories = seasonalData.reduce((sum, s) => sum + s.memoryCount, 0);
  const avgRating = seasonalData.reduce((sum, s) => sum + s.averageRating, 0) / seasonalData.length;
  const peakSeason = seasonalData.reduce((max, s) => s.memoryCount > max.memoryCount ? s : max, seasonalData[0]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Sun className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Mẫu theo mùa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {seasonalData.length} seasons
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt seasonal patterns
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Comparison year
              </label>
              <select
                value={comparisonYear}
                onChange={(e) => setComparisonYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
              >
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
                <option value={2021}>2021</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Show predictions
              </span>
              <button
                type="button"
                onClick={() => setShowPredictions(!showPredictions)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  showPredictions ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    showPredictions ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalMemories}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Rating</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgRating.toFixed(1)}/5
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Peak</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {peakSeason.season}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Patterns</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {patterns.length}
          </div>
        </div>
      </div>

      {/* Season Selector */}
      <div className="mb-4">
        <div className="grid grid-cols-4 gap-2">
          {seasonalData.map((season) => (
            <button
              key={season.season}
              type="button"
              onClick={() => setSelectedSeason(season.season)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedSeason === season.season
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className={`flex items-center justify-center mb-1 ${getSeasonColor(season.season)}`}>
                {getSeasonIcon(season.season)}
              </div>
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {season.season}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Season Details */}
      {selectedSeasonData && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            {selectedSeason} Details
          </h4>
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Months</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedSeasonData.months.join(', ')}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Memories</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedSeasonData.memoryCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Rating</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedSeasonData.averageRating.toFixed(1)}/5
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Trend</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(selectedSeasonData.trend)}
                  <span className="text-xs text-slate-700 dark:text-slate-300 capitalize">
                    {selectedSeasonData.trend}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Confidence</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {(selectedSeasonData.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">Mood Distribution</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(selectedSeasonData.moodDistribution).map(([mood, count]) => (
                  <span
                    key={mood}
                    className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[10px] rounded-full"
                  >
                    {mood}: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seasonal Comparison */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Seasonal Comparison
        </h4>
        <div className="space-y-2">
          {seasonalData.map((season) => (
            <div
              key={season.season}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getSeasonColor(season.season)}`}>
                    {getSeasonIcon(season.season)}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {season.season}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(season.trend)}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {season.memoryCount} memories
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                    style={{ width: `${(season.memoryCount / totalMemories) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {((season.memoryCount / totalMemories) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected Patterns */}
      {showPredictions && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Detected Patterns
          </h4>
          <div className="space-y-2">
            {patterns.map((pattern) => (
              <div
                key={pattern.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getSeasonColor(pattern.season)}`}>
                      {getSeasonIcon(pattern.season)}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {pattern.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {(pattern.strength * 100).toFixed(0)}% strength
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                  {pattern.description}
                </p>

                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span className="text-xs text-amber-700 dark:text-amber-400">
                      {pattern.prediction}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg">
        <p className="text-[10px] text-amber-700 dark:text-amber-400">
          <strong>Lưu ý:</strong> Mẫu theo mùa phân tích các mẫu kỷ niệm theo mùa với seasonal comparison, mood distribution, trend tracking, pattern detection, và predictions.
        </p>
      </div>
    </div>
  );
}