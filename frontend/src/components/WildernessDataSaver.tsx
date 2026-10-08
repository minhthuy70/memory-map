'use client';

import { useState } from 'react';

export default function WildernessDataSaver() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mode, setMode] = useState<'2g' | '3g' | 'low-bandwidth'>('low-bandwidth');
  const [compression, setCompression] = useState<'low' | 'medium' | 'high'>('medium');
  const [imageQuality, setImageQuality] = useState<'low' | 'medium' | 'high'>('medium');
  const [videoQuality, setVideoQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [vectorTiles, setVectorTiles] = useState(true);
  const [backgroundQueue, setBackgroundQueue] = useState(true);
  const [dataLimit, setDataLimit] = useState(100);

  const handleTrigger = () => {
    setIsEnabled(true);
    alert('Wilderness Data Saver mode activated!');
  };

  const handleDisable = () => {
    setIsEnabled(false);
    alert('Wilderness Data Saver mode disabled');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Low-bandwidth & Wilderness Data-saver Mode</h2>
      <p className="text-gray-600 mb-6">
        Adaptive 2G/3G compression, progressive image encoding, vector tile caching, background queue for uploads when back in 4G range.
      </p>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
          <div>
            <p className="font-medium">Data Saver Mode</p>
            <p className="text-sm text-gray-600">
              {isEnabled ? 'Active - Saving data' : 'Inactive'}
            </p>
          </div>
          <button
            onClick={isEnabled ? handleDisable : handleTrigger}
            className={`px-4 py-2 rounded ${
              isEnabled
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Network Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="2g">2G Network</option>
              <option value="3g">3G Network</option>
              <option value="low-bandwidth">Low Bandwidth</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Compression Level</label>
            <select
              value={compression}
              onChange={(e) => setCompression(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="low">Low (Better Quality)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Maximum Savings)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image Quality</label>
            <select
              value={imageQuality}
              onChange={(e) => setImageQuality(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="low">Low (Smallest Size)</option>
              <option value="medium">Medium</option>
              <option value="high">High (Best Quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Video Quality</label>
            <select
              value={videoQuality}
              onChange={(e) => setVideoQuality(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="low">Low (Smallest Size)</option>
              <option value="medium">Medium</option>
              <option value="high">High (Best Quality)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Daily Data Limit (MB)</label>
            <input
              type="number"
              value={dataLimit}
              onChange={(e) => setDataLimit(parseInt(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Vector Tiles (Map)</span>
            <input
              type="checkbox"
              checked={vectorTiles}
              onChange={(e) => setVectorTiles(e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Background Upload Queue</span>
            <input
              type="checkbox"
              checked={backgroundQueue}
              onChange={(e) => setBackgroundQueue(e.target.checked)}
              className="w-5 h-5"
            />
          </div>
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={() => alert('Configuration saved!')}
        >
          Save Configuration
        </button>

        {isEnabled && (
          <div className="p-4 bg-green-50 rounded">
            <p className="text-green-700 font-medium">✓ Data Saver Active</p>
            <p className="text-sm text-green-600">
              Images and videos will be compressed for optimal data usage
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
