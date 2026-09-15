'use client';

import { useState } from 'react';
import { FileText, X, RefreshCw, Info, Download, Copy, Check, Star, Plus, BookOpen, ExternalLink, Calendar } from 'lucide-react';

interface AcademicCitationExportProps {
  onCancel?: () => void;
}

interface CitationFormat {
  name: string;
  style: 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'Vancouver';
  description: string;
  example: string;
}

interface CitationEntry {
  id: string;
  memoryId: string;
  memoryTitle: string;
  author: string;
  date: string;
  source: string;
  citationFormat: 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'Vancouver';
  generatedCitation: string;
  isSaved: boolean;
  exportCount: number;
}

interface CitationSettings {
  defaultFormat: 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'Vancouver';
  autoGenerate: boolean;
  includeURL: boolean;
  includeDOI: boolean;
}

export default function AcademicCitationExport({ onCancel }: AcademicCitationExportProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isExportEnabled, setIsExportEnabled] = useState(true);

  const [citationFormats] = useState<CitationFormat[]>([
    { name: 'APA', style: 'APA', description: 'American Psychological Association', example: 'Smith, J. (2024). Memory title. Source.' },
    { name: 'MLA', style: 'MLA', description: 'Modern Language Association', example: 'Smith, John. "Memory Title." Source, 2024.' },
    { name: 'Chicago', style: 'Chicago', description: 'Chicago Manual of Style', example: 'Smith, John. 2024. "Memory Title." Source.' },
    { name: 'Harvard', style: 'Harvard', description: 'Harvard Referencing Style', example: 'Smith, J. (2024) 'Memory Title', Source.' },
    { name: 'Vancouver', style: 'Vancouver', description: 'Vancouver Citation Style', example: 'Smith J. Memory title. Source. 2024.' },
  ]);

  const [citationEntries, setCitationEntries] = useState<CitationEntry[]>([
    { id: '1', memoryId: 'mem_1', memoryTitle: 'Beach sunset memory', author: 'Smith, J.', date: '2024-01-15', source: 'Memory Map Database', citationFormat: 'APA', generatedCitation: 'Smith, J. (2024). Beach sunset memory. Memory Map Database.', isSaved: true, exportCount: 3 },
    { id: '2', memoryId: 'mem_2', memoryTitle: 'Family dinner', author: 'Johnson, M.', date: '2024-01-10', source: 'Memory Map Database', citationFormat: 'MLA', generatedCitation: 'Johnson, Mary. "Family Dinner." Memory Map Database, 2024.', isSaved: true, exportCount: 2 },
  ]);

  const [citationSettings, setCitationSettings] = useState<CitationSettings>({
    defaultFormat: 'APA',
    autoGenerate: true,
    includeURL: true,
    includeDOI: false,
  });

  const [currentCitation, setCurrentCitation] = useState({
    memoryId: '',
    memoryTitle: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    source: 'Memory Map Database',
    citationFormat: 'APA' as 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'Vancouver',
  });

  const generateCitation = (format: 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'Vancouver', author: string, title: string, date: string, source: string): string => {
    const year = date.split('-')[0];
    switch (format) {
      case 'APA':
        return `${author}. (${year}). ${title}. ${source}.`;
      case 'MLA':
        const lastName = author.split(',')[0];
        const firstName = author.split(',')[1]?.trim() || '';
        return `${lastName}, ${firstName}. "${title}." ${source}, ${year}.`;
      case 'Chicago':
        return `${author}. ${year}. "${title}." ${source}.`;
      case 'Harvard':
        return `${author} (${year}) '${title}', ${source}.`;
      case 'Vancouver':
        const initials = author.split(', ').map(n => n[0]).join(' ');
        return `${initials}. ${title}. ${source}. ${year}.`;
      default:
        return `${author}. (${year}). ${title}. ${source}.`;
    }
  };

  const addCitation = () => {
    const generatedCitation = generateCitation(
      currentCitation.citationFormat,
      currentCitation.author,
      currentCitation.memoryTitle,
      currentCitation.date,
      currentCitation.source
    );
    const newEntry: CitationEntry = {
      id: Date.now().toString(),
      memoryId: currentCitation.memoryId || 'mem_' + Date.now(),
      memoryTitle: currentCitation.memoryTitle,
      author: currentCitation.author,
      date: currentCitation.date,
      source: currentCitation.source,
      citationFormat: currentCitation.citationFormat,
      generatedCitation,
      isSaved: false,
      exportCount: 0,
    };
    setCitationEntries([...citationEntries, newEntry]);
    setCurrentCitation({
      memoryId: '',
      memoryTitle: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      source: 'Memory Map Database',
      citationFormat: 'APA',
    });
  };

  const exportCitation = (id: string) => {
    setCitationEntries(citationEntries.map(entry => 
      entry.id === id ? { ...entry, exportCount: entry.exportCount + 1 } : entry
    ));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'APA': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'MLA': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'Chicago': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Harvard': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'Vancouver': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Academic Citation Export
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Export memories in academic citation formats
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isExportEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isExportEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Citations</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{citationEntries.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Formats</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{citationFormats.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Exports</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{citationEntries.reduce((acc, e) => acc + e.exportCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Saved</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{citationEntries.filter(e => e.isSaved).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isExportEnabled}
              onChange={(e) => setIsExportEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Export</span>
          </div>
          <button
            type="button"
            onClick={addCitation}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Generate Citation
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generate Citation</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory Title</span>
              </div>
              <input
                type="text"
                value={currentCitation.memoryTitle}
                onChange={(e) => setCurrentCitation({ ...currentCitation, memoryTitle: e.target.value })}
                placeholder="Enter memory title..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Author</span>
              </div>
              <input
                type="text"
                value={currentCitation.author}
                onChange={(e) => setCurrentCitation({ ...currentCitation, author: e.target.value })}
                placeholder="e.g., Smith, J."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Date</span>
              </div>
              <input
                type="date"
                value={currentCitation.date}
                onChange={(e) => setCurrentCitation({ ...currentCitation, date: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Source</span>
              </div>
              <input
                type="text"
                value={currentCitation.source}
                onChange={(e) => setCurrentCitation({ ...currentCitation, source: e.target.value })}
                placeholder="Source name..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Citation Format</span>
              </div>
              <select
                value={currentCitation.citationFormat}
                onChange={(e) => setCurrentCitation({ ...currentCitation, citationFormat: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="APA">APA</option>
                <option value="MLA">MLA</option>
                <option value="Chicago">Chicago</option>
                <option value="Harvard">Harvard</option>
                <option value="Vancouver">Vancouver</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Citation Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Format</span>
              </div>
              <select
                value={citationSettings.defaultFormat}
                onChange={(e) => setCitationSettings({ ...citationSettings, defaultFormat: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="APA">APA</option>
                <option value="MLA">MLA</option>
                <option value="Chicago">Chicago</option>
                <option value="Harvard">Harvard</option>
                <option value="Vancouver">Vancouver</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={citationSettings.autoGenerate}
                onChange={(e) => setCitationSettings({ ...citationSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include URL</span>
              </div>
              <input
                type="checkbox"
                checked={citationSettings.includeURL}
                onChange={(e) => setCitationSettings({ ...citationSettings, includeURL: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Citation Formats</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {citationFormats.map((format) => (
              <div key={format.style} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${getFormatColor(format.style)}`}>
                    {format.style}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{format.description}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">{format.example}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generated Citations</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {citationEntries.map((entry) => (
              <div key={entry.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{entry.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getFormatColor(entry.citationFormat)}`}>
                          {entry.citationFormat}
                        </span>
                        {entry.isSaved && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Saved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{entry.author} • {entry.date}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2 p-2 bg-slate-50 dark:bg-slate-700 rounded">
                  <p className="text-xs text-slate-700 dark:text-slate-300">{entry.generatedCitation}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(entry.generatedCitation)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => exportCitation(entry.id)}
                    className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Export
                  </button>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    {entry.exportCount} exports
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Academic Citation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Generate citations in APA, MLA, Chicago, Harvard, Vancouver formats</li>
              <li>• Copy citations to clipboard for easy use</li>
              <li>• Export citations for academic papers</li>
              <li>• Auto-generate from memory data</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
