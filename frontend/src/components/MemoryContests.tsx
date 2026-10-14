'use client';

import { useState } from 'react';

export default function MemoryContests() {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('travel');
  const [status, setStatus] = useState('open');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Community Memory Contests</h3>
      <p className="text-gray-600 mb-4">Cuộc thi ảnh và câu chuyện kỷ niệm với voting và badges</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Contest Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Best Sunset Photo"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="travel">Travel ✈️</option>
            <option value="food">Food 🍜</option>
            <option value="nature">Nature 🌿</option>
            <option value="portrait">Portrait 📸</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="open">Open for Submissions 📝</option>
            <option value="voting">Voting Phase 🗳️</option>
            <option value="closed">Closed 🏆</option>
          </select>
        </div>

        <div className="bg-red-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Contest Preview</h4>
          <div className="h-32 bg-gradient-to-b from-red-200 via-rose-300 to-pink-400 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <span className="text-white font-bold text-lg">{title || 'Memory Contest'}</span>
              <div className="text-white text-sm capitalize">{status}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          {saved ? 'Saved!' : 'Create Contest'}
        </button>
      </div>
    </div>
  );
}
