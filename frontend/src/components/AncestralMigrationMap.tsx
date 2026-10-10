'use client';

import { useState } from 'react';

export default function AncestralMigrationMap() {
  const [migrations, setMigrations] = useState([
    { id: 1, fromLocation: 'Hanoi', toLocation: 'Ho Chi Minh City', moveDate: '1980-05-15', reason: 'work' },
    { id: 2, fromLocation: 'Ho Chi Minh City', toLocation: 'Da Nang', moveDate: '1995-08-20', reason: 'marriage' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMigration, setNewMigration] = useState({
    fromLocation: '',
    toLocation: '',
    moveDate: '',
    reason: '',
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setMigrations(prev => [
        ...prev,
        {
          id: prev.length + 1,
          fromLocation: newMigration.fromLocation,
          toLocation: newMigration.toLocation,
          moveDate: newMigration.moveDate,
          reason: newMigration.reason,
        },
      ]);
      setNewMigration({ fromLocation: '', toLocation: '', moveDate: '', reason: '' });
      setIsAdding(false);
    }, 1500);
  };

  const getReasonColor = (reason: string) => {
    switch (reason) {
      case 'war': return 'bg-red-100 text-red-800';
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'marriage': return 'bg-pink-100 text-pink-800';
      case 'education': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Ancestral Migration Timeline Map</h2>
      <p className="text-gray-600 mb-6">
        Visualize generational movements across provinces and continents over decades/centuries, migration reasons tags.
      </p>

      <div className="space-y-4">
        {/* Migration Map */}
        <div className="bg-gray-100 p-4 rounded h-48 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <p className="text-4xl mb-2">🗺️</p>
              <p className="text-sm">Migration Map</p>
              <p className="text-xs">{migrations.length} movements tracked</p>
            </div>
          </div>
          {migrations.map((migration, index) => (
            <div
              key={migration.id}
              className="absolute text-2xl"
              style={{
                left: `${20 + index * 30}%`,
                top: `${30 + index * 15}%`,
              }}
            >
              ✈️
            </div>
          ))}
        </div>

        {/* Add Migration */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-3">Add Migration</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="From Location"
              value={newMigration.fromLocation}
              onChange={(e) => setNewMigration({ ...newMigration, fromLocation: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="To Location"
              value={newMigration.toLocation}
              onChange={(e) => setNewMigration({ ...newMigration, toLocation: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="date"
              value={newMigration.moveDate}
              onChange={(e) => setNewMigration({ ...newMigration, moveDate: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newMigration.reason}
              onChange={(e) => setNewMigration({ ...newMigration, reason: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="">Reason (optional)</option>
              <option value="war">War</option>
              <option value="work">Work</option>
              <option value="marriage">Marriage</option>
              <option value="education">Education</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding || !newMigration.fromLocation || !newMigration.toLocation}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newMigration.fromLocation || !newMigration.toLocation
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add Migration'}
          </button>
        </div>

        {/* Migration List */}
        <div>
          <h3 className="font-medium mb-3">Migration History</h3>
          <div className="space-y-2">
            {migrations.map(migration => (
              <div key={migration.id} className="p-3 bg-white border rounded flex items-center gap-3">
                <span className="text-2xl">✈️</span>
                <div className="flex-1">
                  <p className="font-medium">{migration.fromLocation} → {migration.toLocation}</p>
                  <p className="text-sm text-gray-600">{migration.moveDate}</p>
                </div>
                {migration.reason && (
                  <span className={`text-xs px-2 py-1 rounded capitalize ${getReasonColor(migration.reason)}`}>
                    {migration.reason}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded">
          <h4 className="font-medium text-purple-800 mb-2">Migration Tracking:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Visualize family movements over time</li>
            <li>• Tag migration reasons (war, work, marriage)</li>
            <li>• Historical map tile overlays</li>
            <li>• Generational journey timeline</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
