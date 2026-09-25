'use client';

import { useState } from 'react';
import { Dumbbell, X, RefreshCw, Info, Activity, Flame, Clock, Target, Star, MapPin, Zap } from 'lucide-react';

interface ExerciseMemoryTaggingProps {
  onCancel?: () => void;
}

interface ExerciseMemory {
  id: string;
  memoryId: string;
  memoryTitle: string;
  memoryDate: string;
  activityType: 'running' | 'walking' | 'cycling' | 'swimming' | 'gym' | 'yoga' | 'hiking' | 'sports' | 'other';
  duration: number;
  intensity: 'low' | 'moderate' | 'high' | 'intense';
  calories: number;
  distance?: number;
  heartRate?: number;
  notes?: string;
  taggedAt: string;
}

interface ExerciseStats {
  totalActivities: number;
  totalDuration: number;
  totalCalories: number;
  avgIntensity: string;
  topActivity: string;
}

interface ExerciseSettings {
  autoTag: boolean;
  includeInMemories: boolean;
  syncWithHealth: boolean;
  defaultIntensity: 'low' | 'moderate' | 'high' | 'intense';
}

export default function ExerciseMemoryTagging({ onCancel }: ExerciseMemoryTaggingProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTaggingEnabled, setIsTaggingEnabled] = useState(true);

  const [exerciseMemories, setExerciseMemories] = useState<ExerciseMemory[]>([
    { id: '1', memoryId: 'mem_1', memoryTitle: 'Morning run in the park', memoryDate: '2024-01-17', activityType: 'running', duration: 30, intensity: 'moderate', calories: 300, distance: 5, heartRate: 140, notes: 'Great morning run', taggedAt: '2024-01-17' },
    { id: '2', memoryId: 'mem_2', memoryTitle: 'Gym workout', memoryDate: '2024-01-15', activityType: 'gym', duration: 45, intensity: 'high', calories: 400, heartRate: 155, notes: 'Leg day', taggedAt: '2024-01-15' },
    { id: '3', memoryId: 'mem_3', memoryTitle: 'Weekend hike', memoryDate: '2024-01-13', activityType: 'hiking', duration: 120, intensity: 'moderate', calories: 600, distance: 8, heartRate: 130, notes: 'Beautiful trail', taggedAt: '2024-01-13' },
  ]);

  const [exerciseSettings, setExerciseSettings] = useState<ExerciseSettings>({
    autoTag: false,
    includeInMemories: true,
    syncWithHealth: false,
    defaultIntensity: 'moderate',
  });

  const [currentExercise, setCurrentExercise] = useState({
    memoryId: '',
    memoryTitle: '',
    memoryDate: new Date().toISOString().split('T')[0],
    activityType: 'running' as 'running' | 'walking' | 'cycling' | 'swimming' | 'gym' | 'yoga' | 'hiking' | 'sports' | 'other',
    duration: 30,
    intensity: 'moderate' as 'low' | 'moderate' | 'high' | 'intense',
    calories: 300,
    distance: 5,
    heartRate: 140,
    notes: '',
  });

  const tagMemory = () => {
    const newTag: ExerciseMemory = {
      id: Date.now().toString(),
      memoryId: currentExercise.memoryId || 'mem_' + Date.now(),
      memoryTitle: currentExercise.memoryTitle || 'Untitled memory',
      memoryDate: currentExercise.memoryDate,
      activityType: currentExercise.activityType,
      duration: currentExercise.duration,
      intensity: currentExercise.intensity,
      calories: currentExercise.calories,
      distance: currentExercise.activityType === 'running' || currentExercise.activityType === 'cycling' || currentExercise.activityType === 'hiking' ? currentExercise.distance : undefined,
      heartRate: currentExercise.heartRate,
      notes: currentExercise.notes,
      taggedAt: new Date().toISOString().split('T')[0],
    };
    setExerciseMemories([...exerciseMemories, newTag].sort((a, b) => new Date(b.taggedAt).getTime() - new Date(a.taggedAt).getTime()));
    setCurrentExercise({
      memoryId: '',
      memoryTitle: '',
      memoryDate: new Date().toISOString().split('T')[0],
      activityType: 'running',
      duration: 30,
      intensity: 'moderate',
      calories: 300,
      distance: 5,
      heartRate: 140,
      notes: '',
    });
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'running': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'walking': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'cycling': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'swimming': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
      case 'gym': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'yoga': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'hiking': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      case 'sports': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'other': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'moderate': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'intense': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const exerciseStats: ExerciseStats = {
    totalActivities: exerciseMemories.length,
    totalDuration: exerciseMemories.reduce((acc, e) => acc + e.duration, 0),
    totalCalories: exerciseMemories.reduce((acc, e) => acc + e.calories, 0),
    avgIntensity: 'moderate',
    topActivity: 'running',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Exercise Memory Tagging
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tag memories with exercise activities
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isTaggingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isTaggingEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Activities</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{exerciseStats.totalActivities}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Time</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{exerciseStats.totalDuration}min</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Calories</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{exerciseStats.totalCalories}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Top Activity</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{exerciseStats.topActivity}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isTaggingEnabled}
              onChange={(e) => setIsTaggingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Tagging</span>
          </div>
          <button
            type="button"
            onClick={tagMemory}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Dumbbell className="h-3 w-3" />
            Tag Memory
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Tag Memory with Exercise</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory Title</span>
              </div>
              <input
                type="text"
                value={currentExercise.memoryTitle}
                onChange={(e) => setCurrentExercise({ ...currentExercise, memoryTitle: e.target.value })}
                placeholder="Enter memory title..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Activity Type</span>
              </div>
              <select
                value={currentExercise.activityType}
                onChange={(e) => setCurrentExercise({ ...currentExercise, activityType: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="running">Running</option>
                <option value="walking">Walking</option>
                <option value="cycling">Cycling</option>
                <option value="swimming">Swimming</option>
                <option value="gym">Gym</option>
                <option value="yoga">Yoga</option>
                <option value="hiking">Hiking</option>
                <option value="sports">Sports</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Duration (min)</span>
              </div>
              <input
                type="number"
                value={currentExercise.duration}
                onChange={(e) => setCurrentExercise({ ...currentExercise, duration: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Intensity</span>
              </div>
              <select
                value={currentExercise.intensity}
                onChange={(e) => setCurrentExercise({ ...currentExercise, intensity: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="intense">Intense</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Flame className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Calories</span>
              </div>
              <input
                type="number"
                value={currentExercise.calories}
                onChange={(e) => setCurrentExercise({ ...currentExercise, calories: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            {(currentExercise.activityType === 'running' || currentExercise.activityType === 'cycling' || currentExercise.activityType === 'hiking') && (
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span className="text-xs text-slate-900 dark:text-white">Distance (km)</span>
                </div>
                <input
                  type="number"
                  value={currentExercise.distance}
                  onChange={(e) => setCurrentExercise({ ...currentExercise, distance: parseFloat(e.target.value) })}
                  className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
                />
              </div>
            )}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Heart Rate (bpm)</span>
              </div>
              <input
                type="number"
                value={currentExercise.heartRate}
                onChange={(e) => setCurrentExercise({ ...currentExercise, heartRate: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Notes</span>
              </div>
              <textarea
                value={currentExercise.notes}
                onChange={(e) => setCurrentExercise({ ...currentExercise, notes: e.target.value })}
                placeholder="Exercise notes..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Exercise Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Tag</span>
              </div>
              <input
                type="checkbox"
                checked={exerciseSettings.autoTag}
                onChange={(e) => setExerciseSettings({ ...exerciseSettings, autoTag: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include in Memories</span>
              </div>
              <input
                type="checkbox"
                checked={exerciseSettings.includeInMemories}
                onChange={(e) => setExerciseSettings({ ...exerciseSettings, includeInMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sync with Health</span>
              </div>
              <input
                type="checkbox"
                checked={exerciseSettings.syncWithHealth}
                onChange={(e) => setExerciseSettings({ ...exerciseSettings, syncWithHealth: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Exercise-Tagged Memories</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {exerciseMemories.map((tag) => (
              <div key={tag.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Dumbbell className="h-4 w-4 text-orange-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{tag.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getActivityColor(tag.activityType)}`}>
                          {tag.activityType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getIntensityColor(tag.intensity)}`}>
                          {tag.intensity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{tag.memoryDate} • Tagged: {tag.taggedAt}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{tag.duration}min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Calories</p>
                    <p className="text-xs font-bold text-red-600 dark:text-red-400">{tag.calories}</p>
                  </div>
                  {tag.distance && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Distance</p>
                      <p className="text-xs font-bold text-amber-600 dark:text-amber-400">{tag.distance}km</p>
                    </div>
                  )}
                  {tag.heartRate && (
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Heart Rate</p>
                      <p className="text-xs font-bold text-pink-600 dark:text-pink-400">{tag.heartRate}bpm</p>
                    </div>
                  )}
                </div>
                {tag.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">{tag.notes}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Exercise Tagging Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Tag memories with exercise activities</li>
              <li>• Activity types: running, walking, cycling, swimming, gym, yoga, hiking, sports</li>
              <li>• Track duration, intensity, calories, distance, and heart rate</li>
              <li>• Auto-tag and sync with health apps</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
