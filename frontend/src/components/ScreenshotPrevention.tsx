'use client';

import { useState } from 'react';

export default function ScreenshotPrevention() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [watermarkText, setWatermarkText] = useState('Confidential');
  const [blurPreview, setBlurPreview] = useState(true);
  const [platform, setPlatform] = useState<'android' | 'ios'>('android');

  const handleSetup = () => {
    setIsEnabled(true);
    alert('Screenshot prevention enabled for ' + platform);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Screenshot Prevention & Privacy Screen Filter</h2>
      <p className="text-gray-600 mb-6">
        FLAG_SECURE on Android, blur window preview on iOS app switcher, anti-screenshot watermark overlay.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as any)}
            className="w-full p-2 border rounded"
          >
            <option value="android">Android</option>
            <option value="ios">iOS</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
          <div>
            <p className="font-medium">Screenshot Prevention</p>
            <p className="text-sm text-gray-600">
              {isEnabled ? 'Active' : 'Inactive'}
            </p>
          </div>
          <button
            onClick={() => setIsEnabled(!isEnabled)}
            className={`px-4 py-2 rounded ${
              isEnabled
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white`}
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        {isEnabled && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Blur App Switcher Preview</span>
              <input
                type="checkbox"
                checked={blurPreview}
                onChange={(e) => setBlurPreview(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Watermark Overlay</span>
              <input
                type="checkbox"
                checked={watermarkEnabled}
                onChange={(e) => setWatermarkEnabled(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            {watermarkEnabled && (
              <div>
                <label className="block text-sm font-medium mb-2">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Confidential"
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            <button
              onClick={handleSetup}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Apply Settings
            </button>

            <div className="p-4 bg-blue-50 rounded">
              <h4 className="font-medium text-blue-800 mb-2">Platform-specific features:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Android: FLAG_SECURE prevents screenshots</li>
                <li>• iOS: Blur window in app switcher</li>
                <li>• Watermark overlay on all screens</li>
                <li>• Anti-screenshot detection and alert</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Limitations:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Rooted/jailbroken devices may bypass protection</li>
                <li>• System-level screenshots still possible</li>
                <li>• Works within app context only</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
