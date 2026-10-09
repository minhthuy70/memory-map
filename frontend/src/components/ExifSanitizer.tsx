'use client';

import { useState } from 'react';

export default function ExifSanitizer() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [stripDate, setStripDate] = useState(false);
  const [stripGPS, setStripGPS] = useState(false);
  const [stripCamera, setStripCamera] = useState(true);
  const [stripDevice, setStripDevice] = useState(true);
  const [stripNetwork, setStripNetwork] = useState(true);
  const [sanitizedCount, setSanitizedCount] = useState(0);

  const handleSanitize = () => {
    setSanitizedCount(sanitizedCount + 1);
    alert('EXIF data sanitized successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Automatic Metadata & EXIF Sanitizer</h2>
      <p className="text-gray-600 mb-6">
        Strip camera serial, lens ID, device IMEI, and network info before storage or public sharing, retain only stripped date & GPS if permitted.
      </p>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
          <div>
            <p className="font-medium">EXIF Sanitizer</p>
            <p className="text-sm text-gray-600">
              {isEnabled ? 'Active - Auto-sanitizing uploads' : 'Inactive'}
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
              <span className="text-sm">Strip Date & Time</span>
              <input
                type="checkbox"
                checked={stripDate}
                onChange={(e) => setStripDate(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Strip GPS Location</span>
              <input
                type="checkbox"
                checked={stripGPS}
                onChange={(e) => setStripGPS(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Strip Camera Serial & Lens ID</span>
              <input
                type="checkbox"
                checked={stripCamera}
                onChange={(e) => setStripCamera(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Strip Device IMEI</span>
              <input
                type="checkbox"
                checked={stripDevice}
                onChange={(e) => setStripDevice(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Strip Network Info</span>
              <input
                type="checkbox"
                checked={stripNetwork}
                onChange={(e) => setStripNetwork(e.target.checked)}
                className="w-5 h-5"
              />
            </div>

            <button
              onClick={handleSanitize}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Test Sanitize (Simulated)
            </button>

            {sanitizedCount > 0 && (
              <div className="p-4 bg-green-50 rounded">
                <p className="text-green-700 font-medium">
                  ✓ {sanitizedCount} photos sanitized
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded">
              <h4 className="font-medium text-blue-800 mb-2">What gets removed:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Camera serial number</li>
                <li>• Lens ID and metadata</li>
                <li>• Device IMEI</li>
                <li>• Network/wifi SSID</li>
                <li>• Optional: Date, GPS</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
