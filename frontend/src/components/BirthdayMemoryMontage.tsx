'use client';

import { useState } from 'react';
import {
  Cake,
  CheckCircle,
  Clock,
  Download,
  Gift,
  Info,
  Play,
  RefreshCw,
  Star,
  Zap
} from 'lucide-react';

interface BirthdayMemoryMontageProps {
  onCancel?: () => void;
}

interface BirthdayMontage {
  id: string;
  title: string;
  personName: string;
  birthdayDate: string;
  duration: number;
  memoryCount: number;
  theme: 'colorful' | 'elegant' | 'fun' | 'party';
  music: string;
  includeCake: boolean;
  includeBalloons: boolean;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}

interface MontageSettings {
  autoGenerate: boolean;
  defaultTheme: 'colorful' | 'elegant' | 'fun' | 'party';
  defaultDuration: number;
  includeCake: boolean;
  includeBalloons: boolean;
}

export default function BirthdayMemoryMontage({ onCancel }: BirthdayMemoryMontageProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isMontageEnabled, setIsMontageEnabled] = useState(true);

  const [birthdayMontages, setBirthdayMontages] = useState<BirthdayMontage[]>([
    { id: '1', title: 'Sarah\'s PartyPopper 2024', personName: 'Sarah', birthdayDate: '2024-03-15', duration: 180, memoryCount: 25, theme: 'colorful', music: 'celebration', includeCake: true, includeBalloons: true, createdAt: '2024-03-15', status: 'completed' },
    { id: '2', title: 'John\'s PartyPopper 2024', personName: 'John', birthdayDate: '2024-05-20', duration: 150, memoryCount: 18, theme: 'elegant', music: 'classical', includeCake: true, includeBalloons: false, createdAt: '2024-05-20', status: 'completed' },
  ]);

  const [montageSettings, setMontageSettings] = useState<MontageSettings>({
    autoGenerate: false,
    defaultTheme: 'colorful',
    defaultDuration: 180,
    includeCake: true,
    includeBalloons: true,
  });

  const [personName, setPersonName] = useState('');
  const [birthdayDate, setBirthdayDate] = useState(new Date().toISOString().split('T')[0]);

  const createMontage = () => {
    const themes: Array<'colorful' | 'elegant' | 'fun' | 'party'> = ['colorful', 'elegant', 'fun', 'party'];
    const newMontage: BirthdayMontage = {
      id: Date.now().toString(),
      title: `${personName || 'Person'}'s PartyPopper`,
      personName: personName || 'Person',
      birthdayDate: birthdayDate,
      duration: montageSettings.defaultDuration,
      memoryCount: Math.floor(Math.random() * 20) + 15,
      theme: montageSettings.defaultTheme,
      music: 'celebration',
      includeCake: montageSettings.includeCake,
      includeBalloons: montageSettings.includeBalloons,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'completed',
    };
    setBirthdayMontages([...birthdayMontages, newMontage]);
    setPersonName('');
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'colorful': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'elegant': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'fun': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'party': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Cake className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              PartyPopper Memory Montage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Auto birthday montage for special occasions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isMontageEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isMontageEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Montages</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{birthdayMontages.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Duration</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{(birthdayMontages.reduce((acc, m) => acc + m.duration, 0) / birthdayMontages.length).toFixed(0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Memories</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{birthdayMontages.reduce((acc, m) => acc + m.memoryCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Themes</p>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{4}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isMontageEnabled}
              onChange={(e) => setIsMontageEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Montage</span>
          </div>
          <button
            type="button"
            onClick={createMontage}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Cake className="h-3 w-3" />
            Create Montage
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">PartyPopper Person</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Gift className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Person Name</span>
              </div>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Enter name..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">PartyPopper Date</span>
              </div>
              <input
                type="date"
                value={birthdayDate}
                onChange={(e) => setBirthdayDate(e.target.value)}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Montage Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={montageSettings.autoGenerate}
                onChange={(e) => setMontageSettings({ ...montageSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Cake className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Theme</span>
              </div>
              <select
                value={montageSettings.defaultTheme}
                onChange={(e) => setMontageSettings({ ...montageSettings, defaultTheme: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="colorful">Colorful</option>
                <option value="elegant">Elegant</option>
                <option value="fun">Fun</option>
                <option value="party">Party</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Duration</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="60"
                  max="300"
                  value={montageSettings.defaultDuration}
                  onChange={(e) => setMontageSettings({ ...montageSettings, defaultDuration: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{montageSettings.defaultDuration}s</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Cake className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Cake</span>
              </div>
              <input
                type="checkbox"
                checked={montageSettings.includeCake}
                onChange={(e) => setMontageSettings({ ...montageSettings, includeCake: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Gift className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Balloons</span>
              </div>
              <input
                type="checkbox"
                checked={montageSettings.includeBalloons}
                onChange={(e) => setMontageSettings({ ...montageSettings, includeBalloons: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">PartyPopper Montages</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {birthdayMontages.map((montage) => (
              <div key={montage.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Cake className="h-4 w-4 text-pink-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{montage.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getThemeColor(montage.theme)}`}>
                          {montage.theme}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(montage.status)}`}>
                          {montage.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{montage.personName} • {montage.birthdayDate} • {montage.memoryCount} memories • {montage.duration}s</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    {montage.includeCake && <span>🎂 Cake</span>}
                    {montage.includeBalloons && <span>🎈 Balloons</span>}
                    <span>• Music: {montage.music}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Play
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Gift className="h-3 w-3" />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">PartyPopper Montage Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Auto birthday montage for special occasions</li>
              <li>• Themes: colorful, elegant, fun, party</li>
              <li>• Include cake and balloons options</li>
              <li>• Person name and birthday date selection</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
