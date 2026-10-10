'use client';

import { useState } from 'react';

export default function ARTreasureChests() {
  const [chests, setChests] = useState([
    { id: 1, name: 'Golden Chest', location: 'Central Park', contentType: 'souvenir', isUnlocked: false },
    { id: 2, name: 'Discount Coupon', location: 'Museum', contentType: 'coupon', isUnlocked: true },
    { id: 3, name: 'Vintage Filter', location: 'Beach', contentType: 'filter', isUnlocked: false },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newChest, setNewChest] = useState({
    name: '',
    location: '',
    contentType: 'souvenir',
  });

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setChests(prev => [
        ...prev,
        {
          id: prev.length + 1,
          name: newChest.name,
          location: newChest.location,
          contentType: newChest.contentType,
          isUnlocked: false,
        },
      ]);
      setNewChest({ name: '', location: '', contentType: 'souvenir' });
      setIsCreating(false);
    }, 1500);
  };

  const handleUnlock = (id: number) => {
    setChests(prev =>
      prev.map(chest =>
        chest.id === id ? { ...chest, isUnlocked: true } : chest
      )
    );
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'souvenir': return '🎁';
      case 'coupon': return '🎫';
      case 'filter': return '🎨';
      default: return '📦';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">AR Virtual Treasure Chests</h2>
      <p className="text-gray-600 mb-6">
        Discover floating AR chests in parks and tourist spots via phone camera, unlock virtual souvenirs, discount coupons, special photo filters.
      </p>

      <div className="space-y-4">
        {/* Create New AR Chest */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Place AR Treasure Chest</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Chest Name"
              value={newChest.name}
              onChange={(e) => setNewChest({ ...newChest, name: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Location"
              value={newChest.location}
              onChange={(e) => setNewChest({ ...newChest, location: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <select
            value={newChest.contentType}
            onChange={(e) => setNewChest({ ...newChest, contentType: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="souvenir">Virtual Souvenir</option>
            <option value="coupon">Discount Coupon</option>
            <option value="filter">Special Photo Filter</option>
          </select>
          <button
            onClick={handleCreate}
            disabled={isCreating || !newChest.name || !newChest.location}
            className={`w-full py-2 rounded font-medium ${
              isCreating || !newChest.name || !newChest.location
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isCreating ? 'Placing...' : 'Place AR Chest'}
          </button>
        </div>

        {/* AR Chest List */}
        <div>
          <h3 className="font-medium mb-3">Nearby AR Chests</h3>
          <div className="space-y-3">
            {chests.map(chest => (
              <div
                key={chest.id}
                className={`p-4 rounded border ${
                  chest.isUnlocked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getContentTypeIcon(chest.contentType)}</span>
                    <div>
                      <h4 className="font-medium">{chest.name}</h4>
                      <p className="text-sm text-gray-600">{chest.location}</p>
                    </div>
                  </div>
                  {chest.isUnlocked && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Unlocked</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                    {chest.contentType}
                  </span>
                  {!chest.isUnlocked && (
                    <button
                      onClick={() => handleUnlock(chest.id)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Unlock with AR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AR Camera Preview */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">AR Camera Preview</h3>
          <div className="h-48 bg-gray-300 rounded flex items-center justify-center">
            <div className="text-center text-gray-600">
              <p className="text-4xl mb-2">📱</p>
              <p className="text-sm">Point camera to discover AR chests</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded">
          <h4 className="font-medium text-yellow-800 mb-2">⚠️ AR Requirements:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Requires ARKit (iOS) or ARCore (Android)</li>
            <li>• Camera access permission needed</li>
            <li>• GPS location for chest placement</li>
            <li>• Works best in well-lit outdoor areas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
