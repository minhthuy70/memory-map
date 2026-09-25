'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Home,
  Image,
  ImageIcon,
  MapPin,
  Mountain,
  Palmtree,
  Plane,
  Scan,
  Settings,
  Sparkles,
  TreePine,
  Zap,
  ZapIcon
} from 'lucide-react';

interface SceneCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface SceneClassification {
  id: string;
  label: string;
  confidence: number;
  category: string;
  features: string[];
}

interface ClassificationResult {
  imageId: string;
  imageName: string;
  scenes: SceneClassification[];
  primaryScene: string;
  processedAt: Date;
  processingTime: number;
  modelUsed: string;
}

interface SceneClassificationProps {
  onCancel?: () => void;
  onRunClassification?: (imageId: string) => Promise<void>;
}

const DEFAULT_CATEGORIES: SceneCategory[] = [
  {
    id: 'indoor',
    name: 'Indoor',
    icon: Home,
    description: 'Indoor scenes (home, office, restaurant)',
  },
  {
    id: 'outdoor',
    name: 'Outdoor',
    icon: TreePine,
    description: 'Outdoor scenes (park, street, garden)',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: Plane,
    description: 'Travel destinations (landmarks, cities)',
  },
  {
    id: 'nature',
    name: 'Nature',
    icon: Mountain,
    description: 'Nature scenes (mountains, beaches, forests)',
  },
  {
    id: 'beach',
    name: 'Beach',
    icon: Palmtree,
    description: 'Beach and water scenes',
  },
  {
    id: 'urban',
    name: 'Urban',
    icon: Building,
    description: 'Urban scenes (cities, architecture)',
  },
];

const DEFAULT_RESULTS: ClassificationResult[] = [
  {
    imageId: 'img-1',
    imageName: 'family-vacation.jpg',
    scenes: [
      {
        id: 'scene-1',
        label: 'beach',
        confidence: 0.92,
        category: 'nature',
        features: ['sand', 'ocean', 'sky', 'sunlight'],
      },
      {
        id: 'scene-2',
        label: 'outdoor',
        confidence: 0.88,
        category: 'outdoor',
        features: ['natural lighting', 'open space', 'horizon'],
      },
      {
        id: 'scene-3',
        label: 'travel',
        confidence: 0.75,
        category: 'travel',
        features: ['tourist destination', 'landmark', 'scenic'],
      },
    ],
    primaryScene: 'beach',
    processedAt: new Date('2024-01-12'),
    processingTime: 0.6,
    modelUsed: 'ResNet50',
  },
];

export default function SceneClassification({ onCancel, onRunClassification }: SceneClassificationProps) {
  const [results, setResults] = useState<ClassificationResult[]>(DEFAULT_RESULTS);
  const [categories, setCategories] = useState<SceneCategory[]>(DEFAULT_CATEGORIES);
  const [showSettings, setShowSettings] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalScenes = results.reduce((sum, r) => sum + r.scenes.length, 0);
  const avgConfidence = totalScenes > 0 ? results.reduce((sum, r) => sum + r.scenes.reduce((s, o) => s + o.confidence, 0), 0) / totalScenes : 0;
  const avgProcessingTime = results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    const Icon = cat?.icon || ImageIcon;
    return <Icon className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'indoor':
        return 'text-amber-500';
      case 'outdoor':
        return 'text-green-500';
      case 'travel':
        return 'text-blue-500';
      case 'nature':
        return 'text-teal-500';
      case 'beach':
        return 'text-cyan-500';
      case 'urban':
        return 'text-purple-500';
      default:
        return 'text-slate-500';
    }
  };

  const handleRunClassification = async (imageId: string) => {
    setIsProcessing(true);
    await onRunClassification?.(imageId);
    setIsProcessing(false);
  };

  const filteredScenes = results.flatMap(r => 
    r.scenes.filter(s => 
      s.confidence >= confidenceThreshold &&
      (selectedCategory === 'all' || s.category === selectedCategory)
    )
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <ImageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Phân loại cảnh
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalScenes} scenes classified
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
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt scene classification
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
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-classify on upload
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Multi-label classification
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
            <ImageIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Scenes</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalScenes}
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
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Categories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {categories.length}
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
                ? 'bg-purple-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('indoor')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'indoor'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Indoor
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('outdoor')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'outdoor'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Outdoor
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('travel')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'travel'
                ? 'bg-purple-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Travel
          </button>
        </div>
      </div>

      {/* Scene Categories */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Scene Categories
        </h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`p-4 rounded-lg border-2 ${
                selectedCategory === category.id
                  ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`p-2 rounded-lg ${getCategoryColor(category.id)}`}>
                  {getCategoryIcon(category.id)}
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {category.name}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classification Results */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Classification Results
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
                      Primary: {result.primaryScene}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunClassification(result.imageId)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Scan className="h-3 w-3" />
                  {isProcessing ? 'Processing...' : 'Re-classify'}
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

              {/* Scene Labels */}
              <div className="space-y-2">
                {result.scenes.filter(s => s.confidence >= confidenceThreshold).map((scene) => (
                  <div
                    key={scene.id}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${getCategoryColor(scene.category)}`}>
                          {getCategoryIcon(scene.category)}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                            {scene.label}
                          </span>
                          <div className={`text-xs ${getCategoryColor(scene.category)} capitalize`}>
                            {scene.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {(scene.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {scene.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-[10px] rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg">
        <p className="text-[10px] text-purple-700 dark:text-purple-400">
          <strong>Lưu ý:</strong> Phân loại cảnh sử dụng computer vision để xác định loại cảnh (nhà, ngoài trời, du lịch, v.v) với 6 scene categories (indoor/outdoor/travel/nature/beach/urban), multi-label classification, confidence thresholding, feature extraction, primary scene detection, và re-classify functionality.
        </p>
      </div>
    </div>
  );
}