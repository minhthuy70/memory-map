'use client';

import { useState } from 'react';
import { Landmark, X, RefreshCw, Info, Calendar, MapPin, FileText, Star, Plus, Camera, Tag, Globe, Edit } from 'lucide-react';

interface CulturalHeritageDocumentationProps {
  onCancel?: () => void;
}

interface HeritageSite {
  id: string;
  name: string;
  location: string;
  country: string;
  heritageType: 'natural' | 'cultural' | 'mixed' | 'intangible';
  significance: string;
  description: string;
  yearRecognized?: string;
  visitDate?: string;
  photos: number;
  memoriesLinked: number;
  tags: string[];
  isArchived: boolean;
}

interface HeritageSettings {
  autoTag: boolean;
  includePhotos: boolean;
  mapIntegration: boolean;
  exportFormat: 'pdf' | 'html' | 'json';
}

export default function CulturalHeritageDocumentation({ onCancel }: CulturalHeritageDocumentationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDocumentationEnabled, setIsDocumentationEnabled] = useState(true);

  const [heritageSites, setHeritageSites] = useState<HeritageSite[]>([
    { id: '1', name: 'Angkor Wat', location: 'Siem Reap', country: 'Cambodia', heritageType: 'cultural', significance: 'Largest religious monument', description: 'Ancient temple complex built in 12th century', yearRecognized: '1992', visitDate: '2024-01-15', photos: 100, memoriesLinked: 20, tags: ['temple', 'ancient', 'unesco'], isArchived: false },
    { id: '2', name: 'Great Barrier Reef', location: 'Queensland', country: 'Australia', heritageType: 'natural', significance: 'World\'s largest coral reef system', description: 'Marine ecosystem with diverse coral species', yearRecognized: '1981', visitDate: '2023-12-01', photos: 150, memoriesLinked: 25, tags: ['marine', 'coral', 'nature'], isArchived: false },
    { id: '3', name: 'Machu Picchu', location: 'Cusco Region', country: 'Peru', heritageType: 'cultural', significance: 'Incan citadel in the Andes', description: '15th-century Inca site', yearRecognized: '1983', visitDate: '2023-10-10', photos: 80, memoriesLinked: 15, tags: ['inca', 'mountain', 'ancient'], isArchived: true },
  ]);

  const [heritageSettings, setHeritageSettings] = useState<HeritageSettings>({
    autoTag: true,
    includePhotos: true,
    mapIntegration: true,
    exportFormat: 'pdf',
  });

  const [currentSite, setCurrentSite] = useState({
    name: '',
    location: '',
    country: '',
    heritageType: 'cultural' as 'natural' | 'cultural' | 'mixed' | 'intangible',
    significance: '',
    description: '',
    yearRecognized: '',
    visitDate: '',
    tags: '',
  });

  const addSite = () => {
    const newSite: HeritageSite = {
      id: Date.now().toString(),
      name: currentSite.name,
      location: currentSite.location,
      country: currentSite.country,
      heritageType: currentSite.heritageType,
      significance: currentSite.significance,
      description: currentSite.description,
      yearRecognized: currentSite.yearRecognized || undefined,
      visitDate: currentSite.visitDate || undefined,
      photos: 0,
      memoriesLinked: 0,
      tags: currentSite.tags.split(',').map(t => t.trim()).filter(t => t),
      isArchived: false,
    };
    setHeritageSites([...heritageSites, newSite]);
    setCurrentSite({
      name: '',
      location: '',
      country: '',
      heritageType: 'cultural',
      significance: '',
      description: '',
      yearRecognized: '',
      visitDate: '',
      tags: '',
    });
  };

  const toggleArchive = (id: string) => {
    setHeritageSites(heritageSites.map(site => 
      site.id === id ? { ...site, isArchived: !site.isArchived } : site
    ));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'natural': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'cultural': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'mixed': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'intangible': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl">
            <Landmark className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Cultural Heritage Documentation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Document cultural heritage sites and traditions
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sites</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{heritageSites.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Countries</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{new Set(heritageSites.map(s => s.country)).size}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Photos</p>
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{heritageSites.reduce((acc, s) => acc + s.photos, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Memories</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{heritageSites.reduce((acc, s) => acc + s.memoriesLinked, 0)}</p>
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
            onClick={addSite}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Site
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Heritage Site</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Landmark className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Site Name</span>
              </div>
              <input
                type="text"
                value={currentSite.name}
                onChange={(e) => setCurrentSite({ ...currentSite, name: e.target.value })}
                placeholder="e.g., Angkor Wat..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Location</span>
              </div>
              <input
                type="text"
                value={currentSite.location}
                onChange={(e) => setCurrentSite({ ...currentSite, location: e.target.value })}
                placeholder="City/Region..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Country</span>
              </div>
              <input
                type="text"
                value={currentSite.country}
                onChange={(e) => setCurrentSite({ ...currentSite, country: e.target.value })}
                placeholder="Country name..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Heritage Type</span>
              </div>
              <select
                value={currentSite.heritageType}
                onChange={(e) => setCurrentSite({ ...currentSite, heritageType: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="natural">Natural</option>
                <option value="cultural">Cultural</option>
                <option value="mixed">Mixed</option>
                <option value="intangible">Intangible</option>
              </select>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Significance</span>
              </div>
              <input
                type="text"
                value={currentSite.significance}
                onChange={(e) => setCurrentSite({ ...currentSite, significance: e.target.value })}
                placeholder="Why is this site significant?"
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Description</span>
              </div>
              <textarea
                value={currentSite.description}
                onChange={(e) => setCurrentSite({ ...currentSite, description: e.target.value })}
                placeholder="Detailed description..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Year Recognized</span>
              </div>
              <input
                type="text"
                value={currentSite.yearRecognized}
                onChange={(e) => setCurrentSite({ ...currentSite, yearRecognized: e.target.value })}
                placeholder="e.g., 1992"
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Visit Date</span>
              </div>
              <input
                type="date"
                value={currentSite.visitDate}
                onChange={(e) => setCurrentSite({ ...currentSite, visitDate: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Tag className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Tags (comma-separated)</span>
              </div>
              <input
                type="text"
                value={currentSite.tags}
                onChange={(e) => setCurrentSite({ ...currentSite, tags: e.target.value })}
                placeholder="temple, ancient, unesco..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Heritage Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Tag className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Tag</span>
              </div>
              <input
                type="checkbox"
                checked={heritageSettings.autoTag}
                onChange={(e) => setHeritageSettings({ ...heritageSettings, autoTag: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Camera className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Photos</span>
              </div>
              <input
                type="checkbox"
                checked={heritageSettings.includePhotos}
                onChange={(e) => setHeritageSettings({ ...heritageSettings, includePhotos: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Map Integration</span>
              </div>
              <input
                type="checkbox"
                checked={heritageSettings.mapIntegration}
                onChange={(e) => setHeritageSettings({ ...heritageSettings, mapIntegration: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Heritage Sites</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {heritageSites.map((site) => (
              <div key={site.id} className={`p-3 rounded-lg border ${site.isArchived ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 opacity-60' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Landmark className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{site.name}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(site.heritageType)}`}>
                          {site.heritageType}
                        </span>
                        {site.isArchived && (
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{site.location}, {site.country}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={site.isArchived}
                    onChange={() => toggleArchive(site.id)}
                    className="rounded"
                  />
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Significance: {site.significance}</p>
                </div>
                {site.description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">{site.description}</p>
                )}
                {site.tags.length > 0 && (
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-1">
                      {site.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{site.photos} photos</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{site.memoriesLinked} memories</span>
                  {site.yearRecognized && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Recognized: {site.yearRecognized}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Cultural Heritage Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Document cultural heritage sites and traditions</li>
              <li>• Heritage types: natural, cultural, mixed, intangible</li>
              <li>• Track significance and recognition year</li>
              <li>• Auto-tag and integrate with maps</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
