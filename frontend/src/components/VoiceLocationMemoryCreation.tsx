'use client';

import { useState } from 'react';
import { Mic, X, RefreshCw, Info, CheckCircle, Star, Zap, MapPin, Play, Pause, StopCircle, Volume2 } from 'lucide-react';

interface VoiceLocationMemoryCreationProps {
  onCancel?: () => void;
}

interface VoiceRecording {
  id: string;
  duration: number;
  transcript: string;
  confidence: number;
  language: string;
  createdAt: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  accuracy: number;
}

interface CreatedMemory {
  id: string;
  title: string;
  transcript: string;
  location: LocationData;
  voiceRecording: VoiceRecording;
  timestamp: string;
  status: 'draft' | 'saved' | 'published';
}

export default function VoiceLocationMemoryCreation({ onCancel }: VoiceLocationMemoryCreationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRecordingEnabled, setIsRecordingEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const [voiceRecordings, setVoiceRecordings] = useState<VoiceRecording[]>([
    { id: '1', duration: 45, transcript: 'Today was an amazing day at the beach with my family', confidence: 0.95, language: 'en-US', createdAt: '2024-01-15' },
    { id: '2', duration: 32, transcript: 'The sunset over the mountains was absolutely beautiful', confidence: 0.92, language: 'en-US', createdAt: '2024-02-20' },
    { id: '3', duration: 58, transcript: 'Walking through the old town and discovering hidden gems', confidence: 0.88, language: 'en-US', createdAt: '2024-03-10' },
  ]);

  const [createdMemories, setCreatedMemories] = useState<CreatedMemory[]>([
    { 
      id: '1', 
      title: 'Beach Day with Family', 
      transcript: 'Today was an amazing day at the beach with my family', 
      location: { latitude: 37.7749, longitude: -122.4194, address: 'Ocean Beach', city: 'San Francisco', country: 'USA', accuracy: 10 },
      voiceRecording: voiceRecordings[0],
      timestamp: '2024-01-15 14:30',
      status: 'saved'
    },
    { 
      id: '2', 
      title: 'Mountain Sunset', 
      transcript: 'The sunset over the mountains was absolutely beautiful', 
      location: { latitude: 46.5197, longitude: 8.3078, address: 'Swiss Alps', city: 'Zermatt', country: 'Switzerland', accuracy: 5 },
      voiceRecording: voiceRecordings[1],
      timestamp: '2024-02-20 18:45',
      status: 'published'
    },
  ]);

  const [currentLocation, setCurrentLocation] = useState<LocationData>({
    latitude: 37.7749,
    longitude: -122.4194,
    address: 'Current Location',
    city: 'San Francisco',
    country: 'USA',
    accuracy: 5,
  });

  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    const newRecording: VoiceRecording = {
      id: Date.now().toString(),
      duration: recordingDuration,
      transcript: 'New voice recording transcript...',
      confidence: 0.90,
      language: 'en-US',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setVoiceRecordings([...voiceRecordings, newRecording]);
  };

  const createMemory = () => {
    const newMemory: CreatedMemory = {
      id: Date.now().toString(),
      title: 'New Voice Memory',
      transcript: voiceRecordings[voiceRecordings.length - 1]?.transcript || '',
      location: currentLocation,
      voiceRecording: voiceRecordings[voiceRecordings.length - 1] || voiceRecordings[0],
      timestamp: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
      status: 'draft',
    };
    setCreatedMemories([...createdMemories, newMemory]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (confidence >= 0.8) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    if (confidence >= 0.7) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'saved': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'draft': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Voice + Location Memory Creation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create memories with voice and GPS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isRecordingEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isRecordingEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Recordings</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{voiceRecordings.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Memories</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{createdMemories.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Duration</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{voiceRecordings.reduce((acc, r) => acc + r.duration, 0)}s</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Confidence</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{(voiceRecordings.reduce((acc, r) => acc + r.confidence, 0) / voiceRecordings.length).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isRecordingEnabled}
              onChange={(e) => setIsRecordingEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Voice Recording</span>
          </div>
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="px-3 py-1.5 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white border-0 flex items-center gap-1"
            >
              <Mic className="h-3 w-3" />
              Start Recording
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
            >
              <StopCircle className="h-3 w-3" />
              Stop Recording
            </button>
          )}
          <button
            type="button"
            onClick={createMemory}
            className="px-3 py-1.5 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white border-0 flex items-center gap-1"
          >
            <MapPin className="h-3 w-3" />
            Create Memory
          </button>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        {isRecording && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-red-700 dark:text-red-300">Recording...</span>
              </div>
              <span className="text-xs text-red-700 dark:text-red-300">{recordingDuration}s</span>
            </div>
          </div>
        )}

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Current Location</h4>
          <div className="space-y-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-rose-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{currentLocation.address}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {currentLocation.city}, {currentLocation.country}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy: {currentLocation.accuracy}m</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Lat: {currentLocation.latitude}</span>
                <span>•</span>
                <span>Lng: {currentLocation.longitude}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Voice Recordings</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {voiceRecordings.map((recording) => (
              <div key={recording.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Mic className="h-4 w-4 text-rose-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">Recording {recording.id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getConfidenceColor(recording.confidence)}`}>
                          {(recording.confidence * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {recording.duration}s • {recording.language}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{recording.createdAt}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Transcript:</p>
                  <p className="text-xs text-slate-900 dark:text-white">{recording.transcript}</p>
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
                    <Volume2 className="h-3 w-3" />
                    Adjust
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Created Memories</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {createdMemories.map((memory) => (
              <div key={memory.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{memory.title}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(memory.status)}`}>
                          {memory.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {memory.location.city}, {memory.location.country}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">{memory.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Voice + Location Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Record voice and capture GPS automatically</li>
              <li>• Speech-to-text transcription with confidence scores</li>
              <li>• Location data includes address and coordinates</li>
              <li>• Create memories hands-free while exploring</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
