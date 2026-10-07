'use client';

import { useEffect, useRef, useState } from 'react';

export default function InteractiveGlobeMode() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);

  useEffect(() => {
    // This is a simplified 3D globe representation
    // In production, this would use Three.js or CesiumJS for actual 3D rendering
    setIsLoaded(true);
  }, []);

  const memories = [
    { id: 1, city: 'Hanoi', country: 'Vietnam', lat: 21.0, lng: 105.8, count: 15 },
    { id: 2, city: 'Ho Chi Minh', country: 'Vietnam', lat: 10.8, lng: 106.6, count: 23 },
    { id: 3, city: 'Paris', country: 'France', lat: 48.9, lng: 2.4, count: 8 },
    { id: 4, city: 'Tokyo', country: 'Japan', lat: 35.7, lng: 139.7, count: 12 },
    { id: 5, city: 'New York', country: 'USA', lat: 40.7, lng: -74.0, count: 5 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">3D Interactive Globe Mode</h2>

      {/* Globe Visualization */}
      <div
        ref={containerRef}
        className="relative w-full h-96 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg overflow-hidden mb-6"
      >
        {/* Simplified 3D Globe Representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Globe */}
            <div
              className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl animate-pulse"
              style={{
                animationDuration: `${3 / rotationSpeed}s`,
              }}
            >
              {/* Memory Pins */}
              {memories.map((memory) => {
                const x = 50 + (memory.lng / 180) * 40;
                const y = 50 - (memory.lat / 90) * 40;
                return (
                  <div
                    key={memory.id}
                    className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-lg animate-bounce"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      animationDelay: `${memory.id * 0.2}s`,
                    }}
                    title={`${memory.city}, ${memory.country} (${memory.count} memories)`}
                  />
                );
              })}
            </div>

            {/* Atmosphere Glow */}
            <div className="absolute inset-0 rounded-full bg-blue-300 opacity-20 blur-xl" />
          </div>
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-4 left-4 text-white text-sm">
          <p className="font-semibold">Interactive 3D Globe</p>
          <p className="opacity-75">Smooth zoom from space to street level</p>
        </div>

        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-white">Loading 3D Globe...</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Globe Controls</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Speed</label>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Slow</span>
              <span>{rotationSpeed}x</span>
              <span>Fast</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Zoom In
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Zoom Out
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Day View
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Night View
            </button>
          </div>
        </div>
      </div>

      {/* Memory Locations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Memory Locations on Globe</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">📍</div>
                <div>
                  <h4 className="font-medium text-gray-800">{memory.city}</h4>
                  <p className="text-sm text-gray-600">{memory.country}</p>
                  <p className="text-xs text-blue-600 mt-1">{memory.count} memories</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">About 3D Globe Mode</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Three.js/CesiumJS 3D globe rendering</li>
          <li>• Smooth zoom from space to street level</li>
          <li>• Glowing memory pins with atmospheric glow</li>
          <li>• Rotation speed control and day/night shadow</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2 italic">
          Note: This is a simplified demo. Full implementation requires Three.js or CesiumJS library.
        </p>
      </div>
    </div>
  );
}
