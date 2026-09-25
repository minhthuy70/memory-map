'use client';

import { useState } from 'react';
import {
  as,
  CheckCircle,
  Download,
  Image,
  ImageIcon,
  Info,
  RefreshCw,
  Sparkles,
  Star,
  Wrench,
  Zap
} from 'lucide-react';

interface AIPhotoRestorationProps {
  onCancel?: () => void;
}

interface RestoredPhoto {
  id: string;
  originalName: string;
  restoredName: string;
  originalSize: number;
  restoredSize: number;
  processedAt: string;
  qualityScore: number;
  damageLevel: 'low' | 'medium' | 'high';
  status: 'processing' | 'completed' | 'failed';
}

interface RestorationType {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface RestorationSettings {
  autoRestore: boolean;
  enhanceColors: boolean;
  removeNoise: boolean;
  sharpenDetails: boolean;
}

export default function AIPhotoRestoration({ onCancel }: AIPhotoRestorationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRestorationEnabled, setIsRestorationEnabled] = useState(true);

  const [restoredPhotos, setRestoredPhotos] = useState<RestoredPhoto[]>([
    { id: '1', originalName: 'damaged_photo_1.jpg', restoredName: 'damaged_photo_1_restored.jpg', originalSize: 3.5, restoredSize: 3.8, processedAt: '2024-01-15', qualityScore: 92, damageLevel: 'high', status: 'completed' },
    { id: '2', originalName: 'scratched_image.jpg', restoredName: 'scratched_image_restored.jpg', originalSize: 2.8, restoredSize: 3.0, processedAt: '2024-02-20', qualityScore: 88, damageLevel: 'medium', status: 'completed' },
    { id: '3', originalName: 'faded_photo.jpg', restoredName: 'faded_photo_restored.jpg', originalSize: 4.2, restoredSize: 4.5, processedAt: '2024-03-10', qualityScore: 95, damageLevel: 'low', status: 'completed' },
  ]);

  const [restorationTypes, setRestorationTypes] = useState<RestorationType[]>([
    { id: '1', name: 'Scratch Removal', description: 'Remove scratches and marks', isActive: true },
    { id: '2', name: 'Fade Correction', description: 'Restore faded colors', isActive: true },
    { id: '3', name: 'Tear Repair', description: 'Repair torn photos', isActive: false },
    { id: '4', name: 'Stain Removal', description: 'Remove stains and spots', isActive: true },
  ]);

  const [restorationSettings, setRestorationSettings] = useState<RestorationSettings>({
    autoRestore: true,
    enhanceColors: true,
    removeNoise: true,
    sharpenDetails: true,
  });

  const restorePhoto = () => {
    const damageLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const newPhoto: RestoredPhoto = {
      id: Date.now().toString(),
      originalName: `damaged_${Date.now()}.jpg`,
      restoredName: `damaged_${Date.now()}_restored.jpg`,
      originalSize: Math.random() * 3 + 2,
      restoredSize: Math.random() * 3 + 2.5,
      processedAt: new Date().toISOString().split('T')[0],
      qualityScore: Math.floor(Math.random() * 15) + 85,
      damageLevel: damageLevels[Math.floor(Math.random() * damageLevels.length)],
      status: 'completed',
    };
    setRestoredPhotos([...restoredPhotos, newPhoto]);
  };

  const toggleRestorationType = (id: string) => {
    setRestorationTypes(restorationTypes.map(type => 
      type.id === id ? { ...type, isActive: !type.isActive } : type
    ));
  };

  const getDamageColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Photo Restoration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Restore damaged photos with AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isRestorationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isRestorationEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Restored</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{restoredPhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Gauge</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(restoredPhotos.reduce((acc, p) => acc + p.qualityScore, 0) / restoredPhotos.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{restoredPhotos.reduce((acc, p) => acc + p.restoredSize, 0).toFixed(1)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Types Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{restorationTypes.filter(t => t.isActive).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isRestorationEnabled}
              onChange={(e) => setIsRestorationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Restoration</span>
          </div>
          <button
            type="button"
            onClick={restorePhoto}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Wrench className="h-3 w-3" />
            Restore Photo
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Restoration Types</h4>
          <div className="space-y-2">
            {restorationTypes.map((type) => (
              <div key={type.id} className={`p-3 rounded-lg border ${type.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{type.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{type.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRestorationType(type.id)}
                    className={`px-2 py-1 rounded text-xs ${type.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {type.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Restoration Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Restore</span>
              </div>
              <input
                type="checkbox"
                checked={restorationSettings.autoRestore}
                onChange={(e) => setRestorationSettings({ ...restorationSettings, autoRestore: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Enhance Colors</span>
              </div>
              <input
                type="checkbox"
                checked={restorationSettings.enhanceColors}
                onChange={(e) => setRestorationSettings({ ...restorationSettings, enhanceColors: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Remove Noise</span>
              </div>
              <input
                type="checkbox"
                checked={restorationSettings.removeNoise}
                onChange={(e) => setRestorationSettings({ ...restorationSettings, removeNoise: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Wrench className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sharpen Details</span>
              </div>
              <input
                type="checkbox"
                checked={restorationSettings.sharpenDetails}
                onChange={(e) => setRestorationSettings({ ...restorationSettings, sharpenDetails: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Restored Photos</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {restoredPhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.originalName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.restoredName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getDamageColor(photo.damageLevel)}`}>
                          {photo.damageLevel} damage
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {photo.originalSize.toFixed(1)} MB → {photo.restoredSize.toFixed(1)} MB
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Photo Restoration Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI restores damaged, scratched, faded photos</li>
              <li>• Restoration types: scratches, fade, tears, stains</li>
              <li>• Settings: enhance colors, remove noise, sharpen details</li>
              <li>• Damage level assessment: low, medium, high</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
