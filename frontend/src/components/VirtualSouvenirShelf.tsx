'use client';

import { useState } from 'react';

export default function VirtualSouvenirShelf() {
  const [souvenirs, setSouvenirs] = useState([
    { id: 1, name: 'Eiffel Tower Figurine', type: 'figurine', location: 'Paris', position: 0 },
    { id: 2, name: 'Venice Gondola Magnet', type: 'magnet', location: 'Venice', position: 1 },
    { id: 3, name: 'Tokyo Cherry Blossom Postcard', type: 'postcard', location: 'Tokyo', position: 2 },
    { id: 4, name: 'Sydney Opera House Keychain', type: 'keychain', location: 'Sydney', position: 3 },
    { id: 5, name: 'Mount Fuji Figurine', type: 'figurine', location: 'Japan', position: 4 },
  ]);
  const [woodColor, setWoodColor] = useState('oak');
  const [lighting, setLighting] = useState('warm');
  const [isAdding, setIsAdding] = useState(false);
  const [newSouvenir, setNewSouvenir] = useState({
    name: '',
    type: 'figurine',
    location: '',
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setSouvenirs(prev => [
        ...prev,
        {
          id: prev.length + 1,
          name: newSouvenir.name,
          type: newSouvenir.type,
          location: newSouvenir.location,
          position: prev.length,
        },
      ]);
      setNewSouvenir({ name: '', type: 'figurine', location: '' });
      setIsAdding(false);
    }, 1500);
  };

  const handleMove = (id: number, direction: 'left' | 'right') => {
    setSouvenirs(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index < 0) return prev;

      const newIndex = direction === 'left' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated.map((s, i) => ({ ...s, position: i }));
    });
  };

  const getSouvenirIcon = (type: string) => {
    switch (type) {
      case 'figurine': return '🗿';
      case 'postcard': return '📮';
      case 'magnet': return '🧲';
      case 'keychain': return '🔑';
      default: return '📦';
    }
  };

  const getWoodColorClass = (color: string) => {
    switch (color) {
      case 'oak': return 'bg-amber-200';
      case 'mahogany': return 'bg-red-300';
      case 'pine': return 'bg-yellow-100';
      case 'dark': return 'bg-amber-900';
      default: return 'bg-amber-200';
    }
  };

  const getLightingClass = (light: string) => {
    switch (light) {
      case 'warm': return 'shadow-amber-200';
      case 'cool': return 'shadow-blue-200';
      case 'natural': return 'shadow-gray-200';
      default: return 'shadow-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Virtual Souvenir Collection Shelf</h2>
      <p className="text-gray-600 mb-6">
        Interactive 3D shelf with collectible souvenirs unlocked per destination, inspect 3D items, customize shelf wood/lighting, share showcase.
      </p>

      <div className="space-y-4">
        {/* Shelf Customization */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Customize Shelf</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Wood Color</label>
              <select
                value={woodColor}
                onChange={(e) => setWoodColor(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="oak">Oak</option>
                <option value="mahogany">Mahogany</option>
                <option value="pine">Pine</option>
                <option value="dark">Dark Wood</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Lighting</label>
              <select
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="natural">Natural</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3D Shelf Display */}
        <div className={`${getWoodColorClass(woodColor)} p-6 rounded-lg shadow-lg ${getLightingClass(lighting)}`}>
          <div className="flex justify-center items-end gap-4 h-48 border-b-4 border-amber-800 pb-4">
            {souvenirs.map(souvenir => (
              <div
                key={souvenir.id}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">
                  {getSouvenirIcon(souvenir.type)}
                </div>
                <div className="text-xs text-center max-w-20">
                  <div className="font-medium">{souvenir.name}</div>
                  <div className="text-gray-600">{souvenir.location}</div>
                </div>
                <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleMove(souvenir.id, 'left')}
                    className="text-xs bg-white px-2 py-1 rounded shadow"
                    disabled={souvenir.position === 0}
                  >
                    ←
                  </button>
                  <button
                    onClick={() => handleMove(souvenir.id, 'right')}
                    className="text-xs bg-white px-2 py-1 rounded shadow"
                    disabled={souvenir.position === souvenirs.length - 1}
                  >
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Souvenir */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Add New Souvenir</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Souvenir Name"
              value={newSouvenir.name}
              onChange={(e) => setNewSouvenir({ ...newSouvenir, name: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={newSouvenir.location}
              onChange={(e) => setNewSouvenir({ ...newSouvenir, location: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <select
            value={newSouvenir.type}
            onChange={(e) => setNewSouvenir({ ...newSouvenir, type: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="figurine">Figurine</option>
            <option value="postcard">Postcard</option>
            <option value="magnet">Magnet</option>
            <option value="keychain">Keychain</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={isAdding || !newSouvenir.name || !newSouvenir.location}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newSouvenir.name || !newSouvenir.location
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add to Shelf'}
          </button>
        </div>

        {/* Souvenir Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-purple-50 p-3 rounded text-center">
            <p className="text-2xl font-bold text-purple-600">{souvenirs.length}</p>
            <p className="text-xs text-gray-600">Total Items</p>
          </div>
          <div className="bg-blue-50 p-3 rounded text-center">
            <p className="text-2xl font-bold text-blue-600">
              {souvenirs.filter(s => s.type === 'figurine').length}
            </p>
            <p className="text-xs text-gray-600">Figurines</p>
          </div>
          <div className="bg-green-50 p-3 rounded text-center">
            <p className="text-2xl font-bold text-green-600">
              {souvenirs.filter(s => s.type === 'magnet').length}
            </p>
            <p className="text-xs text-gray-600">Magnets</p>
          </div>
          <div className="bg-orange-50 p-3 rounded text-center">
            <p className="text-2xl font-bold text-orange-600">
              {souvenirs.filter(s => s.type === 'postcard').length}
            </p>
            <p className="text-xs text-gray-600">Postcards</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">3D Shelf Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Unlock souvenirs by visiting new destinations</li>
            <li>• Drag and drop to rearrange items on shelf</li>
            <li>• Customize wood color and lighting</li>
            <li>• Share your showcase with friends</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
