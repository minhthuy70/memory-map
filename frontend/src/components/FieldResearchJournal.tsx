'use client';

import { useState } from 'react';
import { BookOpen, X, RefreshCw, Info, Calendar, MapPin, FileText, Star, Plus, Tag, Activity, Edit } from 'lucide-react';

interface FieldResearchJournalProps {
  onCancel?: () => void;
}

interface ResearchEntry {
  id: string;
  date: string;
  location: string;
  researchTopic: string;
  methodology: string;
  findings: string;
  notes: string;
  tags: string[];
  dataPoints: number;
  samplesCollected: number;
  isArchived: boolean;
}

interface ResearchSettings {
  autoTag: boolean;
  includeLocation: boolean;
  dataSync: boolean;
  exportFormat: 'json' | 'csv' | 'pdf';
}

export default function FieldResearchJournal({ onCancel }: FieldResearchJournalProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isJournalEnabled, setIsJournalEnabled] = useState(true);

  const [researchEntries, setResearchEntries] = useState<ResearchEntry[]>([
    { id: '1', date: '2024-01-17', location: 'Amazon Rainforest', researchTopic: 'Biodiversity Study', methodology: 'Field observation & sample collection', findings: 'Discovered 3 new species of insects', notes: 'Weather conditions were optimal for sampling', tags: ['biodiversity', 'insects', 'fieldwork'], dataPoints: 25, samplesCollected: 12, isArchived: false },
    { id: '2', date: '2024-01-15', location: 'Local River', researchTopic: 'Water Quality Analysis', methodology: 'Water sampling & lab testing', findings: 'pH levels within normal range', notes: 'Increased turbidity near industrial area', tags: ['water', 'environment', 'testing'], dataPoints: 18, samplesCollected: 8, isArchived: false },
    { id: '3', date: '2024-01-10', location: 'Mountain Trail', researchTopic: 'Vegetation Survey', methodology: 'Quadrat sampling', findings: 'Vegetation density higher at lower elevations', notes: 'Need to sample in spring for comparison', tags: ['vegetation', 'ecology', 'survey'], dataPoints: 30, samplesCollected: 15, isArchived: true },
  ]);

  const [researchSettings, setResearchSettings] = useState<ResearchSettings>({
    autoTag: true,
    includeLocation: true,
    dataSync: false,
    exportFormat: 'json',
  });

  const [currentEntry, setCurrentEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    location: '',
    researchTopic: '',
    methodology: '',
    findings: '',
    notes: '',
    tags: '',
    dataPoints: 0,
    samplesCollected: 0,
  });

  const addEntry = () => {
    const newEntry: ResearchEntry = {
      id: Date.now().toString(),
      date: currentEntry.date,
      location: currentEntry.location,
      researchTopic: currentEntry.researchTopic,
      methodology: currentEntry.methodology,
      findings: currentEntry.findings,
      notes: currentEntry.notes,
      tags: currentEntry.tags.split(',').map(t => t.trim()).filter(t => t),
      dataPoints: currentEntry.dataPoints,
      samplesCollected: currentEntry.samplesCollected,
      isArchived: false,
    };
    setResearchEntries([...researchEntries, newEntry].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setCurrentEntry({
      date: new Date().toISOString().split('T')[0],
      location: '',
      researchTopic: '',
      methodology: '',
      findings: '',
      notes: '',
      tags: '',
      dataPoints: 0,
      samplesCollected: 0,
    });
  };

  const toggleArchive = (id: string) => {
    setResearchEntries(researchEntries.map(entry => 
      entry.id === id ? { ...entry, isArchived: !entry.isArchived } : entry
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Field Research Journal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Document field research and observations
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{researchEntries.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Data Points</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{researchEntries.reduce((acc, e) => acc + e.dataPoints, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Samples</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{researchEntries.reduce((acc, e) => acc + e.samplesCollected, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Locations</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{new Set(researchEntries.map(e => e.location)).size}</p>
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
            onClick={addEntry}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Entry
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Research Entry</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-900 dark:text-white">Date</span>
              </div>
              <input
                type="date"
                value={currentEntry.date}
                onChange={(e) => setCurrentEntry({ ...currentEntry, date: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Location</span>
              </div>
              <input
                type="text"
                value={currentEntry.location}
                onChange={(e) => setCurrentEntry({ ...currentEntry, location: e.target.value })}
                placeholder="Research location..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Research Topic</span>
              </div>
              <input
                type="text"
                value={currentEntry.researchTopic}
                onChange={(e) => setCurrentEntry({ ...currentEntry, researchTopic: e.target.value })}
                placeholder="e.g., Biodiversity Study..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Methodology</span>
              </div>
              <textarea
                value={currentEntry.methodology}
                onChange={(e) => setCurrentEntry({ ...currentEntry, methodology: e.target.value })}
                placeholder="Research methodology..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Findings</span>
              </div>
              <textarea
                value={currentEntry.findings}
                onChange={(e) => setCurrentEntry({ ...currentEntry, findings: e.target.value })}
                placeholder="Key findings..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Data Points</span>
              </div>
              <input
                type="number"
                value={currentEntry.dataPoints}
                onChange={(e) => setCurrentEntry({ ...currentEntry, dataPoints: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Samples Collected</span>
              </div>
              <input
                type="number"
                value={currentEntry.samplesCollected}
                onChange={(e) => setCurrentEntry({ ...currentEntry, samplesCollected: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Tag className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Tags (comma-separated)</span>
              </div>
              <input
                type="text"
                value={currentEntry.tags}
                onChange={(e) => setCurrentEntry({ ...currentEntry, tags: e.target.value })}
                placeholder="biodiversity, fieldwork, ecology..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Research Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-emerald-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Tag</span>
              </div>
              <input
                type="checkbox"
                checked={researchSettings.autoTag}
                onChange={(e) => setResearchSettings({ ...researchSettings, autoTag: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Location</span>
              </div>
              <input
                type="checkbox"
                checked={researchSettings.includeLocation}
                onChange={(e) => setResearchSettings({ ...researchSettings, includeLocation: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Data Sync</span>
              </div>
              <input
                type="checkbox"
                checked={researchSettings.dataSync}
                onChange={(e) => setResearchSettings({ ...researchSettings, dataSync: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Research Entries</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {researchEntries.map((entry) => (
              <div key={entry.id} className={`p-3 rounded-lg border ${entry.isArchived ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{entry.researchTopic}</span>
                        {entry.isArchived && (
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{entry.date} • {entry.location}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={entry.isArchived}
                    onChange={() => toggleArchive(entry.id)}
                    className="rounded"
                  />
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Methodology: {entry.methodology}</p>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Findings: {entry.findings}</p>
                </div>
                {entry.tags.length > 0 && (
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{entry.dataPoints} data points</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{entry.samplesCollected} samples</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Field Research Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Document field research with methodology and findings</li>
              <li>• Track data points and samples collected</li>
              <li>• Tag entries for easy organization</li>
              <li>• Archive completed research projects</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
