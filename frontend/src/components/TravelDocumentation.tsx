'use client';

import { useState } from 'react';
import { Plane, X, RefreshCw, Info, Calendar, MapPin, FileText, Star, Plus, Camera, Clock, DollarSign, Edit } from 'lucide-react';

interface TravelDocumentationProps {
  onCancel?: () => void;
}

interface TravelEntry {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  location: string;
  purpose: 'leisure' | 'business' | 'adventure' | 'cultural' | 'educational' | 'other';
  highlights: string[];
  notes: string;
  photos: number;
  memoriesLinked: number;
  budget?: number;
  actualCost?: number;
  isArchived: boolean;
}

interface TravelSettings {
  autoLinkMemories: boolean;
  includeBudget: boolean;
  autoSyncPhotos: boolean;
  exportFormat: 'pdf' | 'html' | 'markdown';
}

export default function TravelDocumentation({ onCancel }: TravelDocumentationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDocumentationEnabled, setIsDocumentationEnabled] = useState(true);

  const [travelEntries, setTravelEntries] = useState<TravelEntry[]>([
    { id: '1', destination: 'Paris, France', startDate: '2024-01-10', endDate: '2024-01-17', location: 'Paris', purpose: 'leisure', highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'], notes: 'Amazing trip, beautiful architecture', photos: 150, memoriesLinked: 25, budget: 3000, actualCost: 2800, isArchived: false },
    { id: '2', destination: 'Tokyo, Japan', startDate: '2023-12-01', endDate: '2023-12-10', location: 'Tokyo', purpose: 'cultural', highlights: ['Senso-ji Temple', 'Shibuya Crossing', 'Cherry Blossoms'], notes: 'Cultural immersion experience', photos: 200, memoriesLinked: 30, budget: 4000, actualCost: 4200, isArchived: false },
    { id: '3', destination: 'New York, USA', startDate: '2023-10-15', endDate: '2023-10-20', location: 'New York', purpose: 'business', highlights: ['Times Square', 'Central Park', 'Broadway Show'], notes: 'Business trip with sightseeing', photos: 80, memoriesLinked: 15, budget: 2500, actualCost: 2400, isArchived: true },
  ]);

  const [travelSettings, setTravelSettings] = useState<TravelSettings>({
    autoLinkMemories: true,
    includeBudget: true,
    autoSyncPhotos: true,
    exportFormat: 'pdf',
  });

  const [currentEntry, setCurrentEntry] = useState({
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    location: '',
    purpose: 'leisure' as 'leisure' | 'business' | 'adventure' | 'cultural' | 'educational' | 'other',
    highlights: '',
    notes: '',
    budget: 0,
    actualCost: 0,
  });

  const addEntry = () => {
    const newEntry: TravelEntry = {
      id: Date.now().toString(),
      destination: currentEntry.destination,
      startDate: currentEntry.startDate,
      endDate: currentEntry.endDate,
      location: currentEntry.location,
      purpose: currentEntry.purpose,
      highlights: currentEntry.highlights.split(',').map(h => h.trim()).filter(h => h),
      notes: currentEntry.notes,
      photos: 0,
      memoriesLinked: 0,
      budget: currentEntry.budget || undefined,
      actualCost: currentEntry.actualCost || undefined,
      isArchived: false,
    };
    setTravelEntries([...travelEntries, newEntry].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    setCurrentEntry({
      destination: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      location: '',
      purpose: 'leisure',
      highlights: '',
      notes: '',
      budget: 0,
      actualCost: 0,
    });
  };

  const toggleArchive = (id: string) => {
    setTravelEntries(travelEntries.map(entry => 
      entry.id === id ? { ...entry, isArchived: !entry.isArchived } : entry
    ));
  };

  const getPurposeColor = (purpose: string) => {
    switch (purpose) {
      case 'leisure': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'business': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'adventure': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'cultural': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'educational': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'other': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl">
            <Plane className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Travel Documentation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Document trips with detailed information
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isDocumentationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isDocumentationEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Trips</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{travelEntries.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Photos</p>
            <p className="text-lg font-bold text-sky-600 dark:text-sky-400">{travelEntries.reduce((acc, e) => acc + e.photos, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Spent</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">${travelEntries.reduce((acc, e) => acc + (e.actualCost || 0), 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Memories</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{travelEntries.reduce((acc, e) => acc + e.memoriesLinked, 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isDocumentationEnabled}
              onChange={(e) => setIsDocumentationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Documentation</span>
          </div>
          <button
            type="button"
            onClick={addEntry}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Trip
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Travel Entry</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span className="text-xs text-slate-900 dark:text-white">Destination</span>
              </div>
              <input
                type="text"
                value={currentEntry.destination}
                onChange={(e) => setCurrentEntry({ ...currentEntry, destination: e.target.value })}
                placeholder="e.g., Paris, France..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Start Date</span>
              </div>
              <input
                type="date"
                value={currentEntry.startDate}
                onChange={(e) => setCurrentEntry({ ...currentEntry, startDate: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">End Date</span>
              </div>
              <input
                type="date"
                value={currentEntry.endDate}
                onChange={(e) => setCurrentEntry({ ...currentEntry, endDate: e.target.value })}
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
                placeholder="City/Region..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Plane className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Purpose</span>
              </div>
              <select
                value={currentEntry.purpose}
                onChange={(e) => setCurrentEntry({ ...currentEntry, purpose: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="leisure">Leisure</option>
                <option value="business">Business</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="educational">Educational</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Highlights (comma-separated)</span>
              </div>
              <input
                type="text"
                value={currentEntry.highlights}
                onChange={(e) => setCurrentEntry({ ...currentEntry, highlights: e.target.value })}
                placeholder="Eiffel Tower, Louvre Museum..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Budget</span>
              </div>
              <input
                type="number"
                value={currentEntry.budget}
                onChange={(e) => setCurrentEntry({ ...currentEntry, budget: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-24"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Actual Cost</span>
              </div>
              <input
                type="number"
                value={currentEntry.actualCost}
                onChange={(e) => setCurrentEntry({ ...currentEntry, actualCost: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-24"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Travel Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Camera className="h-4 w-4 text-sky-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Link Memories</span>
              </div>
              <input
                type="checkbox"
                checked={travelSettings.autoLinkMemories}
                onChange={(e) => setTravelSettings({ ...travelSettings, autoLinkMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Budget</span>
              </div>
              <input
                type="checkbox"
                checked={travelSettings.includeBudget}
                onChange={(e) => setTravelSettings({ ...travelSettings, includeBudget: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Camera className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Sync Photos</span>
              </div>
              <input
                type="checkbox"
                checked={travelSettings.autoSyncPhotos}
                onChange={(e) => setTravelSettings({ ...travelSettings, autoSyncPhotos: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Travel Entries</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {travelEntries.map((entry) => (
              <div key={entry.id} className={`p-3 rounded-lg border ${entry.isArchived ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Plane className="h-4 w-4 text-sky-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{entry.destination}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getPurposeColor(entry.purpose)}`}>
                          {entry.purpose}
                        </span>
                        {entry.isArchived && (
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{entry.startDate} - {entry.endDate} • {entry.location}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={entry.isArchived}
                    onChange={() => toggleArchive(entry.id)}
                    className="rounded"
                  />
                </div>
                {entry.highlights.length > 0 && (
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-1">
                      {entry.highlights.map((highlight) => (
                        <span key={highlight} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {entry.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">{entry.notes}</p>
                )}
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{entry.photos} photos</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{entry.memoriesLinked} memories</span>
                  {entry.budget && entry.actualCost && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Budget: ${entry.budget} / ${entry.actualCost}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Travel Documentation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Document trips with destination, dates, and purpose</li>
              <li>• Track highlights and budget vs actual cost</li>
              <li>• Auto-link memories and sync photos</li>
              <li>• Export as PDF, HTML, or Markdown</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
