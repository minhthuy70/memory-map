'use client';

import { useState } from 'react';

export default function VintageFilmEmulation() {
  const [filterType, setFilterType] = useState('kodak_portra');
  const [intensity, setIntensity] = useState(0.7);
  const [grainAmount, setGrainAmount] = useState(0.5);
  const [dateStamp, setDateStamp] = useState('');
  const [hasLightLeak, setHasLightLeak] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const filters = [
    { value: 'kodak_portra', label: 'Kodak Portra 400', desc: 'Warm tones, rich colors' },
    { value: 'fuji_velvia', label: 'Fuji Velvia', desc: 'Vivid saturation, contrast' },
    { value: 'ilford_bw', label: 'Ilford B&W', desc: 'Classic black & white' },
    { value: 'polaroid', label: 'Polaroid 600', desc: 'Instant film aesthetic' },
    { value: 'vhs', label: 'VHS Glitch', desc: 'Retro video tape effect' },
  ];

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Vintage Film & Analog Camera Emulation</h2>
      <p className="text-gray-600 mb-6">
        Film stocks: Kodak Portra 400, Fuji Velvia, Ilford B&W, Polaroid 600, VHS glitch effect, light leaks, realistic film grain.
      </p>

      <div className="space-y-4">
        {/* Filter Selection */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Film Filter</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setFilterType(filter.value)}
                className={`p-3 rounded text-left ${
                  filterType === filter.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <p className="font-medium">{filter.label}</p>
                <p className="text-xs">{filter.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Upload Image</h3>
          <div className="border-2 border-dashed border-gray-300 rounded p-8 text-center">
            <p className="text-gray-500">📷 Click or drag to upload image</p>
          </div>
        </div>

        {/* Filter Settings */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Filter Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Intensity: {Math.round(intensity * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Grain Amount: {Math.round(grainAmount * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={grainAmount}
                onChange={(e) => setGrainAmount(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasLightLeak}
                onChange={(e) => setHasLightLeak(e.target.checked)}
                className="w-5 h-5"
              />
              <label className="text-sm">Add Light Leak Effect</label>
            </div>
            <input
              type="text"
              placeholder="Date Stamp (e.g., 1985-06-15)"
              value={dateStamp}
              onChange={(e) => setDateStamp(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-3">Preview</h3>
          <div className="h-64 bg-white rounded flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-4xl mb-2">🎞️</p>
              <p>Preview will appear here</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className={`w-full py-3 rounded font-medium ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {isProcessing ? 'Processing...' : 'Apply Filter'}
        </button>

        <div className="p-4 bg-orange-50 rounded">
          <h4 className="font-medium text-orange-800 mb-2">Film Effects:</h4>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>• Authentic film grain simulation</li>
            <li>• Color grading presets</li>
            <li>• Light leak overlays</li>
            <li>• Date stamp overlays</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
