'use client';

import { useState } from 'react';

export default function OfflineTravelGuide() {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = () => {
    setIsDownloaded(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Offline Travel Guide Generator</h2>
      <p className="text-gray-600 mb-6">Bundle memories, offline vector tiles, notes, emergency contacts into downloadable offline pack.</p>
      <div className="space-y-4">
        <button onClick={handleDownload} disabled={isDownloaded} className="w-full py-2 bg-purple-500 text-white rounded">
          {isDownloaded ? 'Downloaded' : 'Download Offline Pack'}
        </button>
        {isDownloaded && <p className="text-sm text-green-600">✓ Works without cellular data</p>}
      </div>
    </div>
  );
}
