'use client';

import { useState } from 'react';
import {
  as,
  Brush,
  CheckCircle,
  Download,
  Image,
  ImageIcon,
  Info,
  Palette,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface AIStyleTransferProps {
  onCancel?: () => void;
}

interface StyledPhoto {
  id: string;
  originalName: string;
  styledName: string;
  originalSize: number;
  styledSize: number;
  styleName: string;
  styleArtist: string;
  processedAt: string;
  similarity: number;
  status: 'processing' | 'completed' | 'failed';
}

interface ArtStyle {
  id: string;
  name: string;
  artist: string;
  description: string;
  preview: string;
  isActive: boolean;
}

interface StyleTransferSettings {
  autoTransfer: boolean;
  intensity: number;
  preserveDetails: boolean;
  applyToAll: boolean;
}

export default function AIStyleTransfer({ onCancel }: AIStyleTransferProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isTransferEnabled, setIsTransferEnabled] = useState(true);

  const [styledPhotos, setStyledPhotos] = useState<StyledPhoto[]>([
    { id: '1', originalName: 'photo_1.jpg', styledName: 'photo_1_van_gogh.jpg', originalSize: 3.5, styledSize: 4.2, styleName: 'Starry Sunset', styleArtist: 'Van Gogh', processedAt: '2024-01-15', similarity: 85, status: 'completed' },
    { id: '2', originalName: 'photo_2.jpg', styledName: 'photo_2_monet.jpg', originalSize: 2.8, styledSize: 3.5, styleName: 'Water Lilies', styleArtist: 'Monet', processedAt: '2024-02-20', similarity: 88, status: 'completed' },
    { id: '3', originalName: 'photo_3.jpg', styledName: 'photo_3_anime.jpg', originalSize: 4.2, styledSize: 5.0, styleName: 'Anime Style', styleArtist: 'Anime AI', processedAt: '2024-03-10', similarity: 92, status: 'completed' },
  ]);

  const [artStyles, setArtStyles] = useState<ArtStyle[]>([
    { id: '1', name: 'Starry Sunset', artist: 'Van Gogh', description: 'Impressionist swirls and colors', preview: '🎨', isActive: true },
    { id: '2', name: 'Water Lilies', artist: 'Monet', description: 'Soft impressionist water scene', preview: '🎨', isActive: false },
    { id: '3', name: 'The Scream', artist: 'Munch', description: 'Expressionist emotional style', preview: '🎨', isActive: false },
    { id: '4', name: 'Anime Style', artist: 'Anime AI', description: 'Japanese anime aesthetic', preview: '🎨', isActive: true },
    { id: '5', name: 'Pop Art', artist: 'Warhol', description: 'Bold colors and patterns', preview: '🎨', isActive: false },
  ]);

  const [styleTransferSettings, setStyleTransferSettings] = useState<StyleTransferSettings>({
    autoTransfer: false,
    intensity: 70,
    preserveDetails: true,
    applyToAll: false,
  });

  const transferStyle = () => {
    const activeStyle = artStyles.find(s => s.isActive) || artStyles[0];
    const newPhoto: StyledPhoto = {
      id: Date.now().toString(),
      originalName: `photo_${Date.now()}.jpg`,
      styledName: `photo_${Date.now()}_${activeStyle.name.replace(/\s+/g, '_').toLowerCase()}.jpg`,
      originalSize: Math.random() * 3 + 2,
      styledSize: Math.random() * 3 + 3,
      styleName: activeStyle.name,
      styleArtist: activeStyle.artist,
      processedAt: new Date().toISOString().split('T')[0],
      similarity: Math.floor(Math.random() * 15) + 80,
      status: 'completed',
    };
    setStyledPhotos([...styledPhotos, newPhoto]);
  };

  const selectStyle = (id: string) => {
    setArtStyles(artStyles.map(style => 
      style.id === id ? { ...style, isActive: true } : { ...style, isActive: false }
    ));
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (similarity >= 85) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (similarity >= 80) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-xl">
            <Palette className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Style Transfer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Convert photos to art styles (Van Gogh, Monet, anime...)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isTransferEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isTransferEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Styled</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{styledPhotos.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Similarity</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(styledPhotos.reduce((acc, p) => acc + p.similarity, 0) / styledPhotos.length).toFixed(0)}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Size</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{styledPhotos.reduce((acc, p) => acc + p.styledSize, 0).toFixed(1)} MB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Styles Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{artStyles.filter(s => s.isActive).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isTransferEnabled}
              onChange={(e) => setIsTransferEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Transfer</span>
          </div>
          <button
            type="button"
            onClick={transferStyle}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Palette className="h-3 w-3" />
            Transfer Style
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Art Styles</h4>
          <div className="space-y-2">
            {artStyles.map((style) => (
              <div key={style.id} className={`p-3 rounded-lg border ${style.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{style.preview}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{style.name}</span>
                        {style.isActive && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{style.artist} • {style.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectStyle(style.id)}
                    className={`px-2 py-1 rounded text-xs ${style.isActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                    {style.isActive ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Style Transfer Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Transfer</span>
              </div>
              <input
                type="checkbox"
                checked={styleTransferSettings.autoTransfer}
                onChange={(e) => setStyleTransferSettings({ ...styleTransferSettings, autoTransfer: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Brush className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Intensity</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={styleTransferSettings.intensity}
                  onChange={(e) => setStyleTransferSettings({ ...styleTransferSettings, intensity: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{styleTransferSettings.intensity}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Preserve Details</span>
              </div>
              <input
                type="checkbox"
                checked={styleTransferSettings.preserveDetails}
                onChange={(e) => setStyleTransferSettings({ ...styleTransferSettings, preserveDetails: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Styled Photos</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {styledPhotos.map((photo) => (
              <div key={photo.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="h-4 w-4 text-purple-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.originalName}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{photo.styledName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getSimilarityColor(photo.similarity)}`}>
                          {photo.similarity}% similarity
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {photo.originalSize.toFixed(1)} MB → {photo.styledSize.toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{photo.styleName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{photo.styleArtist}</p>
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Style Transfer Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI transfers art styles to photos</li>
              <li>• Styles: Van Gogh, Monet, Munch, Anime, Pop Art</li>
              <li>• Adjustable intensity and detail preservation</li>
              <li>• Similarity scoring for style accuracy</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
