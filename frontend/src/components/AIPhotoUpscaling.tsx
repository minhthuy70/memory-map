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
  Maximize,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface AIPhotoUpscalingProps {
  onCancel?: () => void;
}

interface UpscaledPhoto {
  id: string;
  originalName: string;
  upscaledName: string;
  originalResolution: string;
  upscaledResolution: string;
  originalSize: number;
  upscaledSize: number;
  scaleFactor: number;
  processedAt: string;
  qualityScore: number;
  status: 'processing' | 'completed' | 'failed';
}

interface UpscaleModel {
  id: string;
  name: string;
  maxScale: number;
  description: string;
  isActive: boolean;
}

interface UpscaleSettings {
  autoUpscale: boolean;
  defaultScale: number;
  preserveAspectRatio: boolean;
  enhanceDetails: boolean;
}

export default function AIPhotoUpscaling({ onCancel }: AIPhotoUpscalingProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isUpscalingEnabled, setIsUpscalingEnabled] = useState(true);

  const [upscaledPhotos, setUpscaledPhotos] = useState<UpscaledPhoto[]>([
    { id: '1', originalName: 'photo_1.jpg', upscaledName: 'photo_1_4x.jpg', originalResolution: '1920x1080', upscaledResolution: '7680x4320', originalSize: 2.5, upscaledSize: 15.2, scaleFactor: 4, processedAt: '2024-01-15', qualityScore: 94, status: 'completed' },
    { id: '2', originalName: 'photo_2.jpg', upscaledName: 'photo_2_2x.jpg', originalResolution: '1280x720', upscaledResolution: '2560x1440', originalSize: 1.8, upscaledSize: 5.5, scaleFactor: 2, processedAt: '2024-02-20', qualityScore: 91, status: 'completed' },
    { id: '3', originalName: 'photo_3.jpg', upscaledName: 'photo_3_8x.jpg', originalResolution: '800x600', upscaledResolution: '6400x4800', originalSize: 1.2, upscaledSize: 28.5, scaleFactor: 8, processedAt: '2024-03-10', qualityScore: 88, status: 'completed' },
  ]);

  const [upscaleModels, setUpscaleModels] = useState<UpscaleModel[]>([
    { id: '1', name: '2x Upscaler', maxScale: 2, description: 'Fast 2x upscaling', isActive: true },
    { id: '2', name: '4x Upscaler', maxScale: 4, description: 'Standard 4x upscaling', isActive: true },
    { id: '3', name: '8x Upscaler', maxScale: 8, description: 'Maximum 8x upscaling', isActive: false },
  ]);

  const [upscaleSettings, setUpscaleSettings] = useState<UpscaleSettings>({
    autoUpscale: false,
    defaultScale: 4,
    preserveAspectRatio: true,
    enhanceDetails: true,
  });

  const upscalePhoto = () => {
    const scales = [2, 4, 8];
    const newPhoto: UpscaledPhoto = {
      id: Date.now().toString(),
      originalName: `photo_${Date.now()}.jpg`,
      upscaledName: `photo_${Date.now()}_${upscaleSettings.defaultScale}x.jpg`,
      originalResolution: '1920x1080',
      upscaledResolution: `${1920 * upscaleSettings.defaultScale}x${1080 * upscaleSettings.defaultScale}`,
      originalSize: Math.random() * 2 + 1,
      upscaledSize: (Math.random() * 2 + 1) * upscaleSettings.defaultScale * 3,
      scaleFactor: upscaleSettings.defaultScale,
      processedAt: new Date().toISOString().split('T')[0],
      qualityScore: Math.floor(Math.random() * 15) + 85,
      status: 'completed',
    };
    setUpscaledPhotos([...upscaledPhotos, newPhoto]);
  };

  const toggleModel = (id: string) => {
    setUpscaleModels(upscaleModels.map(model => 
      model.id === id ? { ...model, isActive: !model.isActive } : model
    ));
  };

  const getScaleColor = (scale: number) => {
    if (scale >= 8) return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
    if (scale >= 4) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (scale >= 2) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Maximize className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Photo Upscaling
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Increase photo resolution with AI (4x upscale)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isUpscalingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isUpscalingEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Upscaled</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{upscaledPhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Gauge</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(upscaledPhotos.reduce((acc, p) => acc + p.qualityScore, 0) / upscaledPhotos.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{upscaledPhotos.reduce((acc, p) => acc + p.upscaledSize, 0).toFixed(1)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Scale</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{(upscaledPhotos.reduce((acc, p) => acc + p.scaleFactor, 0) / upscaledPhotos.length).toFixed(1)}x</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isUpscalingEnabled}
              onChange={(e) => setIsUpscalingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Upscaling</span>
          </div>
          <button
            type="button"
            onClick={upscalePhoto}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Maximize className="h-3 w-3" />
            Upscale Photo
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Upscale Models</h4>
          <div className="space-y-2">
            {upscaleModels.map((model) => (
              <div key={model.id} className={`p-3 rounded-lg border ${model.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-blue-400" />
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
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{model.maxScale}x</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">max</p>
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Upscale Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Upscale</span>
              </div>
              <input
                type="checkbox"
                checked={upscaleSettings.autoUpscale}
                onChange={(e) => setUpscaleSettings({ ...upscaleSettings, autoUpscale: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Maximize className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Scale</span>
              </div>
              <select
                value={upscaleSettings.defaultScale}
                onChange={(e) => setUpscaleSettings({ ...upscaleSettings, defaultScale: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value={2}>2x</option>
                <option value={4}>4x</option>
                <option value={8}>8x</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Preserve Aspect Ratio</span>
              </div>
              <input
                type="checkbox"
                checked={upscaleSettings.preserveAspectRatio}
                onChange={(e) => setUpscaleSettings({ ...upscaleSettings, preserveAspectRatio: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Enhance Details</span>
              </div>
              <input
                type="checkbox"
                checked={upscaleSettings.enhanceDetails}
                onChange={(e) => setUpscaleSettings({ ...upscaleSettings, enhanceDetails: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Upscaled Photos</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {upscaledPhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-blue-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.originalName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.upscaledName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getScaleColor(photo.scaleFactor)}`}>
                          {photo.scaleFactor}x
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {photo.originalResolution} → {photo.upscaledResolution}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{photo.qualityScore}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">quality</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{photo.originalSize.toFixed(1)} MB → {photo.upscaledSize.toFixed(1)} MB</span>
                    <span>•</span>
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Photo Upscaling Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI increases photo resolution up to 8x</li>
              <li>• Multiple upscale models: 2x, 4x, 8x</li>
              <li>• Preserve aspect ratio option</li>
              <li>• Enhance details for sharper results</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
