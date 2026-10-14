'use client';

import { useState } from 'react';

export default function PhotogrammetryReconstruction() {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('processing');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing': return 'from-yellow-200 to-orange-300';
      case 'completed': return 'from-green-200 to-green-400';
      case 'failed': return 'from-red-200 to-red-400';
      default: return 'from-gray-200 to-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing': return '⏳';
      case 'completed': return '✅';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Photogrammetry 3D Memory Reconstruction</h3>
      <p className="text-gray-600 mb-4">Tái tạo mô hình 3D từ nhiều góc độ ảnh chụp với cloud mesh reconstruction</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Ha Long Bay Model"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="processing">Processing ⏳</option>
            <option value="completed">Completed ✅</option>
            <option value="failed">Failed ❌</option>
          </select>
        </div>

        <div className={`bg-gradient-to-b ${getStatusColor()} p-4 rounded`}>
          <h4 className="font-semibold mb-2">Reconstruction Preview</h4>
          <div className="h-32 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">{getStatusIcon()}</div>
              <span className="text-white font-bold text-lg capitalize">{status}</span>
              <div className="text-white text-sm">Cloud Mesh + Texture</div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-3 rounded text-sm text-purple-800">
          <strong>Features:</strong> Multi-angle photo upload, cloud mesh reconstruction, texture generation, AR inspect
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {saved ? 'Saved!' : 'Save Reconstruction'}
        </button>
      </div>
    </div>
  );
}
