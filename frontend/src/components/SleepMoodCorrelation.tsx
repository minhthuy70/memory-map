'use client';

import { useState } from 'react';
import { Moon, X, RefreshCw, Info, Smile, Activity, TrendingUp, Calendar, Star, Clock, Bed } from 'lucide-react';

interface SleepMoodCorrelationProps {
  onCancel?: () => void;
}

interface SleepEntry {
  id: string;
  date: string;
  hours: number;
  quality: number;
  bedtime: string;
  wakeTime: string;
  disturbances: number;
}

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
}

interface CorrelationData {
  date: string;
  sleepHours: number;
  sleepQuality: number;
  mood: number;
  energy: number;
  stress: number;
  correlation: number;
}

interface CorrelationSettings {
  dateRange: 'week' | 'month' | 'quarter' | 'year';
  autoCorrelate: boolean;
  includeWeekends: boolean;
}

export default function SleepMoodCorrelation({ onCancel }: SleepMoodCorrelationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCorrelationEnabled, setIsCorrelationEnabled] = useState(true);

  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([
    { id: '1', date: '2024-01-17', hours: 7.5, quality: 8, bedtime: '23:00', wakeTime: '06:30', disturbances: 1 },
    { id: '2', date: '2024-01-16', hours: 6.5, quality: 6, bedtime: '00:30', wakeTime: '07:00', disturbances: 2 },
    { id: '3', date: '2024-01-15', hours: 8, quality: 9, bedtime: '22:30', wakeTime: '06:30', disturbances: 0 },
    { id: '4', date: '2024-01-14', hours: 7, quality: 7, bedtime: '23:30', wakeTime: '06:30', disturbances: 1 },
    { id: '5', date: '2024-01-13', hours: 5.5, quality: 5, bedtime: '01:00', wakeTime: '06:30', disturbances: 3 },
  ]);

  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: '1', date: '2024-01-17', mood: 8, energy: 7, stress: 3 },
    { id: '2', date: '2024-01-16', mood: 5, energy: 4, stress: 7 },
    { id: '3', date: '2024-01-15', mood: 9, energy: 8, stress: 2 },
    { id: '4', date: '2024-01-14', mood: 7, energy: 6, stress: 4 },
    { id: '5', date: '2024-01-13', mood: 4, energy: 3, stress: 8 },
  ]);

  const [correlationSettings, setCorrelationSettings] = useState<CorrelationSettings>({
    dateRange: 'week',
    autoCorrelate: true,
    includeWeekends: true,
  });

  const [currentSleep, setCurrentSleep] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 7,
    quality: 7,
    bedtime: '23:00',
    wakeTime: '06:30',
    disturbances: 1,
  });

  const [currentMood, setCurrentMood] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: 7,
    energy: 7,
    stress: 4,
  });

  const addSleepEntry = () => {
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: currentSleep.date,
      hours: currentSleep.hours,
      quality: currentSleep.quality,
      bedtime: currentSleep.bedtime,
      wakeTime: currentSleep.wakeTime,
      disturbances: currentSleep.disturbances,
    };
    setSleepEntries([...sleepEntries, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentSleep({
      date: new Date().toISOString().split('T')[0],
      hours: 7,
      quality: 7,
      bedtime: '23:00',
      wakeTime: '06:30',
      disturbances: 1,
    });
  };

  const addMoodEntry = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: currentMood.date,
      mood: currentMood.mood,
      energy: currentMood.energy,
      stress: currentMood.stress,
    };
    setMoodEntries([...moodEntries, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentMood({
      date: new Date().toISOString().split('T')[0],
      mood: 7,
      energy: 7,
      stress: 4,
    });
  };

  const getCorrelationData = (): CorrelationData[] => {
    return sleepEntries.map(sleep => {
      const mood = moodEntries.find(m => m.date === sleep.date);
      const correlation = mood ? (sleep.hours * sleep.quality * 0.1 + mood.mood * 0.3) / 2 : 0;
      return {
        date: sleep.date,
        sleepHours: sleep.hours,
        sleepQuality: sleep.quality,
        mood: mood?.mood || 0,
        energy: mood?.energy || 0,
        stress: mood?.stress || 0,
        correlation: Math.round(correlation * 10) / 10,
      };
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-600 dark:text-green-400';
    if (score >= 5) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const correlationData = getCorrelationData();
  const avgSleepHours = sleepEntries.reduce((acc, e) => acc + e.hours, 0) / sleepEntries.length;
  const avgMood = moodEntries.reduce((acc, e) => acc + e.mood, 0) / moodEntries.length;
  const avgCorrelation = correlationData.reduce((acc, e) => acc + e.correlation, 0) / correlationData.length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Moon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Sleep & Mood Correlation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Analyze sleep patterns and mood relationship
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCorrelationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCorrelationEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Sleep</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{avgSleepHours.toFixed(1)}h</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Mood</p>
            <p className={`text-lg font-bold ${getScoreColor(avgMood)}`}>{avgMood.toFixed(1)}/10</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Correlation</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{avgCorrelation.toFixed(1)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Entries</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{correlationData.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCorrelationEnabled}
              onChange={(e) => setIsCorrelationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Correlation</span>
          </div>
          <button
            type="button"
            onClick={addSleepEntry}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Bed className="h-3 w-3" />
            Log Sleep
          </button>
          <button
            type="button"
            onClick={addMoodEntry}
            className="px-3 py-1.5 rounded-lg text-xs bg-pink-600 hover:bg-pink-700 text-white border-0 flex items-center gap-1"
          >
            <Smile className="h-3 w-3" />
            Log Mood
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sleep Input</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Date</span>
              </div>
              <input
                type="date"
                value={currentSleep.date}
                onChange={(e) => setCurrentSleep({ ...currentSleep, date: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={currentSleep.hours}
                  onChange={(e) => setCurrentSleep({ ...currentSleep, hours: parseFloat(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{currentSleep.hours}h</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentSleep.quality}
                  onChange={(e) => setCurrentSleep({ ...currentSleep, quality: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className={`text-xs font-bold ${getScoreColor(currentSleep.quality)}`}>{currentSleep.quality}/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Bedtime</span>
              </div>
              <input
                type="time"
                value={currentSleep.bedtime}
                onChange={(e) => setCurrentSleep({ ...currentSleep, bedtime: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Wake Time</span>
              </div>
              <input
                type="time"
                value={currentSleep.wakeTime}
                onChange={(e) => setCurrentSleep({ ...currentSleep, wakeTime: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mood Input</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Date</span>
              </div>
              <input
                type="date"
                value={currentMood.date}
                onChange={(e) => setCurrentMood({ ...currentMood, date: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Smile className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mood</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood.mood}
                  onChange={(e) => setCurrentMood({ ...currentMood, mood: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className={`text-xs font-bold ${getScoreColor(currentMood.mood)}`}>{currentMood.mood}/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Energy</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood.energy}
                  onChange={(e) => setCurrentMood({ ...currentMood, energy: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className={`text-xs font-bold ${getScoreColor(currentMood.energy)}`}>{currentMood.energy}/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Stress</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentMood.stress}
                  onChange={(e) => setCurrentMood({ ...currentMood, stress: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className={`text-xs font-bold ${getScoreColor(11 - currentMood.stress)}`}>{currentMood.stress}/10</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Correlation Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Date Range</span>
              </div>
              <select
                value={correlationSettings.dateRange}
                onChange={(e) => setCorrelationSettings({ ...correlationSettings, dateRange: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Correlate</span>
              </div>
              <input
                type="checkbox"
                checked={correlationSettings.autoCorrelate}
                onChange={(e) => setCorrelationSettings({ ...correlationSettings, autoCorrelate: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sleep & Mood Correlation</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {correlationData.map((data) => (
              <div key={data.date} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Moon className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{data.date}</span>
                  </div>
                  <span className={`text-xs font-bold ${getScoreColor(data.correlation)}`}>
                    Correlation: {data.correlation}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sleep</p>
                    <p className={`text-xs font-bold ${getScoreColor(data.sleepHours / 10)}`}>{data.sleepHours}h ({data.sleepQuality}/10)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mood</p>
                    <p className={`text-xs font-bold ${getScoreColor(data.mood)}`}>{data.mood}/10</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Energy</p>
                    <p className={`text-xs font-bold ${getScoreColor(data.energy)}`}>{data.energy}/10</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sleep & Mood Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Track sleep hours, quality, and timing</li>
              <li>• Log mood, energy, and stress levels</li>
              <li>• Analyze correlation between sleep and mood</li>
              <li>• Identify patterns to improve sleep hygiene</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
