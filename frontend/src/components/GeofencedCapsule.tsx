'use client';

import { useState } from 'react';

export default function GeofencedCapsule() {
  const [capsules, setCapsules] = useState([
    { id: 1, title: 'Paris Memory', description: 'Memories from our trip to Paris', latitude: 48.8566, longitude: 2.3522, radiusMeters: 50, isUnlocked: false },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCapsule, setNewCapsule] = useState({
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    radiusMeters: 50,
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setCapsules(prev => [
        ...prev,
        {
          id: prev.length + 1,
          title: newCapsule.title,
          description: newCapsule.description,
          latitude: newCapsule.latitude,
          longitude: newCapsule.longitude,
          radiusMeters: newCapsule.radiusMeters,
          isUnlocked: false,
        },
      ]);
      setNewCapsule({ title: '', description: '', latitude: 0, longitude: 0, radiusMeters: 50 });
      setIsAdding(false);
    }, 1500);
  };

  const handleCheckLocation = () => {
    // Simulate GPS check
    alert('Checking GPS location... (In production, this would use browser Geolocation API)');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Geofenced Location Capsule</h2>
      <p className="text-gray-600 mb-6">
        Location-based unlock mechanism, 50m radius GPS trigger, scavenger hunt clues, surprise memory unlock when standing at original spot.
      </p>

      <div className="space-y-4">
        {/* GPS Check */}
        <div className="bg-green-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="font-medium">Check GPS Location</p>
            <p className="text-sm text-gray-600">Unlock capsules at your current location</p>
          </div>
          <button
            onClick={handleCheckLocation}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            📍 Check Location
          </button>
        </div>

        {/* Add Capsule */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-3">Create Geofenced Capsule</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Title"
              value={newCapsule.title}
              onChange={(e) => setNewCapsule({ ...newCapsule, title: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Radius (meters)"
              value={newCapsule.radiusMeters}
              onChange={(e) => setNewCapsule({ ...newCapsule, radiusMeters: parseInt(e.target.value) })}
              className="p-2 border rounded"
            />
          </div>
          <textarea
            placeholder="Description"
            value={newCapsule.description}
            onChange={(e) => setNewCapsule({ ...newCapsule, description: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude"
              value={newCapsule.latitude}
              onChange={(e) => setNewCapsule({ ...newCapsule, latitude: parseFloat(e.target.value) })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude"
              value={newCapsule.longitude}
              onChange={(e) => setNewCapsule({ ...newCapsule, longitude: parseFloat(e.target.value) })}
              className="p-2 border rounded"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding || !newCapsule.title || !newCapsule.description}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newCapsule.title || !newCapsule.description
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAdding ? 'Creating...' : 'Create Capsule'}
          </button>
        </div>

        {/* Capsules List */}
        <div>
          <h3 className="font-medium mb-3">Your Geofenced Capsules</h3>
          <div className="space-y-2">
            {capsules.map(capsule => (
              <div
                key={capsule.id}
                className={`p-3 rounded border ${
                  capsule.isUnlocked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{capsule.title}</p>
                    <p className="text-sm text-gray-600">
                      📍 {capsule.latitude.toFixed(4)}, {capsule.longitude.toFixed(4)}
                    </p>
                  </div>
                  {capsule.isUnlocked && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Unlocked</span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{capsule.description}</p>
                <p className="text-xs text-gray-500 mt-1">Radius: {capsule.radiusMeters}m</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ GPS Requirements:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Requires GPS-enabled device</li>
            <li>• User must grant location permission</li>
            <li>• Unlock triggers within specified radius</li>
            <li>• Works outdoors with clear GPS signal</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
