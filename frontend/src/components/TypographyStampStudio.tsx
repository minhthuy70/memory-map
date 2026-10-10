'use client';

import { useState } from 'react';

export default function TypographyStampStudio() {
  const [stamps, setStamps] = useState([
    { id: 1, text: 'HANOI 2024', fontName: 'Vintage', fontSize: 32, stampType: 'postmark' },
  ]);
  const [text, setText] = useState('');
  const [fontName, setFontName] = useState('Vintage');
  const [fontSize, setFontSize] = useState(32);
  const [fontColor, setFontColor] = useState('#000000');
  const [stampType, setStampType] = useState('postmark');
  const [rotation, setRotation] = useState(0);

  const fonts = ['Vintage', 'Modern', 'Handwritten', 'Serif', 'Script'];
  const stampTypes = ['postmark', 'wax_seal', 'watermark'];

  const handleCreate = () => {
    const newStamp = {
      id: stamps.length + 1,
      text,
      fontName,
      fontSize,
      fontColor,
      stampType,
      rotation,
    };
    setStamps(prev => [...prev, newStamp]);
    setText('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Custom Typography & Stamp Studio</h2>
      <p className="text-gray-600 mb-6">
        Curated Vietnamese font collection with full accents, vintage postmark stamps, custom wax seals, watermark generator.
      </p>

      <div className="space-y-4">
        {/* Text Input */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Create Stamp</h3>
          <input
            type="text"
            placeholder="Enter text..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded mb-3"
          />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Font</label>
              <select
                value={fontName}
                onChange={(e) => setFontName(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {fonts.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Size: {fontSize}px</label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full p-2 border rounded"
                min={12}
                max={72}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Color</label>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-full p-2 border rounded h-10"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Type</label>
              <select
                value={stampType}
                onChange={(e) => setStampType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {stampTypes.map(type => (
                  <option key={type} value={type} capitalize>{type.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Rotation: {rotation}°</label>
            <input
              type="range"
              min={0}
              max={360}
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-3">Preview</h3>
          <div className="h-32 bg-white rounded flex items-center justify-center">
            <div
              className="text-center"
              style={{
                fontFamily: fontName,
                fontSize: `${fontSize}px`,
                color: fontColor,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {text || 'Preview Text'}
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!text}
          className={`w-full py-2 rounded font-medium ${
            !text ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          Create Stamp
        </button>

        {/* Saved Stamps */}
        <div>
          <h3 className="font-medium mb-3">Saved Stamps</h3>
          <div className="grid grid-cols-3 gap-3">
            {stamps.map(stamp => (
              <div key={stamp.id} className="p-3 bg-gray-50 rounded">
                <div className="h-20 bg-white rounded mb-2 flex items-center justify-center">
                  <span
                    className="text-sm font-medium"
                    style={{
                      fontSize: `${Math.min(stamp.fontSize, 16)}px`,
                      color: stamp.fontColor,
                    }}
                  >
                    {stamp.text}
                  </span>
                </div>
                <p className="text-xs text-gray-600 capitalize">{stamp.stampType}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded">
          <h4 className="font-medium text-indigo-800 mb-2">Typography Features:</h4>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• Vietnamese font collection</li>
            <li>• Full accent support</li>
            <li>• Vintage postmark stamps</li>
            <li>• Custom wax seals</li>
            <li>• Watermark generator</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
