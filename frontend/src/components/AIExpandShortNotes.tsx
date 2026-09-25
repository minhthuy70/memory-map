'use client';

import { useState } from 'react';
import {
  CheckCircle,
  Copy,
  FileText,
  Info,
  Maximize,
  Minimize,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface AIExpandShortNotesProps {
  onCancel?: () => void;
}

interface ExpandedNote {
  id: string;
  originalNote: string;
  expandedText: string;
  expansionLevel: 'brief' | 'detailed' | 'comprehensive';
  wordCount: number;
  createdAt: string;
  isSaved: boolean;
}

interface ExpansionSettings {
  autoExpand: boolean;
  defaultLevel: 'brief' | 'detailed' | 'comprehensive';
  includeContext: boolean;
  maintainTone: boolean;
}

export default function AIExpandShortNotes({ onCancel }: AIExpandShortNotesProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isExpanderEnabled, setIsExpanderEnabled] = useState(true);

  const [expandedNotes, setExpandedNotes] = useState<ExpandedNote[]>([
    { id: '1', originalNote: 'Great day at beach', expandedText: 'It was a wonderful day spent at the beach with clear blue skies and gentle waves. The sun was shining brightly as we enjoyed building sandcastles and collecting seashells along the shore. The peaceful sound of the ocean created the perfect atmosphere for relaxation and family bonding.', expansionLevel: 'detailed', wordCount: 45, createdAt: '2024-01-15', isSaved: true },
    { id: '2', originalNote: 'Meeting friends', expandedText: 'Had a lovely time meeting up with old friends at our favorite coffee shop. We spent hours catching up on life updates, sharing stories, and reminiscing about our college days. The warm atmosphere and good company made it a memorable gathering that we all enjoyed immensely.', expansionLevel: 'comprehensive', wordCount: 52, createdAt: '2024-02-20', isSaved: false },
  ]);

  const [expansionSettings, setExpansionSettings] = useState<ExpansionSettings>({
    autoExpand: false,
    defaultLevel: 'detailed',
    includeContext: true,
    maintainTone: true,
  });

  const [currentNote, setCurrentNote] = useState('');

  const expandNote = () => {
    const levels: Array<'brief' | 'detailed' | 'comprehensive'> = ['brief', 'detailed', 'comprehensive'];
    const newExpanded: ExpandedNote = {
      id: Date.now().toString(),
      originalNote: currentNote || 'Sample short note',
      expandedText: 'AI-expanded version of the note with additional context, details, and elaboration to create a more comprehensive and engaging description of the original thought or memory.',
      expansionLevel: expansionSettings.defaultLevel,
      wordCount: Math.floor(Math.random() * 30) + 40,
      createdAt: new Date().toISOString().split('T')[0],
      isSaved: false,
    };
    setExpandedNotes([...expandedNotes, newExpanded]);
    setCurrentNote('');
  };

  const saveNote = (id: string) => {
    setExpandedNotes(expandedNotes.map(note => 
      note.id === id ? { ...note, isSaved: true } : note
    ));
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'brief': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'detailed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'comprehensive': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Maximize className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Expand Short Notes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Expand short notes into full paragraphs
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isExpanderEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isExpanderEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Expanded</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{expandedNotes.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Saved</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{expandedNotes.filter(n => n.isSaved).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Words</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(expandedNotes.reduce((acc, n) => acc + n.wordCount, 0) / expandedNotes.length).toFixed(0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Levels</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{3}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isExpanderEnabled}
              onChange={(e) => setIsExpanderEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Expander</span>
          </div>
          <button
            type="button"
            onClick={expandNote}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Maximize className="h-3 w-3" />
            Expand Note
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Note Input</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-slate-900 dark:text-white">Short Note</span>
              </div>
              <input
                type="text"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Enter short note..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-64"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Expansion Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Expand</span>
              </div>
              <input
                type="checkbox"
                checked={expansionSettings.autoExpand}
                onChange={(e) => setExpansionSettings({ ...expansionSettings, autoExpand: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Maximize className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Level</span>
              </div>
              <select
                value={expansionSettings.defaultLevel}
                onChange={(e) => setExpansionSettings({ ...expansionSettings, defaultLevel: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="brief">Brief</option>
                <option value="detailed">Detailed</option>
                <option value="comprehensive">Comprehensive</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Info className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Context</span>
              </div>
              <input
                type="checkbox"
                checked={expansionSettings.includeContext}
                onChange={(e) => setExpansionSettings({ ...expansionSettings, includeContext: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Maintain Tone</span>
              </div>
              <input
                type="checkbox"
                checked={expansionSettings.maintainTone}
                onChange={(e) => setExpansionSettings({ ...expansionSettings, maintainTone: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Expanded Notes</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {expandedNotes.map((note) => (
              <div key={note.id} className={`p-3 rounded-lg border ${note.isSaved ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Maximize className="h-4 w-4 text-cyan-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs ${getLevelColor(note.expansionLevel)}`}>
                          {note.expansionLevel}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{note.wordCount} words</span>
                        {note.isSaved && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Saved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{note.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 line-through">{note.originalNote}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">→</span>
                  </div>
                  <p className="text-xs text-slate-900 dark:text-white">{note.expandedText}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => saveNote(note.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Minimize className="h-3 w-3" />
                    Compress
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Note Expansion Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI expands short notes into full paragraphs</li>
              <li>• Expansion levels: brief, detailed, comprehensive</li>
              <li>• Context and tone preservation options</li>
              <li>• Word count tracking for expansion metrics</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
