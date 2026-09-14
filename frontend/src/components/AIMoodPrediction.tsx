'use client';

import { useState } from 'react';
import { Smile, X, RefreshCw, Info, CheckCircle, Star, Zap, CloudSun, CloudRain, Snowflake, Thermometer, MapPin } from 'lucide-react';

interface AIMoodPredictionProps {
  onCancel?: () => void;
}

interface MoodFactor {
  id: string;
  name: string;
  type: 'weather' | 'season' | 'location' | 'time';
  impact: number;
  direction: 'positive' | 'negative' | 'neutral';
}

interface MoodPrediction {
  id: string;
  date: string;
  predictedMood: 'happy' | 'sad' | 'energetic' | 'calm' | 'stressed';
  confidence: number;
  factors: MoodFactor[];
  actualMood?: 'happy' | 'sad' | 'energetic' | 'calm' | 'stressed';
}

interface WeatherData {
  condition: string;
  temperature: number;
  humidity: number;
  season: string;
}

export default function AIMoodPrediction({ onCancel }: AIMoodPredictionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPredictionEnabled, setIsPredictionEnabled] = useState(true);

  const [moodPredictions, setMoodPredictions] = useState<MoodPrediction[]>([
    { 
      id: '1', 
      date: '2024-01-15', 
      predictedMood: 'happy', 
      confidence: 0.85, 
      factors: [
        { id: '1', name: 'Sunny Weather', type: 'weather', impact: 0.3, direction: 'positive' },
        { id: '2', name: 'Summer Season', type: 'season', impact: 0.2, direction: 'positive' },
        { id: '3', name: 'Beach Location', type: 'location', impact: 0.4, direction: 'positive' },
      ],
      actualMood: 'happy'
    },
    { 
      id: '2', 
      date: '2024-02-20', 
      predictedMood: 'calm', 
      confidence: 0.78, 
      factors: [
        { id: '1', name: 'Rainy Weather', type: 'weather', impact: 0.25, direction: 'neutral' },
        { id: '2', name: 'Winter Season', type: 'season', impact: 0.2, direction: 'neutral' },
        { id: '3', name: 'Home Location', type: 'location', impact: 0.3, direction: 'positive' },
      ],
      actualMood: 'calm'
    },
  ]);

  const [currentWeather, setCurrentWeather] = useState<WeatherData>({
    condition: 'Sunny',
    temperature: 25,
    humidity: 60,
    season: 'Summer',
  });

  const predictMood = () => {
    const moods: Array<'happy' | 'sad' | 'energetic' | 'calm' | 'stressed'> = ['happy', 'sad', 'energetic', 'calm', 'stressed'];
    const newPrediction: MoodPrediction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      predictedMood: moods[Math.floor(Math.random() * moods.length)],
      confidence: Math.random() * 0.2 + 0.7,
      factors: [
        { id: '1', name: `${currentWeather.condition} Weather`, type: 'weather', impact: Math.random() * 0.3 + 0.2, direction: currentWeather.condition === 'Sunny' ? 'positive' : 'neutral' },
        { id: '2', name: `${currentWeather.season} Season`, type: 'season', impact: Math.random() * 0.2 + 0.1, direction: 'neutral' },
        { id: '3', name: 'Current Location', type: 'location', impact: Math.random() * 0.3 + 0.2, direction: 'positive' },
      ],
    };
    setMoodPredictions([...moodPredictions, newPrediction]);
  };

  const recordActualMood = (id: string, mood: 'happy' | 'sad' | 'energetic' | 'calm' | 'stressed') => {
    setMoodPredictions(moodPredictions.map(prediction => 
      prediction.id === id ? { ...prediction, actualMood: mood } : prediction
    ));
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'sad': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'energetic': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'calm': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'stressed': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'positive': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'negative': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'neutral': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getFactorIcon = (type: string) => {
    switch (type) {
      case 'weather': return <CloudSun className="h-4 w-4" />;
      case 'season': return <Snowflake className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'time': return <Thermometer className="h-4 w-4" />;
      default: return <Smile className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
            <Smile className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Mood Prediction
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Predict mood based on context
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isPredictionEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isPredictionEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Predictions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{moodPredictions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accuracy</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{((moodPredictions.filter(p => p.predictedMood === p.actualMood).length / moodPredictions.length) * 100).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Confidence</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(moodPredictions.reduce((acc, p) => acc + p.confidence, 0) / moodPredictions.length).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Factors</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{moodPredictions.reduce((acc, p) => acc + p.factors.length, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isPredictionEnabled}
              onChange={(e) => setIsPredictionEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Prediction</span>
          </div>
          <button
            type="button"
            onClick={predictMood}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Smile className="h-3 w-3" />
            Predict Mood
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Current Context</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <CloudSun className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-slate-900 dark:text-white">Weather</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{currentWeather.condition}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Thermometer className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-slate-900 dark:text-white">Temperature</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{currentWeather.temperature}°C</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Snowflake className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Season</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{currentWeather.season}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mood Predictions</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {moodPredictions.map((prediction) => (
              <div key={prediction.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Smile className="h-4 w-4 text-yellow-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{prediction.date}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getMoodColor(prediction.predictedMood)}`}>
                          {prediction.predictedMood}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{(prediction.confidence * 100).toFixed(0)}% confidence</span>
                      </div>
                      {prediction.actualMood && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Actual: <span className={`px-2 py-0.5 rounded ${getMoodColor(prediction.actualMood)}`}>{prediction.actualMood}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Factors:</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.factors.map((factor) => (
                      <span key={factor.id} className={`px-2 py-0.5 rounded text-xs ${getDirectionColor(factor.direction)}`}>
                        {factor.name} ({(factor.impact * 100).toFixed(0)}%)
                      </span>
                    ))}
                  </div>
                </div>
                {!prediction.actualMood && (
                  <div className="flex gap-1">
                    {['happy', 'sad', 'energetic', 'calm', 'stressed'].map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => recordActualMood(prediction.id, mood as any)}
                        className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mood Prediction Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Predicts mood based on weather, season, location, time</li>
              <li>• Analyzes impact factors with confidence scores</li>
              <li>• Record actual mood to improve accuracy</li>
              <li>• Track prediction accuracy over time</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
