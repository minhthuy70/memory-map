'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Eye,
  EyeOff,
  Image,
  Info,
  RefreshCw,
  Shield,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Upload,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

interface NSFWImageDetectionProps {
  onCancel?: () => void;
}

interface DetectedImage {
  id: string;
  name: string;
  url: string;
  nsfwScore: number;
  categories: {
    explicit: number;
    suggestive: number;
    safe: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  detectedAt: string;
}

export default function NSFWImageDetection({ onCancel }: NSFWImageDetectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [threshold, setThreshold] = useState(70);
  const [autoReject, setAutoReject] = useState(true);

  const [detectedImages, setDetectedImages] = useState<DetectedImage[]>([
    { id: '1', name: 'photo_001.jpg', url: '/placeholder.jpg', nsfwScore: 85, categories: { explicit: 85, suggestive: 10, safe: 5 }, status: 'pending', detectedAt: '2026-09-14' },
    { id: '2', name: 'photo_002.jpg', url: '/placeholder.jpg', nsfwScore: 45, categories: { explicit: 10, suggestive: 35, safe: 55 }, status: 'approved', detectedAt: '2026-09-13' },
    { id: '3', name: 'photo_003.jpg', url: '/placeholder.jpg', nsfwScore: 92, categories: { explicit: 92, suggestive: 5, safe: 3 }, status: 'rejected', detectedAt: '2026-09-12' },
    { id: '4', name: 'photo_004.jpg', url: '/placeholder.jpg', nsfwScore: 15, categories: { explicit: 5, suggestive: 10, safe: 85 }, status: 'approved', detectedAt: '2026-09-11' },
  ]);

  const [stats, setStats] = useState({
    totalScanned: 15420,
    detectedNSFW: 325,
    falsePositives: 5,
    accuracy: 94.2,
  });

  const approveImage = (id: string) => {
    setDetectedImages(detectedImages.map(img => img.id === id ? { ...img, status: 'approved' } : img));
  };

  const rejectImage = (id: string) => {
    setDetectedImages(detectedImages.map(img => img.id === id ? { ...img, status: 'rejected' } : img));
  };

  const deleteImage = (id: string) => {
    setDetectedImages(detectedImages.filter(img => img.id !== id));
  };

  const scanNewImages = () => {
    // Simulate scanning new images
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'rejected': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              NSFW Image Detection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI-powered inappropriate content detection
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Scanned</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalScanned.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Detected NSFW</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.detectedNSFW}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Accuracy</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.accuracy}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">False Positives</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.falsePositives}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={scanNewImages}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Scan New Images
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <Upload className="h-3 w-3" />
            Upload Test Image
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detection Settings</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">NSFW Threshold (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-slate-500 dark:text-slate-400">{threshold}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoReject(!autoReject)}
                className={`p-2 rounded-lg transition-colors ${autoReject ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
              >
                {autoReject ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              </button>
              <span className="text-xs text-slate-700 dark:text-slate-300">Auto Reject Above Threshold</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detected Images</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {detectedImages.map((image) => (
              <div key={image.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{image.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(image.status)}`}>
                        {image.status}
                      </span>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-500 dark:text-slate-400">NSFW Score</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{image.nsfwScore}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${getScoreColor(image.nsfwScore)}`} style={{ width: `${image.nsfwScore}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Explicit:</span>
                        <span className="text-slate-900 dark:text-white ml-1">{image.categories.explicit}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Suggestive:</span>
                        <span className="text-slate-900 dark:text-white ml-1">{image.categories.suggestive}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Safe:</span>
                        <span className="text-slate-900 dark:text-white ml-1">{image.categories.safe}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => approveImage(image.id)}
                    className="flex-1 px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectImage(image.id)}
                    className="flex-1 px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-1"
                  >
                    <EyeOff className="h-3 w-3" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteImage(image.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Detection Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Adjust threshold based on your community standards</li>
              <li>• Review borderline cases manually</li>
              <li>• Monitor false positive rate</li>
              <li>• Regularly retrain model for better accuracy</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
