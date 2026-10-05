'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface VoiceCloneModel {
  id: string;
  modelName: string;
  sampleAudioUrl: string;
  modelPath: string;
  status: string;
  trainingProgress: number;
  errorMessage: string | null;
  createdAt: string;
  readyAt: string | null;
}

export default function PersonalVoiceCloning() {
  const { token } = useAuth();
  const [models, setModels] = useState<VoiceCloneModel[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newModel, setNewModel] = useState({
    modelName: '',
    sampleAudioUrl: '',
  });
  const [narrationText, setNarrationText] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<any>(null);

  useEffect(() => {
    fetchModels();
  }, [token]);

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:3001/ai-companion/voice-clone', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error('Failed to fetch models:', error);
    }
  };

  const createModel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:3001/ai-companion/voice-clone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newModel),
      });

      setShowAddForm(false);
      setNewModel({ modelName: '', sampleAudioUrl: '' });
      await fetchModels();
    } catch (error) {
      console.error('Failed to create model:', error);
    }
  };

  const deleteModel = async (id: string) => {
    if (!confirm('Are you sure you want to delete this voice model?')) return;

    try {
      await fetch(`http://localhost:3001/ai-companion/voice-clone/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchModels();
    } catch (error) {
      console.error('Failed to delete model:', error);
    }
  };

  const generateNarration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModelId || !narrationText.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/ai-companion/voice-clone/narrate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          modelId: selectedModelId,
          text: narrationText,
        }),
      });

      const data = await response.json();
      setGeneratedAudio(data);
    } catch (error) {
      console.error('Failed to generate narration:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'training':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Personal AI Voice Cloning</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Train New Voice
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Train Voice Model</h3>
          <form onSubmit={createModel} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
              <input
                type="text"
                value={newModel.modelName}
                onChange={(e) => setNewModel({ ...newModel, modelName: e.target.value })}
                placeholder="My Voice v1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sample Audio URL</label>
              <input
                type="text"
                value={newModel.sampleAudioUrl}
                onChange={(e) => setNewModel({ ...newModel, sampleAudioUrl: e.target.value })}
                placeholder="https://example.com/sample.mp3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload a 1-minute audio sample of your voice
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start Training
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Voice Models */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-700">Your Voice Models</h3>

        {models.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No voice models trained yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-800">{model.modelName}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(model.status)}`}>
                        {model.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(model.createdAt).toLocaleDateString()}
                    </p>
                    {model.readyAt && (
                      <p className="text-sm text-gray-500">
                        Ready: {new Date(model.readyAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteModel(model.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>

                {model.status === 'training' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Training Progress</span>
                      <span>{model.trainingProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full transition-all"
                        style={{ width: `${model.trainingProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {model.errorMessage && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-700">
                    Error: {model.errorMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Narration Generator */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Generate Voice Narration</h3>
        <form onSubmit={generateNarration} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Voice Model</label>
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a model...</option>
              {models
                .filter((m) => m.status === 'ready')
                .map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.modelName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text to Narrate</label>
            <textarea
              value={narrationText}
              onChange={(e) => setNarrationText(e.target.value)}
              placeholder="Enter the text you want to narrate in your voice..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !selectedModelId}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : '🎙️ Generate Narration'}
          </button>
        </form>

        {generatedAudio && (
          <div className="mt-4 p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Generated Audio</h4>
            <audio controls className="w-full mb-2">
              <source src={generatedAudio.audioUrl} type="audio/mpeg" />
              Your browser does not support audio playback.
            </audio>
            <p className="text-sm text-gray-600">Duration: {generatedAudio.duration}s</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">How It Works</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Train custom voice model from 1-minute audio sample</li>
          <li>• Synthesizes natural audio narration in your own voice</li>
          <li>• Perfect for narrating old journal entries</li>
          <li>• Use for audio memoirs and memory playback</li>
        </ul>
      </div>
    </div>
  );
}
