'use client';

import { useState } from 'react';
import {
  Calendar,
  Clock,
  Edit,
  FileText,
  Info,
  Mic,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Star,
  User
} from 'lucide-react';

interface OralHistoryRecorderProps {
  onCancel?: () => void;
}

interface OralHistoryRecording {
  id: string;
  intervieweeName: string;
  interviewDate: string;
  duration: number;
  topic: string;
  language: string;
  transcript?: string;
  summary?: string;
  tags: string[];
  audioUrl?: string;
  status: 'recording' | 'processing' | 'completed';
  createdAt: string;
}

interface RecordingSettings {
  autoTranscribe: boolean;
  autoSummarize: boolean;
  language: string;
  quality: 'low' | 'medium' | 'high';
}

export default function OralHistoryRecorder({ onCancel }: OralHistoryRecorderProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRecorderEnabled, setIsRecorderEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [oralHistoryRecordings, setOralHistoryRecordings] = useState<OralHistoryRecording[]>([
    { id: '1', intervieweeName: 'Grandma Mary', interviewDate: '2024-01-15', duration: 45, topic: 'Childhood memories', language: 'English', transcript: 'Growing up in the 1950s was different...', summary: 'Grandma Mary shares stories about her childhood', tags: ['childhood', '1950s', 'family'], status: 'completed', createdAt: '2024-01-15' },
    { id: '2', intervieweeName: 'Uncle Bob', interviewDate: '2024-01-10', duration: 60, topic: 'War experiences', language: 'English', transcript: 'I was drafted in 1968...', summary: 'Uncle Bob discusses his military service', tags: ['war', 'military', '1960s'], status: 'completed', createdAt: '2024-01-10' },
  ]);

  const [recordingSettings, setRecordingSettings] = useState<RecordingSettings>({
    autoTranscribe: true,
    autoSummarize: true,
    language: 'English',
    quality: 'high',
  });

  const [currentRecording, setCurrentRecording] = useState({
    intervieweeName: '',
    topic: '',
    language: 'English',
    tags: '',
  });

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = () => {
    setIsRecording(false);
    const newRecording: OralHistoryRecording = {
      id: Date.now().toString(),
      intervieweeName: currentRecording.intervieweeName || 'Unknown',
      interviewDate: new Date().toISOString().split('T')[0],
      duration: recordingTime,
      topic: currentRecording.topic || 'General',
      language: currentRecording.language,
      transcript: recordingSettings.autoTranscribe ? 'Auto-transcribed content...' : undefined,
      summary: recordingSettings.autoSummarize ? 'Auto-generated summary...' : undefined,
      tags: currentRecording.tags.split(',').map(t => t.trim()).filter(t => t),
      status: 'processing',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOralHistoryRecordings([...oralHistoryRecordings, newRecording]);
    setCurrentRecording({
      intervieweeName: '',
      topic: '',
      language: 'English',
      tags: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recording': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'processing': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
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
              Oral History Recorder
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Record oral histories from elderly family members
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isRecorderEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isRecorderEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-lg font-bold text-slate-900 dark:text-white">{oralHistoryRecordings.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Duration</p>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{oralHistoryRecordings.reduce((acc, r) => acc + r.duration, 0)}min</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Transcribed</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{oralHistoryRecordings.filter(r => r.transcript).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Interviewees</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{new Set(oralHistoryRecordings.map(r => r.intervieweeName)).size}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isRecorderEnabled}
              onChange={(e) => setIsRecorderEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Recorder</span>
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
              className="px-3 py-1.5 rounded-lg text-xs bg-amber-600 hover:bg-amber-700 text-white border-0 flex items-center gap-1"
            >
              <Pause className="h-3 w-3" />
              Stop Recording ({recordingTime}s)
            </button>
          )}
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recording Setup</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-rose-400" />
                <span className="text-xs text-slate-900 dark:text-white">Interviewee Name</span>
              </div>
              <input
                type="text"
                value={currentRecording.intervieweeName}
                onChange={(e) => setCurrentRecording({ ...currentRecording, intervieweeName: e.target.value })}
                placeholder="Enter name..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Topic</span>
              </div>
              <input
                type="text"
                value={currentRecording.topic}
                onChange={(e) => setCurrentRecording({ ...currentRecording, topic: e.target.value })}
                placeholder="e.g., Childhood, War experiences..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Language</span>
              </div>
              <select
                value={currentRecording.language}
                onChange={(e) => setCurrentRecording({ ...currentRecording, language: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Tags (comma-separated)</span>
              </div>
              <input
                type="text"
                value={currentRecording.tags}
                onChange={(e) => setCurrentRecording({ ...currentRecording, tags: e.target.value })}
                placeholder="childhood, family, 1950s..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Recording Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-rose-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Transcribe</span>
              </div>
              <input
                type="checkbox"
                checked={recordingSettings.autoTranscribe}
                onChange={(e) => setRecordingSettings({ ...recordingSettings, autoTranscribe: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Summarize</span>
              </div>
              <input
                type="checkbox"
                checked={recordingSettings.autoSummarize}
                onChange={(e) => setRecordingSettings({ ...recordingSettings, autoSummarize: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Gauge</span>
              </div>
              <select
                value={recordingSettings.quality}
                onChange={(e) => setRecordingSettings({ ...recordingSettings, quality: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Oral History Recordings</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {oralHistoryRecordings.map((recording) => (
              <div key={recording.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Mic className="h-4 w-4 text-rose-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{recording.intervieweeName}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(recording.status)}`}>
                          {recording.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{recording.interviewDate} • {recording.duration}min • {recording.language}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Topic: {recording.topic}</p>
                </div>
                {recording.tags.length > 0 && (
                  <div className="mb-2">
                    <div className="flex flex-wrap gap-1">
                      {recording.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {recording.summary && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">{recording.summary}</p>
                )}
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
                    <FileText className="h-3 w-3" />
                    Transcript
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Oral History Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Record oral histories from elderly family members</li>
              <li>• Auto-transcribe with speech-to-text</li>
              <li>• Auto-summarize recordings</li>
              <li>• Tag recordings for easy organization</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
