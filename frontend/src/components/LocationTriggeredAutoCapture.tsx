'use client';

import { useState } from 'react';
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Heart,
  Home,
  Info,
  Map,
  MapPin,
  Navigation,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Work
} from 'lucide-react';

interface LocationTriggeredAutoCaptureProps {
  onCancel?: () => void;
}

interface LocationZone {
  id: string;
  name: string;
  type: 'home' | 'work' | 'favorite' | 'custom';
  address: string;
  latitude: number;
  longitude: number;
  radius: number;
  isAutoCaptureEnabled: boolean;
  autoCaptureType: 'photo' | 'video' | 'audio' | 'all';
  lastTriggered?: string;
  triggerCount: number;
}

interface CaptureEvent {
  id: string;
  zoneId: string;
  zoneName: string;
  triggeredAt: string;
  captureType: 'photo' | 'video' | 'audio';
  status: 'success' | 'failed' | 'pending';
  memoryId?: string;
}

interface LocationSettings {
  locationServices: boolean;
  autoCaptureAllZones: boolean;
  minimumStayDuration: number;
  maxCapturesPerVisit: number;
  backgroundMonitoring: boolean;
  notificationOnCapture: boolean;
}

export default function LocationTriggeredAutoCapture({ onCancel }: LocationTriggeredAutoCaptureProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAutoCaptureEnabled, setIsAutoCaptureEnabled] = useState(true);

  const [locationZones, setLocationZones] = useState<LocationZone[]>([
    { id: '1', name: 'Home', type: 'home', address: '123 Main Street, City', latitude: 40.7128, longitude: -74.0060, radius: 100, isAutoCaptureEnabled: true, autoCaptureType: 'photo', lastTriggered: '2024-01-17 18:30', triggerCount: 45 },
    { id: '2', name: 'Office', type: 'work', address: '456 Business Ave, City', latitude: 40.7128, longitude: -74.0060, radius: 50, isAutoCaptureEnabled: true, autoCaptureType: 'photo', lastTriggered: '2024-01-17 09:00', triggerCount: 30 },
    { id: '3', name: 'Favorite Park', type: 'favorite', address: 'Central Park, City', latitude: 40.7829, longitude: -73.9654, radius: 200, isAutoCaptureEnabled: false, autoCaptureType: 'all', triggerCount: 15 },
  ]);

  const [captureEvents, setCaptureEvents] = useState<CaptureEvent[]>([
    { id: '1', zoneId: '1', zoneName: 'Home', triggeredAt: '2024-01-17 18:30', captureType: 'photo', status: 'success', memoryId: 'mem1' },
    { id: '2', zoneId: '2', zoneName: 'Office', triggeredAt: '2024-01-17 09:00', captureType: 'photo', status: 'success', memoryId: 'mem2' },
  ]);

  const [locationSettings, setLocationSettings] = useState<LocationSettings>({
    locationServices: true,
    autoCaptureAllZones: true,
    minimumStayDuration: 30,
    maxCapturesPerVisit: 3,
    backgroundMonitoring: true,
    notificationOnCapture: true,
  });

  const toggleZoneAutoCapture = (id: string) => {
    setLocationZones(locationZones.map(zone => 
      zone.id === id ? { ...zone, isAutoCaptureEnabled: !zone.isAutoCaptureEnabled } : zone
    ));
  };

  const deleteZone = (id: string) => {
    setLocationZones(locationZones.filter(zone => zone.id !== id));
  };

  const addZone = () => {
    const newZone: LocationZone = {
      id: Date.now().toString(),
      name: 'New Location',
      type: 'custom',
      address: 'Enter address',
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100,
      isAutoCaptureEnabled: true,
      autoCaptureType: 'photo',
      triggerCount: 0,
    };
    setLocationZones([...locationZones, newZone]);
  };

  const triggerCapture = (zoneId: string) => {
    const zone = locationZones.find(z => z.id === zoneId);
    if (!zone) return;

    const newEvent: CaptureEvent = {
      id: Date.now().toString(),
      zoneId,
      zoneName: zone.name,
      triggeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      captureType: zone.autoCaptureType === 'all' ? 'photo' : zone.autoCaptureType,
      status: 'pending',
    };
    setCaptureEvents([...captureEvents, newEvent]);
    
    setTimeout(() => {
      setCaptureEvents(events => events.map(e => 
        e.id === newEvent.id ? { ...e, status: 'success', memoryId: `mem${Date.now()}` } : e
      ));
      setLocationZones(zones => zones.map(z => 
        z.id === zoneId ? { ...z, triggerCount: z.triggerCount + 1, lastTriggered: new Date().toISOString().replace('T', ' ').substring(0, 16) } : z
      ));
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getZoneTypeIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="h-4 w-4" />;
      case 'work': return <Work className="h-4 w-4" />;
      case 'favorite': return <Heart className="h-4 w-4" />;
      case 'custom': return <MapPin className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getZoneTypeColor = (type: string) => {
    switch (type) {
      case 'home': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'work': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'favorite': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'custom': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Location-Triggered Auto-Capture
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tự động tạo kỷ niệm khi đến địa điểm quen
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isAutoCaptureEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isAutoCaptureEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Zones</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{locationZones.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{locationZones.filter(z => z.isAutoCaptureEnabled).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Triggers</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{locationZones.reduce((acc, z) => acc + z.triggerCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Events</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{captureEvents.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isAutoCaptureEnabled}
              onChange={(e) => setIsAutoCaptureEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Auto-Capture</span>
          </div>
          <button
            type="button"
            onClick={addZone}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Zone
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Location Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Navigation className="h-4 w-4 text-green-400" />
                <span className="text-xs text-slate-900 dark:text-white">Location Services</span>
              </div>
              <input
                type="checkbox"
                checked={locationSettings.locationServices}
                onChange={(e) => setLocationSettings({ ...locationSettings, locationServices: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto-Capture All Zones</span>
              </div>
              <input
                type="checkbox"
                checked={locationSettings.autoCaptureAllZones}
                onChange={(e) => setLocationSettings({ ...locationSettings, autoCaptureAllZones: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Min Stay Duration (sec)</span>
              </div>
              <input
                type="number"
                value={locationSettings.minimumStayDuration}
                onChange={(e) => setLocationSettings({ ...locationSettings, minimumStayDuration: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Max Captures Per Visit</span>
              </div>
              <input
                type="number"
                value={locationSettings.maxCapturesPerVisit}
                onChange={(e) => setLocationSettings({ ...locationSettings, maxCapturesPerVisit: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Map className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Background Monitoring</span>
              </div>
              <input
                type="checkbox"
                checked={locationSettings.backgroundMonitoring}
                onChange={(e) => setLocationSettings({ ...locationSettings, backgroundMonitoring: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Notification on Capture</span>
              </div>
              <input
                type="checkbox"
                checked={locationSettings.notificationOnCapture}
                onChange={(e) => setLocationSettings({ ...locationSettings, notificationOnCapture: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Location Zones</h4>
          <div className="space-y-2">
            {locationZones.map((zone) => (
              <div key={zone.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      {getZoneTypeIcon(zone.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{zone.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getZoneTypeColor(zone.type)}`}>
                          {zone.type}
                        </span>
                        {zone.isAutoCaptureEnabled && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Auto-Capture
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{zone.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleZoneAutoCapture(zone.id)}
                      className={`px-2 py-1 rounded text-xs ${zone.isAutoCaptureEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {zone.isAutoCaptureEnabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteZone(zone.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-600 hover:bg-slate-700 text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Radius: {zone.radius}m</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Triggers: {zone.triggerCount}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Last: {zone.lastTriggered || 'Never'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Capture Type: {zone.autoCaptureType}</span>
                  {zone.isAutoCaptureEnabled && (
                    <button
                      type="button"
                      onClick={() => triggerCapture(zone.id)}
                      className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" />
                      Test Trigger
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Capture Events</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {captureEvents.map((event) => (
              <div key={event.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{event.zoneName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{event.triggeredAt} • {event.captureType}</p>
                    </div>
                  </div>
                </div>
                {event.memoryId && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">Memory: {event.memoryId}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Location-Triggered Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Set up location zones for automatic memory capture</li>
              <li>• Configure capture type: photo/video/audio/all</li>
              <li>• Set minimum stay duration to avoid false triggers</li>
              <li>• Enable background monitoring for continuous tracking</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
