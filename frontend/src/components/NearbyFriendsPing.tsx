'use client';

import { useState } from 'react';

export default function NearbyFriendsPing() {
  const [friendId, setFriendId] = useState('');
  const [threshold, setThreshold] = useState(1000);
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Nearby Friends Memory Ping</h3>
      <p className="text-gray-600 mb-4">Nhận thông báo khi bạn bè tạo kỷ niệm gần bạn với radar detection</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Friend ID</label>
          <input
            type="text"
            value={friendId}
            onChange={(e) => setFriendId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="friend-user-id"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Distance Threshold ({threshold}m)</label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Enable Proximity Alerts</label>
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Radar Preview</h4>
          <div className="h-32 bg-gradient-to-b from-green-200 via-emerald-300 to-teal-400 rounded flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-4xl mb-2">📡</div>
              <span className="text-white font-bold text-lg">Radar Active</span>
              <div className="text-white text-sm">{threshold}m threshold</div>
            </div>
            {enabled && (
              <div className="absolute top-2 right-2 animate-pulse text-2xl">🔴</div>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {saved ? 'Saved!' : 'Set Up Ping'}
        </button>
      </div>
    </div>
  );
}
