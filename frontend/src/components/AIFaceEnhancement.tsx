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
  Smile,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';

interface AIFaceEnhancementProps {
  onCancel?: () => void;
}

interface EnhancedPhoto {
  id: string;
  originalName: string;
  enhancedName: string;
  originalSize: number;
  enhancedSize: number;
  enhancementType: 'smooth' | 'natural' | 'dramatic';
  processedAt: string;
  qualityScore: number;
  status: 'processing' | 'completed' | 'failed';
}

interface EnhancementFeature {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface EnhancementSettings {
  autoEnhance: boolean;
  enhancementLevel: number;
  preserveSkinTone: boolean;
  removeBlemishes: boolean;
}

export default function AIFaceEnhancement({ onCancel }: AIFaceEnhancementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEnhancementEnabled, setIsEnhancementEnabled] = useState(true);

  const [enhancedPhotos, setEnhancedPhotos] = useState<EnhancedPhoto[]>([
    { id: '1', originalName: 'portrait_1.jpg', enhancedName: 'portrait_1_enhanced.jpg', originalSize: 3.5, enhancedSize: 3.8, enhancementType: 'natural', processedAt: '2024-01-15', qualityScore: 94, status: 'completed' },
    { id: '2', originalName: 'selfie_1.jpg', enhancedName: 'selfie_1_enhanced.jpg', originalSize: 2.8, enhancedSize: 3.0, enhancementType: 'smooth', processedAt: '2024-02-20', qualityScore: 91, status: 'completed' },
    { id: '3', originalName: 'group_photo.jpg', enhancedName: 'group_enhanced.jpg', originalSize: 4.2, enhancedSize: 4.5, enhancementType: 'dramatic', processedAt: '2024-03-10', qualityScore: 88, status: 'completed' },
  ]);

  const [enhancementFeatures, setEnhancementFeatures] = useState<EnhancementFeature[]>([
    { id: '1', name: 'Skin Smoothing', description: 'Smooth skin texture naturally', isActive: true },
    { id: '2', name: 'Eye Brightening', description: 'Enhance eye brightness', isActive: true },
    { id: '3', name: 'Teeth Whitening', description: 'Whiten teeth naturally', isActive: false },
    { id: '4', name: 'Face Contouring', description: 'Enhance facial contours', isActive: true },
  ]);

  const [enhancementSettings, setEnhancementSettings] = useState<EnhancementSettings>({
    autoEnhance: false,
    enhancementLevel: 50,
    preserveSkinTone: true,
    removeBlemishes: true,
  });

  const enhanceFace = () => {
    const types: Array<'smooth' | 'natural' | 'dramatic'> = ['smooth', 'natural', 'dramatic'];
    const newPhoto: EnhancedPhoto = {
      id: Date.now().toString(),
      originalName: `face_${Date.now()}.jpg`,
      enhancedName: `face_${Date.now()}_enhanced.jpg`,
      originalSize: Math.random() * 3 + 2,
      enhancedSize: Math.random() * 3 + 2.5,
      enhancementType: types[Math.floor(Math.random() * types.length)],
      processedAt: new Date().toISOString().split('T')[0],
      qualityScore: Math.floor(Math.random() * 15) + 85,
      status: 'completed',
    };
    setEnhancedPhotos([...enhancedPhotos, newPhoto]);
  };

  const toggleFeature = (id: string) => {
    setEnhancementFeatures(enhancementFeatures.map(feature => 
      feature.id === id ? { ...feature, isActive: !feature.isActive } : feature
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'smooth': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'natural': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'dramatic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl">
            <Smile className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Face Enhancement
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enhance faces in photos with AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isEnhancementEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isEnhancementEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Enhanced</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{enhancedPhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Gauge</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(enhancedPhotos.reduce((acc, p) => acc + p.qualityScore, 0) / enhancedPhotos.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{enhancedPhotos.reduce((acc, p) => acc + p.enhancedSize, 0).toFixed(1)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Features Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{enhancementFeatures.filter(f => f.isActive).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isEnhancementEnabled}
              onChange={(e) => setIsEnhancementEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Enhancement</span>
          </div>
          <button
            type="button"
            onClick={enhanceFace}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Smile className="h-3 w-3" />
            Enhance Face
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Enhancement Features</h4>
          <div className="space-y-2">
            {enhancementFeatures.map((feature) => (
              <div key={feature.id} className={`p-3 rounded-lg border ${feature.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{feature.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFeature(feature.id)}
                    className={`px-2 py-1 rounded text-xs ${feature.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {feature.isActive ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Enhancement Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Enhance</span>
              </div>
              <input
                type="checkbox"
                checked={enhancementSettings.autoEnhance}
                onChange={(e) => setEnhancementSettings({ ...enhancementSettings, autoEnhance: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Enhancement Level</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={enhancementSettings.enhancementLevel}
                  onChange={(e) => setEnhancementSettings({ ...enhancementSettings, enhancementLevel: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{enhancementSettings.enhancementLevel}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Preserve Skin Tone</span>
              </div>
              <input
                type="checkbox"
                checked={enhancementSettings.preserveSkinTone}
                onChange={(e) => setEnhancementSettings({ ...enhancementSettings, preserveSkinTone: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Smile className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Remove Blemishes</span>
              </div>
              <input
                type="checkbox"
                checked={enhancementSettings.removeBlemishes}
                onChange={(e) => setEnhancementSettings({ ...enhancementSettings, removeBlemishes: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Enhanced Photos</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {enhancedPhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-yellow-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.originalName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.enhancedName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(photo.enhancementType)}`}>
                          {photo.enhancementType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {photo.originalSize.toFixed(1)} MB → {photo.enhancedSize.toFixed(1)} MB
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Face Enhancement Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI enhances faces naturally with multiple features</li>
              <li>• Features: skin smoothing, eye brightening, teeth whitening, contouring</li>
              <li>• Enhancement types: smooth, natural, dramatic</li>
              <li>• Preserve skin tone and remove blemishes options</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
