'use client';

import { useState } from 'react';
import { Package, X, RefreshCw, Info, CheckCircle, Star, Zap, Clock, Lock, Unlock, Eye, Calendar } from 'lucide-react';

interface AIMemoryTimeCapsuleProps {
  onCancel?: () => void;
}

interface TimeCapsule {
  id: string;
  name: string;
  description: string;
  openDate: string;
  createdAt: string;
  status: 'sealed' | 'scheduled' | 'opened';
  memoryCount: number;
  predictions: string[];
}

interface CapsulePrediction {
  id: string;
  type: 'location' | 'activity' | 'mood' | 'milestone';
  prediction: string;
  confidence: number;
  basedOn: string[];
}

interface CapsuleSettings {
  autoPredict: boolean;
  minMemories: number;
  predictionHorizon: number;
}

export default function AIMemoryTimeCapsule({ onCancel }: AIMemoryTimeCapsuleProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCapsuleEnabled, setIsCapsuleEnabled] = useState(true);

  const [timeCapsules, setTimeCapsules] = useState<TimeCapsule[]>([
    { 
      id: '1', 
      name: '2025 Goals Capsule', 
      description: 'Predictions for 2025 based on 2024 memories', 
      openDate: '2025-01-01', 
      createdAt: '2024-01-15', 
      status: 'sealed',
      memoryCount: 50,
      predictions: ['More travel adventures', 'New friendships', 'Career growth', 'Fitness achievements']
    },
    { 
      id: '2', 
      name: '2030 Future Self', 
      description: 'Long-term predictions for 2030', 
      openDate: '2030-01-01', 
      createdAt: '2024-02-20', 
      status: 'scheduled',
      memoryCount: 100,
      predictions: ['Settled in dream location', 'Family milestones', 'Financial stability', 'Personal growth']
    },
  ]);

  const [capsulePredictions, setCapsulePredictions] = useState<CapsulePrediction[]>([
    { id: '1', type: 'location', prediction: 'Visit Japan within 2 years', confidence: 0.85, basedOn: ['Travel patterns', 'Interest in culture'] },
    { id: '2', type: 'activity', prediction: 'Start a new hobby in 6 months', confidence: 0.78, basedOn: ['Past hobbies', 'Activity patterns'] },
    { id: '3', type: 'mood', prediction: 'Increased happiness through outdoor activities', confidence: 0.82, basedOn: ['Mood trends', 'Location preferences'] },
  ]);

  const [capsuleSettings, setCapsuleSettings] = useState<CapsuleSettings>({
    autoPredict: true,
    minMemories: 10,
    predictionHorizon: 5,
  });

  const createCapsule = () => {
    const newCapsule: TimeCapsule = {
      id: Date.now().toString(),
      name: `Capsule ${timeCapsules.length + 1}`,
      description: 'AI-generated time capsule predictions',
      openDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      status: 'sealed',
      memoryCount: Math.floor(Math.random() * 50) + 20,
      predictions: ['New adventures', 'Personal growth', 'Meaningful connections', 'Life milestones'],
    };
    setTimeCapsules([...timeCapsules, newCapsule]);
  };

  const openCapsule = (id: string) => {
    setTimeCapsules(timeCapsules.map(capsule => 
      capsule.id === id ? { ...capsule, status: 'opened' as const } : capsule
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sealed': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'scheduled': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'opened': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'location': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'activity': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'mood': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'milestone': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Memory Time Capsule
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI creates future predictions from past
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isCapsuleEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isCapsuleEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Capsules</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{timeCapsules.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sealed</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{timeCapsules.filter(c => c.status === 'sealed').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Predictions</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{capsulePredictions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Confidence</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{(capsulePredictions.reduce((acc, p) => acc + p.confidence, 0) / capsulePredictions.length).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isCapsuleEnabled}
              onChange={(e) => setIsCapsuleEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Capsules</span>
          </div>
          <button
            type="button"
            onClick={createCapsule}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Package className="h-3 w-3" />
            Create Capsule
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Capsule Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Predict</span>
              </div>
              <input
                type="checkbox"
                checked={capsuleSettings.autoPredict}
                onChange={(e) => setCapsuleSettings({ ...capsuleSettings, autoPredict: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Min Memories</span>
              </div>
              <input
                type="number"
                value={capsuleSettings.minMemories}
                onChange={(e) => setCapsuleSettings({ ...capsuleSettings, minMemories: parseInt(e.target.value) })}
                className="w-20 px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Prediction Horizon (years)</span>
              </div>
              <input
                type="number"
                value={capsuleSettings.predictionHorizon}
                onChange={(e) => setCapsuleSettings({ ...capsuleSettings, predictionHorizon: parseInt(e.target.value) })}
                className="w-20 px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Time Capsules</h4>
          <div className="space-y-2">
            {timeCapsules.map((capsule) => (
              <div key={capsule.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {capsule.status === 'sealed' ? <Lock className="h-4 w-4 text-indigo-400" /> : <Unlock className="h-4 w-4 text-green-400" />}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{capsule.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(capsule.status)}`}>
                          {capsule.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{capsule.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Open: {capsule.openDate}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{capsule.memoryCount} memories</span>
                    <span>•</span>
                    <span>Created: {capsule.createdAt}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Predictions:</p>
                  <div className="flex flex-wrap gap-1">
                    {capsule.predictions.map((prediction, index) => (
                      <span key={index} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {prediction}
                      </span>
                    ))}
                  </div>
                </div>
                {capsule.status === 'sealed' && (
                  <button
                    type="button"
                    onClick={() => openCapsule(capsule.id)}
                    className="px-2 py-1 rounded text-xs bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
                  >
                    <Unlock className="h-3 w-3" />
                    Open Capsule
                  </button>
                )}
                {capsule.status === 'opened' && (
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    View Predictions
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">AI Predictions</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {capsulePredictions.map((prediction) => (
              <div key={prediction.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(prediction.type)}`}>
                          {prediction.type}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{prediction.prediction}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Confidence: {(prediction.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Based on:</span>
                  {prediction.basedOn.map((item, index) => (
                    <span key={index} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Time Capsule Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI predicts future based on past memories</li>
              <li>• Prediction types: location, activity, mood, milestone</li>
              <li>• Seal capsules for future opening</li>
              <li>• Track prediction accuracy over time</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
