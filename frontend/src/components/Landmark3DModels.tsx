'use client';

import { useState } from 'react';

export default function Landmark3DModels() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">3D Landmark & City Models</h3>
      <p className="text-gray-600 mb-4">Model 3D các địa danh nổi tiếng (Eiffel Tower, Chùa Một Cột, Cầu Vàng) với glTF/GLB</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Landmark Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Eiffel Tower"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Paris, France"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Scale ({scale}x)</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Rotation ({rotation}°)</label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <h4 className="font-semibold mb-2">3D Model Preview</h4>
          <div className="h-32 bg-gradient-to-b from-purple-200 to-purple-400 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏛️ {name || 'Landmark'}</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {saved ? 'Saved!' : 'Save Landmark'}
        </button>
      </div>
    </div>
  );
}
