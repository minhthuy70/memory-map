'use client';

import { useState } from 'react';
import {
  as,
  Calendar,
  Castle,
  Eye,
  Image,
  ImageIcon,
  Info,
  Layers,
  MapPin,
  Plus,
  RefreshCw,
  Star,
  Target
} from 'lucide-react';

interface MemoryPalaceTechniqueProps {
  onCancel?: () => void;
}

interface MemoryPalace {
  id: string;
  name: string;
  description: string;
  locationCount: number;
  memoryCount: number;
  createdAt: string;
  isFavorite: boolean;
}

interface PalaceLocation {
  id: string;
  palaceId: string;
  name: string;
  description: string;
  memoryId?: string;
  memoryTitle?: string;
  position: { x: number; y: number };
  visualPrompt?: string;
  associationNote?: string;
}

interface PalaceSettings {
  autoAssociate: boolean;
  visualPrompts: boolean;
  reminderEnabled: boolean;
  reviewFrequency: 'daily' | 'weekly' | 'monthly';
}

export default function MemoryPalaceTechnique({ onCancel }: MemoryPalaceTechniqueProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPalaceEnabled, setIsPalaceEnabled] = useState(true);

  const [memoryPalaces, setMemoryPalaces] = useState<MemoryPalace[]>([
    { id: '1', name: 'Childhood Home', description: 'My childhood house where I grew up', locationCount: 10, memoryCount: 25, createdAt: '2024-01-01', isFavorite: true },
    { id: '2', name: 'University Campus', description: 'University buildings and grounds', locationCount: 15, memoryCount: 30, createdAt: '2024-01-05', isFavorite: false },
    { id: '3', name: 'Dream Beach', description: 'Perfect beach from my favorite memory', locationCount: 8, memoryCount: 20, createdAt: '2024-01-10', isFavorite: true },
  ]);

  const [palaceLocations, setPalaceLocations] = useState<PalaceLocation[]>([
    { id: '1', palaceId: '1', name: 'Front Door', description: 'Main entrance of the house', memoryId: 'mem_1', memoryTitle: 'Beach sunset', position: { x: 10, y: 10 }, visualPrompt: 'Ocean view', associationNote: 'Sunset colors like front door' },
    { id: '2', palaceId: '1', name: 'Living Room', description: 'Where family gathers', memoryId: 'mem_2', memoryTitle: 'Family dinner', position: { x: 30, y: 20 }, visualPrompt: 'Comfortable couch', associationNote: 'Family dinners around TV' },
    { id: '3', palaceId: '1', name: 'Kitchen', description: 'Cooking and eating area', memoryId: 'mem_3', memoryTitle: 'Mountain hike', position: { x: 50, y: 30 }, visualPrompt: 'Cooking smells', associationNote: 'Hiking snacks from kitchen' },
  ]);

  const [palaceSettings, setPalaceSettings] = useState<PalaceSettings>({
    autoAssociate: true,
    visualPrompts: true,
    reminderEnabled: true,
    reviewFrequency: 'weekly',
  });

  const [currentPalace, setCurrentPalace] = useState({
    name: '',
    description: '',
  });

  const [currentLocation, setCurrentLocation] = useState({
    palaceId: '',
    name: '',
    description: '',
    memoryId: '',
    memoryTitle: '',
    position: { x: 50, y: 50 },
    visualPrompt: '',
    associationNote: '',
  });

  const addPalace = () => {
    const newPalace: MemoryPalace = {
      id: Date.now().toString(),
      name: currentPalace.name,
      description: currentPalace.description,
      locationCount: 0,
      memoryCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isFavorite: false,
    };
    setMemoryPalaces([...memoryPalaces, newPalace]);
    setCurrentPalace({
      name: '',
      description: '',
    });
  };

  const addLocation = () => {
    const newLocation: PalaceLocation = {
      id: Date.now().toString(),
      palaceId: currentLocation.palaceId || memoryPalaces[0]?.id || '',
      name: currentLocation.name,
      description: currentLocation.description,
      memoryId: currentLocation.memoryId || undefined,
      memoryTitle: currentLocation.memoryTitle || undefined,
      position: currentLocation.position,
      visualPrompt: currentLocation.visualPrompt || undefined,
      associationNote: currentLocation.associationNote || undefined,
    };
    setPalaceLocations([...palaceLocations, newLocation]);
    setCurrentLocation({
      palaceId: '',
      name: '',
      description: '',
      memoryId: '',
      memoryTitle: '',
      position: { x: 50, y: 50 },
      visualPrompt: '',
      associationNote: '',
    });
  };

  const toggleFavorite = (id: string) => {
    setMemoryPalaces(memoryPalaces.map(palace => 
      palace.id === id ? { ...palace, isFavorite: !palace.isFavorite } : palace
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl">
            <Castle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Memory Palace Technique
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ancient mnemonic technique integrated with memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isPalaceEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isPalaceEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Palaces</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{memoryPalaces.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Locations</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{palaceLocations.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Associated</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{palaceLocations.filter(l => l.memoryId).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Favorites</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{memoryPalaces.filter(p => p.isFavorite).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isPalaceEnabled}
              onChange={(e) => setIsPalaceEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Palace</span>
          </div>
          <button
            type="button"
            onClick={addPalace}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Palace
          </button>
          <button
            type="button"
            onClick={addLocation}
            className="px-3 py-1.5 rounded-lg text-xs bg-violet-600 hover:bg-violet-700 text-white border-0 flex items-center gap-1"
          >
            <MapPin className="h-3 w-3" />
            Add Location
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create Memory Palace</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Castle className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Palace Name</span>
              </div>
              <input
                type="text"
                value={currentPalace.name}
                onChange={(e) => setCurrentPalace({ ...currentPalace, name: e.target.value })}
                placeholder="e.g., Childhood Home..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Description</span>
              </div>
              <textarea
                value={currentPalace.description}
                onChange={(e) => setCurrentPalace({ ...currentPalace, description: e.target.value })}
                placeholder="Describe your memory palace..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Palace Location</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-violet-400" />
                <span className="text-xs text-slate-900 dark:text-white">Palace</span>
              </div>
              <select
                value={currentLocation.palaceId}
                onChange={(e) => setCurrentLocation({ ...currentLocation, palaceId: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                {memoryPalaces.map(palace => (
                  <option key={palace.id} value={palace.id}>{palace.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Location Name</span>
              </div>
              <input
                type="text"
                value={currentLocation.name}
                onChange={(e) => setCurrentLocation({ ...currentLocation, name: e.target.value })}
                placeholder="e.g., Front Door..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Description</span>
              </div>
              <textarea
                value={currentLocation.description}
                onChange={(e) => setCurrentLocation({ ...currentLocation, description: e.target.value })}
                placeholder="Describe this location..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory to Associate</span>
              </div>
              <input
                type="text"
                value={currentLocation.memoryTitle}
                onChange={(e) => setCurrentLocation({ ...currentLocation, memoryTitle: e.target.value })}
                placeholder="Memory title..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Visual Prompt</span>
              </div>
              <input
                type="text"
                value={currentLocation.visualPrompt}
                onChange={(e) => setCurrentLocation({ ...currentLocation, visualPrompt: e.target.value })}
                placeholder="Visual cue for this location..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Association Note</span>
              </div>
              <textarea
                value={currentLocation.associationNote}
                onChange={(e) => setCurrentLocation({ ...currentLocation, associationNote: e.target.value })}
                placeholder="How does this memory connect to this location?"
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Palace Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-indigo-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Associate</span>
              </div>
              <input
                type="checkbox"
                checked={palaceSettings.autoAssociate}
                onChange={(e) => setPalaceSettings({ ...palaceSettings, autoAssociate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Visual Prompts</span>
              </div>
              <input
                type="checkbox"
                checked={palaceSettings.visualPrompts}
                onChange={(e) => setPalaceSettings({ ...palaceSettings, visualPrompts: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Review Frequency</span>
              </div>
              <select
                value={palaceSettings.reviewFrequency}
                onChange={(e) => setPalaceSettings({ ...palaceSettings, reviewFrequency: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memory Palaces</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {memoryPalaces.map((palace) => (
              <div key={palace.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Castle className="h-4 w-4 text-indigo-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{palace.name}</span>
                        {palace.isFavorite && (
                          <span className="px-2 py-0.5 rounded text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                            Favorite
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{palace.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(palace.id)}
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {palace.isFavorite ? 'Unfavorite' : 'Favorite'}
                  </button>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{palace.locationCount} locations</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{palace.memoryCount} memories</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Palace Locations</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {palaceLocations.map((location) => (
              <div key={location.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-violet-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{location.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{location.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Pos: ({location.position.x}, {location.position.y})</span>
                </div>
                {location.memoryTitle && (
                  <div className="mb-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">Memory: {location.memoryTitle}</p>
                  </div>
                )}
                {location.visualPrompt && (
                  <div className="mb-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">Visual: {location.visualPrompt}</p>
                  </div>
                )}
                {location.associationNote && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">{location.associationNote}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memory Palace Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Create memory palaces from familiar places</li>
              <li>• Add locations and associate memories with them</li>
              <li>• Use visual prompts and association notes</li>
              <li>• Review palaces to strengthen memory recall</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
