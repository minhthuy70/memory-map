'use client';

import { useState } from 'react';
import {
  as,
  CheckCircle,
  Contrast,
  Download,
  Image,
  ImageIcon,
  Info,
  Palette,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface AIPhotoColorizationProps {
  onCancel?: () => void;
}

interface ColorizedPhoto {
  id: string;
  originalName: string;
  colorizedName: string;
  originalSize: number;
  colorizedSize: number;
  processedAt: string;
  quality: number;
  status: 'processing' | 'completed' | 'failed';
}

interface ColorizationModel {
  id: string;
  name: string;
  description: string;
  quality: 'low' | 'medium' | 'high';
  speed: 'fast' | 'medium' | 'slow';
  isActive: boolean;
}

interface ColorizationSettings {
  autoColorize: boolean;
  quality: 'low' | 'medium' | 'high';
  preserveDetails: boolean;
}

export default function AIPhotoColorization({ onCancel }: AIPhotoColorizationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isColorizationEnabled, setIsColorizationEnabled] = useState(true);

  const [colorizedPhotos, setColorizedPhotos] = useState<ColorizedPhoto[]>([
    { id: '1', originalName: 'old_photo_1.jpg', colorizedName: 'old_photo_1_colorized.jpg', originalSize: 2.5, colorizedSize: 2.8, processedAt: '2024-01-15', quality: 95, status: 'completed' },
    { id: '2', originalName: 'family_bw.jpg', colorizedName: 'family_bw_colorized.jpg', originalSize: 3.2, colorizedSize: 3.5, processedAt: '2024-02-20', quality: 92, status: 'completed' },
    { id: '3', originalName: 'vintage_scene.jpg', colorizedName: 'vintage_scene_colorized.jpg', originalSize: 1.8, colorizedSize: 2.0, processedAt: '2024-03-10', quality: 88, status: 'completed' },
  ]);

  const [colorizationModels, setColorizationModels] = useState<ColorizationModel[]>([
    { id: '1', name: 'Fast Colorizer', description: 'Quick colorization for batch processing', quality: 'low', speed: 'fast', isActive: true },
    { id: '2', name: 'Balanced Model', description: 'Good quality with reasonable speed', quality: 'medium', speed: 'medium', isActive: false },
    { id: '3', name: 'Deep Colorizer', description: 'Highest quality, slower processing', quality: 'high', speed: 'slow', isActive: false },
  ]);

  const [colorizationSettings, setColorizationSettings] = useState<ColorizationSettings>({
    autoColorize: true,
    quality: 'medium',
    preserveDetails: true,
  });

  const colorizePhoto = () => {
    const newPhoto: ColorizedPhoto = {
      id: Date.now().toString(),
      originalName: `bw_photo_${Date.now()}.jpg`,
      colorizedName: `bw_photo_${Date.now()}_colorized.jpg`,
      originalSize: Math.random() * 2 + 1,
      colorizedSize: Math.random() * 2 + 1.5,
      processedAt: new Date().toISOString().split('T')[0],
      quality: Math.floor(Math.random() * 15) + 85,
      status: 'completed',
    };
    setColorizedPhotos([...colorizedPhotos, newPhoto]);
  };

  const toggleModel = (id: string) => {
    setColorizationModels(colorizationModels.map(model => 
      model.id === id ? { ...model, isActive: !model.isActive } : model
    ));
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'slow': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Photo Colorization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Colorize black and white photos with AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isColorizationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isColorizationEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Colorized</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{colorizedPhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Gauge</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(colorizedPhotos.reduce((acc, p) => acc + p.quality, 0) / colorizedPhotos.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{colorizedPhotos.reduce((acc, p) => acc + p.colorizedSize, 0).toFixed(1)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Models</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{colorizationModels.filter(m => m.isActive).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isColorizationEnabled}
              onChange={(e) => setIsColorizationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Colorization</span>
          </div>
          <button
            type="button"
            onClick={colorizePhoto}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Palette className="h-3 w-3" />
            Colorize Photo
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Colorization Models</h4>
          <div className="space-y-2">
            {colorizationModels.map((model) => (
              <div key={model.id} className={`p-3 rounded-lg border ${model.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Palette className="h-4 w-4 text-pink-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{model.name}</span>
                        {model.isActive && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{model.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs ${getQualityColor(model.quality)}`}>
                      {model.quality}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getSpeedColor(model.speed)}`}>
                      {model.speed}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleModel(model.id)}
                  className={`px-2 py-1 rounded text-xs ${model.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                  {model.isActive ? 'Disable' : 'Enable'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Colorization Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Colorize</span>
              </div>
              <input
                type="checkbox"
                checked={colorizationSettings.autoColorize}
                onChange={(e) => setColorizationSettings({ ...colorizationSettings, autoColorize: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Contrast className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Gauge</span>
              </div>
              <select
                value={colorizationSettings.quality}
                onChange={(e) => setColorizationSettings({ ...colorizationSettings, quality: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Preserve Details</span>
              </div>
              <input
                type="checkbox"
                checked={colorizationSettings.preserveDetails}
                onChange={(e) => setColorizationSettings({ ...colorizationSettings, preserveDetails: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Colorized Photos</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {colorizedPhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-pink-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.originalName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.colorizedName}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {photo.originalSize.toFixed(1)} MB → {photo.colorizedSize.toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{photo.quality}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">quality</p>
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Photo Colorization Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI colorizes black and white photos automatically</li>
              <li>• Multiple models: fast, balanced, deep colorizer</li>
              <li>• Gauge settings: low, medium, high</li>
              <li>• Preserve details option for better results</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
