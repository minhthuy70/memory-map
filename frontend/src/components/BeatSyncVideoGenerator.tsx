'use client';

import { useState } from 'react';

export default function BeatSyncVideoGenerator() {
  const [videos, setVideos] = useState([
    { id: 1, title: 'Summer Trip Mix', pacing: 'energetic', status: 'completed' },
  ]);
  const [pacing, setPacing] = useState('energetic');
  const [transitionStyle, setTransitionStyle] = useState('fade');
  const [isProcessing, setIsProcessing] = useState(false);

  const pacingOptions = ['energetic', 'chill', 'custom'];
  const transitions = ['fade', 'slide', 'zoom', 'wipe'];

  const handleGenerate = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newVideo = {
        id: videos.length + 1,
        title: `Video #${videos.length + 1}`,
        pacing,
        status: 'completed',
      };
      setVideos(prev => [...prev, newVideo]);
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Dynamic Beat-sync Video Generator</h2>
      <p className="text-gray-600 mb-6">
        Audio beat detection algorithm, auto-align photo transitions to musical transients, energetic/chill pacing presets.
      </p>

      <div className="space-y-4">
        {/* Audio Upload */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-3">Upload Audio Track</h3>
          <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center mb-3">
            <p className="text-gray-500">🎵 Upload music file (MP3, WAV)</p>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-2 bg-gray-200 rounded">
              <div className="w-1/3 h-2 bg-blue-500 rounded"></div>
            </div>
            <span className="text-sm text-gray-600">1:23 / 3:45</span>
          </div>
        </div>

        {/* Memory Selection */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Select Memories</h3>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-white rounded border-2 border-transparent hover:border-blue-500 cursor-pointer flex items-center justify-center">
                <span className="text-2xl">📷</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">8 memories selected</p>
        </div>

        {/* Video Settings */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Video Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Pacing</label>
              <select
                value={pacing}
                onChange={(e) => setPacing(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {pacingOptions.map(option => (
                  <option key={option} value={option} capitalize>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Transition</label>
              <select
                value={transitionStyle}
                onChange={(e) => setTransitionStyle(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {transitions.map(t => <option key={t} value={t} capitalize>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Beat Detection */}
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-3">Beat Detection</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Detected beats:</span>
            <span className="text-sm font-bold">127 BPM</span>
          </div>
          <div className="flex gap-1">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-6 bg-purple-500 rounded"
                style={{ opacity: 0.3 + Math.random() * 0.7 }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isProcessing}
          className={`w-full py-3 rounded font-medium ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isProcessing ? 'Generating Video...' : 'Generate Beat-sync Video'}
        </button>

        {/* Generated Videos */}
        <div>
          <h3 className="font-medium mb-3">Generated Videos</h3>
          <div className="space-y-2">
            {videos.map(video => (
              <div key={video.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{video.title}</p>
                  <p className="text-sm text-gray-600 capitalize">{video.pacing} pacing</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  video.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {video.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Beat Sync Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Automatic beat detection</li>
            <li>• Photo transitions synced to music</li>
            <li>• Pacing presets (energetic/chill)</li>
            <li>• Custom transition styles</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
