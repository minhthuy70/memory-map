'use client';

import { useState } from 'react';

export default function CoPresenceSuggestion() {
  const [location, setLocation] = useState('');
  const [detectedCount, setDetectedCount] = useState(3);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Co-presence Memory Suggestion</h3>
      <p className="text-gray-600 mb-4">Gợi ý tạo kỷ niệm chung khi nhiều người ở cùng địa điểm (Bluetooth/GPS)</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Coffee Shop ABC"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Detected Users: {detectedCount}</label>
          <input
            type="range"
            min="2"
            max="10"
            value={detectedCount}
            onChange={(e) => setDetectedCount(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="bg-purple-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Co-presence Detection</h4>
          <div className="h-32 bg-gradient-to-b from-purple-200 via-violet-300 to-indigo-400 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">👥</div>
              <span className="text-white font-bold text-lg">{detectedCount} Users Nearby</span>
              <div className="text-white text-sm">Create Group Memory?</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
          <strong>Note:</strong> Requires Bluetooth/GPS for real-time detection
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {saved ? 'Saved!' : 'Save Suggestion'}
        </button>
      </div>
    </div>
  );
}
