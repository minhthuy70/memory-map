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
  RefreshCw,
  Settings,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface HeartRateAtMemoryProps {
  onCancel?: () => void;
}

interface HeartRateData {
  id: string;
  memoryId: string;
  memoryTitle: string;
  heartRate: number;
  heartRateZone: 'resting' | 'fat_burn' | 'cardio' | 'peak';
  timestamp: string;
  deviceId: string;
  deviceName: string;
}

interface HeartRateStats {
  averageHeartRate: number;
  maxHeartRate: number;
  minHeartRate: number;
  restingHeartRate: number;
  zoneDistribution: {
    resting: number;
    fat_burn: number;
    cardio: number;
    peak: number;
  };
}

interface HeartRateSettings {
  autoRecord: boolean;
  recordingInterval: number;
  zoneAlerts: boolean;
  syncWithHealth: boolean;
  showInMemory: boolean;
}

export default function HeartRateAtMemory({ onCancel }: HeartRateAtMemoryProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isHeartRateEnabled, setIsHeartRateEnabled] = useState(true);

  const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([
    { id: '1', memoryId: 'mem1', memoryTitle: 'Summer Vacation', heartRate: 72, heartRateZone: 'resting', timestamp: '2024-01-17 18:30', deviceId: '1', deviceName: 'Apple Watch' },
    { id: '2', memoryId: 'mem2', memoryTitle: 'Morning Run', heartRate: 145, heartRateZone: 'cardio', timestamp: '2024-01-16 07:00', deviceId: '2', deviceName: 'Galaxy Watch' },
    { id: '3', memoryId: 'mem3', memoryTitle: 'Relaxing Evening', heartRate: 65, heartRateZone: 'resting', timestamp: '2024-01-15 20:00', deviceId: '1', deviceName: 'Apple Watch' },
  ]);

  const [heartRateStats, setHeartRateStats] = useState<HeartRateStats>({
    averageHeartRate: 94,
    maxHeartRate: 165,
    minHeartRate: 58,
    restingHeartRate: 62,
    zoneDistribution: {
      resting: 15,
      fat_burn: 8,
      cardio: 12,
      peak: 3,
    },
  });

  const [heartRateSettings, setHeartRateSettings] = useState<HeartRateSettings>({
    autoRecord: true,
    recordingInterval: 5,
    zoneAlerts: true,
    syncWithHealth: true,
    showInMemory: true,
  });

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'resting': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'fat_burn': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'cardio': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'peak': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'resting': return <Activity className="h-4 w-4" />;
      case 'fat_burn': return <TrendingUp className="h-4 w-4" />;
      case 'cardio': return <Heart className="h-4 w-4" />;
      case 'peak': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const recordHeartRate = () => {
    const newData: HeartRateData = {
      id: Date.now().toString(),
      memoryId: `mem${Date.now()}`,
      memoryTitle: 'New Memory',
      heartRate: Math.floor(Math.random() * 40) + 60,
      heartRateZone: 'resting',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      deviceId: '1',
      deviceName: 'Apple Watch',
    };
    setHeartRateData([...heartRateData, newData]);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-xl">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Heart Rate at Memory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lưu nhịp tim tại thời điểm tạo kỷ niệm
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isHeartRateEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isHeartRateEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{heartRateStats.averageHeartRate} BPM</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Max</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{heartRateStats.maxHeartRate} BPM</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Min</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{heartRateStats.minHeartRate} BPM</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Resting</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{heartRateStats.restingHeartRate} BPM</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isHeartRateEnabled}
              onChange={(e) => setIsHeartRateEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Heart Rate</span>
          </div>
          <button
            type="button"
            onClick={recordHeartRate}
            className="px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white border-0 flex items-center gap-1"
          >
            <Heart className="h-3 w-3" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Heart Rate Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-red-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Record</span>
              </div>
              <input
                type="checkbox"
                checked={heartRateSettings.autoRecord}
                onChange={(e) => setHeartRateSettings({ ...heartRateSettings, autoRecord: e.target.checked })}
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
                value={heartRateSettings.recordingInterval}
                onChange={(e) => setHeartRateSettings({ ...heartRateSettings, recordingInterval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Zone Alerts</span>
              </div>
              <input
                type="checkbox"
                checked={heartRateSettings.zoneAlerts}
                onChange={(e) => setHeartRateSettings({ ...heartRateSettings, zoneAlerts: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">RefreshCcw with Health</span>
              </div>
              <input
                type="checkbox"
                checked={heartRateSettings.syncWithHealth}
                onChange={(e) => setHeartRateSettings({ ...heartRateSettings, syncWithHealth: e.target.checked })}
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
                checked={heartRateSettings.showInMemory}
                onChange={(e) => setHeartRateSettings({ ...heartRateSettings, showInMemory: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Zone Distribution</h4>
          <div className="grid grid-cols-4 gap-2">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
              <p className="text-xs text-blue-700 dark:text-blue-300 mb-1">Resting</p>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{heartRateStats.zoneDistribution.resting}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
              <p className="text-xs text-green-700 dark:text-green-300 mb-1">Fat Burn</p>
              <p className="text-lg font-bold text-green-700 dark:text-green-300">{heartRateStats.zoneDistribution.fat_burn}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-center">
              <p className="text-xs text-orange-700 dark:text-orange-300 mb-1">Cardio</p>
              <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{heartRateStats.zoneDistribution.cardio}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg text-center">
              <p className="text-xs text-red-700 dark:text-red-300 mb-1">Peak</p>
              <p className="text-lg font-bold text-red-700 dark:text-red-300">{heartRateStats.zoneDistribution.peak}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Heart Rate Records</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {heartRateData.map((data) => (
              <div key={data.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Heart className="h-4 w-4 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{data.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getZoneColor(data.heartRateZone)}`}>
                          {data.heartRateZone}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{data.deviceName} • {data.timestamp}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">{data.heartRate} BPM</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {data.memoryId}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Heart Rate Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Auto-record heart rate when creating memories</li>
              <li>• Track heart rate zones: resting/fat burn/cardio/peak</li>
              <li>• RefreshCcw with health apps for comprehensive data</li>
              <li>• View heart rate context in memory details</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
