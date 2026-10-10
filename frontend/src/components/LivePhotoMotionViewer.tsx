'use client';

import { useState } from 'react';

export default function LivePhotoMotionViewer() {
  const [livePhotos, setLivePhotos] = useState([
    { id: 1, title: 'Beach Sunset', platform: 'ios', duration: 3, isLoop: true },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [platform, setPlatform] = useState('ios');
  const [isLoop, setIsLoop] = useState(false);

  const handleUpload = () => {
    const newPhoto = {
      id: livePhotos.length + 1,
      title: `Live Photo #${livePhotos.length + 1}`,
      platform,
      duration: 3,
      isLoop,
    };
    setLivePhotos(prev => [...prev, newPhoto]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Live Photo & Burst Shot Motion Viewer</h2>
      <p className="text-gray-600 mb-6">
        iOS Live Photo and Android Motion Photo playback, keyframe photo selector, bounce/loop video export.
      </p>

      <div className="space-y-4">
        {/* Upload Section */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-3">Upload Live Photo</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="ios">iOS Live Photo</option>
              <option value="android">Android Motion Photo</option>
            </select>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isLoop}
                onChange={(e) => setIsLoop(e.target.checked)}
                className="w-5 h-5"
              />
              <label className="text-sm">Loop Playback</label>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center mb-3">
            <p className="text-gray-500">📷 Upload Live Photo file</p>
          </div>
          <button
            onClick={handleUpload}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
          >
            Upload Live Photo
          </button>
        </div>

        {/* Playback Controls */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Playback Controls</h3>
          <div className="flex justify-center gap-4 mb-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>
          <div className="flex justify-center gap-2">
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Bounce</button>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Loop</button>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Extract Frame</button>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Export GIF</button>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-3">Preview</h3>
          <div className="h-48 bg-white rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-4xl mb-2">🎬</p>
              <p>Live Photo Preview</p>
              {isPlaying && <p className="text-xs mt-1 text-green-600">Playing...</p>}
            </div>
          </div>
        </div>

        {/* Live Photos List */}
        <div>
          <h3 className="font-medium mb-3">Your Live Photos</h3>
          <div className="grid grid-cols-3 gap-3">
            {livePhotos.map(photo => (
              <div key={photo.id} className="p-3 bg-gray-50 rounded">
                <div className="h-24 bg-white rounded mb-2 flex items-center justify-center">
                  <span className="text-2xl">📸</span>
                </div>
                <p className="text-sm font-medium">{photo.title}</p>
                <p className="text-xs text-gray-600 capitalize">{photo.platform}</p>
                {photo.isLoop && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Loop</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded">
          <h4 className="font-medium text-purple-800 mb-2">Live Photo Features:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• iOS Live Photo support</li>
            <li>• Android Motion Photo support</li>
            <li>• Keyframe extraction</li>
            <li>• Bounce/loop playback modes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
