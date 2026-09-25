'use client';

import { useState } from 'react';
import { FileText, X, RefreshCw, Info, CheckCircle, Star, Zap, Copy, Image as ImageIcon, MapPin } from 'lucide-react';

interface AIDescriptionGeneratorProps {
  onCancel?: () => void;
}

interface GeneratedDescription {
  id: string;
  memoryId: string;
  memoryTitle: string;
  location: string;
  description: string;
  keywords: string[];
  tone: 'formal' | 'casual' | 'poetic' | 'detailed';
  createdAt: string;
}

interface GenerationContext {
  imageInput: string;
  location: string;
  mood: string;
  date: string;
}

interface ToneOption {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function AIDescriptionGenerator({ onCancel }: AIDescriptionGeneratorProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGeneratorEnabled, setIsGeneratorEnabled] = useState(true);

  const [generatedDescriptions, setGeneratedDescriptions] = useState<GeneratedDescription[]>([
    { id: '1', memoryId: '1', memoryTitle: 'Beach Sunset', location: 'California', description: 'A breathtaking sunset over the Pacific Ocean, painting the sky in vibrant shades of orange and pink as the sun dips below the horizon. The gentle waves create a soothing rhythm against the shore.', keywords: ['sunset', 'ocean', 'peaceful', 'vibrant'], tone: 'poetic', createdAt: '2024-01-15' },
    { id: '2', memoryId: '2', memoryTitle: 'Mountain Summit', location: 'Swiss Alps', description: 'Standing at the peak of the mountain, surrounded by snow-capped peaks and clear blue sky. The achievement of reaching the summit fills the heart with pride and accomplishment.', keywords: ['mountain', 'summit', 'achievement', 'scenic'], tone: 'detailed', createdAt: '2024-02-20' },
  ]);

  const [toneOptions, setToneOptions] = useState<ToneOption[]>([
    { id: '1', name: 'Formal', description: 'Professional and structured', isActive: false },
    { id: '2', name: 'Casual', description: 'Relaxed and conversational', isActive: true },
    { id: '3', name: 'Poetic', description: 'Artistic and expressive', isActive: false },
    { id: '4', name: 'Detailed', description: 'Comprehensive and descriptive', isActive: false },
  ]);

  const [generationContext, setGenerationContext] = useState<GenerationContext>({
    imageInput: '',
    location: '',
    mood: '',
    date: new Date().toISOString().split('T')[0],
  });

  const generateDescription = () => {
    const activeTone = toneOptions.find(t => t.isActive) || toneOptions[1];
    const newDescription: GeneratedDescription = {
      id: Date.now().toString(),
      memoryId: Date.now().toString(),
      memoryTitle: `Memory ${generatedDescriptions.length + 1}`,
      location: generationContext.location || 'Unknown',
      description: `AI-generated description in ${activeTone.name.toLowerCase()} tone based on ${generationContext.imageInput ? 'image' : 'context'} input. Captures the essence of the moment with vivid details and emotional resonance.`,
      keywords: ['AI', 'generated', 'memory', 'moment'],
      tone: activeTone.name.toLowerCase() as any,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGeneratedDescriptions([...generatedDescriptions, newDescription]);
  };

  const selectTone = (id: string) => {
    setToneOptions(toneOptions.map(tone => 
      tone.id === id ? { ...tone, isActive: true } : { ...tone, isActive: false }
    ));
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'formal': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'casual': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'poetic': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'detailed': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Description Generator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate descriptions from image + location
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGeneratorEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGeneratorEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Generated</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{generatedDescriptions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Tones</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{toneOptions.filter(t => t.isActive).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Keywords</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{generatedDescriptions.reduce((acc, d) => acc + d.keywords.length, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Length</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{(generatedDescriptions.reduce((acc, d) => acc + d.description.length, 0) / generatedDescriptions.length).toFixed(0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGeneratorEnabled}
              onChange={(e) => setIsGeneratorEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Generator</span>
          </div>
          <button
            type="button"
            onClick={generateDescription}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            Generate Description
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Tone Options</h4>
          <div className="space-y-2">
            {toneOptions.map((tone) => (
              <div key={tone.id} className={`p-3 rounded-lg border ${tone.isActive ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600' : 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{tone.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{tone.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => selectTone(tone.id)}
                    className={`px-2 py-1 rounded text-xs ${tone.isActive ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                  >
                    {tone.isActive ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generation Context</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Image Input</span>
              </div>
              <input
                type="text"
                value={generationContext.imageInput}
                onChange={(e) => setGenerationContext({ ...generationContext, imageInput: e.target.value })}
                placeholder="Upload image..."
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
                value={generationContext.location}
                onChange={(e) => setGenerationContext({ ...generationContext, location: e.target.value })}
                placeholder="Enter location..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Mood</span>
              </div>
              <input
                type="text"
                value={generationContext.mood}
                onChange={(e) => setGenerationContext({ ...generationContext, mood: e.target.value })}
                placeholder="Enter mood..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generated Descriptions</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {generatedDescriptions.map((desc) => (
              <div key={desc.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{desc.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getToneColor(desc.tone)}`}>
                          {desc.tone}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{desc.location} • {desc.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-900 dark:text-white">{desc.description}</p>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-wrap gap-1">
                    {desc.keywords.map((keyword) => (
                      <span key={keyword} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Description Generator Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI generates descriptions from image and location</li>
              <li>• Tone options: formal, casual, poetic, detailed</li>
              <li>• Context: image input, location, mood, date</li>
              <li>• Auto-extracts keywords for easy tagging</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
