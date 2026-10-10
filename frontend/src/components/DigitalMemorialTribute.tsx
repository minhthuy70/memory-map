'use client';

import { useState } from 'react';

export default function DigitalMemorialTribute() {
  const [memorials, setMemorials] = useState([
    { id: 1, deceasedName: 'John Smith', birthDate: '1950-01-15', deathDate: '2020-06-30', biography: 'Beloved father and grandfather. He will be dearly missed.', candles: 15, flowers: 23, isPublic: false },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemorial, setNewMemorial] = useState({
    deceasedName: '',
    birthDate: '',
    deathDate: '',
    biography: '',
    isPublic: false,
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setMemorials(prev => [
        ...prev,
        {
          id: prev.length + 1,
          deceasedName: newMemorial.deceasedName,
          birthDate: newMemorial.birthDate,
          deathDate: newMemorial.deathDate,
          biography: newMemorial.biography,
          candles: 0,
          flowers: 0,
          isPublic: newMemorial.isPublic,
        },
      ]);
      setNewMemorial({ deceasedName: '', birthDate: '', deathDate: '', biography: '', isPublic: false });
      setIsAdding(false);
    }, 1500);
  };

  const handleAddCandle = (id: number) => {
    setMemorials(prev =>
      prev.map(m => m.id === id ? { ...m, candles: m.candles + 1 } : m)
    );
  };

  const handleAddFlower = (id: number) => {
    setMemorials(prev =>
      prev.map(m => m.id === id ? { ...m, flowers: m.flowers + 1 } : m)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Digital Memorial & Eternal Tribute Page</h2>
      <p className="text-gray-600 mb-6">
        Reverent memorial page for deceased loved ones, virtual candle lighting, flower offerings, shared condolence stories.
      </p>

      <div className="space-y-4">
        {/* Create Memorial */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Create Memorial</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Deceased Name"
              value={newMemorial.deceasedName}
              onChange={(e) => setNewMemorial({ ...newMemorial, deceasedName: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="date"
              placeholder="Birth Date"
              value={newMemorial.birthDate}
              onChange={(e) => setNewMemorial({ ...newMemorial, birthDate: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <input
            type="date"
            placeholder="Death Date"
            value={newMemorial.deathDate}
            onChange={(e) => setNewMemorial({ ...newMemorial, deathDate: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          />
          <textarea
            placeholder="Biography"
            value={newMemorial.biography}
            onChange={(e) => setNewMemorial({ ...newMemorial, biography: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={3}
          />
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={newMemorial.isPublic}
              onChange={(e) => setNewMemorial({ ...newMemorial, isPublic: e.target.checked })}
              className="w-5 h-5"
            />
            <label className="text-sm">Make public (accessible via access code)</label>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding || !newMemorial.deceasedName || !newMemorial.biography}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newMemorial.deceasedName || !newMemorial.biography
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-900 text-white'
            }`}
          >
            {isAdding ? 'Creating...' : 'Create Memorial'}
          </button>
        </div>

        {/* Memorials List */}
        <div>
          <h3 className="font-medium mb-3">Memorials</h3>
          <div className="space-y-4">
            {memorials.map(memorial => (
              <div key={memorial.id} className="p-6 bg-gradient-to-b from-gray-50 to-white border rounded">
                <div className="text-center mb-4">
                  <p className="text-3xl mb-2">🕯️</p>
                  <h3 className="text-xl font-bold">{memorial.deceasedName}</h3>
                  <p className="text-sm text-gray-600">
                    {memorial.birthDate} - {memorial.deathDate}
                  </p>
                </div>
                <p className="text-sm text-gray-700 mb-4">{memorial.biography}</p>
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    onClick={() => handleAddCandle(memorial.id)}
                    className="flex flex-col items-center px-4 py-2 bg-yellow-50 hover:bg-yellow-100 rounded"
                  >
                    <span className="text-2xl">🕯️</span>
                    <span className="text-sm">{memorial.candles}</span>
                  </button>
                  <button
                    onClick={() => handleAddFlower(memorial.id)}
                    className="flex flex-col items-center px-4 py-2 bg-pink-50 hover:bg-pink-100 rounded"
                  >
                    <span className="text-2xl">💐</span>
                    <span className="text-sm">{memorial.flowers}</span>
                  </button>
                </div>
                {memorial.isPublic && (
                  <div className="text-center text-xs text-gray-500">
                    <span>🔒 Access code protected</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded">
          <h4 className="font-medium text-purple-800 mb-2">Memorial Features:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Virtual candle lighting</li>
            <li>• Digital flower offerings</li>
            <li>• Shared condolence stories</li>
            <li>• Eternal preservation hosting</li>
            <li>• Access code for sharing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
