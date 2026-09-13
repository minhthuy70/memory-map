'use client';

import { useState } from 'react';
import { X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Play, Pause, Download, Trash2, Settings as SettingsIcon, Map, RefreshCw, Check, Zap as ZapIcon, Plus, MapPin, Layers, LayoutGrid, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, AlignLeft, AlignCenter, AlignRight, Palette, Type as TypeIcon, Sparkles, Share2, ExternalLink, Download as DownloadIcon, Eye, EyeOff, Trash2 as TrashIcon, Map as MapIcon, Navigation, Globe, Compass, Route, DollarSign, Printer, CopyRight, Filter as FilterIcon, Satellite, Mountain, Waves, TreePine, Building } from 'lucide-react';

interface MapLocation {
  id: string;
  title: string;
  description: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  date: Date;
  isSelected: boolean;
}

interface MapPosterConfig {
  size: 'A3' | 'A2' | 'A1' | 'Custom';
  mapStyle: 'satellite' | 'terrain' | 'street' | 'minimal';
  showRoute: boolean;
  showLabels: boolean;
  showPhotos: boolean;
  quantity: number;
  totalPrice: number;
}

interface PrintMapPosterProps {
  onCancel?: () => void;
  onPrint?: (config: MapPosterConfig, locations: MapLocation[]) => Promise<void>;
  onPreview?: (config: MapPosterConfig, locations: MapLocation[]) => Promise<void>;
}

const DEFAULT_LOCATIONS: MapLocation[] = [
  {
    id: 'loc-1',
    title: 'Đà Lạt',
    description: 'Morning mist adventure',
    coordinates: { lat: 11.9405, lng: 108.4583 },
    imageUrl: '/loc-1.jpg',
    date: new Date('2024-01-12'),
    isSelected: true,
  },
  {
    id: 'loc-2',
    title: 'Nha Trang',
    description: 'Beach relaxation',
    coordinates: { lat: 12.2380, lng: 109.1967 },
    imageUrl: '/loc-2.jpg',
    date: new Date('2024-02-15'),
    isSelected: true,
  },
  {
    id: 'loc-3',
    title: 'Hanoi',
    description: 'City exploration',
    coordinates: { lat: 21.0285, lng: 105.8542 },
    imageUrl: '/loc-3.jpg',
    date: new Date('2024-03-20'),
    isSelected: true,
  },
];

const PRICING = {
  A3: 20,
  A2: 30,
  A1: 50,
  Custom: 60,
};

export default function PrintMapPoster({ onCancel, onPrint, onPreview }: PrintMapPosterProps) {
  const [locations, setLocations] = useState<MapLocation[]>(DEFAULT_LOCATIONS);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<MapLocation[]>(DEFAULT_LOCATIONS.filter(l => l.isSelected));
  const [config, setConfig] = useState<MapPosterConfig>({
    size: 'A3',
    mapStyle: 'satellite',
    showRoute: true,
    showLabels: true,
    showPhotos: true,
    quantity: 1,
    totalPrice: 20,
  });
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const selectedCount = selectedLocations.length;
  const basePrice = PRICING[config.size];
  const totalPrice = basePrice * config.quantity;

  const handleToggleLocation = (locationId: string) => {
    setLocations(locations.map(l => 
      l.id === locationId ? { ...l, isSelected: !l.isSelected } : l
    ));
    setSelectedLocations(locations.filter(l => l.id === locationId ? !l.isSelected : l.isSelected));
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    await onPrint?.(config, selectedLocations);
    setIsPrinting(false);
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    await onPreview?.(config, selectedLocations);
    setIsPreviewing(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              In bản đồ hành trình dạng poster
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {selectedCount} locations selected
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
            Cài đặt map poster
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-route optimization
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                High-resolution map
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Print-ready format
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
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locations</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {locations.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Selected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {selectedCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CopyRight className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Quantity</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {config.quantity}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            ${totalPrice}
          </div>
        </div>
      </div>

      {/* Map Poster Configuration */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Map Poster Configuration
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Poster Size
              </label>
              <select
                value={config.size}
                onChange={(e) => setConfig({ ...config, size: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="A3">A3</option>
                <option value="A2">A2</option>
                <option value="A1">A1</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                Map Style
              </label>
              <select
                value={config.mapStyle}
                onChange={(e) => setConfig({ ...config, mapStyle: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
              >
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
                <option value="street">Street</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.showRoute}
                  onChange={(e) => setConfig({ ...config, showRoute: e.target.checked })}
                  className="rounded"
                />
                Show Route
              </label>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.showLabels}
                  onChange={(e) => setConfig({ ...config, showLabels: e.target.checked })}
                  className="rounded"
                />
                Show Labels
              </label>
            </div>
            <div className="flex-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
                <input
                  type="checkbox"
                  checked={config.showPhotos}
                  onChange={(e) => setConfig({ ...config, showPhotos: e.target.checked })}
                  className="rounded"
                />
                Show Photos
              </label>
            </div>
          </div>

          <div className="mt-3">
            <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={config.quantity}
              onChange={(e) => setConfig({ ...config, quantity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-lg text-sm text-slate-700 dark:text-slate-300"
            />
          </div>

          <div className="mt-3 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Total Price
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                ${totalPrice}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ${basePrice} per poster × {config.quantity} copies
            </p>
          </div>
        </div>
      </div>

      {/* Location Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Select Map Locations
        </h4>
        <div className="space-y-2">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                location.isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
              onClick={() => handleToggleLocation(location.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {location.title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(location.date)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {location.isSelected && (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Preview */}
      <div className="mb-4">
        <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Map Preview
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <ZoomIn className="h-4 w-4 text-slate-500" />
              </button>
              <button className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-lg transition-colors">
                <Maximize2 className="h-4 w-4 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Map Preview Area */}
          <div className="aspect-video bg-slate-200 dark:bg-slate-600 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {config.size} - {config.mapStyle}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  {config.showRoute ? 'With route' : 'No route'}
                </p>
              </div>
            </div>

            {/* Map Pins */}
            {selectedLocations.map((location, index) => (
              <div
                key={location.id}
                className="absolute w-4 h-4 bg-emerald-500 rounded-full"
                style={{
                  top: `${20 + index * 20}%`,
                  left: `${20 + index * 25}%`,
                }}
              />
            ))}

            {/* Route Line */}
            {config.showRoute && selectedLocations.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d={`M ${selectedLocations[0]?.coordinates.lng || 50} ${selectedLocations[0]?.coordinates.lat || 50} L ${selectedLocations[1]?.coordinates.lng || 70} ${selectedLocations[1]?.coordinates.lat || 70}`}
                  stroke="#10b981"
                  strokeWidth="2"
                  fill="none"
                  className="opacity-50"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handlePreview}
          disabled={isPreviewing || selectedCount === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPreviewing ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Previewing...
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Preview
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handlePrint}
          disabled={isPrinting || selectedCount === 0}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPrinting ? (
            <>
              <Activity className="h-4 w-4 animate-spin" />
              Printing...
            </>
          ) : (
            <>
              <Printer className="h-4 w-4" />
              Print Poster
            </>
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-lg">
        <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
          <strong>Lưu ý:</strong> In bản đồ hành trình dạng poster với poster size selection (A3/A2/A1/Custom), map style options (satellite/terrain/street/minimal), route visualization, labels, photo markers, location selection, preview mode, pricing calculation, auto-route optimization, high-resolution map, và comprehensive print map poster system.
        </p>
      </div>
    </div>
  );
}