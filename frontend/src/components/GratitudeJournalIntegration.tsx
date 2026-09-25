'use client';

import { useState } from 'react';
import { Award, Calendar, CheckCircle, Heart, Info, RefreshCw, Sparkles, Star } from 'lucide-react';

interface GratitudeJournalIntegrationProps {
  onCancel?: () => void;
}

interface GratitudeEntry {
  id: string;
  date: string;
  gratitude: string;
  category: 'relationships' | 'health' | 'work' | 'nature' | 'small_things' | 'memories';
  mood: 'happy' | 'peaceful' | 'excited' | 'calm';
  linkedMemoryId?: string;
  isPublic: boolean;
}

interface GratitudeSettings {
  dailyReminder: boolean;
  reminderTime: string;
  defaultCategory: 'relationships' | 'health' | 'work' | 'nature' | 'small_things' | 'memories';
  autoLinkMemories: boolean;
  shareToFeed: boolean;
}

export default function GratitudeJournalIntegration({ onCancel }: GratitudeJournalIntegrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGratitudeEnabled, setIsGratitudeEnabled] = useState(true);

  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([
    { id: '1', date: '2024-01-15', gratitude: 'Grateful for my family who always supports me', category: 'relationships', mood: 'happy', linkedMemoryId: 'mem_1', isPublic: false },
    { id: '2', date: '2024-01-16', gratitude: 'Thankful for good health and the ability to exercise', category: 'health', mood: 'peaceful', linkedMemoryId: undefined, isPublic: false },
    { id: '3', date: '2024-01-17', gratitude: 'Appreciate the beautiful sunset I watched yesterday', category: 'nature', mood: 'calm', linkedMemoryId: 'mem_2', isPublic: false },
  ]);

  const [gratitudeSettings, setGratitudeSettings] = useState<GratitudeSettings>({
    dailyReminder: true,
    reminderTime: '08:00',
    defaultCategory: 'small_things',
    autoLinkMemories: true,
    shareToFeed: false,
  });

  const [currentGratitude, setCurrentGratitude] = useState({
    gratitude: '',
    category: 'small_things' as 'relationships' | 'health' | 'work' | 'nature' | 'small_things' | 'memories',
    mood: 'happy' as 'happy' | 'peaceful' | 'excited' | 'calm',
  });

  const saveGratitude = () => {
    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      gratitude: currentGratitude.gratitude,
      category: currentGratitude.category,
      mood: currentGratitude.mood,
      linkedMemoryId: gratitudeSettings.autoLinkMemories ? 'mem_' + Date.now() : undefined,
      isPublic: gratitudeSettings.shareToFeed,
    };
    setGratitudeEntries([...gratitudeEntries, newEntry]);
    setCurrentGratitude({
      gratitude: '',
      category: gratitudeSettings.defaultCategory,
      mood: 'happy',
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relationships': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'health': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'work': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'nature': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      case 'small_things': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'memories': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'peaceful': return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
      case 'excited': return 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300';
      case 'calm': return 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Gratitude Journal Integration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily gratitude journal with memory integration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGratitudeEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGratitudeEnabled ? 'Enabled' : 'Disabled'}
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Entries</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{gratitudeEntries.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Streak</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{gratitudeEntries.length} days</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Linked Memories</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{gratitudeEntries.filter(e => e.linkedMemoryId).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Categories</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{6}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGratitudeEnabled}
              onChange={(e) => setIsGratitudeEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Gratitude</span>
          </div>
          <button
            type="button"
            onClick={saveGratitude}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Star className="h-3 w-3" />
            Save Gratitude
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Today's Gratitude</h4>
          <div className="space-y-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">What are you grateful for today?</span>
              </div>
              <textarea
                value={currentGratitude.gratitude}
                onChange={(e) => setCurrentGratitude({ ...currentGratitude, gratitude: e.target.value })}
                placeholder="I am grateful for..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Category</span>
              </div>
              <select
                value={currentGratitude.category}
                onChange={(e) => setCurrentGratitude({ ...currentGratitude, category: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="relationships">Relationships</option>
                <option value="health">Health</option>
                <option value="work">Work</option>
                <option value="nature">Nature</option>
                <option value="small_things">Small Things</option>
                <option value="memories">Memories</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mood</span>
              </div>
              <select
                value={currentGratitude.mood}
                onChange={(e) => setCurrentGratitude({ ...currentGratitude, mood: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="happy">Happy</option>
                <option value="peaceful">Peaceful</option>
                <option value="excited">Excited</option>
                <option value="calm">Calm</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Gratitude Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Daily Reminder</span>
              </div>
              <input
                type="checkbox"
                checked={gratitudeSettings.dailyReminder}
                onChange={(e) => setGratitudeSettings({ ...gratitudeSettings, dailyReminder: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Reminder Time</span>
              </div>
              <input
                type="time"
                value={gratitudeSettings.reminderTime}
                onChange={(e) => setGratitudeSettings({ ...gratitudeSettings, reminderTime: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Link Memories</span>
              </div>
              <input
                type="checkbox"
                checked={gratitudeSettings.autoLinkMemories}
                onChange={(e) => setGratitudeSettings({ ...gratitudeSettings, autoLinkMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Share to Feed</span>
              </div>
              <input
                type="checkbox"
                checked={gratitudeSettings.shareToFeed}
                onChange={(e) => setGratitudeSettings({ ...gratitudeSettings, shareToFeed: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Gratitude Entries</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {gratitudeEntries.map((entry) => (
              <div key={entry.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{entry.date}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(entry.category)}`}>
                          {entry.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getMoodColor(entry.mood)}`}>
                          {entry.mood}
                        </span>
                        {entry.linkedMemoryId && (
                          <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            Linked
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-900 dark:text-white">{entry.gratitude}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Heart className="h-3 w-3" />
                    View
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Gratitude Journal Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Daily gratitude journal with memory integration</li>
              <li>• Categories: relationships, health, work, nature, small things, memories</li>
              <li>• Auto-link to related memories</li>
              <li>• Mood tracking and daily reminders</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
