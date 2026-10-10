'use client';

import { useState } from 'react';

export default function EmotionalWaveformTimeline() {
  const [waveforms, setWaveforms] = useState([
    { id: 1, date: '2020-01-15', mood: 'happiness', intensity: 0.9, lifeChapter: 'college' },
    { id: 2, date: '2020-06-20', mood: 'stress', intensity: 0.7, lifeChapter: 'college' },
    { id: 3, date: '2021-03-10', mood: 'peace', intensity: 0.8, lifeChapter: 'travel' },
    { id: 4, date: '2022-09-15', mood: 'excitement', intensity: 0.95, lifeChapter: 'career' },
    { id: 5, date: '2023-12-25', mood: 'happiness', intensity: 0.85, lifeChapter: 'marriage' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newWaveform, setNewWaveform] = useState({
    date: '',
    mood: 'happiness',
    intensity: 0.5,
    lifeChapter: '',
    note: '',
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setWaveforms(prev => [
        ...prev,
        {
          id: prev.length + 1,
          date: newWaveform.date,
          mood: newWaveform.mood,
          intensity: newWaveform.intensity,
          lifeChapter: newWaveform.lifeChapter,
        },
      ]);
      setNewWaveform({ date: '', mood: 'happiness', intensity: 0.5, lifeChapter: '', note: '' });
      setIsAdding(false);
    }, 1500);
  };

  const handleDelete = (id: number) => {
    setWaveforms(prev => prev.filter(w => w.id !== id));
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happiness': return 'bg-yellow-400';
      case 'sadness': return 'bg-blue-400';
      case 'anger': return 'bg-red-400';
      case 'peace': return 'bg-green-400';
      case 'stress': return 'bg-orange-400';
      case 'excitement': return 'bg-purple-400';
      default: return 'bg-gray-400';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happiness': return '😊';
      case 'sadness': return '😢';
      case 'anger': return '😠';
      case 'peace': return '😌';
      case 'stress': return '😰';
      case 'excitement': return '🤩';
      default: return '😐';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Emotional Waveform Timeline</h2>
      <p className="text-gray-600 mb-6">
        Continuous smooth waveform charting highs and lows across years, life chapter annotations: college, travel, marriage, career shifts.
      </p>

      <div className="space-y-4">
        {/* Waveform Visualization */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Emotional Waveform</h3>
          <div className="h-48 bg-white rounded border flex items-end justify-around p-4">
            {waveforms.map((waveform, index) => (
              <div
                key={waveform.id}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-8 rounded-t ${getMoodColor(waveform.mood)}`}
                  style={{ height: `${waveform.intensity * 100}%` }}
                />
                <span className="text-xs mt-1">{getMoodIcon(waveform.mood)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Entry */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Add Emotional Entry</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Date</label>
              <input
                type="date"
                value={newWaveform.date}
                onChange={(e) => setNewWaveform({ ...newWaveform, date: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Mood</label>
              <select
                value={newWaveform.mood}
                onChange={(e) => setNewWaveform({ ...newWaveform, mood: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="happiness">Happiness 😊</option>
                <option value="sadness">Sadness 😢</option>
                <option value="anger">Anger 😠</option>
                <option value="peace">Peace 😌</option>
                <option value="stress">Stress 😰</option>
                <option value="excitement">Excitement 🤩</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Intensity (0-1)</label>
              <input
                type="number"
                value={newWaveform.intensity}
                onChange={(e) => setNewWaveform({ ...newWaveform, intensity: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                min={0}
                max={1}
                step={0.1}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Life Chapter</label>
              <select
                value={newWaveform.lifeChapter}
                onChange={(e) => setNewWaveform({ ...newWaveform, lifeChapter: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select...</option>
                <option value="college">College</option>
                <option value="travel">Travel</option>
                <option value="marriage">Marriage</option>
                <option value="career">Career</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <textarea
            placeholder="Note (optional)"
            value={newWaveform.note}
            onChange={(e) => setNewWaveform({ ...newWaveform, note: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={2}
          />
          <button
            onClick={handleAdd}
            disabled={isAdding || !newWaveform.date}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newWaveform.date
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add Entry'}
          </button>
        </div>

        {/* Timeline List */}
        <div>
          <h3 className="font-medium mb-3">Timeline Entries</h3>
          <div className="space-y-2">
            {waveforms
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(waveform => (
                <div
                  key={waveform.id}
                  className="p-3 bg-white border rounded flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMoodIcon(waveform.mood)}</span>
                    <div>
                      <p className="font-medium capitalize">{waveform.mood}</p>
                      <p className="text-sm text-gray-600">{waveform.date}</p>
                      {waveform.lifeChapter && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                          {waveform.lifeChapter}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{Math.round(waveform.intensity * 100)}%</span>
                    <button
                      onClick={() => handleDelete(waveform.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded">
          <h4 className="font-medium text-purple-800 mb-2">Life Chapters & Insights:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Track emotional patterns over time</li>
            <li>• Identify life chapter transitions</li>
            <li>• Visualize highs and lows</li>
            <li>• Reflect on personal growth</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
