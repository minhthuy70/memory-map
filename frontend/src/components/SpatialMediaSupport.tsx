'use client';

import { useState } from 'react';

export default function SpatialMediaSupport() {
  const [mediaType, setMediaType] = useState('spatial_photo');
  const [stereoscopic, setStereoscopic] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Apple Vision Pro Spatial Media Support</h3>
      <p className="text-gray-600 mb-4">Hỗ trợ Spatial Video & Spatial Photo cho Apple Vision Pro với MV-HEVC</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Media Type</label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="spatial_photo">Spatial Photo 📷</option>
            <option value="spatial_video">Spatial Video 🎥</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={stereoscopic}
            onChange={(e) => setStereoscopic(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Stereoscopic 3D Mode</label>
        </div>

        <div className="bg-indigo-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Spatial Media Preview</h4>
          <div className="h-32 bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-300 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🥽</div>
              <span className="text-white font-bold text-lg">
                {mediaType === 'spatial_photo' ? 'Spatial Photo' : 'Spatial Video'}
              </span>
              {stereoscopic && <div className="text-white text-sm">3D Stereoscopic</div>}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-800">
          <strong>Note:</strong> WebXR immersive space requires Apple Vision Pro browser support.
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          {saved ? 'Saved!' : 'Save Spatial Media'}
        </button>
      </div>
    </div>
  );
}
