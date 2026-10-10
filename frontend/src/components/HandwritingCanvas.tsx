'use client';

import { useState } from 'react';

export default function HandwritingCanvas() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushType, setBrushType] = useState('pen');
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [canvases, setCanvases] = useState([
    { id: 1, title: 'Doodle #1', brushType: 'pen', brushColor: '#000000', createdAt: '2024-01-15' },
  ]);

  const brushTypes = [
    { value: 'pen', label: 'Pen' },
    { value: 'pencil', label: 'Pencil' },
    { value: 'highlighter', label: 'Highlighter' },
    { value: 'calligraphy', label: 'Calligraphy' },
  ];

  const handleSave = () => {
    const newCanvas = {
      id: canvases.length + 1,
      title: `Doodle #${canvases.length + 1}`,
      brushType,
      brushColor,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCanvases(prev => [...prev, newCanvas]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Handwriting & Digital Pen Canvas</h2>
      <p className="text-gray-600 mb-6">
        Apple Pencil / Wacom stylus support, pressure sensitivity, calligraphy pens, highlighter, sketch brushes.
      </p>

      <div className="space-y-4">
        {/* Canvas Settings */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Brush Settings</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Brush Type</label>
              <select
                value={brushType}
                onChange={(e) => setBrushType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {brushTypes.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Color</label>
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-full p-2 border rounded h-10"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Size: {brushSize}px</label>
              <input
                type="range"
                min={1}
                max={20}
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                className="w-full p-2"
              />
            </div>
          </div>
        </div>

        {/* Drawing Canvas */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded p-4">
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center mb-3">
            <div className="text-center text-gray-500">
              <p className="text-4xl mb-2">✏️</p>
              <p>Drawing Canvas</p>
              <p className="text-xs mt-1">Click and drag to draw</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsDrawing(!isDrawing)}
              className={`flex-1 py-2 rounded font-medium ${
                isDrawing
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isDrawing ? 'Stop Drawing' : 'Start Drawing'}
            </button>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Undo</button>
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Redo</button>
            <button onClick={handleSave} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">Save</button>
          </div>
        </div>

        {/* Saved Canvases */}
        <div>
          <h3 className="font-medium mb-3">Saved Drawings</h3>
          <div className="grid grid-cols-3 gap-3">
            {canvases.map(canvas => (
              <div key={canvas.id} className="p-3 bg-gray-50 rounded">
                <div className="h-24 bg-white rounded mb-2 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <p className="text-sm font-medium">{canvas.title}</p>
                <p className="text-xs text-gray-600">{canvas.createdAt}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Canvas Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Pressure-sensitive brush strokes</li>
            <li>• Multiple brush types and sizes</li>
            <li>• Custom color palettes</li>
            <li>• Undo/redo history</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
