'use client';

import { useState } from 'react';

export default function BinauralSoundTherapy() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [frequency, setFrequency] = useState('alpha');
  const [natureSound, setNatureSound] = useState('rain');
  const [sessions, setSessions] = useState([
    { id: 1, frequency: 'alpha', duration: 15, natureSound: 'rain', moodBefore: 'stressed', moodAfter: 'calm' },
  ]);

  const frequencies = [
    { value: 'alpha', label: 'Alpha (8-12 Hz)', desc: 'Relaxed focus' },
    { value: 'theta', label: 'Theta (4-7 Hz)', desc: 'Deep meditation' },
    { value: 'delta', label: 'Delta (0.5-4 Hz)', desc: 'Deep sleep' },
    { value: '432hz', label: '432 Hz', desc: 'Healing frequency' },
  ];

  const natureSounds = [
    { value: 'rain', label: 'Rain' },
    { value: 'ocean', label: 'Ocean waves' },
    { value: 'forest', label: 'Forest' },
    { value: 'birds', label: 'Birds singing' },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration * 60) {
          setIsPlaying(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Binaural Beats Memory Sound Therapy</h2>
      <p className="text-gray-600 mb-6">
        Alpha/theta 432Hz binaural frequencies paired with nature recordings of favorite peaceful memory spots, guided meditation timer.
      </p>

      <div className="space-y-4">
        {/* Therapy Player */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-lg">Sound Therapy Session</h3>
              <p className="text-sm text-gray-600">
                {frequencies.find(f => f.value === frequency)?.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatTime(currentTime)}</p>
              <p className="text-sm text-gray-600">/ {formatTime(duration * 60)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-indigo-500 h-2 rounded-full transition-all"
              style={{ width: `${(currentTime / (duration * 60)) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={isPlaying ? handleStop : handlePlay}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                isPlaying
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isPlaying}
              >
                {frequencies.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Nature Sound</label>
              <select
                value={natureSound}
                onChange={(e) => setNatureSound(e.target.value)}
                className="w-full p-2 border rounded"
                disabled={isPlaying}
              >
                {natureSounds.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mood Tracking */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Session Mood Tracking</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Mood Before</label>
              <select className="w-full p-2 border rounded">
                <option value="">Select...</option>
                <option value="stressed">Stressed</option>
                <option value="anxious">Anxious</option>
                <option value="neutral">Neutral</option>
                <option value="calm">Calm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Mood After</label>
              <select className="w-full p-2 border rounded">
                <option value="">Select...</option>
                <option value="calm">Calm</option>
                <option value="relaxed">Relaxed</option>
                <option value="happy">Happy</option>
                <option value="peaceful">Peaceful</option>
              </select>
            </div>
          </div>
        </div>

        {/* Past Sessions */}
        <div>
          <h3 className="font-medium mb-3">Past Sessions</h3>
          <div className="space-y-2">
            {sessions.map(session => (
              <div key={session.id} className="p-3 bg-white border rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium capitalize">{session.frequency} - {session.natureSound}</p>
                    <p className="text-sm text-gray-600">{session.duration} minutes</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      <span className="text-red-500">{session.moodBefore}</span>
                      <span className="mx-1">→</span>
                      <span className="text-green-500">{session.moodAfter}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">About Binaural Beats:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Alpha waves: Relaxed focus and calm</li>
            <li>• Theta waves: Deep meditation and creativity</li>
            <li>• Delta waves: Deep sleep and healing</li>
            <li>• 432 Hz: Natural healing frequency</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
