'use client';

import { useState } from 'react';
import { FileText, X, RefreshCw, Info, CheckCircle, Star, Zap, Lock, Calendar, Shield, Clock, Edit } from 'lucide-react';

interface TherapySessionNotesProps {
  onCancel?: () => void;
}

interface TherapyNote {
  id: string;
  sessionDate: string;
  therapistName: string;
  sessionType: 'individual' | 'group' | 'couples' | 'family';
  duration: number;
  topics: string[];
  insights: string;
  moodBefore: number;
  moodAfter: number;
  isEncrypted: boolean;
  notes: string;
}

interface TherapySettings {
  autoEncrypt: boolean;
  defaultDuration: number;
  moodTracking: boolean;
  reminderEnabled: boolean;
  reminderDay: string;
}

export default function TherapySessionNotes({ onCancel }: TherapySessionNotesProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isNotesEnabled, setIsNotesEnabled] = useState(true);

  const [therapyNotes, setTherapyNotes] = useState<TherapyNote[]>([
    { id: '1', sessionDate: '2024-01-15', therapistName: 'Dr. Smith', sessionType: 'individual', duration: 60, topics: ['anxiety', 'work stress'], insights: 'Learned breathing techniques for anxiety management', moodBefore: 3, moodAfter: 6, isEncrypted: true, notes: 'Discussed current work pressures and family expectations. Introduced mindfulness exercises.' },
    { id: '2', sessionDate: '2024-01-22', therapistName: 'Dr. Smith', sessionType: 'individual', duration: 60, topics: ['relationships', 'boundaries'], insights: 'Setting healthy boundaries with family members', moodBefore: 4, moodAfter: 7, isEncrypted: true, notes: 'Explored patterns in family dynamics and practiced assertive communication.' },
  ]);

  const [therapySettings, setTherapySettings] = useState<TherapySettings>({
    autoEncrypt: true,
    defaultDuration: 60,
    moodTracking: true,
    reminderEnabled: true,
    reminderDay: 'Monday',
  });

  const [currentNote, setCurrentNote] = useState({
    therapistName: '',
    sessionType: 'individual' as 'individual' | 'group' | 'couples' | 'family',
    duration: 60,
    topics: '',
    insights: '',
    moodBefore: 5,
    moodAfter: 5,
    notes: '',
  });

  const saveNote = () => {
    const newNote: TherapyNote = {
      id: Date.now().toString(),
      sessionDate: new Date().toISOString().split('T')[0],
      therapistName: currentNote.therapistName,
      sessionType: currentNote.sessionType,
      duration: currentNote.duration,
      topics: currentNote.topics.split(',').map(t => t.trim()).filter(t => t),
      insights: currentNote.insights,
      moodBefore: currentNote.moodBefore,
      moodAfter: currentNote.moodAfter,
      isEncrypted: therapySettings.autoEncrypt,
      notes: currentNote.notes,
    };
    setTherapyNotes([...therapyNotes, newNote]);
    setCurrentNote({
      therapistName: '',
      sessionType: 'individual',
      duration: 60,
      topics: '',
      insights: '',
      moodBefore: 5,
      moodAfter: 5,
      notes: '',
    });
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'group': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'couples': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'family': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Therapy Session Notes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Private encrypted therapy session records
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isNotesEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isNotesEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sessions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{therapyNotes.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Hours</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{(therapyNotes.reduce((acc, n) => acc + n.duration, 0) / 60).toFixed(1)}h</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Mood Change</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">+{(therapyNotes.reduce((acc, n) => acc + (n.moodAfter - n.moodBefore), 0) / therapyNotes.length).toFixed(1)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Encrypted</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{therapyNotes.filter(n => n.isEncrypted).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isNotesEnabled}
              onChange={(e) => setIsNotesEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Notes</span>
          </div>
          <button
            type="button"
            onClick={saveNote}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            Save Note
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Session Input</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-violet-400" />
                <span className="text-xs text-slate-900 dark:text-white">Therapist Name</span>
              </div>
              <input
                type="text"
                value={currentNote.therapistName}
                onChange={(e) => setCurrentNote({ ...currentNote, therapistName: e.target.value })}
                placeholder="Enter therapist name..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Session Type</span>
              </div>
              <select
                value={currentNote.sessionType}
                onChange={(e) => setCurrentNote({ ...currentNote, sessionType: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
                <option value="couples">Couples</option>
                <option value="family">Family</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Duration (min)</span>
              </div>
              <input
                type="number"
                value={currentNote.duration}
                onChange={(e) => setCurrentNote({ ...currentNote, duration: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Topics (comma-separated)</span>
              </div>
              <input
                type="text"
                value={currentNote.topics}
                onChange={(e) => setCurrentNote({ ...currentNote, topics: e.target.value })}
                placeholder="anxiety, work, relationships..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Key Insights</span>
              </div>
              <textarea
                value={currentNote.insights}
                onChange={(e) => setCurrentNote({ ...currentNote, insights: e.target.value })}
                placeholder="What were the main takeaways?"
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mood Before</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentNote.moodBefore}
                  onChange={(e) => setCurrentNote({ ...currentNote, moodBefore: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{currentNote.moodBefore}/10</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mood After</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentNote.moodAfter}
                  onChange={(e) => setCurrentNote({ ...currentNote, moodAfter: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{currentNote.moodAfter}/10</span>
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Lock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Session Notes</span>
              </div>
              <textarea
                value={currentNote.notes}
                onChange={(e) => setCurrentNote({ ...currentNote, notes: e.target.value })}
                placeholder="Detailed session notes..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Therapy Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-violet-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Encrypt</span>
              </div>
              <input
                type="checkbox"
                checked={therapySettings.autoEncrypt}
                onChange={(e) => setTherapySettings({ ...therapySettings, autoEncrypt: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Duration</span>
              </div>
              <input
                type="number"
                value={therapySettings.defaultDuration}
                onChange={(e) => setTherapySettings({ ...therapySettings, defaultDuration: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mood Tracking</span>
              </div>
              <input
                type="checkbox"
                checked={therapySettings.moodTracking}
                onChange={(e) => setTherapySettings({ ...therapySettings, moodTracking: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Therapy Notes</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {therapyNotes.map((note) => (
              <div key={note.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{note.sessionDate}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getSessionTypeColor(note.sessionType)}`}>
                          {note.sessionType}
                        </span>
                        {note.isEncrypted && (
                          <span className="px-2 py-0.5 rounded text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">
                            Encrypted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{note.therapistName} • {note.duration}min • Mood: {note.moodBefore} → {note.moodAfter}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {note.topics.map((topic) => (
                      <span key={topic} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">Insights: {note.insights}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
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
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Therapy Notes Tips</h4>
            <ul className="text-xs text-s-auto">
              <li>• Private encrypted therapy session records</li>
              <li>• Session types: individual, group, couples, family</li>
              <li>• Mood tracking before and after sessions</li>
              <li>• Auto-encrypt for privacy and security</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
