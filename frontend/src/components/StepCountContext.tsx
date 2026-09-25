'use client';

import { useState } from 'react';
import { Footprints, X, RefreshCw, Info, Settings, TrendingUp, TrendingDown, CheckCircle, AlertCircle, Clock, Calendar, Activity } from 'lucide-react';

interface StepCountContextProps {
  onCancel?: () => void;
}

interface StepData {
  id: string;
  memoryId: string;
  memoryTitle: string;
  stepCount: number;
  distance: number;
  calories: number;
  timestamp: string;
  deviceId: string;
  deviceName: string;
}

interface StepStats {
  averageSteps: number;
  maxSteps: number;
  minSteps: number;
  totalSteps: number;
  totalDistance: number;
  totalCalories: number;
}

interface StepSettings {
  autoRecord: boolean;
  recordingInterval: number;
  stepGoal: number;
  distanceUnit: 'km' | 'miles';
  syncWithHealth: boolean;
  showInMemory: boolean;
}

export default function StepCountContext({ onCancel }: StepCountContextProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isStepCountEnabled, setIsStepCountEnabled] = useState(true);

  const [stepData, setStepData] = useState<StepData[]>([
    { id: '1', memoryId: 'mem1', memoryTitle: 'Morning Walk', stepCount: 3542, distance: 2.4, calories: 180, timestamp: '2024-01-17 07:30', deviceId: '1', deviceName: 'Apple Watch' },
    { id: '2', memoryId: 'mem2', memoryTitle: 'Afternoon Run', stepCount: 8921, distance: 6.8, calories: 520, timestamp: '2024-01-16 17:00', deviceId: '2', deviceName: 'Galaxy Watch' },
    { id: '3', memoryId: 'mem3', memoryTitle: 'Evening Stroll', stepCount: 2105, distance: 1.5, calories: 95, timestamp: '2024-01-15 20:00', deviceId: '1', deviceName: 'Apple Watch' },
  ]);

  const [stepStats, setStepStats] = useState<StepStats>({
    averageSteps: 4856,
    maxSteps: 12450,
    minSteps: 890,
    totalSteps: 14568,
    totalDistance: 10.7,
    totalCalories: 795,
  });

  const [stepSettings, setStepSettings] = useState<StepSettings>({
    autoRecord: true,
    recordingInterval: 15,
    stepGoal: 10000,
    distanceUnit: 'km',
    syncWithHealth: true,
    showInMemory: true,
  });

  const recordSteps = () => {
    const newData: StepData = {
      id: Date.now().toString(),
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Activity',
      stepCount: Math.floor(Math.random() * 5000) + 2000,
      distance: parseFloat((Math.random() * 5 + 1).toFixed(1)),
      calories: Math.floor(Math.random() * 300) + 100,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      deviceId: '1',
      deviceName: 'Apple Watch',
    };
    setStepData([...stepData, newData]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl">
            <Footprints className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Step Count Context
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ngữ cảnh số bước chân hàng ngày
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isStepCountEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isStepCountEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Average</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stepStats.averageSteps.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Max</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stepStats.maxSteps.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Distance</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{stepStats.totalDistance} km</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Calories</p>
            <p className="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-400">{stepStats.totalCalories} kcal</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isStepCountEnabled}
              onChange={(e) => setIsStepCountEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Step Count</span>
          </div>
          <button
            type="button"
            onClick={recordSteps}
            className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1"
          >
            <Footprints className="h-3 w-3" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Step Count Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Record</span>
              </div>
              <input
                type="checkbox"
                checked={stepSettings.autoRecord}
                onChange={(e) => setStepSettings({ ...stepSettings, autoRecord: e.target.checked })}
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
                value={stepSettings.recordingInterval}
                onChange={(e) => setStepSettings({ ...stepSettings, recordingInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Step Goal</span>
              </div>
              <input
                type="number"
                value={stepSettings.stepGoal}
                onChange={(e) => setStepSettings({ ...stepSettings, stepGoal: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Distance Unit</span>
              </div>
              <select
                value={stepSettings.distanceUnit}
                onChange={(e) => setStepSettings({ ...stepSettings, distanceUnit: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="km">Kilometers</option>
                <option value="miles">Miles</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Footprints className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sync with Health</span>
              </div>
              <input
                type="checkbox"
                checked={stepSettings.syncWithHealth}
                onChange={(e) => setStepSettings({ ...stepSettings, syncWithHealth: e.target.checked })}
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
                checked={stepSettings.showInMemory}
                onChange={(e) => setStepSettings({ ...stepSettings, showInMemory: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Step Count Records</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {stepData.map((data) => (
              <div key={data.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Footprints className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{data.memoryTitle}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{data.deviceName} • {data.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{data.stepCount.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Distance: {data.distance} km</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Calories: {data.calories} kcal</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {data.memoryId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Step Count Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Auto-record step count when creating memories</li>
              <li>• Track distance and calories burned</li>
              <li>• Set daily step goals for motivation</li>
              <li>• Sync with health apps for comprehensive data</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
