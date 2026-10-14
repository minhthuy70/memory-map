'use client';

import { useState } from 'react';

export default function TerrainElevation3D() {
  const [locationName, setLocationName] = useState('');
  const [elevation, setElevation] = useState(0);
  const [steepness, setSteepness] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">3D Terrain & Elevation Map</h3>
      <p className="text-gray-600 mb-4">Hiển thị độ cao địa hình, độ dốc đường đi, và hiking/trekking elevation profiles</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location Name</label>
          <input
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Fansipan Mountain"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Elevation (meters)</label>
          <input
            type="number"
            value={elevation}
            onChange={(e) => setElevation(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="3143"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Steepness (%)</label>
          <input
            type="number"
            value={steepness}
            onChange={(e) => setSteepness(Number(e.target.value))}
            className="w-full p-2 border rounded"
            placeholder="45"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Terrain Preview</h4>
          <div className="h-32 bg-gradient-to-b from-green-200 via-green-400 to-gray-300 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">Elevation: {elevation}m</span>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {saved ? 'Saved!' : 'Save Terrain Data'}
        </button>
      </div>
    </div>
  );
}
