import { AlertCircle, Calendar, CheckCircle, Clock, Download, ExternalLink, FileText, Fork, Github, Info, Plus, RefreshCw, Settings, Star, Trash2, X } from 'lucide-react';
'use client';

import { useState } from 'react';


interface CodeSamplesRepositoryProps {
  onCancel?: () => void;
}

interface CodeSample {
  id: string;
  title: string;
  description: string;
  sdk: string;
  language: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  isPublic: boolean;
}

interface SampleCategory {
  id: string;
  name: string;
  count: number;
}

interface SampleTag {
  id: string;
  name: string;
  color: string;
}

export default function CodeSamplesRepository({ onCancel }: CodeSamplesRepositoryProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRepoEnabled, setIsRepoEnabled] = useState(true);

  const [codeSamples, setCodeSamples] = useState<CodeSample[]>([
    { id: '1', title: 'JavaScript SDK Basic Example', description: 'Basic memory CRUD operations with JavaScript SDK', sdk: 'JavaScript/TypeScript', language: 'TypeScript', stars: 245, forks: 78, lastUpdated: '2024-01-17', isPublic: true },
    { id: '2', title: 'Python SDK Authentication', description: 'OAuth2 authentication example with Python SDK', sdk: 'Python', language: 'Python', stars: 189, forks: 52, lastUpdated: '2024-01-16', isPublic: true },
    { id: '3', title: 'React Native Memory App', description: 'Full React Native app with memory features', sdk: 'React Native', language: 'TypeScript', stars: 312, forks: 95, lastUpdated: '2024-01-15', isPublic: true },
    { id: '4', title: 'Flutter Memory Plugin Demo', description: 'Flutter app demonstrating memory plugin usage', sdk: 'Flutter', language: 'Dart', stars: 156, forks: 41, lastUpdated: '2024-01-14', isPublic: true },
    { id: '5', title: 'CLI Tool Integration', description: 'CLI tool integration examples', sdk: 'CLI', language: 'Bash', stars: 98, forks: 23, lastUpdated: '2024-01-13', isPublic: true },
  ]);

  const [sampleCategories, setSampleCategories] = useState<SampleCategory[]>([
    { id: '1', name: 'Getting Started', count: 8 },
    { id: '2', name: 'Authentication', count: 5 },
    { id: '3', name: 'CRUD Operations', count: 12 },
    { id: '4', name: 'File Upload', count: 4 },
    { id: '5', name: 'Webhooks', count: 3 },
  ]);

  const [sampleTags, setSampleTags] = useState<SampleTag[]>([
    { id: '1', name: 'beginner', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
    { id: '2', name: 'intermediate', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    { id: '3', name: 'advanced', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
    { id: '4', name: 'production', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  ]);

  const togglePublic = (id: string) => {
    setCodeSamples(codeSamples.map(sample => 
      sample.id === id ? { ...sample, isPublic: !sample.isPublic } : sample
    ));
  };

  const downloadSample = (id: string) => {
    console.log(`Downloading sample: ${id}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl">
            <Github className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Code Samples Repository
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Repository code mẫu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isRepoEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isRepoEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Samples</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{codeSamples.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Stars</p>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-400">{codeSamples.reduce((acc, s) => acc + s.stars, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Forks</p>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">{codeSamples.reduce((acc, s) => acc + s.forks, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Categories</p>
            <p className="text-lg font-bold text-zinc-600 dark:text-zinc-400">{sampleCategories.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isRepoEnabled}
              onChange={(e) => setIsRepoEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Repo</span>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-700 hover:bg-slate-800 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Sample
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sample Categories</h4>
          <div className="flex flex-wrap gap-2">
            {sampleCategories.map((category) => (
              <div key={category.id} className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600">
                <span className="text-slate-900 dark:text-white font-semibold">{category.name}</span>
                <span className="text-slate-500 dark:text-slate-400 ml-1">({category.count})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Sample Tags</h4>
          <div className="flex flex-wrap gap-2">
            {sampleTags.map((tag) => (
              <div key={tag.id} className={`px-3 py-1.5 rounded-lg text-xs ${tag.color}`}>
                {tag.name}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Code Samples</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {codeSamples.map((sample) => (
              <div key={sample.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                      <Github className="h-4 w-4 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{sample.title}</span>
                        {sample.isPublic && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Public
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{sample.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => togglePublic(sample.id)}
                      className={`px-2 py-1 rounded text-xs ${sample.isPublic ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                    >
                      {sample.isPublic ? 'Private' : 'Public'}
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadSample(sample.id)}
                      className="px-2 py-1 rounded text-xs bg-slate-700 hover:bg-slate-800 text-white flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">SDK: {sample.sdk}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Language: {sample.language}</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{sample.stars}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fork className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{sample.forks}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Updated: {sample.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Code Samples Repository Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Explore code samples for all SDKs</li>
              <li>• Fork and customize samples for your needs</li>
              <li>• Star samples you find useful</li>
              <li>• Contribute your own samples</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
