'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Info,
  Plus,
  Radio,
  RefreshCw,
  Trash2,
  Volume2
} from 'lucide-react';

interface ARIALiveRegionsProps {
  onCancel?: () => void;
}

interface LiveRegion {
  id: string;
  name: string;
  type: 'polite' | 'assertive' | 'off';
  priority: 'high' | 'medium' | 'low';
  content: string;
  lastUpdated: string;
  isAtomic: boolean;
  isRelevant: boolean;
}

export default function ARIALiveRegions({ onCancel }: ARIALiveRegionsProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('all');

  const [liveRegions, setLiveRegions] = useState<LiveRegion[]>([
    { id: '1', name: 'Notification Region', type: 'polite', priority: 'high', content: 'New memory created successfully', lastUpdated: '2026-09-14 14:30:00', isAtomic: false, isRelevant: true },
    { id: '2', name: 'Error Region', type: 'assertive', priority: 'high', content: 'Error: Invalid input', lastUpdated: '2026-09-14 14:25:00', isAtomic: true, isRelevant: true },
    { id: '3', name: 'Status Region', type: 'polite', priority: 'medium', content: 'Upload in progress: 50%', lastUpdated: '2026-09-14 14:20:00', isAtomic: false, isRelevant: true },
    { id: '4', name: 'Success Region', type: 'polite', priority: 'medium', content: 'Changes saved successfully', lastUpdated: '2026-09-14 14:15:00', isAtomic: false, isRelevant: true },
    { id: '5', name: 'Warning Region', type: 'assertive', priority: 'high', content: 'Warning: Unsaved changes', lastUpdated: '2026-09-14 14:10:00', isAtomic: true, isRelevant: true },
  ]);

  const filteredRegions = selectedType === 'all' 
    ? liveRegions 
    : liveRegions.filter(region => region.type === selectedType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'polite': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'assertive': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'off': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const announceMessage = (regionId: string, message: string) => {
    setLiveRegions(liveRegions.map(region => 
      region.id === regionId 
        ? { ...region, content: message, lastUpdated: new Date().toLocaleString() }
        : region
    ));
  };

  const testAnnouncement = (regionId: string) => {
    announceMessage(regionId, 'Test announcement: This is a sample message for screen readers.');
  };

  const addRegion = () => {
    const newRegion: LiveRegion = {
      id: Date.now().toString(),
      name: `New Region ${liveRegions.length + 1}`,
      type: 'polite',
      priority: 'medium',
      content: 'Waiting for content...',
      lastUpdated: new Date().toLocaleString(),
      isAtomic: false,
      isRelevant: true,
    };
    setLiveRegions([...liveRegions, newRegion]);
  };

  const deleteRegion = (regionId: string) => {
    setLiveRegions(liveRegions.filter(region => region.id !== regionId));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl">
            <Radio className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              ARIA Live Regions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage live regions for dynamic content
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Regions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{liveRegions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Polite</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{liveRegions.filter(r => r.type === 'polite').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Assertive</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{liveRegions.filter(r => r.type === 'assertive').length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">High Priority</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{liveRegions.filter(r => r.priority === 'high').length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Types</option>
            <option value="polite">Polite</option>
            <option value="assertive">Assertive</option>
            <option value="off">Off</option>
          </select>
          <button
            type="button"
            onClick={addRegion}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Region
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Live Regions ({filteredRegions.length})</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredRegions.map((region) => (
              <div key={region.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    {region.type === 'assertive' ? <Bell className="h-5 w-5 text-red-500" /> : <Volume2 className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{region.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(region.type)}`}>
                        {region.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(region.priority)}`}>
                        {region.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{region.content}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Updated: {region.lastUpdated}</span>
                      {region.isAtomic && <span>Atomic</span>}
                      {region.isRelevant && <span>Relevant</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => testAnnouncement(region.id)}
                    className="px-2 py-1 rounded text-xs bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Test
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRegion(region.id)}
                    className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Live Region Configuration</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Polite</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Announces when user is idle</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Assertive</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Interrupts immediately</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Atomic</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Announces entire content at once</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Relevant</span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Only announces relevant updates</span>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">ARIA Live Region Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use polite for informational updates</li>
              <li>• Use assertive for critical alerts</li>
              <li>• Atomic ensures complete announcements</li>
              <li>• Test with screen readers for proper behavior</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
