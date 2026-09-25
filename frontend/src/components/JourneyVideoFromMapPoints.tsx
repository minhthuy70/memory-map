'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  Download,
  Info,
  Map,
  Play,
  RefreshCw,
  Route,
  Star,
  Zap
} from 'lucide-react';

interface JourneyVideoFromMapPointsProps {
  onCancel?: () => void;
}

interface MapPoint {
  id: string;
  name: string;
  location: string;
  memoryCount: number;
  visitedAt: string;
}

interface JourneyVideo {
  id: string;
  title: string;
  duration: number;
  points: MapPoint[];
  style: 'satellite' | 'street' | 'terrain' | 'hybrid';
  music: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

interface JourneySettings {
  autoGenerate: boolean;
  defaultStyle: 'satellite' | 'street' | 'terrain' | 'hybrid';
  includePhotos: boolean;
  includeTimeline: boolean;
  animationSpeed: number;
}

export default function JourneyVideoFromMapPoints({ onCancel }: JourneyVideoFromMapPointsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isJourneyEnabled, setIsJourneyEnabled] = useState(true);

  const [journeyVideos, setJourneyVideos] = useState<JourneyVideo[]>([
    { 
      id: '1', 
      title: 'European Adventure 2023', 
      duration: 240, 
      points: [
        { id: '1', name: 'Paris', location: 'France', memoryCount: 15, visitedAt: '2023-06-15' },
        { id: '2', name: 'Rome', location: 'Italy', memoryCount: 12, visitedAt: '2023-06-20' },
        { id: '3', name: 'Barcelona', location: 'Spain', memoryCount: 18, visitedAt: '2023-06-25' },
      ],
      style: 'satellite', 
      music: 'adventure', 
      createdAt: '2024-01-15', 
      status: 'completed' 
    },
  ]);

  const [journeySettings, setJourneySettings] = useState<JourneySettings>({
    autoGenerate: false,
    defaultStyle: 'satellite',
    includePhotos: true,
    includeTimeline: true,
    animationSpeed: 50,
  });

  const createJourneyVideo = () => {
    const styles: Array<'satellite' | 'street' | 'terrain' | 'hybrid'> = ['satellite', 'street', 'terrain', 'hybrid'];
    const newJourney: JourneyVideo = {
      id: Date.now().toString(),
      title: `Journey ${journeyVideos.length + 1}`,
      duration: Math.floor(Math.random() * 200) + 180,
      points: [
        { id: '1', name: 'Start Point', location: 'Location A', memoryCount: Math.floor(Math.random() * 10) + 5, visitedAt: new Date().toISOString().split('T')[0] },
        { id: '2', name: 'Mid Point', location: 'Location B', memoryCount: Math.floor(Math.random() * 10) + 5, visitedAt: new Date().toISOString().split('T')[0] },
        { id: '3', name: 'End Point', location: 'Location C', memoryCount: Math.floor(Math.random() * 10) + 5, visitedAt: new Date().toISOString().split('T')[0] },
      ],
      style: journeySettings.defaultStyle,
      music: 'adventure',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setJourneyVideos([...journeyVideos, newJourney]);
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'satellite': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'street': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'terrain': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'hybrid': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Journey Video from Map Points
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create journey videos from map location points
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isJourneyEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isJourneyEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Journeys</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{journeyVideos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Duration</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(journeyVideos.reduce((acc, j) => acc + j.duration, 0) / journeyVideos.length).toFixed(0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Points</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{journeyVideos.reduce((acc, j) => acc + j.points.length, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Map Styles</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{4}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isJourneyEnabled}
              onChange={(e) => setIsJourneyEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Journey</span>
          </div>
          <button
            type="button"
            onClick={createJourneyVideo}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Map className="h-3 w-3" />
            Create Journey
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Journey Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-teal-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={journeySettings.autoGenerate}
                onChange={(e) => setJourneySettings({ ...journeySettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Map className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Map Style</span>
              </div>
              <select
                value={journeySettings.defaultStyle}
                onChange={(e) => setJourneySettings({ ...journeySettings, defaultStyle: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="satellite">Satellite</option>
                <option value="street">Street</option>
                <option value="terrain">Terrain</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Route className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Photos</span>
              </div>
              <input
                type="checkbox"
                checked={journeySettings.includePhotos}
                onChange={(e) => setJourneySettings({ ...journeySettings, includePhotos: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Timeline</span>
              </div>
              <input
                type="checkbox"
                checked={journeySettings.includeTimeline}
                onChange={(e) => setJourneySettings({ ...journeySettings, includeTimeline: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Animation Speed</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={journeySettings.animationSpeed}
                  onChange={(e) => setJourneySettings({ ...journeySettings, animationSpeed: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{journeySettings.animationSpeed}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Journey Videos</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {journeyVideos.map((journey) => (
              <div key={journey.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Map className="h-4 w-4 text-teal-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{journey.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStyleColor(journey.style)}`}>
                          {journey.style}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(journey.status)}`}>
                          {journey.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{journey.points.length} points • {journey.duration}s • {journey.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {journey.points.map((point) => (
                      <span key={point.id} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {point.name} ({point.memoryCount})
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Play
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Route className="h-3 w-3" />
                    View Map
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Journey Video Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create journey videos from map location points</li>
              <li>• Map styles: satellite, street, terrain, hybrid</li>
              <li>• Include photos and timeline options</li>
              <li>• Adjustable animation speed</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
