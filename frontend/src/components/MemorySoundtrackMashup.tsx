'use client';

import { useState } from 'react';

export default function MemorySoundtrackMashup() {
  const [soundtracks, setSoundtracks] = useState([
    { id: 1, title: 'Beach Memories', duration: 180, hasSpotify: true, hasFieldRecording: true },
  ]);
  const [spotifyTrackId, setSpotifyTrackId] = useState('');
  const [hasFieldRecording, setHasFieldRecording] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [isMixing, setIsMixing] = useState(false);

  const handleMix = () => {
    setIsMixing(true);
    setTimeout(() => {
      const newSoundtrack = {
        id: soundtracks.length + 1,
        title: `Soundtrack #${soundtracks.length + 1}`,
        duration: 180,
        hasSpotify: !!spotifyTrackId,
        hasFieldRecording,
      };
      setSoundtracks(prev => [...prev, newSoundtrack]);
      setIsMixing(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Memory Soundtrack AI Mashup</h2>
      <p className="text-gray-600 mb-6">
        Seamless blending of favorite Spotify track with ambient field recording, ducking vocal commentary over music, auto fade-in/out.
      </p>

      <div className="space-y-4">
        {/* Spotify Track */}
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-medium mb-3">Spotify Track</h3>
          <input
            type="text"
            placeholder="Enter Spotify track ID or URL"
            value={spotifyTrackId}
            onChange={(e) => setSpotifyTrackId(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          {spotifyTrackId && (
            <div className="flex items-center gap-3 p-2 bg-white rounded">
              <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xl">🎵</span>
              </div>
              <div>
                <p className="font-medium">Track Loaded</p>
                <p className="text-sm text-gray-600">3:00</p>
              </div>
            </div>
          )}
        </div>

        {/* Field Recording */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-3">Field Recording</h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={hasFieldRecording}
              onChange={(e) => setHasFieldRecording(e.target.checked)}
              className="w-5 h-5"
            />
            <label className="text-sm">Include ambient field recording</label>
          </div>
          {hasFieldRecording && (
            <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
              <p className="text-gray-500">🎤 Upload field recording (ocean waves, rain, etc.)</p>
            </div>
          )}
        </div>

        {/* Mix Settings */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Mix Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Music Volume: {Math.round(musicVolume * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Field Recording Volume: {Math.round(voiceVolume * 100)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={voiceVolume}
                onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <label className="text-sm">Auto ducking (lower music during voice)</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-5 h-5" />
              <label className="text-sm">Auto fade-in/out</label>
            </div>
          </div>
        </div>

        {/* Waveform Preview */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-3">Waveform Preview</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs w-16">Music</span>
              <div className="flex-1 h-8 bg-white rounded flex items-center px-2">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-500 rounded"
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-16">Field</span>
              <div className="flex-1 h-8 bg-white rounded flex items-center px-2">
                {[...Array(30)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-blue-500 rounded"
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleMix}
          disabled={isMixing || (!spotifyTrackId && !hasFieldRecording)}
          className={`w-full py-3 rounded font-medium ${
            isMixing || (!spotifyTrackId && !hasFieldRecording)
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          {isMixing ? 'Mixing...' : 'Create Soundtrack'}
        </button>

        {/* Saved Soundtracks */}
        <div>
          <h3 className="font-medium mb-3">Saved Soundtracks</h3>
          <div className="space-y-2">
            {soundtracks.map(soundtrack => (
              <div key={soundtrack.id} className="p-3 bg-gray-50 rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{soundtrack.title}</p>
                  <p className="text-sm text-gray-600">{formatTime(soundtrack.duration)}</p>
                  <div className="flex gap-1 mt-1">
                    {soundtrack.hasSpotify && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Spotify</span>}
                    {soundtrack.hasFieldRecording && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Field</span>}
                  </div>
                </div>
                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">▶ Play</button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded">
          <h4 className="font-medium text-purple-800 mb-2">Mashup Features:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Spotify track integration</li>
            <li>• Ambient field recording blending</li>
            <li>• Auto ducking for voice</li>
            <li>• Auto fade-in/out</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
