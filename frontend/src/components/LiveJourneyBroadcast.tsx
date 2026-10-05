'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { io, Socket } from 'socket.io-client';

interface LocationUpdate {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface Broadcast {
  id: string;
  title: string;
  isActive: boolean;
  batteryLevel?: number;
  elevation?: number;
  beaconMode: boolean;
  startedAt: string;
  endedAt?: string;
  locationUpdates: LocationUpdate[];
}

export default function LiveJourneyBroadcast() {
  const { token, userId } = useAuth();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [activeBroadcast, setActiveBroadcast] = useState<Broadcast | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveLocations, setLiveLocations] = useState<LocationUpdate[]>([]);

  const fetchBroadcasts = async () => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/live-journey', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setBroadcasts(data);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    }
  };

  const createBroadcast = async (title: string, password?: string, beaconMode?: boolean) => {
    try {
      const response = await fetch('http://localhost:3001/event-streaming/live-journey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, password, beaconMode }),
      });
      const data = await response.json();
      setBroadcasts([data, ...broadcasts]);
      return data;
    } catch (error) {
      console.error('Error creating broadcast:', error);
      throw error;
    }
  };

  const startTracking = async (broadcast: Broadcast) => {
    setActiveBroadcast(broadcast);
    setIsTracking(true);

    // Connect to WebSocket
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
      newSocket.emit('join-broadcast', broadcast.id);
    });

    newSocket.on('location-update', (location: LocationUpdate) => {
      setLiveLocations((prev) => [location, ...prev].slice(0, 50));
    });

    // Start GPS tracking
    if ('geolocation' in navigator) {
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Send location update to server
          await fetch(`http://localhost:3001/event-streaming/live-journey/${broadcast.id}/location`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ latitude, longitude }),
          });

          // Update battery level if available
          if ('getBattery' in navigator) {
            const battery = await (navigator as any).getBattery();
            setBatteryLevel(battery.level * 100);
          }
        },
        (error) => console.error('GPS error:', error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
      setWatchId(id);
    }
  };

  const stopTracking = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    
    if (socket) {
      socket.emit('leave-broadcast', activeBroadcast?.id);
      socket.disconnect();
      setSocket(null);
    }
    
    setIsTracking(false);
    setLiveLocations([]);

    if (activeBroadcast) {
      await fetch(`http://localhost:3001/event-streaming/live-journey/${activeBroadcast.id}/end`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchBroadcasts();
    }
    setActiveBroadcast(null);
  };

  const endBroadcast = async (id: string) => {
    await fetch(`http://localhost:3001/event-streaming/live-journey/${id}/end`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchBroadcasts();
  };

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Live Journey Broadcast
      </h2>

      <div className="mb-6">
        <button
          onClick={() => {
            const title = prompt('Enter broadcast title:');
            if (title) {
              const password = prompt('Enter password (optional):');
              const beaconMode = confirm('Enable beacon mode?');
              createBroadcast(title, password || undefined, beaconMode);
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New Broadcast
        </button>
      </div>

      {activeBroadcast && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
          <h3 className="font-bold text-green-800 dark:text-green-200 mb-2">
            Currently Tracking: {activeBroadcast.title}
          </h3>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Status: <span className="font-semibold text-green-600">Live</span>
            </span>
            {batteryLevel !== null && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Battery: {Math.round(batteryLevel)}%
              </span>
            )}
            {activeBroadcast.beaconMode && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Beacon Mode: <span className="font-semibold text-orange-600">Active</span>
              </span>
            )}
          </div>
          
          {/* Live Location Updates */}
          {liveLocations.length > 0 && (
            <div className="mt-4 p-3 bg-white dark:bg-gray-700 rounded">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Live Location Updates ({liveLocations.length})
              </h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {liveLocations.slice(0, 10).map((loc, index) => (
                  <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                    {new Date(loc.timestamp).toLocaleTimeString()}: {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={stopTracking}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Tracking
          </button>
        </div>
      )}

      <div className="space-y-4">
        {broadcasts.map((broadcast) => (
          <div
            key={broadcast.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {broadcast.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Started: {new Date(broadcast.startedAt).toLocaleString()}
                </p>
                {broadcast.endedAt && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ended: {new Date(broadcast.endedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {broadcast.isActive && !activeBroadcast && (
                  <button
                    onClick={() => startTracking(broadcast)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Start Tracking
                  </button>
                )}
                {broadcast.isActive && (
                  <button
                    onClick={() => endBroadcast(broadcast.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    End
                  </button>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Location Updates: {broadcast.locationUpdates.length}
            </div>
            {broadcast.batteryLevel && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Battery: {broadcast.batteryLevel}%
              </div>
            )}
            {broadcast.elevation && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Elevation: {broadcast.elevation}m
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
