'use client';

import { useState } from 'react';

export default function MemoryDioramaBox() {
  const [title, setTitle] = useState('');
  const [soundBoxEnabled, setSoundBoxEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">3D Memory Diorama Box</h3>
      <p className="text-gray-600 mb-4">Hộp ký ức thu nhỏ dạng diorama 3D với 2.5D photos, stickers, và sound box</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Diorama Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Hanoi Old Street Memory"
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={soundBoxEnabled}
            onChange={(e) => setSoundBoxEnabled(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Enable Sound Box</label>
        </div>

        <div className="bg-amber-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Diorama Preview</h4>
          <div className="h-32 bg-gradient-to-b from-amber-200 via-orange-300 to-amber-400 rounded flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-4xl mb-2">🏠</div>
              <span className="text-white font-bold text-lg">3D Isometric View</span>
              <div className="text-white text-sm">360° Rotation</div>
            </div>
            {soundBoxEnabled && (
              <div className="absolute top-2 right-2 text-2xl">🔊</div>
            )}
          </div>
        </div>

        <div className="bg-orange-50 p-3 rounded text-sm text-orange-800">
          <strong>Features:</strong> Place 2.5D photos, stickers, mini furniture, sound box, export glTF/GIF
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-amber-600 text-white py-2 rounded hover:bg-amber-700"
        >
          {saved ? 'Saved!' : 'Save Diorama'}
        </button>
      </div>
    </div>
  );
}
