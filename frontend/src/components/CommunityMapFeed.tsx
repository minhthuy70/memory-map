'use client';

import { useState } from 'react';

export default function CommunityMapFeed() {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('travel');
  const [mood, setMood] = useState('happy');
  const [radius, setRadius] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Community Public Map Feed</h3>
      <p className="text-gray-600 mb-4">Khám phá kỷ niệm công khai trên bản đồ với filters theo category, mood, popularity</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Hanoi"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="travel">Travel ✈️</option>
            <option value="food">Food 🍜</option>
            <option value="nature">Nature 🌿</option>
            <option value="culture">Culture 🎭</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="happy">Happy 😊</option>
            <option value="nostalgic">Nostalgic 🍂</option>
            <option value="excited">Excited 🎉</option>
            <option value="peaceful">Peaceful 😌</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Radius ({radius}km)</label>
          <input
            type="range"
            min="1"
            max="50"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Community Feed Preview</h4>
          <div className="h-32 bg-gradient-to-b from-blue-200 via-cyan-300 to-teal-400 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <span className="text-white font-bold text-lg">Public Memories</span>
              <div className="text-white text-sm">{location || 'All Locations'} • {radius}km radius</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {saved ? 'Saved!' : 'Add to Community Feed'}
        </button>
      </div>
    </div>
  );
}
