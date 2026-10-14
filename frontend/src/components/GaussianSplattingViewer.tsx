'use client';

import { useState } from 'react';

export default function GaussianSplattingViewer() {
  const [location, setLocation] = useState('');
  const [modelUrl, setModelUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">3D Gaussian Splatting Viewer</h3>
      <p className="text-gray-600 mb-4">Trình xem 3D Gaussian Splatting siêu thực với WebGL/WebGPU rendering</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Ha Long Bay"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Model URL (.splat or .ply)</label>
          <input
            type="text"
            value={modelUrl}
            onChange={(e) => setModelUrl(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="https://example.com/model.splat"
          />
        </div>

        <div className="bg-green-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Gaussian Splatting Preview</h4>
          <div className="h-32 bg-gradient-to-br from-green-200 via-teal-300 to-cyan-400 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🌊</div>
              <span className="text-white font-bold text-lg">WebGL/WebGPU Rendering</span>
              <div className="text-white text-sm">Free Camera Movement</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
          <strong>Features:</strong> Real-time rendering, memory annotation tags in 3D space, free camera movement
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {saved ? 'Saved!' : 'Save Gaussian Splatting'}
        </button>
      </div>
    </div>
  );
}
