'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface SoundscapeMix {
  id: string;
  title: string;
  memoryId: string | null;
  mixData: string;
  duration: number;
  audioUrl: string | null;
  createdAt: string;
}

interface SoundLayer {
  id: string;
  name: string;
  icon: string;
  volume: number;
}

export default function EnvironmentalSoundscapeMixer() {
  const { token } = useAuth();
  const [mixes, setMixes] = useState<SoundscapeMix[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentMix, setCurrentMix] = useState<SoundscapeMix | null>(null);
  const [newMix, setNewMix] = useState({
    title: '',
    duration: 60,
  });

  const [layers, setLayers] = useState<SoundLayer[]>([
    { id: 'rain', name: 'Rain on Tent', icon: '🌧️', volume: 0 },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊', volume: 0 },
    { id: 'cafe', name: 'Parisian Cafe', icon: '☕', volume: 0 },
    { id: 'forest', name: 'Forest Birds', icon: '🐦', volume: 0 },
    { id: 'wind', name: 'Mountain Wind', icon: '💨', volume: 0 },
    { id: 'fire', name: 'Campfire', icon: '🔥', volume: 0 },
  ]);

  useEffect(() => {
    fetchMixes();
  }, [token]);

  const fetchMixes = async () => {
    try {
      const response = await fetch('http://localhost:3001/audiovisual/soundscapes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMixes(data);
    } catch (error) {
      console.error('Failed to fetch mixes:', error);
    }
  };

  const createMix = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mixData = layers.reduce((acc, layer) => {
        acc[layer.id] = layer.volume;
        return acc;
      }, {} as Record<string, number>);

      await fetch('http://localhost:3001/audiovisual/soundscapes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newMix,
          mixData,
        }),
      });

      setShowCreateForm(false);
      setNewMix({ title: '', duration: 60 });
      await fetchMixes();
    } catch (error) {
      console.error('Failed to create mix:', error);
    }
  };

  const loadMix = (mix: SoundscapeMix) => {
    const mixData = JSON.parse(mix.mixData);
    const updatedLayers = layers.map((layer) => ({
      ...layer,
      volume: mixData[layer.id] || 0,
    }));
    setLayers(updatedLayers);
    setCurrentMix(mix);
  };

  const updateVolume = (id: string, volume: number) => {
    setLayers(layers.map((layer) => (layer.id === id ? { ...layer, volume } : layer)));
  };

  const resetLayers = () => {
    setLayers(layers.map((layer) => ({ ...layer, volume: 0 })));
    setCurrentMix(null);
  };

  const isPlaying = layers.some((layer) => layer.volume > 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Environmental Soundscape Mixer</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Mix
        </button>
      </div>

      {/* Mixer Interface */}
      <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Sound Layers</h3>
          {currentMix && (
            <span className="text-sm text-gray-600">Editing: {currentMix.title}</span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {layers.map((layer) => (
            <div key={layer.id} className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{layer.icon}</span>
                <span className="font-medium text-gray-800">{layer.name}</span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={layer.volume}
                  onChange={(e) => updateVolume(layer.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>0%</span>
                  <span>{layer.volume}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={resetLayers}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
          {isPlaying && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              <span className="animate-pulse">🔊</span>
              <span>Playing</span>
            </div>
          )}
        </div>
      </div>

      {/* Save Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Save Soundscape Mix</h3>
          <form onSubmit={createMix} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newMix.title}
                onChange={(e) => setNewMix({ ...newMix, title: e.target.value })}
                placeholder="Rainy Evening"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
              <input
                type="number"
                value={newMix.duration}
                onChange={(e) => setNewMix({ ...newMix, duration: parseInt(e.target.value) })}
                min="10"
                max="3600"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Mix
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Saved Mixes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Saved Mixes</h3>

        {mixes.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No saved mixes yet</p>
        ) : (
          mixes.map((mix) => (
            <div
              key={mix.id}
              className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{mix.title}</h4>
                  <p className="text-sm text-gray-600">
                    Duration: {mix.duration}s • Created: {new Date(mix.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => loadMix(mix)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Load
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">About Soundscape Mixer</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Multi-track ambient sound generator</li>
          <li>• Rain, ocean waves, cafe ambience, forest birds</li>
          <li>• Adjust volume sliders per layer</li>
          <li>• Embed into memory playback</li>
        </ul>
      </div>
    </div>
  );
}
