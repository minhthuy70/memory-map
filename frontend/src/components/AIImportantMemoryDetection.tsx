'use client';

import { useState } from 'react';
import {
  Award,
  CheckCircle,
  Flag,
  Heart,
  Info,
  RefreshCw,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react';

interface AIImportantMemoryDetectionProps {
  onCancel?: () => void;
}

interface DetectedMemory {
  id: string;
  title: string;
  date: string;
  importanceScore: number;
  importanceLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  isMarked: boolean;
}

interface ImportanceFactor {
  id: string;
  name: string;
  weight: number;
  isActive: boolean;
}

interface DetectionSettings {
  autoDetect: boolean;
  threshold: number;
  factorCount: number;
}

export default function AIImportantMemoryDetection({ onCancel }: AIImportantMemoryDetectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDetectionEnabled, setIsDetectionEnabled] = useState(true);

  const [detectedMemories, setDetectedMemories] = useState<DetectedMemory[]>([
    { id: '1', title: 'Wedding Day', date: '2024-01-15', importanceScore: 0.95, importanceLevel: 'critical', factors: ['emotional', 'life-event', 'family'], isMarked: true },
    { id: '2', title: 'Graduation', date: '2024-02-20', importanceScore: 0.88, importanceLevel: 'high', factors: ['achievement', 'milestone'], isMarked: true },
    { id: '3', title: 'First Travel Abroad', date: '2024-03-10', importanceScore: 0.82, importanceLevel: 'high', factors: ['first-time', 'adventure'], isMarked: true },
    { id: '4', title: 'PartyPopper Party', date: '2024-04-05', importanceScore: 0.75, importanceLevel: 'medium', factors: ['social', 'celebration'], isMarked: false },
  ]);

  const [importanceFactors, setImportanceFactors] = useState<ImportanceFactor[]>([
    { id: '1', name: 'Emotional Impact', weight: 0.3, isActive: true },
    { id: '2', name: 'Social Significance', weight: 0.25, isActive: true },
    { id: '3', name: 'Frequency of Recall', weight: 0.2, isActive: true },
    { id: '4', name: 'Location Uniqueness', weight: 0.15, isActive: false },
    { id: '5', name: 'Photo Gauge', weight: 0.1, isActive: false },
  ]);

  const [detectionSettings, setDetectionSettings] = useState<DetectionSettings>({
    autoDetect: true,
    threshold: 0.7,
    factorCount: 3,
  });

  const detectImportantMemories = () => {
    const newMemory: DetectedMemory = {
      id: Date.now().toString(),
      title: `Important Memory ${detectedMemories.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      importanceScore: Math.random() * 0.3 + 0.6,
      importanceLevel: 'medium',
      factors: ['emotional', 'social'],
      isMarked: false,
    };
    setDetectedMemories([...detectedMemories, newMemory]);
  };

  const toggleMark = (id: string) => {
    setDetectedMemories(detectedMemories.map(memory => 
      memory.id === id ? { ...memory, isMarked: !memory.isMarked } : memory
    ));
  };

  const toggleFactor = (id: string) => {
    setImportanceFactors(importanceFactors.map(factor => 
      factor.id === id ? { ...factor, isActive: !factor.isActive } : factor
    ));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'high': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Important Memory Detection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto-detect important memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isDetectionEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isDetectionEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Detected</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{detectedMemories.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Marked</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{detectedMemories.filter(m => m.isMarked).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Score</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(detectedMemories.reduce((acc, m) => acc + m.importanceScore, 0) / detectedMemories.length).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Critical</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{detectedMemories.filter(m => m.importanceLevel === 'critical').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isDetectionEnabled}
              onChange={(e) => setIsDetectionEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Detection</span>
          </div>
          <button
            type="button"
            onClick={detectImportantMemories}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Star className="h-3 w-3" />
            Detect Memories
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detection Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Detect</span>
              </div>
              <input
                type="checkbox"
                checked={detectionSettings.autoDetect}
                onChange={(e) => setDetectionSettings({ ...detectionSettings, autoDetect: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Threshold</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={detectionSettings.threshold}
                  onChange={(e) => setDetectionSettings({ ...detectionSettings, threshold: parseFloat(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{detectionSettings.threshold}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Importance Factors</h4>
          <div className="space-y-2">
            {importanceFactors.map((factor) => (
              <div key={factor.id} className={`p-3 rounded-lg border ${factor.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{factor.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Weight: {factor.weight}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFactor(factor.id)}
                    className={`px-2 py-1 rounded text-xs ${factor.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {factor.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detected Important Memories</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {detectedMemories.map((memory) => (
              <div key={memory.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{memory.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getLevelColor(memory.importanceLevel)}`}>
                          {memory.importanceLevel}
                        </span>
                        {memory.isMarked && (
                          <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            Marked
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{memory.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{(memory.importanceScore * 100).toFixed(0)}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">score</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {memory.factors.map((factor) => (
                      <span key={factor} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMark(memory.id)}
                  className={`px-2 py-1 rounded text-xs ${memory.isMarked ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'} flex items-center gap-1`}
                >
                  <Flag className="h-3 w-3" />
                  {memory.isMarked ? 'Unmark' : 'Mark'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Important Memory Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI auto-detects important memories based on factors</li>
              <li>• Factors: emotional impact, social significance, frequency</li>
              <li>• Importance levels: critical, high, medium, low</li>
              <li>• Mark/unmark memories for easy access</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
