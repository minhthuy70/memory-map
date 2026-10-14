'use client';

import { useState } from 'react';

export default function MemoryStories() {
  const [mediaUrl, setMediaUrl] = useState('');
  const [privacy, setPrivacy] = useState('public');
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Memory Stories (24h Ephemeral Stories)</h3>
      <p className="text-gray-600 mb-4">Stories kỷ niệm biến mất sau 24h với stickers, music, và privacy controls</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Media URL</label>
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/story.jpg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Privacy</label>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="public">Public 🌍</option>
            <option value="close_friends">Close Friends 👥</option>
            <option value="private">Private 🔒</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={musicEnabled}
            onChange={(e) => setMusicEnabled(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Enable Background Music</label>
        </div>

        <div className="bg-pink-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Story Preview</h4>
          <div className="h-32 bg-gradient-to-r from-pink-200 via-purple-300 to-indigo-300 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📸</div>
              <span className="text-white font-bold text-lg">24h Story</span>
              <div className="text-white text-sm">{privacy} • {musicEnabled ? '🎵 Music' : 'No Music'}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
        >
          {saved ? 'Saved!' : 'Create Story'}
        </button>
      </div>
    </div>
  );
}
