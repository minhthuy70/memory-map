'use client';

import { useState } from 'react';

export default function DreamJournalMapAnchors() {
  const [dreams, setDreams] = useState([
    { id: 1, title: 'Flying over mountains', description: 'I was flying over snow-capped mountains...', dreamDate: '2024-01-15', isLucid: true, mood: 'peaceful', locationName: 'Swiss Alps' },
    { id: 2, title: 'Childhood home', description: 'Walking through my old house...', dreamDate: '2024-01-10', isLucid: false, mood: 'nostalgic', locationName: 'Hometown' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newDream, setNewDream] = useState({
    title: '',
    description: '',
    dreamDate: '',
    isLucid: false,
    mood: '',
    locationName: '',
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setDreams(prev => [
        ...prev,
        {
          id: prev.length + 1,
          title: newDream.title,
          description: newDream.description,
          dreamDate: newDream.dreamDate,
          isLucid: newDream.isLucid,
          mood: newDream.mood,
          locationName: newDream.locationName,
        },
      ]);
      setNewDream({ title: '', description: '', dreamDate: '', isLucid: false, mood: '', locationName: '' });
      setIsAdding(false);
    }, 1500);
  };

  const handleDelete = (id: number) => {
    setDreams(prev => prev.filter(d => d.id !== id));
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'scary': return '😱';
      case 'confusing': return '😕';
      case 'peaceful': return '😌';
      case 'nostalgic': return '🥺';
      default: return '💭';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Dream Journal with Map Anchors</h2>
      <p className="text-gray-600 mb-6">
        Log dreams upon waking, link dream scenery to real geographic locations visited, dream symbols analysis, lucid dream tagging.
      </p>

      <div className="space-y-4">
        {/* Add New Dream */}
        <div className="bg-indigo-50 p-4 rounded">
          <h3 className="font-medium mb-3">Log New Dream</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input
                type="text"
                placeholder="Dream title..."
                value={newDream.title}
                onChange={(e) => setNewDream({ ...newDream, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Dream Date</label>
              <input
                type="date"
                value={newDream.dreamDate}
                onChange={(e) => setNewDream({ ...newDream, dreamDate: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <textarea
            placeholder="Describe your dream..."
            value={newDream.description}
            onChange={(e) => setNewDream({ ...newDream, description: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Mood</label>
              <select
                value={newDream.mood}
                onChange={(e) => setNewDream({ ...newDream, mood: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select...</option>
                <option value="happy">Happy 😊</option>
                <option value="scary">Scary 😱</option>
                <option value="confusing">Confusing 😕</option>
                <option value="peaceful">Peaceful 😌</option>
                <option value="nostalgic">Nostalgic 🥺</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Real Location (optional)</label>
              <input
                type="text"
                placeholder="Location linked to dream..."
                value={newDream.locationName}
                onChange={(e) => setNewDream({ ...newDream, locationName: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={newDream.isLucid}
              onChange={(e) => setNewDream({ ...newDream, isLucid: e.target.checked })}
              className="w-5 h-5"
            />
            <label className="text-sm">Lucid Dream (aware while dreaming)</label>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding || !newDream.title || !newDream.description}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newDream.title || !newDream.description
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
            }`}
          >
            {isAdding ? 'Saving...' : 'Save Dream'}
          </button>
        </div>

        {/* Dream List */}
        <div>
          <h3 className="font-medium mb-3">Dream Journal</h3>
          <div className="space-y-3">
            {dreams.map(dream => (
              <div
                key={dream.id}
                className={`p-4 rounded border ${
                  dream.isLucid ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodIcon(dream.mood)}</span>
                    <div>
                      <p className="font-medium">{dream.title}</p>
                      <p className="text-sm text-gray-600">{dream.dreamDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {dream.isLucid && (
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">Lucid</span>
                    )}
                    <button
                      onClick={() => handleDelete(dream.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{dream.description}</p>
                {dream.locationName && (
                  <div className="flex items-center gap-1 text-sm text-indigo-600">
                    <span>📍</span>
                    <span>{dream.locationName}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Map Anchors */}
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">Dream Location Map</h3>
          <div className="h-48 bg-white rounded flex items-center justify-center">
            <div className="text-center text-gray-600">
              <p className="text-4xl mb-2">🗺️</p>
              <p className="text-sm">Dream locations will appear here</p>
              {dreams.filter(d => d.locationName).length > 0 && (
                <p className="text-xs mt-2">{dreams.filter(d => d.locationName).length} location(s) linked</p>
              )}
            </div>
          </div>
        </div>

        {/* Dream Symbols */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-2">Common Dream Symbols</h3>
          <div className="flex flex-wrap gap-2">
            {['Flying', 'Water', 'Falling', 'Teeth', 'House', 'Animals', 'Chase', 'Death'].map(symbol => (
              <span key={symbol} className="bg-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-100">
                {symbol}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 rounded">
          <h4 className="font-medium text-indigo-800 mb-2">Dream Journal Benefits:</h4>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• Track dream patterns and themes</li>
            <li>• Link dreams to real locations</li>
            <li>• Practice lucid dreaming techniques</li>
            <li>• Analyze dream symbols for insights</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
