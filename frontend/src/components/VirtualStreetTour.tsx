'use client';

import { useState } from 'react';

export default function VirtualStreetTour() {
  const [title, setTitle] = useState('');
  const [audioTransitions, setAudioTransitions] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Virtual Street Walk & Connected 360 Tour</h3>
      <p className="text-gray-600 mb-4">Tour đi dạo ảo liên kết nhiều ảnh 360 với directional hotspots và floor plan</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Tour Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Hanoi Old Quarter Tour"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={audioTransitions}
            onChange={(e) => setAudioTransitions(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Enable Audio Transitions</label>
        </div>

        <div className="bg-cyan-50 p-4 rounded">
          <h4 className="font-semibold mb-2">360 Tour Preview</h4>
          <div className="h-32 bg-gradient-to-r from-cyan-200 via-blue-300 to-teal-300 rounded flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-4xl mb-2">🔄</div>
              <span className="text-white font-bold text-lg">360° Panorama</span>
              <div className="text-white text-sm">Directional Hotspots</div>
            </div>
            {audioTransitions && (
              <div className="absolute top-2 right-2 text-2xl">🎵</div>
            )}
          </div>
        </div>

        <div className="bg-teal-50 p-3 rounded text-sm text-teal-800">
          <strong>Features:</strong> Multiple 360 panoramas, directional hotspots, floor plan radar, smooth walk transitions
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700"
        >
          {saved ? 'Saved!' : 'Save Virtual Tour'}
        </button>
      </div>
    </div>
  );
}
