'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  ClockIcon,
  Compass,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Flag,
  Globe,
  Layers,
  Map,
  MapIcon,
  MapPin,
  Navigation,
  Pause,
  PauseCircle,
  Play,
  PlayCircle,
  Plus,
  RefreshCw,
  Route,
  Settings,
  SettingsIcon,
  SkipBack,
  SkipForward,
  Star,
  Trash2,
  TrashIcon,
  Volume2,
  Zap,
  ZapIcon
} from 'lucide-react';

interface TourLocation {
  id: string;
  memoryId: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  order: number;
  isVisited: boolean;
  isFavorite: boolean;
  duration: number;
}

interface TourRoute {
  id: string;
  name: string;
  description: string;
  locations: TourLocation[];
  totalDuration: number;
  createdAt: Date;
  isActive: boolean;
  progress: number;
}

interface VRWorldTourProps {
  onCancel?: () => void;
  onStartTour?: (routeId: string) => Promise<void>;
  onPauseTour?: () => Promise<void>;
  onGoToLocation?: (locationId: string) => Promise<void>;
  onCreateRoute?: (route: Partial<TourRoute>) => Promise<void>;
}

const DEFAULT_ROUTES: TourRoute[] = [
  {
    id: 'route-1',
    name: 'Vietnam Journey 2024',
    description: 'A virtual tour through Vietnam',
    locations: [
      {
        id: 'loc-1',
        memoryId: 'mem-1',
        title: 'Đà Lạt Morning',
        description: 'Exploring the morning mist in Đà Lạt',
        location: 'Đà Lạt, Vietnam',
        coordinates: { lat: 11.9405, lng: 108.4583 },
        order: 1,
        isVisited: true,
        isFavorite: true,
        duration: 30,
      },
      {
        id: 'loc-2',
        memoryId: 'mem-2',
        title: 'Nha Trang Beach',
        description: 'Relaxing at the beautiful beach',
        location: 'Nha Trang, Vietnam',
        coordinates: { lat: 12.2380, lng: 109.1967 },
        order: 2,
        isVisited: false,
        isFavorite: false,
        duration: 45,
      },
      {
        id: 'loc-3',
        memoryId: 'mem-3',
        title: 'Hanoi Old Quarter',
        description: 'Walking through the historic streets',
        location: 'Hanoi, Vietnam',
        coordinates: { lat: 21.0285, lng: 105.8542 },
        order: 3,
        isVisited: false,
        isFavorite: false,
        duration: 60,
      },
    ],
    totalDuration: 135,
    createdAt: new Date('2024-01-12'),
    isActive: false,
    progress: 33,
  },
];

export default function VRWorldTour({ onCancel, onStartTour, onPauseTour, onGoToLocation, onCreateRoute }: VRWorldTourProps) {
  const [routes, setRoutes] = useState<TourRoute[]>(DEFAULT_ROUTES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<TourRoute | null>(DEFAULT_ROUTES[0]);
  const [isTouring, setIsTouring] = useState(false);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);

  const totalRoutes = routes.length;
  const totalLocations = routes.reduce((sum, r) => sum + r.locations.length, 0);
  const visitedLocations = routes.reduce((sum, r) => sum + r.locations.filter(l => l.isVisited).length, 0);
  const avgDuration = routes.reduce((sum, r) => sum + r.totalDuration, 0) / totalRoutes;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTour = async (routeId: string) => {
    await onStartTour?.(routeId);
    setRoutes(routes.map(r => 
      r.id === routeId ? { ...r, isActive: true } : { ...r, isActive: false }
    ));
    setSelectedRoute(routes.find(r => r.id === routeId) || null);
    setIsTouring(true);
    setCurrentLocationIndex(0);
  };

  const handlePauseTour = async () => {
    await onPauseTour?.();
    setIsTouring(false);
  };

  const handleGoToLocation = async (locationId: string) => {
    await onGoToLocation?.(locationId);
    if (selectedRoute) {
      const index = selectedRoute.locations.findIndex(l => l.id === locationId);
      if (index !== -1) {
        setCurrentLocationIndex(index);
        setRoutes(routes.map(r => 
          r.id === selectedRoute.id 
            ? { 
                ...r, 
                locations: r.locations.map((l, i) => 
                  i === index ? { ...l, isVisited: true } : l
                )
              } 
            : r
        ));
      }
    }
  };

  const handleNextLocation = () => {
    if (selectedRoute && currentLocationIndex < selectedRoute.locations.length - 1) {
      setCurrentLocationIndex(currentLocationIndex + 1);
      const nextLocation = selectedRoute.locations[currentLocationIndex + 1];
      handleGoToLocation(nextLocation.id);
    }
  };

  const handlePreviousLocation = () => {
    if (currentLocationIndex > 0) {
      setCurrentLocationIndex(currentLocationIndex - 1);
      const prevLocation = selectedRoute?.locations[currentLocationIndex - 1];
      if (prevLocation) {
        handleGoToLocation(prevLocation.id);
      }
    }
  };

  const handleToggleFavorite = (locationId: string) => {
    setRoutes(routes.map(r => 
      r.id === selectedRoute?.id 
        ? { 
            ...r, 
            locations: r.locations.map(l => 
              l.id === locationId ? { ...l, isFavorite: !l.isFavorite } : l
            )
          } 
        : r
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Du lịch VR qua tất cả địa điểm kỷ niệm
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalRoutes} routes
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
        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt VR world tour
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-advance locations
              </span>
              <button
                type="button"
                onClick={() => setAutoAdvance(!autoAdvance)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoAdvance ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoAdvance ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Spatial audio
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                360° panorama
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
            <Route className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Routes</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalRoutes}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Locations</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalLocations}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Visited</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {visitedLocations}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <ClockIcon className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Duration</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {formatDuration(avgDuration)}
          </div>
        </div>
      </div>

      {/* Route Selection */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Tour Routes
        </h4>
        <div className="space-y-2">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`p-4 rounded-lg border-2 ${
                route.isActive
                  ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                    <Route className="h-4 w-4 text-teal-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {route.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {route.locations.length} locations • {formatDuration(route.totalDuration)}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartTour(route.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    route.isActive
                      ? 'bg-teal-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {route.isActive ? 'Touring' : 'Start Tour'}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {route.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Progress
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {route.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 transition-all"
                    style={{ width: `${route.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Navigation */}
      {selectedRoute && (
        <div className="mb-4">
          <div className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Current Location
              </span>
              {isTouring && (
                <span className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] font-semibold rounded-full">
                  Touring
                </span>
              )}
            </div>

            {/* Location Info */}
            {selectedRoute.locations[currentLocationIndex] && (
              <div className="mb-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-600/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30">
                    <MapPin className="h-4 w-4 text-teal-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {selectedRoute.locations[currentLocationIndex].title}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedRoute.locations[currentLocationIndex].location}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedRoute.locations[currentLocationIndex].description}
                </p>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={handlePreviousLocation}
                disabled={currentLocationIndex === 0}
                className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={isTouring ? handlePauseTour : () => handleStartTour(selectedRoute.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50 text-teal-600 dark:text-teal-400 text-sm font-semibold rounded-lg transition-colors"
              >
                {isTouring ? (
                  <>
                    <PauseCircle className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4" />
                    Resume
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNextLocation}
                disabled={currentLocationIndex === (selectedRoute.locations.length - 1)}
                className="p-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 rounded-full transition-colors disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            {/* Location Indicator */}
            <div className="flex items-center justify-center gap-2">
              {selectedRoute.locations.map((location, index) => (
                <div
                  key={location.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentLocationIndex
                      ? 'bg-teal-500'
                      : location.isVisited
                      ? 'bg-teal-300'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Location List */}
      {selectedRoute && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Tour Locations
          </h4>
          <div className="space-y-2">
            {selectedRoute.locations.map((location, index) => (
              <div
                key={location.id}
                className={`p-4 rounded-lg border-2 ${
                  index === currentLocationIndex
                    ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                    {index + 1}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {location.title}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {location.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {location.isVisited && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(location.id)}
                      className="p-1"
                    >
                      <Star className={`h-3 w-3 ${location.isFavorite ? 'text-yellow-500' : 'text-slate-400'}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Duration</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {formatDuration(location.duration)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Coordinates</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Status</div>
                    <div className={`text-xs ${location.isVisited ? 'text-green-500' : 'text-slate-500'}`}>
                      {location.isVisited ? 'Visited' : 'Pending'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoToLocation(location.id)}
                  className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                >
                  <Navigation className="h-3 w-3" />
                  Go to Location
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Du lịch VR qua tất cả địa điểm kỷ niệm với route creation, location management (add/arrange), GPS coordinates, tour navigation (next/previous/go to), progress tracking, auto-advance locations, favorite locations, visited status, spatial audio, 360° panorama, và comprehensive VR world tour experience.
        </p>
      </div>
    </div>
  );
}