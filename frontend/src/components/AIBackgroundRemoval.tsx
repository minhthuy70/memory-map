'use client';

import { useState } from 'react';
import {
  as,
  CheckCircle,
  Download,
  Image,
  ImageIcon,
  Info,
  Layers,
  RefreshCw,
  Scissors,
  Star,
  Zap
} from 'lucide-react';

interface AIBackgroundRemovalProps {
  onCancel?: () => void;
}

interface ProcessedPhoto {
  id: string;
  originalName: string;
  processedName: string;
  originalSize: number;
  processedSize: number;
  backgroundType: 'solid' | 'transparent' | 'custom';
  processedAt: string;
  accuracy: number;
  status: 'processing' | 'completed' | 'failed';
}

interface BackgroundOption {
  id: string;
  name: string;
  type: 'solid' | 'gradient' | 'image' | 'transparent';
  preview: string;
  isActive: boolean;
}

interface RemovalSettings {
  autoRemove: boolean;
  defaultBackground: string;
  edgeSmoothing: number;
  featherEdges: boolean;
}

export default function AIBackgroundRemoval({ onCancel }: AIBackgroundRemovalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRemovalEnabled, setIsRemovalEnabled] = useState(true);

  const [processedPhotos, setProcessedPhotos] = useState<ProcessedPhoto[]>([
    { id: '1', originalName: 'portrait_1.jpg', processedName: 'portrait_1_no_bg.png', originalSize: 3.5, processedSize: 2.8, backgroundType: 'transparent', processedAt: '2024-01-15', accuracy: 95, status: 'completed' },
    { id: '2', originalName: 'product_1.jpg', processedName: 'product_1_white_bg.jpg', originalSize: 2.8, processedSize: 2.5, backgroundType: 'solid', processedAt: '2024-02-20', accuracy: 92, status: 'completed' },
    { id: '3', originalName: 'group_photo.jpg', processedName: 'group_no_bg.png', originalSize: 4.2, processedSize: 3.5, backgroundType: 'transparent', processedAt: '2024-03-10', accuracy: 88, status: 'completed' },
  ]);

  const [backgroundOptions, setBackgroundOptions] = useState<BackgroundOption[]>([
    { id: '1', name: 'Transparent', type: 'transparent', preview: '', isActive: true },
    { id: '2', name: 'White', type: 'solid', preview: '#FFFFFF', isActive: false },
    { id: '3', name: 'Black', type: 'solid', preview: '#000000', isActive: false },
    { id: '4', name: 'Gradient Blue', type: 'gradient', preview: 'linear-gradient(to right, #3b82f6, #8b5cf6)', isActive: false },
  ]);

  const [removalSettings, setRemovalSettings] = useState<RemovalSettings>({
    autoRemove: false,
    defaultBackground: 'transparent',
    edgeSmoothing: 5,
    featherEdges: true,
  });

  const removeBackground = () => {
    const backgroundTypes: Array<'solid' | 'transparent' | 'custom'> = ['solid', 'transparent', 'custom'];
    const newPhoto: ProcessedPhoto = {
      id: Date.now().toString(),
      originalName: `photo_${Date.now()}.jpg`,
      processedName: `photo_${Date.now()}_no_bg.png`,
      originalSize: Math.random() * 3 + 2,
      processedSize: Math.random() * 2 + 1.5,
      backgroundType: backgroundTypes[Math.floor(Math.random() * backgroundTypes.length)],
      processedAt: new Date().toISOString().split('T')[0],
      accuracy: Math.floor(Math.random() * 15) + 85,
      status: 'completed',
    };
    setProcessedPhotos([...processedPhotos, newPhoto]);
  };

  const selectBackground = (id: string) => {
    setBackgroundOptions(backgroundOptions.map(option => 
      option.id === id ? { ...option, isActive: true } : { ...option, isActive: false }
    ));
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (accuracy >= 90) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (accuracy >= 85) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <Scissors className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Background Removal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Remove backgrounds automatically with AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isRemovalEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isRemovalEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Processed</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{processedPhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Accuracy</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(processedPhotos.reduce((acc, p) => acc + p.accuracy, 0) / processedPhotos.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{processedPhotos.reduce((acc, p) => acc + p.processedSize, 0).toFixed(1)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Transparent</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{processedPhotos.filter(p => p.backgroundType === 'transparent').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isRemovalEnabled}
              onChange={(e) => setIsRemovalEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Removal</span>
          </div>
          <button
            type="button"
            onClick={removeBackground}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Scissors className="h-3 w-3" />
            Remove Background
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Background Options</h4>
          <div className="space-y-2">
            {backgroundOptions.map((option) => (
              <div key={option.id} className={`p-3 rounded-lg border ${option.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded border border-slate-300 dark:border-slate-600" style={{ background: option.preview || 'transparent' }} />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{option.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{option.type}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectBackground(option.id)}
                    className={`px-2 py-1 rounded text-xs ${option.isActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                    {option.isActive ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Removal Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-red-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Remove</span>
              </div>
              <input
                type="checkbox"
                checked={removalSettings.autoRemove}
                onChange={(e) => setRemovalSettings({ ...removalSettings, autoRemove: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Edge Smoothing</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={removalSettings.edgeSmoothing}
                  onChange={(e) => setRemovalSettings({ ...removalSettings, edgeSmoothing: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{removalSettings.edgeSmoothing}</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Feather Edges</span>
              </div>
              <input
                type="checkbox"
                checked={removalSettings.featherEdges}
                onChange={(e) => setRemovalSettings({ ...removalSettings, featherEdges: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Processed Photos</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {processedPhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-red-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.originalName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.processedName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getAccuracyColor(photo.accuracy)}`}>
                          {photo.accuracy}% accuracy
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {photo.originalSize.toFixed(1)} MB → {photo.processedSize.toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{photo.backgroundType}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Processed: {photo.processedAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <ImageIcon className="h-3 w-3" />
                    Compare
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Background Removal Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI removes backgrounds automatically</li>
              <li>• Background options: transparent, solid, gradient, custom</li>
              <li>• Edge smoothing and feathering for natural results</li>
              <li>• High accuracy detection for clean edges</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
