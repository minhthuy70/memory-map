'use client';

import { useState } from 'react';

export default function OralHistoryVault() {
  const [histories, setHistories] = useState([
    { id: 1, title: 'Grandma\'s Childhood Stories', speakerName: 'Grandma Mary', relationship: 'grandmother', dialect: 'Northern', recordedAt: '2023-12-01' },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newHistory, setNewHistory] = useState({
    title: '',
    speakerName: '',
    relationship: 'grandmother',
    dialect: '',
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setHistories(prev => [
        ...prev,
        {
          id: prev.length + 1,
          title: newHistory.title,
          speakerName: newHistory.speakerName,
          relationship: newHistory.relationship,
          dialect: newHistory.dialect,
          recordedAt: new Date().toISOString().split('T')[0],
        },
      ]);
      setNewHistory({ title: '', speakerName: '', relationship: 'grandmother', dialect: '' });
      setIsAdding(false);
    }, 1500);
  };

  const dialects = ['Northern', 'Central', 'Southern', 'Mountain', 'Other'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Oral History & Dialect Preservation Vault</h2>
      <p className="text-gray-600 mb-6">
        Elderly oral storytelling recorder, regional dialect tagging, transcription with phonetics, photo slideshow during playback.
      </p>

      <div className="space-y-4">
        {/* Recording Button */}
        <div className="bg-red-50 p-4 rounded flex items-center justify-between">
          <div>
            <p className="font-medium">Record New Story</p>
            <p className="text-sm text-gray-600">Capture oral history from family elders</p>
          </div>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-red-100 hover:bg-red-200'
            }`}
          >
            {isRecording ? '⏹' : '🎙️'}
          </button>
        </div>

        {/* Add Oral History */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-3">Add Oral History Entry</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Title"
              value={newHistory.title}
              onChange={(e) => setNewHistory({ ...newHistory, title: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Speaker Name"
              value={newHistory.speakerName}
              onChange={(e) => setNewHistory({ ...newHistory, speakerName: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <select
              value={newHistory.relationship}
              onChange={(e) => setNewHistory({ ...newHistory, relationship: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="grandmother">Grandmother</option>
              <option value="grandfather">Grandfather</option>
              <option value="aunt">Aunt</option>
              <option value="uncle">Uncle</option>
              <option value="parent">Parent</option>
            </select>
            <select
              value={newHistory.dialect}
              onChange={(e) => setNewHistory({ ...newHistory, dialect: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="">Dialect (optional)</option>
              {dialects.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={isAdding || !newHistory.title || !newHistory.speakerName}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newHistory.title || !newHistory.speakerName
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAdding ? 'Saving...' : 'Save Entry'}
          </button>
        </div>

        {/* Histories List */}
        <div>
          <h3 className="font-medium mb-3">Oral History Archive</h3>
          <div className="space-y-2">
            {histories.map(history => (
              <div key={history.id} className="p-3 bg-white border rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{history.title}</p>
                    <p className="text-sm text-gray-600">{history.speakerName} ({history.relationship})</p>
                  </div>
                  {history.dialect && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {history.dialect}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📅 {history.recordedAt}</span>
                  <button className="text-blue-600 hover:text-blue-800">▶ Play</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <h4 className="font-medium text-green-800 mb-2">Preservation Features:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Regional dialect tagging</li>
            <li>• Transcription with phonetics</li>
            <li>• Photo slideshow during playback</li>
            <li>• Archive preservation tag</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
