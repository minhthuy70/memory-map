'use client';

import { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  CloudSun,
  Heart,
  Info,
  Pause,
  Play,
  RefreshCw,
  Smile,
  Star,
  Volume2,
  Zap
} from 'lucide-react';

interface AIMemoryNarrationProps {
  onCancel?: () => void;
}

interface Memory {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  hasNarration: boolean;
}

interface Narration {
  id: string;
  memoryId: string;
  title: string;
  content: string;
  emotion: 'happy' | 'nostalgic' | 'excited' | 'peaceful' | 'adventurous';
  voice: string;
  duration: number;
  createdAt: string;
  isPlaying: boolean;
}

interface VoiceSettings {
  voice: string;
  speed: number;
  pitch: number;
  volume: number;
}

export default function AIMemoryNarration({ onCancel }: AIMemoryNarrationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isNarrationEnabled, setIsNarrationEnabled] = useState(true);

  const [memories, setMemories] = useState<Memory[]>([
    { id: '1', title: 'First Trip to Paris', date: '2024-01-15', location: 'Paris, France', description: 'Eiffel Tower sunset with family', hasNarration: true },
    { id: '2', title: 'Beach Day', date: '2024-02-20', location: 'California, USA', description: 'Sunny day at the beach with friends', hasNarration: true },
    { id: '3', title: 'Mountain Hiking', date: '2024-03-10', location: 'Swiss Alps', description: 'Reached the summit after long hike', hasNarration: false },
    { id: '4', title: 'City Nightlife', date: '2024-04-05', location: 'Tokyo, Japan', description: 'Tokyo at night with neon lights', hasNarration: false },
  ]);

  const [narrations, setNarrations] = useState<Narration[]>([
    { 
      id: '1', 
      memoryId: '1', 
      title: 'Paris Sunset ScrollText', 
      content: 'That unforgettable evening in Paris, when the golden sun dipped below the Eiffel Tower, painting the sky in shades of amber and rose. Standing there with my family, I felt an overwhelming sense of joy and gratitude. The laughter, the warmth, the magical moment frozen in time - this is what memories are made of.',
      emotion: 'nostalgic',
      voice: 'Natural',
      duration: 45,
      createdAt: '2024-01-16',
      isPlaying: false
    },
    { 
      id: '2', 
      memoryId: '2', 
      title: 'Beach Day Tale', 
      content: 'The sun was shining bright, the ocean waves crashing gently against the shore. Laughter filled the air as we played volleyball and built sandcastles. The salty breeze, the sound of seagulls, the feeling of pure happiness - this beach day with friends will always be one of my most cherished memories.',
      emotion: 'happy',
      voice: 'Natural',
      duration: 38,
      createdAt: '2024-02-21',
      isPlaying: false
    },
  ]);

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    voice: 'Natural',
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8,
  });

  const generateNarration = (memoryId: string) => {
    const memory = memories.find(m => m.id === memoryId);
    if (!memory) return;

    const emotions: Array<'happy' | 'nostalgic' | 'excited' | 'peaceful' | 'adventurous'> = ['happy', 'nostalgic', 'excited', 'peaceful', 'adventurous'];
    const newNarration: Narration = {
      id: Date.now().toString(),
      memoryId,
      title: `${memory.title} ScrollText`,
      content: `An AI-generated emotional narrative about ${memory.description} from ${memory.date} at ${memory.location}. The story captures the feelings and emotions of that special moment.`,
      emotion: emotions[Math.floor(Math.random() * emotions.length)],
      voice: voiceSettings.voice,
      duration: Math.floor(Math.random() * 30) + 30,
      createdAt: new Date().toISOString().split('T')[0],
      isPlaying: false,
    };
    setNarrations([...narrations, newNarration]);
    setMemories(memories.map(m => m.id === memoryId ? { ...m, hasNarration: true } : m));
  };

  const togglePlay = (id: string) => {
    setNarrations(narrations.map(narration => 
      narration.id === id ? { ...narration, isPlaying: !narration.isPlaying } : narration
    ));
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'nostalgic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'excited': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'peaceful': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'adventurous': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'happy': return <Smile className="h-4 w-4" />;
      case 'nostalgic': return <Heart className="h-4 w-4" />;
      case 'excited': return <Star className="h-4 w-4" />;
      case 'peaceful': return <CloudSun className="h-4 w-4" />;
      case 'adventurous': return <Play className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Memory Narration
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI reads memories as emotional stories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isNarrationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isNarrationEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Memories</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{memories.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Narrated</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{memories.filter(m => m.hasNarration).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Duration</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{narrations.reduce((acc, n) => acc + n.duration, 0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Stories</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{narrations.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isNarrationEnabled}
              onChange={(e) => setIsNarrationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Narration</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Voice Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Voice</span>
              </div>
              <select
                value={voiceSettings.voice}
                onChange={(e) => setVoiceSettings({ ...voiceSettings, voice: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="Natural">Natural</option>
                <option value="Warm">Warm</option>
                <option value="Professional">Professional</option>
                <option value="Playful">Playful</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Play className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Speed</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, speed: parseFloat(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{voiceSettings.speed}x</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Pause className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Pitch</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceSettings.pitch}
                  onChange={(e) => setVoiceSettings({ ...voiceSettings, pitch: parseFloat(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{voiceSettings.pitch}x</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Memories</h4>
          <div className="space-y-2">
            {memories.map((memory) => (
              <div key={memory.id} className={`p-3 rounded-lg border ${memory.hasNarration ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-pink-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{memory.title}</span>
                        {memory.hasNarration && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Narrated
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{memory.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {memory.date} • {memory.location}
                      </p>
                    </div>
                  </div>
                  {!memory.hasNarration && (
                    <button
                      type="button"
                      onClick={() => generateNarration(memory.id)}
                      className="px-2 py-1 rounded text-xs bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      Generate ScrollText
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generated Narrations</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {narrations.map((narration) => (
              <div key={narration.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg">
                      {getEmotionIcon(narration.emotion)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{narration.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getEmotionColor(narration.emotion)}`}>
                          {narration.emotion}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {narration.duration}s • {narration.voice}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{narration.createdAt}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-900 dark:text-white">{narration.content}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => togglePlay(narration.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    {narration.isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                    {narration.isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Volume2 className="h-3 w-3" />
                    Adjust
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">AI Narration Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI generates emotional stories from memories</li>
              <li>• Emotions: happy, nostalgic, excited, peaceful, adventurous</li>
              <li>• Customizable voice settings (speed, pitch, volume)</li>
              <li>• Playback with audio narration of stories</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
