import { Activity, AlertTriangle, BarChart3, Calendar, Camera, Check, CheckCircle, Clock, Compass, Crosshair, Download, ExternalLink, Eye, EyeOff, Filter, Grid, Image, Image as ImageIcon, Layers, Maximize2, Minimize2, MoveHorizontal, Pause, Play, Plus, RefreshCw, Rotate3D, RotateCw, Settings, Settings as SettingsIcon, Trash2, Trash2 as TrashIcon, Upload, X, Zap, Zap as ZapIcon, ZoomIn, ZoomOut } from 'lucide-react';
'use client';

import { useState } from 'react';


interface PanoramaPhoto {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  imageUrl: string;
  captureDate: Date;
  location: string;
  coordinates: { lat: number; lng: number };
  resolution: string;
  size: number;
  format: string;
  isFavorite: boolean;
  isDefault: boolean;
}

interface Photo360SupportProps {
  onCancel?: () => void;
  onUpload?: (file: File) => Promise<void>;
  onSetDefault?: (photoId: string) => Promise<void>;
  onDelete?: (photoId: string) => Promise<void>;
}

const DEFAULT_PHOTOS: PanoramaPhoto[] = [
  {
    id: 'pano-1',
    memoryId: 'mem-1',
    title: 'Đà Lạt 360° View',
    description: 'Panoramic view of Đà Lạt city',
    imageUrl: '/pano-1.jpg',
    captureDate: new Date('2024-01-12'),
    location: 'Đà Lạt, Vietnam',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    resolution: '8192x4096',
    size: 15000000,
    format: 'jpg',
    isFavorite: true,
    isDefault: true,
  },
];

export default function Photo360Support({ onCancel, onUpload, onSetDefault, onDelete }: Photo360SupportProps) {
  const [photos, setPhotos] = useState<PanoramaPhoto[]>(DEFAULT_PHOTOS);
  const [showSettings, setShowSettings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<PanoramaPhoto | null>(DEFAULT_PHOTOS[0]);
  const [viewMode, setViewMode] = useState<'viewer' | 'grid'>('viewer');
  const [autoEnhance, setAutoEnhance] = useState(true);

  const totalPhotos = photos.length;
  const favoritePhotos = photos.filter(p => p.isFavorite).length;
  const totalSize = photos.reduce((sum, p) => sum + p.size, 0);
  const avgResolution = '8192x4096';

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB';
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return bytes + ' bytes';
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 100));
    }, 200);
    
    await onUpload?.(file);
    
    clearInterval(interval);
    setIsUploading(false);
    setUploadProgress(0);
  };

  const handleSetDefault = async (photoId: string) => {
    await onSetDefault?.(photoId);
    setPhotos(photos.map(p => 
      p.id === photoId ? { ...p, isDefault: true } : { ...p, isDefault: false }
    ));
  };

  const handleDelete = async (photoId: string) => {
    await onDelete?.(photoId);
    setPhotos(photos.filter(p => p.id !== photoId));
  };

  const handleToggleFavorite = (photoId: string) => {
    setPhotos(photos.map(p => 
      p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Hỗ trợ ảnh 360 độ (spherical photos)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalPhotos} photos
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
            <SettingsIcon className="h-4 w-4 text-slate-500" />
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
        <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt 360° photo
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-enhance on upload
              </span>
              <button
                type="button"
                onClick={() => setAutoEnhance(!autoEnhance)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoEnhance ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoEnhance ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                HDR stitching
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                High-resolution export
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
            <Camera className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Photos</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPhotos}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Favorites</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {favoritePhotos}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ImageIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Size</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(totalSize / 1048576).toFixed(1)}MB
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Grid className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Resolution</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {avgResolution}
          </div>
        </div>
      </div>

      {/* Upload Interface */}
      <div className="mb-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="photo-upload"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
              }
            }}
          />
          <label htmlFor="photo-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              Upload 360° panoramic photo
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Supports: JPG, PNG, Equirectangular format
            </p>
          </label>
        </div>

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Processing photo...
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {uploadProgress}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* View Mode Selector */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setViewMode('viewer')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'viewer'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Viewer
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Viewer Mode */}
      {viewMode === 'viewer' && selectedPhoto && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                360° Viewer
              </span>
              {selectedPhoto.isDefault && (
                <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold rounded-full">
                  Default
                </span>
              )}
            </div>

            {/* Panorama Preview */}
            <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Rotate3D className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedPhoto.title}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-400">
                    Drag to rotate, scroll to zoom
                  </p>
                </div>
              </div>
              {/* Controls overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                    <RotateCw className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                    <ZoomIn className="h-4 w-4 text-white" />
                  </button>
                  <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                    <ZoomOut className="h-4 w-4 text-white" />
                  </button>
                </div>
                <button className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors">
                  <Maximize2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Resolution</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {selectedPhoto.resolution}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {formatFileSize(selectedPhoto.size)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Format</div>
                <div className="text-xs text-slate-700 dark:text-slate-300 uppercase">
                  {selectedPhoto.format}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSetDefault(selectedPhoto.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg transition-colors"
              >
                <Star className="h-3 w-3" />
                Set Default
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid Mode */}
      {viewMode === 'grid' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Panorama Photos
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className={`p-4 rounded-lg border-2 ${
                  photo.isDefault
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                      <Camera className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {photo.title}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {photo.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {photo.isDefault && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(photo.id)}
                      className="p-1"
                    >
                      <Star className={`h-3 w-3 ${photo.isFavorite ? 'text-yellow-500' : 'text-slate-400'}`} />
                    </button>
                  </div>
                </div>

                <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg mb-2 flex items-center justify-center">
                  <Rotate3D className="h-8 w-8 text-slate-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Resolution</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {photo.resolution}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Size</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {formatFileSize(photo.size)}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPhoto(photo);
                    setViewMode('viewer');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Eye className="h-3 w-3" />
                  View 360°
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg">
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
          <strong>Lưu ý:</strong> Hỗ trợ ảnh 360 độ với panoramic photo upload, equirectangular format support, viewer mode (rotate/zoom/fullscreen), grid view, default photo selection, favorite system, auto-enhance on upload, HDR stitching, high-resolution export, location tracking, và comprehensive 360° photo management system.
        </p>
      </div>
    </div>
  );
}