'use client';

import { useState } from 'react';

export default function AIVoiceoverCommentary() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [vocalFilter, setVocalFilter] = useState('broadcast');
  const [noiseLevel, setNoiseLevel] = useState(0.3);
  const [voiceovers, setVoiceovers] = useState([
    { id: 1, title: 'Paris Trip Commentary', duration: 45, vocalFilter: 'broadcast' },
  ]);

  const vocalFilters = ['broadcast', 'warm', 'natural'];

  const handleRecord = () => {
    setIsRecording(true);
    let time = 0;
    const interval = setInterval(() => {
      time++;
      setRecordingTime(time);
      if (time >= 60) {
        setIsRecording(false);
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleStop = () => {
    setIsRecording(false);
    const newVoiceover = {
      id: voiceovers.length + 1,
      title: `Commentary #${voiceovers.length + 1}`,
      duration: recordingTime,
      vocalFilter,
    };
    setVoiceovers(prev => [...prev, newVoiceover]);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">AI Voiceover & Audio Commentary</h2>
      <p className="text-gray-600 mb-6">
        High-fidelity mic recorder, background noise suppression, warm broadcast vocal filters, timestamped photo-voice sync.
      </p>

      <div className="space-y-4">
        {/* Recording Controls */}
        <div className="bg-red-50 p-4 rounded">
          <h3 className="font-medium mb-3">Record Commentary</h3>
          <div className="flex justify-center mb-3">
            <button
              onClick={isRecording ? handleStop : handleRecord}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : 'bg-red-100 hover:bg-red-200'
              }`}
            >
              {isRecording ? '⏹' : '🎙️'}
            </button>
          </div>
          {isRecording && (
            <div className="text-center">
              <p className="text-2xl font-bold">{formatTime(recordingTime)}</p>
              <p className="text-sm text-gray-600">Recording...</p>
            </div>
          )}
        </div>

        {/* Vocal Settings */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Vocal Settings</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Vocal Filter</label>
              <select
                value={vocalFilter}
                onChange={(e) => setVocalFilter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {vocalFilters.map(filter => (
                  <option key={filter} value={filter} capitalize>{filter}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Noise Suppression</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Noise Level:</span>
            <span className="font-medium">{Math.round(noiseLevel * 100)}%</span>
          </div>
        </div>

        {/* Waveform Visualization */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-3">Waveform</h3>
          <div className="h-16 bg-white rounded flex items-center justify-around">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-blue-500 rounded"
                style={{
                  height: `${20 + Math.random() * 60}%`,
                  opacity: isRecording ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>

        {/* Photo Timestamps */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Photo Timestamps</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-white rounded">
              <span className="text-2xl">📷</span>
              <div className="flex-1">
                <p className="text-sm font-medium">Eiffel Tower</p>
                <p className="text-xs text-gray-600">0:15</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white rounded">
              <span className="text-2xl">📷</span>
              <div className="flex-1">
                <p className="text-sm font-medium">Louvre Museum</p>
                <p className="text-xs text-gray-600">0:32</p>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Voiceovers */}
        <div>
          <h3 className="font-medium mb-3">Saved Voiceovers</h3>
          <div className="space-y-2">
            {voiceovers.map(voiceover => (
              <div key={voiceover.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{voiceover.title}</p>
                  <p className="text-sm text-gray-600">{formatTime(voiceover.duration)}</p>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">▶ Play</button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <h4 className="font-medium text-green-800 mb-2">Voiceover Features:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• High-fidelity recording</li>
            <li>• Background noise suppression</li>
            <li>• Broadcast vocal filters</li>
            <li>• Photo-voice timestamp sync</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
