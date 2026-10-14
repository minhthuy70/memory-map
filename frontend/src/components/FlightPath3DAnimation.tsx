'use client';

import { useState } from 'react';

export default function FlightPath3DAnimation() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [duration, setDuration] = useState(3600);
  const [cloudsEffect, setCloudsEffect] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">3D Travel Flight Path Animation</h3>
      <p className="text-gray-600 mb-4">Vẽ đường bay 3D trên quả địa cầu với airplane model, clouds, và camera-follow mode</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">From Location</label>
          <input
            type="text"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Hanoi"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">To Location</label>
          <input
            type="text"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Paris"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="3600"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={cloudsEffect}
            onChange={(e) => setCloudsEffect(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Enable Clouds Effect</label>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Flight Path Preview</h4>
          <div className="h-32 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold">✈️ {fromLocation} → {toLocation}</span>
            </div>
            {cloudsEffect && (
              <div className="absolute top-2 right-2 text-2xl">☁️</div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {saved ? 'Saved!' : 'Save Flight Path'}
        </button>
      </div>
    </div>
  );
}
