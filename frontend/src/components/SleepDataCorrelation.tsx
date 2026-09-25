'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Bed,
  Calendar,
  CheckCircle,
  Clock,
  Info,
  Moon,
  RefreshCw,
  Settings,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface SleepDataCorrelationProps {
  onCancel?: () => void;
}

interface SleepData {
  id: string;
  memoryId: string;
  memoryTitle: string;
  sleepHours: number;
  sleepQuality: 'poor' | 'fair' | 'good' | 'excellent';
  deepSleep: number;
  remSleep: number;
  wakeTime: string;
  bedTime: string;
  deviceId: string;
  deviceName: string;
}

interface SleepStats {
  averageSleep: number;
  maxSleep: number;
  minSleep: number;
  averageQuality: string;
  qualityDistribution: {
    poor: number;
    fair: number;
    good: number;
    excellent: number;
  };
}

interface SleepSettings {
  autoRecord: boolean;
  recordingInterval: number;
  sleepGoal: number;
  syncWithHealth: boolean;
  showInMemory: boolean;
  analyzeCorrelation: boolean;
}

export default function SleepDataCorrelation({ onCancel }: SleepDataCorrelationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSleepEnabled, setIsSleepEnabled] = useState(true);

  const [sleepData, setSleepData] = useState<SleepData[]>([
    { id: '1', memoryId: 'mem1', memoryTitle: 'Productive Day', sleepHours: 7.5, sleepQuality: 'good', deepSleep: 2.1, remSleep: 1.8, wakeTime: '07:00', bedTime: '23:30', deviceId: '1', deviceName: 'Apple Watch' },
    { id: '2', memoryId: 'mem2', memoryTitle: 'Tired Morning', sleepHours: 5.2, sleepQuality: 'poor', deepSleep: 1.2, remSleep: 1.0, wakeTime: '06:30', bedTime: '01:15', deviceId: '2', deviceName: 'Galaxy Watch' },
    { id: '3', memoryId: 'mem3', memoryTitle: 'Great Mood', sleepHours: 8.2, sleepQuality: 'excellent', deepSleep: 2.5, remSleep: 2.2, wakeTime: '07:30', bedTime: '23:15', deviceId: '1', deviceName: 'Apple Watch' },
  ]);

  const [sleepStats, setSleepStats] = useState<SleepStats>({
    averageSleep: 7.0,
    maxSleep: 9.5,
    minSleep: 4.0,
    averageQuality: 'good',
    qualityDistribution: {
      poor: 3,
      fair: 5,
      good: 12,
      excellent: 8,
    },
  });

  const [sleepSettings, setSleepSettings] = useState<SleepSettings>({
    autoRecord: true,
    recordingInterval: 60,
    sleepGoal: 8,
    syncWithHealth: true,
    showInMemory: true,
    analyzeCorrelation: true,
  });

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'good': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'fair': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'poor': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const recordSleep = () => {
    const newData: SleepData = {
      id: Date.now().toString(),
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Sleep Record',
      sleepHours: parseFloat((Math.random() * 4 + 5).toFixed(1)),
      sleepQuality: 'good',
      deepSleep: parseFloat((Math.random() * 1.5 + 1.5).toFixed(1)),
      remSleep: parseFloat((Math.random() * 1.5 + 1.5).toFixed(1)),
      wakeTime: '07:00',
      bedTime: '23:00',
      deviceId: '1',
      deviceName: 'Apple Watch',
    };
    setSleepData([...sleepData, newData]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl">
            <Moon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Sleep Data Correlation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tương quan dữ liệu giấc ngủ với tâm trạng
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isSleepEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isSleepEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Average Sleep</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{sleepStats.averageSleep}h</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Max Sleep</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{sleepStats.maxSleep}h</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Min Sleep</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{sleepStats.minSleep}h</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Gauge</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400 capitalize">{sleepStats.averageQuality}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isSleepEnabled}
              onChange={(e) => setIsSleepEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Sleep Tracking</span>
          </div>
          <button
            type="button"
            onClick={recordSleep}
            className="px-3 py-1.5 rounded-lg text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-0 flex items-center gap-1"
          >
            <Moon className="h-3 w-3" />
            Record Now
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sleep Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Record</span>
              </div>
              <input
                type="checkbox"
                checked={sleepSettings.autoRecord}
                onChange={(e) => setSleepSettings({ ...sleepSettings, autoRecord: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Recording Interval (min)</span>
              </div>
              <input
                type="number"
                value={sleepSettings.recordingInterval}
                onChange={(e) => setSleepSettings({ ...sleepSettings, recordingInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Bed className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sleep Goal (hours)</span>
              </div>
              <input
                type="number"
                value={sleepSettings.sleepGoal}
                onChange={(e) => setSleepSettings({ ...sleepSettings, sleepGoal: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">RefreshCcw with Health</span>
              </div>
              <input
                type="checkbox"
                checked={sleepSettings.syncWithHealth}
                onChange={(e) => setSleepSettings({ ...sleepSettings, syncWithHealth: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Show in Memory</span>
              </div>
              <input
                type="checkbox"
                checked={sleepSettings.showInMemory}
                onChange={(e) => setSleepSettings({ ...sleepSettings, showInMemory: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Analyze Correlation</span>
              </div>
              <input
                type="checkbox"
                checked={sleepSettings.analyzeCorrelation}
                onChange={(e) => setSleepSettings({ ...sleepSettings, analyzeCorrelation: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Gauge Distribution</h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">
              <p className="text-xs text-red-700 dark:text-red-300 mb-1">Poor</p>
              <p className="text-lg font-bold text-red-700 dark:text-red-300">{sleepStats.qualityDistribution.poor}</p>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-center">
              <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">Fair</p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{sleepStats.qualityDistribution.fair}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Good</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{sleepStats.qualityDistribution.good}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
              <p className="text-xs text-green-700 dark:text-green-300 mb-1">Excellent</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">{sleepStats.qualityDistribution.excellent}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sleep Records</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sleepData.map((data) => (
              <div key={data.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <Moon className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{data.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getQualityColor(data.sleepQuality)}`}>
                          {data.sleepQuality}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{data.deviceName} • {data.bedTime} - {data.wakeTime}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{data.sleepHours}h</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Deep: {data.deepSleep}h</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">REM: {data.remSleep}h</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {data.memoryId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sleep Correlation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Auto-record sleep data when creating memories</li>
              <li>• Track sleep quality: poor/fair/good/excellent</li>
              <li>• Analyze correlation between sleep and mood</li>
              <li>• RefreshCcw with health apps for comprehensive data</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
