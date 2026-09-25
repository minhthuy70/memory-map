'use client';

import { useState } from 'react';
import {
  as,
  CheckCircle,
  Clock,
  Download,
  Film,
  Image,
  ImageIcon,
  Info,
  Play,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface AutoMemoryMovieMakerProps {
  onCancel?: () => void;
}

interface GeneratedMovie {
  id: string;
  title: string;
  duration: number;
  memoryCount: number;
  style: 'cinematic' | 'slideshow' | 'dynamic' | 'peaceful';
  music: string;
  transitions: string;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
  thumbnail: string;
}

interface MovieSettings {
  autoGenerate: boolean;
  defaultStyle: 'cinematic' | 'slideshow' | 'dynamic' | 'peaceful';
  defaultDuration: number;
  includeMusic: boolean;
  autoTransitions: boolean;
}

export default function AutoMemoryMovieMaker({ onCancel }: AutoMemoryMovieMakerProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isMakerEnabled, setIsMakerEnabled] = useState(true);

  const [generatedMovies, setGeneratedMovies] = useState<GeneratedMovie[]>([
    { id: '1', title: 'Summer Vacation 2024', duration: 180, memoryCount: 45, style: 'cinematic', music: 'upbeat', transitions: 'fade', createdAt: '2024-01-15', status: 'completed', thumbnail: '🎬' },
    { id: '2', title: 'Family Gatherings', duration: 240, memoryCount: 32, style: 'dynamic', music: 'emotional', transitions: 'slide', createdAt: '2024-02-20', status: 'completed', thumbnail: '🎬' },
  ]);

  const [movieSettings, setMovieSettings] = useState<MovieSettings>({
    autoGenerate: false,
    defaultStyle: 'cinematic',
    defaultDuration: 180,
    includeMusic: true,
    autoTransitions: true,
  });

  const generateMovie = () => {
    const styles: Array<'cinematic' | 'slideshow' | 'dynamic' | 'peaceful'> = ['cinematic', 'slideshow', 'dynamic', 'peaceful'];
    const newMovie: GeneratedMovie = {
      id: Date.now().toString(),
      title: `Memory Movie ${generatedMovies.length + 1}`,
      duration: movieSettings.defaultDuration,
      memoryCount: Math.floor(Math.random() * 40) + 20,
      style: movieSettings.defaultStyle,
      music: 'upbeat',
      transitions: 'fade',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
      thumbnail: '🎬',
    };
    setGeneratedMovies([...generatedMovies, newMovie]);
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'cinematic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'slideshow': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'dynamic': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'peaceful': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl">
            <Film className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Auto Memory Movie Maker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create short movies from photo + video memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isMakerEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isMakerEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Movies</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{generatedMovies.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Duration</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(generatedMovies.reduce((acc, m) => acc + m.duration, 0) / generatedMovies.length).toFixed(0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Memories</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{generatedMovies.reduce((acc, m) => acc + m.memoryCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Styles</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{4}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isMakerEnabled}
              onChange={(e) => setIsMakerEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Maker</span>
          </div>
          <button
            type="button"
            onClick={generateMovie}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Film className="h-3 w-3" />
            Generate Movie
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Movie Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-red-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={movieSettings.autoGenerate}
                onChange={(e) => setMovieSettings({ ...movieSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Film className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Style</span>
              </div>
              <select
                value={movieSettings.defaultStyle}
                onChange={(e) => setMovieSettings({ ...movieSettings, defaultStyle: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="cinematic">Cinematic</option>
                <option value="slideshow">Slideshow</option>
                <option value="dynamic">Dynamic</option>
                <option value="peaceful">Peaceful</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Duration</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="60"
                  max="600"
                  value={movieSettings.defaultDuration}
                  onChange={(e) => setMovieSettings({ ...movieSettings, defaultDuration: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{movieSettings.defaultDuration}s</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Music</span>
              </div>
              <input
                type="checkbox"
                checked={movieSettings.includeMusic}
                onChange={(e) => setMovieSettings({ ...movieSettings, includeMusic: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Transitions</span>
              </div>
              <input
                type="checkbox"
                checked={movieSettings.autoTransitions}
                onChange={(e) => setMovieSettings({ ...movieSettings, autoTransitions: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generated Movies</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {generatedMovies.map((movie) => (
              <div key={movie.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{movie.thumbnail}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{movie.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStyleColor(movie.style)}`}>
                          {movie.style}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(movie.status)}`}>
                          {movie.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{movie.memoryCount} memories • {movie.duration}s • {movie.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>Music: {movie.music}</span>
                    <span>•</span>
                    <span>Transitions: {movie.transitions}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Play
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Film className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Movie Maker Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI creates short movies from photo + video memories</li>
              <li>• Styles: cinematic, slideshow, dynamic, peaceful</li>
              <li>• Adjustable duration (60-600s)</li>
              <li>• Music and transitions options available</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
