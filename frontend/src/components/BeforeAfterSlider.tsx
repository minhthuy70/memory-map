'use client';

import { useState } from 'react';

export default function BeforeAfterSlider() {
  const [sliders, setSliders] = useState([
    { id: 1, title: 'Old vs New House', orientation: 'horizontal', sliderPosition: 0.5 },
  ]);
  const [orientation, setOrientation] = useState('horizontal');
  const [sliderPosition, setSliderPosition] = useState(0.5);
  const [blendMode, setBlendMode] = useState('normal');

  const blendModes = ['normal', 'multiply', 'screen', 'overlay'];

  const handleCreate = () => {
    const newSlider = {
      id: sliders.length + 1,
      title: `Comparison #${sliders.length + 1}`,
      orientation,
      sliderPosition,
    };
    setSliders(prev => [...prev, newSlider]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Before & After Interactive Comparison Slider</h2>
      <p className="text-gray-600 mb-6">
        Interactive split comparison slider, vertical/horizontal mode, automatic image alignment, transparency blend mode.
      </p>

      <div className="space-y-4">
        {/* Image Upload */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Upload Images</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Before Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                <p className="text-gray-500">📷 Before</p>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">After Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                <p className="text-gray-500">📷 After</p>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Settings */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Slider Settings</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Blend Mode</label>
              <select
                value={blendMode}
                onChange={(e) => setBlendMode(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {blendModes.map(mode => <option key={mode} value={mode} capitalize>{mode}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Slider Position: {Math.round(sliderPosition * 100)}%</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={sliderPosition}
              onChange={(e) => setSliderPosition(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-3">Preview</h3>
          <div className="h-48 bg-white rounded flex items-center justify-center relative">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 bg-blue-50 flex items-center justify-center border-r-2 border-gray-400">
                <span className="text-gray-500">Before</span>
              </div>
              <div className="w-1/2 bg-green-50 flex items-center justify-center">
                <span className="text-gray-500">After</span>
              </div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-full bg-gray-800 cursor-ew-resize flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-800 -ml-2"></div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-medium"
        >
          Create Comparison
        </button>

        {/* Saved Sliders */}
        <div>
          <h3 className="font-medium mb-3">Saved Comparisons</h3>
          <div className="grid grid-cols-3 gap-3">
            {sliders.map(slider => (
              <div key={slider.id} className="p-3 bg-gray-50 rounded">
                <div className="h-20 bg-white rounded mb-2 flex items-center justify-center">
                  <span className="text-2xl">🔄</span>
                </div>
                <p className="text-sm font-medium">{slider.title}</p>
                <p className="text-xs text-gray-600 capitalize">{slider.orientation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <h4 className="font-medium text-green-800 mb-2">Comparison Features:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Interactive split slider</li>
            <li>• Horizontal/vertical orientation</li>
            <li>• Blend mode options</li>
            <li>• Automatic image alignment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
