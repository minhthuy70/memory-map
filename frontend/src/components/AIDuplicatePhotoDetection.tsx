'use client';

import { useState } from 'react';
import { Copy, X, RefreshCw, Info, CheckCircle, Star, Zap, Image as ImageIcon, Layers, Trash2 } from 'lucide-react';

interface AIDuplicatePhotoDetectionProps {
  onCancel?: () => void;
}

interface DuplicateGroup {
  id: string;
  photos: DetectedPhoto[];
  similarity: number;
  groupType: 'exact' | 'near' | 'similar';
  createdAt: string;
}

interface DetectedPhoto {
  id: string;
  name: string;
  size: number;
  date: string;
  isOriginal: boolean;
}

interface DetectionSettings {
  autoDetect: boolean;
  similarityThreshold: number;
  checkBy: 'content' | 'hash' | 'metadata';
  autoDelete: boolean;
}

export default function AIDuplicatePhotoDetection({ onCancel }: AIDuplicatePhotoDetectionProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDetectionEnabled, setIsDetectionEnabled] = useState(true);

  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([
    { 
      id: '1', 
      photos: [
        { id: '1', name: 'photo_1.jpg', size: 2.5, date: '2024-01-15', isOriginal: true },
        { id: '2', name: 'photo_1_copy.jpg', size: 2.5, date: '2024-01-16', isOriginal: false },
        { id: '3', name: 'photo_1_copy2.jpg', size: 2.5, date: '2024-01-17', isOriginal: false },
      ],
      similarity: 100,
      groupType: 'exact',
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      photos: [
        { id: '4', name: 'sunset_1.jpg', size: 3.2, date: '2024-02-20', isOriginal: true },
        { id: '5', name: 'sunset_2.jpg', size: 3.1, date: '2024-02-21', isOriginal: false },
      ],
      similarity: 95,
      groupType: 'near',
      createdAt: '2024-02-20'
    },
    { 
      id: '3', 
      photos: [
        { id: '6', name: 'beach_day.jpg', size: 4.5, date: '2024-03-10', isOriginal: true },
        { id: '7', name: 'beach_similar.jpg', size: 4.0, date: '2024-03-11', isOriginal: false },
      ],
      similarity: 85,
      groupType: 'similar',
      createdAt: '2024-03-10'
    },
  ]);

  const [detectionSettings, setDetectionSettings] = useState<DetectionSettings>({
    autoDetect: true,
    similarityThreshold: 90,
    checkBy: 'content',
    autoDelete: false,
  });

  const runDetection = () => {
    const groupTypes: Array<'exact' | 'near' | 'similar'> = ['exact', 'near', 'similar'];
    const newGroup: DuplicateGroup = {
      id: Date.now().toString(),
      photos: [
        { id: Date.now().toString(), name: `photo_${Date.now()}.jpg`, size: Math.random() * 3 + 2, date: new Date().toISOString().split('T')[0], isOriginal: true },
        { id: (Date.now() + 1).toString(), name: `photo_${Date.now()}_copy.jpg`, size: Math.random() * 3 + 2, date: new Date().toISOString().split('T')[0], isOriginal: false },
      ],
      similarity: Math.floor(Math.random() * 20) + 80,
      groupType: groupTypes[Math.floor(Math.random() * groupTypes.length)],
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDuplicateGroups([...duplicateGroups, newGroup]);
  };

  const deleteDuplicate = (groupId: string, photoId: string) => {
    setDuplicateGroups(duplicateGroups.map(group => 
      group.id === groupId 
        ? { ...group, photos: group.photos.filter(p => p.id !== photoId) }
        : group
    ));
  };

  const markAsOriginal = (groupId: string, photoId: string) => {
    setDuplicateGroups(duplicateGroups.map(group => 
      group.id === groupId 
        ? { ...group, photos: group.photos.map(p => p.id === photoId ? { ...p, isOriginal: true } : { ...p, isOriginal: false }) }
        : group
    ));
  };

  const getGroupTypeColor = (type: string) => {
    switch (type) {
      case 'exact': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'near': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'similar': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-400 to-gray-500 rounded-xl">
            <Copy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Duplicate Photo Detection
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Detect duplicate and similar photos with AI
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Groups</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{duplicateGroups.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Duplicates</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{duplicateGroups.reduce((acc, g) => acc + g.photos.filter(p => !p.isOriginal).length, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Space Saved</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{duplicateGroups.reduce((acc, g) => acc + g.photos.filter(p => !p.isOriginal).reduce((a, p) => a + p.size, 0), 0).toFixed(1)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Similarity</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(duplicateGroups.reduce((acc, g) => acc + g.similarity, 0) / duplicateGroups.length).toFixed(0)}%</p>
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
            onClick={runDetection}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Copy className="h-3 w-3" />
            Run Detection
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
                <Star className="h-4 w-4 text-slate-400" />
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
                <Layers className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Similarity Threshold</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={detectionSettings.similarityThreshold}
                  onChange={(e) => setDetectionSettings({ ...detectionSettings, similarityThreshold: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{detectionSettings.similarityThreshold}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Check By</span>
              </div>
              <select
                value={detectionSettings.checkBy}
                onChange={(e) => setDetectionSettings({ ...detectionSettings, checkBy: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="content">Content</option>
                <option value="hash">Hash</option>
                <option value="metadata">Metadata</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Trash2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Delete Duplicates</span>
              </div>
              <input
                type="checkbox"
                checked={detectionSettings.autoDelete}
                onChange={(e) => setDetectionSettings({ ...detectionSettings, autoDelete: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Duplicate Groups</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {duplicateGroups.map((group) => (
              <div key={group.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Copy className="h-4 w-4 text-slate-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">Group {group.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getGroupTypeColor(group.groupType)}`}>
                          {group.groupType}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{group.similarity}% similarity</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {group.photos.length} photos • {group.photos.reduce((acc, p) => acc + p.size, 0).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{group.createdAt}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {group.photos.map((photo) => (
                    <div key={photo.id} className={`p-2 rounded border ${photo.isOriginal ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-3 w-3 text-slate-400" />
                          <span className="text-xs text-slate-900 dark:text-white">{photo.name}</span>
                          {photo.isOriginal && (
                            <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                              Original
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {!photo.isOriginal && (
                            <button
                              type="button"
                              onClick={() => deleteDuplicate(group.id, photo.id)}
                              className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          )}
                          {!photo.isOriginal && (
                            <button
                              type="button"
                              onClick={() => markAsOriginal(group.id, photo.id)}
                              className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Set Original
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Duplicate Detection Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI detects duplicate and similar photos</li>
              <li>• Group types: exact, near, similar matches</li>
              <li>• Check by: content, hash, or metadata</li>
              <li>• Auto-delete duplicates option available</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
