'use client';

import { useState } from 'react';
import { X, Settings, Upload, CheckCircle, AlertTriangle, Loader2, MapPin, Navigation, Route, Waypoints, Calendar, Clock, Gauge, Map, Layers, Filter, Eye, Check, Play, Pause, SkipForward, RefreshCw, ChevronDown, ChevronUp, FileText, Globe } from 'lucide-react';

interface ImportFromGPXTrackProps {
  onCancel?: () => void;
  onImport?: (files: File[]) => void;
}

interface GPXPoint {
  lat: number;
  lon: number;
  ele?: number;
  time?: string;
  name?: string;
  desc?: string;
}

interface GPXTrack {
  name: string;
  points: GPXPoint[];
  totalDistance: number;
  duration: number;
  elevationGain: number;
  elevationLoss: number;
}

export default function ImportFromGPXTrack({ onCancel, onImport }: ImportFromGPXTrackProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [parsedTracks, setParsedTracks] = useState<GPXTrack[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [showTrackDetails, setShowTrackDetails] = useState(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(null);
  const [importAs, setImportAs] = useState<'memory' | 'journey' | 'route'>('memory');
  const [createMemoriesFromPoints, setCreateMemoriesFromPoints] = useState(true);
  const [pointInterval, setPointInterval] = useState<number>(5);
  const [attachPhotos, setAttachPhotos] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<'idle' | 'parsing' | 'processing' | 'creating_memories' | 'validating' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [autoDetectWaypoints, setAutoDetectWaypoints] = useState(true);
  const [waypointThreshold, setWaypointThreshold] = useState<number>(100);
  const [elevationSmoothing, setElevationSmoothing] = useState(true);
  const [smoothingWindow, setSmoothingWindow] = useState<number>(3);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setParsedTracks([]);
      setSelectedTracks([]);
    }
  };

  const parseGPX = (content: string): GPXTrack[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    const tracks: GPXTrack[] = [];

    const trackElements = xmlDoc.querySelectorAll('trk');
    trackElements.forEach((trk) => {
      const name = trk.querySelector('name')?.textContent || 'Unnamed Track';
      const points: GPXPoint[] = [];

      const trackSegs = trk.querySelectorAll('trkseg');
      trackSegs.forEach((seg) => {
        const trackPoints = seg.querySelectorAll('trkpt');
        trackPoints.forEach((pt) => {
          const lat = parseFloat(pt.getAttribute('lat') || '0');
          const lon = parseFloat(pt.getAttribute('lon') || '0');
          const ele = pt.querySelector('ele')?.textContent;
          const time = pt.querySelector('time')?.textContent;
          const pointName = pt.querySelector('name')?.textContent;
          const desc = pt.querySelector('desc')?.textContent;

          points.push({
            lat,
            lon,
            ele: ele ? parseFloat(ele) : undefined,
            time,
            name: pointName,
            desc,
          });
        });
      });

      if (points.length > 0) {
        const totalDistance = calculateTotalDistance(points);
        const duration = calculateDuration(points);
        const { gain, loss } = calculateElevationChanges(points);

        tracks.push({
          name,
          points,
          totalDistance,
          duration,
          elevationGain: gain,
          elevationLoss: loss,
        });
      }
    });

    return tracks;
  };

  const calculateTotalDistance = (points: GPXPoint[]): number => {
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      distance += haversineDistance(points[i - 1], points[i]);
    }
    return distance;
  };

  const haversineDistance = (p1: GPXPoint, p2: GPXPoint): number => {
    const R = 6371;
    const dLat = (p2.lat - p1.lat) * (Math.PI / 180);
    const dLon = (p2.lon - p1.lon) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1.lat * (Math.PI / 180)) *
        Math.cos(p2.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateDuration = (points: GPXPoint[]): number => {
    if (points.length < 2) return 0;
    const firstTime = points[0]?.time;
    const lastTime = points[points.length - 1]?.time;
    if (!firstTime || !lastTime) return 0;
    const start = new Date(firstTime).getTime();
    const end = new Date(lastTime).getTime();
    return (end - start) / 1000;
  };

  const calculateElevationChanges = (points: GPXPoint[]): { gain: number; loss: number } => {
    let gain = 0;
    let loss = 0;
    for (let i = 1; i < points.length; i++) {
      const prevEle = points[i - 1]?.ele;
      const currEle = points[i]?.ele;
      if (prevEle !== undefined && currEle !== undefined) {
        const diff = currEle - prevEle;
        if (diff > 0) gain += diff;
        else loss += Math.abs(diff);
      }
    }
    return { gain, loss };
  };

  const handlePreview = async () => {
    if (!selectedFile) return;
    setIsParsing(true);
    setError(null);
    try {
      const content = await selectedFile.text();
      const tracks = parseGPX(content);
      setParsedTracks(tracks);
      setSelectedTracks(tracks.map((_, idx) => `track-${idx}`));
      setShowPreview(true);
    } catch (err) {
      setError('Failed to parse GPX file');
      console.error(err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || selectedTracks.length === 0) return;
    setIsImporting(true);
    setShowProgress(true);
    setError(null);
    setImportStatus('parsing');
    setImportProgress(10);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImportStatus('processing');
    setImportProgress(30);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImportStatus('creating_memories');
    setImportProgress(50);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImportStatus('validating');
    setImportProgress(70);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setImportStatus('done');
    setImportProgress(100);
    await onImport?.([selectedFile]);
    
    setTimeout(() => {
      setIsImporting(false);
      setShowProgress(false);
      setImportStatus('idle');
      setImportProgress(0);
    }, 1000);
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${meters.toFixed(0)}m`;
    return `${(meters / 1000).toFixed(2)}km`;
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(0)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(0)}m`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const formatElevation = (meters: number): string => {
    return `${meters.toFixed(0)}m`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhập từ GPX Track
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Import GPS tracks, routes, waypoints from GPX files
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
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt GPX Import
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                Import as
              </label>
              <select
                value={importAs}
                onChange={(e) => setImportAs(e.target.value as any)}
                className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
              >
                <option value="memory">Memory</option>
                <option value="journey">Journey</option>
                <option value="route">Route</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Create memories from points
              </span>
              <button
                type="button"
                onClick={() => setCreateMemoriesFromPoints(!createMemoriesFromPoints)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  createMemoriesFromPoints ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    createMemoriesFromPoints ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            {createMemoriesFromPoints && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Point interval (minutes)
                </label>
                <input
                  type="number"
                  value={pointInterval}
                  onChange={(e) => setPointInterval(parseInt(e.target.value) || 5)}
                  min="1"
                  max="60"
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Attach photos (if available)
              </span>
              <button
                type="button"
                onClick={() => setAttachPhotos(!attachPhotos)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  attachPhotos ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    attachPhotos ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-detect waypoints
              </span>
              <button
                type="button"
                onClick={() => setAutoDetectWaypoints(!autoDetectWaypoints)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  autoDetectWaypoints ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    autoDetectWaypoints ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            {autoDetectWaypoints && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Waypoint threshold (meters)
                </label>
                <input
                  type="number"
                  value={waypointThreshold}
                  onChange={(e) => setWaypointThreshold(parseInt(e.target.value) || 100)}
                  min="10"
                  max="1000"
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Elevation smoothing
              </span>
              <button
                type="button"
                onClick={() => setElevationSmoothing(!elevationSmoothing)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  elevationSmoothing ? 'bg-slate-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    elevationSmoothing ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            {elevationSmoothing && (
              <div>
                <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                  Smoothing window
                </label>
                <input
                  type="number"
                  value={smoothingWindow}
                  onChange={(e) => setSmoothingWindow(parseInt(e.target.value) || 3)}
                  min="1"
                  max="10"
                  className="text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 w-full"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
          <Globe className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Upload GPX file
          </p>
          <input
            type="file"
            accept=".gpx"
            onChange={handleFileUpload}
            className="hidden"
            id="gpx-upload"
          />
          <label
            htmlFor="gpx-upload"
            className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Chọn file
          </label>
          {selectedFile && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {selectedFile.name}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handlePreview}
          disabled={!selectedFile || isParsing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
        >
          {isParsing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          Parse & Preview
        </button>

        {showPreview && parsedTracks.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                Found {parsedTracks.length} Track{parsedTracks.length > 1 ? 's' : ''}
              </h4>
              <button
                type="button"
                onClick={() => setSelectedTracks(parsedTracks.map((_, idx) => `track-${idx}`))}
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                Select All
              </button>
            </div>
            <div className="space-y-2">
              {parsedTracks.map((track, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    selectedTracks.includes(`track-${idx}`)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedTracks.includes(`track-${idx}`)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTracks([...selectedTracks, `track-${idx}`]);
                          } else {
                            setSelectedTracks(selectedTracks.filter(t => t !== `track-${idx}`));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {track.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTrackIndex(idx);
                        setShowTrackDetails(!showTrackDetails);
                      }}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                    >
                      {showTrackDetails && selectedTrackIndex === idx ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Route className="h-3 w-3" />
                      <span>{formatDistance(track.totalDistance)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDuration(track.duration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge className="h-3 w-3" />
                      <span>{formatElevation(track.elevationGain)} ↑</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{track.points.length} points</span>
                    </div>
                  </div>
                  {showTrackDetails && selectedTrackIndex === idx && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Start:</span>
                          <span className="ml-1 text-slate-700 dark:text-slate-300">
                            {track.points[0]?.lat.toFixed(4)}, {track.points[0]?.lon.toFixed(4)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">End:</span>
                          <span className="ml-1 text-slate-700 dark:text-slate-300">
                            {track.points[track.points.length - 1]?.lat.toFixed(4)}, {track.points[track.points.length - 1]?.lon.toFixed(4)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Elevation gain:</span>
                          <span className="ml-1 text-slate-700 dark:text-slate-300">
                            {formatElevation(track.elevationGain)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Elevation loss:</span>
                          <span className="ml-1 text-slate-700 dark:text-slate-300">
                            {formatElevation(track.elevationLoss)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showProgress && (
          <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Importing...
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {importProgress}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${importProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              {importStatus === 'parsing' && <FileText className="h-3 w-3" />}
              {importStatus === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
              {importStatus === 'creating_memories' && <MapPin className="h-3 w-3" />}
              {importStatus === 'validating' && <CheckCircle className="h-3 w-3" />}
              {importStatus === 'done' && <Check className="h-3 w-3 text-green-500" />}
              {importStatus === 'error' && <AlertTriangle className="h-3 w-3 text-red-500" />}
              <span className="capitalize">{importStatus.replace('_', ' ')}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={!selectedFile || selectedTracks.length === 0 || isImporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Navigation className="h-4 w-4" />
              Import GPX
            </>
          )}
        </button>
      </div>
    </div>
  );
}
