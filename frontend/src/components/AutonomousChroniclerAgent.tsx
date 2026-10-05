'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AIJournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  photos: string;
  locations: string;
  isDraft: boolean;
  isReviewed: boolean;
  generatedAt: string;
}

export default function AutonomousChroniclerAgent() {
  const { token } = useAuth();
  const [journalEntries, setJournalEntries] = useState<AIJournalEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    photos: [] as string[],
    locations: [] as any[],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchJournalEntries();
  }, [token]);

  const fetchJournalEntries = async () => {
    try {
      const response = await fetch('http://localhost:3001/ai-companion/journal', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setJournalEntries(data);
    } catch (error) {
      console.error('Failed to fetch journal entries:', error);
    }
  };

  const createEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/ai-companion/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newEntry,
          date: selectedDate,
          isDraft: true,
        }),
      });

      setShowAddForm(false);
      setNewEntry({ title: '', content: '', photos: [], locations: [] });
      await fetchJournalEntries();
    } catch (error) {
      console.error('Failed to create entry:', error);
    }
  };

  const generateEntry = async () => {
    setIsGenerating(true);
    try {
      await fetch('http://localhost:3001/ai-companion/journal/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: selectedDate,
          photoIds: [],
        }),
      });

      await fetchJournalEntries();
    } catch (error) {
      console.error('Failed to generate entry:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateEntry = async (id: string, isReviewed: boolean) => {
    try {
      await fetch(`http://localhost:3001/ai-companion/journal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isReviewed }),
      });

      await fetchJournalEntries();
    } catch (error) {
      console.error('Failed to update entry:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) return;

    try {
      await fetch(`http://localhost:3001/ai-companion/journal/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchJournalEntries();
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Autonomous Evening Chronicler</h2>
        <div className="flex gap-2">
          <button
            onClick={generateEntry}
            disabled={isGenerating}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : '✨ AI Generate Entry'}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Entry
          </button>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Create Journal Entry</h3>
          <form onSubmit={createEntry} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                placeholder="A Beautiful Day"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                placeholder="Write about your day..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Your Journal Entries</h3>

        {journalEntries.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No journal entries yet</p>
        ) : (
          journalEntries.map((entry) => (
            <div
              key={entry.id}
              className={`p-4 border rounded-lg transition-colors ${
                entry.isDraft ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-800">{entry.title}</span>
                    {entry.isDraft && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700">
                        Draft
                      </span>
                    )}
                    {entry.isReviewed && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700">
                        Reviewed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {entry.isDraft && (
                    <button
                      onClick={() => updateEntry(entry.id, true)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm transition-colors"
                    >
                      Mark Reviewed
                    </button>
                  )}
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>

              {entry.photos && JSON.parse(entry.photos).length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">
                    {JSON.parse(entry.photos).length} photos attached
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">How It Works</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Runs autonomously at 21:00 daily</li>
          <li>• Groups daytime camera roll photos</li>
          <li>• Identifies visit locations</li>
          <li>• Drafts poetic journal entry for review</li>
        </ul>
      </div>
    </div>
  );
}
