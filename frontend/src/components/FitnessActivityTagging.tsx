'use client';

import { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Info,
  MapPin,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  TrendingUp
} from 'lucide-react';

interface FitnessActivityTaggingProps {
  onCancel?: () => void;
}

interface FitnessActivity {
  id: string;
  memoryId: string;
  memoryTitle: string;
  activityType: 'running' | 'walking' | 'cycling' | 'swimming' | 'gym' | 'yoga' | 'hiking' | 'sports' | 'other';
  duration: number;
  intensity: 'low' | 'moderate' | 'high' | 'intense';
  calories: number;
  distance?: number;
  heartRate?: number;
  timestamp: string;
  deviceId: string;
  deviceName: string;
}

interface ActivitySettings {
  autoTag: boolean;
  tagOnDetection: boolean;
  intensityTracking: boolean;
  heartRateTracking: boolean;
  distanceTracking: boolean;
  syncWithHealth: boolean;
}

export default function FitnessActivityTagging({ onCancel }: FitnessActivityTaggingProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTaggingEnabled, setIsTaggingEnabled] = useState(true);

  const [fitnessActivities, setFitnessActivities] = useState<FitnessActivity[]>([
    { id: '1', memoryId: 'mem1', memoryTitle: 'Morning Run', activityType: 'running', duration: 30, intensity: 'high', calories: 320, distance: 5.2, heartRate: 145, timestamp: '2024-01-17 07:00', deviceId: '1', deviceName: 'Apple Watch' },
    { id: '2', memoryId: 'mem2', memoryTitle: 'Yoga Session', activityType: 'yoga', duration: 45, intensity: 'low', calories: 180, heartRate: 85, timestamp: '2024-01-16 18:00', deviceId: '2', deviceName: 'Galaxy Watch' },
    { id: '3', memoryId: 'mem3', memoryTitle: 'Cycling Trip', activityType: 'cycling', duration: 60, intensity: 'moderate', calories: 450, distance: 15.8, heartRate: 120, timestamp: '2024-01-15 10:00', deviceId: '1', deviceName: 'Apple Watch' },
  ]);

  const [activitySettings, setActivitySettings] = useState<ActivitySettings>({
    autoTag: true,
    tagOnDetection: true,
    intensityTracking: true,
    heartRateTracking: true,
    distanceTracking: true,
    syncWithHealth: true,
  });

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'running': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'walking': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'cycling': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'swimming': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
      case 'gym': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'yoga': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'hiking': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
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

  const tagActivity = () => {
    const newActivity: FitnessActivity = {
      id: Date.now().toString(),
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Fitness Activity',
      activityType: 'running',
      duration: Math.floor(Math.random() * 30) + 20,
      intensity: 'moderate',
      calories: Math.floor(Math.random() * 200) + 150,
      distance: parseFloat((Math.random() * 5 + 2).toFixed(1)),
      heartRate: Math.floor(Math.random() * 40) + 100,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      deviceId: '1',
      deviceName: 'Apple Watch',
    };
    setFitnessActivities([...fitnessActivities, newActivity]);
  };

  const deleteActivity = (id: string) => {
    setFitnessActivities(fitnessActivities.filter(activity => activity.id !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Fitness Activity Tagging
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gắn thẻ hoạt động thể chất vào kỷ niệm
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{fitnessActivities.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Time</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{fitnessActivities.reduce((acc, a) => acc + a.duration, 0)}min</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Calories</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{fitnessActivities.reduce((acc, a) => acc + a.calories, 0)}kcal</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Top Activity</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 capitalize">{fitnessActivities.length > 0 ? fitnessActivities[0].activityType : 'None'}</p>
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
            onClick={tagActivity}
            className="px-3 py-1.5 rounded-lg text-xs bg-orange-600 hover:bg-orange-700 text-white border-0 flex items-center gap-1"
          >
            <Activity className="h-3 w-3" />
            Tag Activity
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Activity Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Tag</span>
              </div>
              <input
                type="checkbox"
                checked={activitySettings.autoTag}
                onChange={(e) => setActivitySettings({ ...activitySettings, autoTag: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Tag on Detection</span>
              </div>
              <input
                type="checkbox"
                checked={activitySettings.tagOnDetection}
                onChange={(e) => setActivitySettings({ ...activitySettings, tagOnDetection: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Intensity Tracking</span>
              </div>
              <input
                type="checkbox"
                checked={activitySettings.intensityTracking}
                onChange={(e) => setActivitySettings({ ...activitySettings, intensityTracking: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Heart Rate Tracking</span>
              </div>
              <input
                type="checkbox"
                checked={activitySettings.heartRateTracking}
                onChange={(e) => setActivitySettings({ ...activitySettings, heartRateTracking: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Distance Tracking</span>
              </div>
              <input
                type="checkbox"
                checked={activitySettings.distanceTracking}
                onChange={(e) => setActivitySettings({ ...activitySettings, distanceTracking: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">RefreshCcw with Health</span>
              </div>
              <input
                type="checkbox"
                checked={activitySettings.syncWithHealth}
                onChange={(e) => setActivitySettings({ ...activitySettings, syncWithHealth: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Fitness Activities</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {fitnessActivities.map((activity) => (
              <div key={activity.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Activity className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{activity.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getActivityColor(activity.activityType)}`}>
                          {activity.activityType}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getIntensityColor(activity.intensity)}`}>
                          {activity.intensity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.deviceName} • {activity.timestamp}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteActivity(activity.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Duration: {activity.duration}min</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Calories: {activity.calories}kcal</span>
                  {activity.distance && <span className="text-xs text-slate-500 dark:text-slate-400">Distance: {activity.distance}km</span>}
                  {activity.heartRate && <span className="text-xs text-slate-500 dark:text-slate-400">HR: {activity.heartRate}bpm</span>}
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {activity.memoryId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Fitness Activity Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Auto-tag fitness activities to memories</li>
              <li>• Activity types: running/walking/cycling/swimming/gym/yoga/hiking/sports</li>
              <li>• Track intensity: low/moderate/high/intense</li>
              <li>• RefreshCcw with health apps for comprehensive data</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
