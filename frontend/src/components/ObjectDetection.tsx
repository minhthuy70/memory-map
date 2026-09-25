'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Armchair,
  as,
  BarChart3,
  Box,
  Calendar,
  Camera,
  Car,
  Check,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Image,
  ImageIcon,
  PawPrint,
  Pizza,
  Scan,
  Settings,
  Sparkles,
  Upload,
  Users,
  Zap,
  ZapIcon
} from 'lucide-react';

interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  category: string;
}

interface DetectionResult {
  imageId: string;
  imageName: string;
  objects: DetectedObject[];
  processedAt: Date;
  processingTime: number;
  modelUsed: string;
}

interface DetectionModel {
  id: string;
  name: string;
  accuracy: number;
  speed: 'fast' | 'medium' | 'slow';
  description: string;
}

interface ObjectDetectionProps {
  onCancel?: () => void;
  onRunDetection?: (imageId: string) => Promise<void>;
}

const DEFAULT_MODELS: DetectionModel[] = [
  {
    id: 'model-1',
    name: 'YOLOv8',
    accuracy: 0.89,
    speed: 'fast',
    description: 'Real-time object detection',
  },
  {
    id: 'model-2',
    name: 'Faster R-CNN',
    accuracy: 0.92,
    speed: 'medium',
    description: 'High accuracy detection',
  },
  {
    id: 'model-3',
    name: 'Mask R-CNN',
    accuracy: 0.95,
    speed: 'slow',
    description: 'Instance segmentation',
  },
];

const DEFAULT_RESULTS: DetectionResult[] = [
  {
    imageId: 'img-1',
    imageName: 'family-vacation.jpg',
    objects: [
      {
        id: 'obj-1',
        label: 'person',
        confidence: 0.95,
        boundingBox: { x: 100, y: 50, width: 80, height: 120 },
        category: 'people',
      },
      {
        id: 'obj-2',
        label: 'person',
        confidence: 0.88,
        boundingBox: { x: 200, y: 60, width: 70, height: 110 },
        category: 'people',
      },
      {
        id: 'obj-3',
        label: 'car',
        confidence: 0.92,
        boundingBox: { x: 300, y: 150, width: 120, height: 80 },
        category: 'vehicle',
      },
    ],
    processedAt: new Date('2024-01-12'),
    processingTime: 1.2,
    modelUsed: 'YOLOv8',
  },
];

export default function ObjectDetection({ onCancel, onRunDetection }: ObjectDetectionProps) {
  const [results, setResults] = useState<DetectionResult[]>(DEFAULT_RESULTS);
  const [models, setModels] = useState<DetectionModel[]>(DEFAULT_MODELS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedModel, setSelectedModel] = useState('model-1');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalObjects = results.reduce((sum, r) => sum + r.objects.length, 0);
  const avgConfidence = totalObjects > 0 ? results.reduce((sum, r) => sum + r.objects.reduce((s, o) => s + o.confidence, 0), 0) / totalObjects : 0;
  const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'people':
        return 'text-blue-500';
      case 'vehicle':
        return 'text-green-500';
      case 'animal':
        return 'text-purple-500';
      case 'food':
        return 'text-orange-500';
      case 'furniture':
        return 'text-teal-500';
      default:
        return 'text-slate-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'people':
        return <Users className="h-4 w-4" />;
      case 'vehicle':
        return <Car className="h-4 w-4" />;
      case 'animal':
        return <PawPrint className="h-4 w-4" />;
      case 'food':
        return <Pizza className="h-4 w-4" />;
      case 'furniture':
        return <Armchair className="h-4 w-4" />;
      default:
        return <Box className="h-4 w-4" />;
    }
  };

  const handleRunDetection = async (imageId: string) => {
    setIsProcessing(true);
    await onRunDetection?.(imageId);
    setIsProcessing(false);
  };

  const filteredObjects = results.flatMap(r => 
    r.objects.filter(o => 
      o.confidence >= confidenceThreshold &&
      (selectedCategory === 'all' || o.category === selectedCategory)
    )
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phát hiện vật thể
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalObjects} objects detected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt object detection
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Confidence threshold: {(confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Detection model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                {models.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.accuracy * 100}% accuracy)</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect on upload
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Box className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Objects</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalObjects}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Time</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgProcessingTime.toFixed(1)}s
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ZapIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Model</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {models.find(m => m.id === selectedModel)?.name}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('people')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'people'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            People
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('vehicle')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'vehicle'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Vehicles
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('animal')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'animal'
                ? 'bg-green-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Animals
          </button>
        </div>
      </div>

      {/* Detection Results */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Detection Results
        </h4>
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.imageId}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {result.imageName}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {result.objects.length} objects detected
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunDetection(result.imageId)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Scan className="h-3 w-3" />
                  {isProcessing ? 'Processing...' : 'Re-detect'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Processed</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.processedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Time</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.processingTime}s
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Model</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.modelUsed}
                  </div>
                </div>
              </div>

              {/* Detected Objects */}
              <div className="space-y-2">
                {result.objects.filter(o => o.confidence >= confidenceThreshold).map((obj) => (
                  <div
                    key={obj.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getCategoryColor(obj.category)}`}>
                          {getCategoryIcon(obj.category)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                            {obj.label}
                          </span>
                          <div className={`text-xs ${getCategoryColor(obj.category)} capitalize`}>
                            {obj.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {(obj.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">X</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {obj.boundingBox.x}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Y</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {obj.boundingBox.y}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Width</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {obj.boundingBox.width}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Height</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {obj.boundingBox.height}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detection Models */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Detection Models
        </h4>
        <div className="space-y-2">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-4 rounded-lg border-2 ${
                model.id === selectedModel
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Scan className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {model.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                      {model.speed}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {(model.accuracy * 100).toFixed(0)}%
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {model.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
        <p className="text-[10px] text-green-700 dark:text-green-400">
          <strong>Lưu ý:</strong> Phát hiện vật thể sử dụng computer vision để nhận diện các vật thể trong ảnh kỷ niệm với YOLOv8/Faster R-CNN/Mask R-CNN models, confidence thresholding, bounding box visualization, category filtering (people/vehicles/animals/food/furniture), detection history, và model selection.
        </p>
      </div>
    </div>
  );
}