'use client';

import { useState } from 'react';
import {
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Heart,
  Info,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface MentalHealthJournalProps {
  onCancel?: () => void;
}

interface JournalEntry {
  id: string;
  date: string;
  mood: 'excellent' | 'good' | 'neutral' | 'anxious' | 'depressed';
  energyLevel: number;
  sleepQuality: number;
  stressLevel: number;
  thoughts: string;
  triggers: string[];
  gratitude: string;
  isEncrypted: boolean;
}

interface JournalSettings {
  autoEncrypt: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  moodTracking: boolean;
  energyTracking: boolean;
}

export default function MentalHealthJournal({ onCancel }: MentalHealthJournalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isJournalEnabled, setIsJournalEnabled] = useState(true);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([
    { id: '1', date: '2024-01-15', mood: 'good', energyLevel: 8, sleepQuality: 7, stressLevel: 3, thoughts: 'Feeling productive today. Had a good conversation with colleagues.', triggers: ['work', 'social'], gratitude: 'Grateful for supportive colleagues', isEncrypted: true },
    { id: '2', date: '2024-01-16', mood: 'neutral', energyLevel: 6, sleepQuality: 5, stressLevel: 5, thoughts: 'Busy day, but managed to stay focused. Feeling a bit tired.', triggers: ['work', 'deadline'], gratitude: 'Grateful for coffee breaks', isEncrypted: true },
  ]);

  const [journalSettings, setJournalSettings] = useState<JournalSettings>({
    autoEncrypt: true,
    dailyReminder: true,
    reminderTime: '09:00',
    moodTracking: true,
    energyTracking: true,
  });

  const [currentEntry, setCurrentEntry] = useState({
    mood: 'neutral' as 'excellent' | 'good' | 'neutral' | 'anxious' | 'depressed',
    energyLevel: 5,
    sleepQuality: 5,
    stressLevel: 5,
    thoughts: '',
    triggers: '',
    gratitude: '',
  });

  const saveEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: currentEntry.mood,
      energyLevel: currentEntry.energyLevel,
      sleepQuality: currentEntry.sleepQuality,
      stressLevel: currentEntry.stressLevel,
      thoughts: currentEntry.thoughts,
      triggers: currentEntry.triggers.split(',').map(t => t.trim()).filter(t => t),
      gratitude: currentEntry.gratitude,
      isEncrypted: journalSettings.autoEncrypt,
    };
    setJournalEntries([...journalEntries, newEntry]);
    setCurrentEntry({
      mood: 'neutral',
      energyLevel: 5,
      sleepQuality: 5,
      stressLevel: 5,
      thoughts: '',
      triggers: '',
      gratitude: '',
    });
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'good': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'neutral': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'anxious': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'depressed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Mental Health Journal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily journal for mental wellness tracking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isJournalEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isJournalEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{journalEntries.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Mood</p>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">Good</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Energy</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{(journalEntries.reduce((acc, e) => acc + e.energyLevel, 0) / journalEntries.length).toFixed(1)}/10</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Encrypted</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{journalEntries.filter(e => e.isEncrypted).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isJournalEnabled}
              onChange={(e) => setIsJournalEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Journal</span>
          </div>
          <button
            type="button"
            onClick={saveEntry}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <BookOpen className="h-3 w-3" />
            Save Entry
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Today's Entry</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-rose-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mood</span>
              </div>
              <select
                value={currentEntry.mood}
                onChange={(e) => setCurrentEntry({ ...currentEntry, mood: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="neutral">Neutral</option>
                <option value="anxious">Anxious</option>
                <option value="depressed">Depressed</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Energy Level</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.energyLevel}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, energyLevel: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{currentEntry.energyLevel}/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Sleep Gauge</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.sleepQuality}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, sleepQuality: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{currentEntry.sleepQuality}/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Brain className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Stress Level</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentEntry.stressLevel}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, stressLevel: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{currentEntry.stressLevel}/10</span>
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Thoughts</span>
              </div>
              <textarea
                value={currentEntry.thoughts}
                onChange={(e) => setCurrentEntry({ ...currentEntry, thoughts: e.target.value })}
                placeholder="How are you feeling today?"
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Triggers (comma-separated)</span>
              </div>
              <input
                type="text"
                value={currentEntry.triggers}
                onChange={(e) => setCurrentEntry({ ...currentEntry, triggers: e.target.value })}
                placeholder="work, family, health..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Gratitude</span>
              </div>
              <textarea
                value={currentEntry.gratitude}
                onChange={(e) => setCurrentEntry({ ...currentEntry, gratitude: e.target.value })}
                placeholder="What are you grateful for today?"
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Journal Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-rose-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Encrypt</span>
              </div>
              <input
                type="checkbox"
                checked={journalSettings.autoEncrypt}
                onChange={(e) => setJournalSettings({ ...journalSettings, autoEncrypt: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Daily Reminder</span>
              </div>
              <input
                type="checkbox"
                checked={journalSettings.dailyReminder}
                onChange={(e) => setJournalSettings({ ...journalSettings, dailyReminder: e.target.checked })}
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
                value={journalSettings.reminderTime}
                onChange={(e) => setJournalSettings({ ...journalSettings, reminderTime: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Journal Entries</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {journalEntries.map((entry) => (
              <div key={entry.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-rose-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{entry.date}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getMoodColor(entry.mood)}`}>
                          {entry.mood}
                        </span>
                        {entry.isEncrypted && (
                          <span className="px-2 py-0.5 rounded text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                            Encrypted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Energy: {entry.energyLevel}/10 • Sleep: {entry.sleepQuality}/10 • Stress: {entry.stressLevel}/10</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-900 dark:text-white">{entry.thoughts}</p>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {entry.triggers.map((trigger) => (
                      <span key={trigger} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {trigger}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">Grateful: {entry.gratitude}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <BookOpen className="h-3 w-3" />
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Mental Health Journal Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Daily journal for mental wellness tracking</li>
              <li>• Track mood, energy, sleep, and stress levels</li>
              <li>• Record thoughts, triggers, and gratitude</li>
              <li>• Auto-encrypt for privacy and security</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
