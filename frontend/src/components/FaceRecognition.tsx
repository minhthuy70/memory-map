'use client';

import { useState } from 'react';
import { User, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Scan, Eye, Shield, Users, Camera, Image as ImageIcon, Smile as FaceSmile, Lock, Unlock, Search, Plus, Trash2 } from 'lucide-react';

interface DetectedFace {
  id: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  embeddings: number[];
  isIdentified: boolean;
  personId: string | null;
  personName: string | null;
}

interface Person {
  id: string;
  name: string;
  avatar: string;
  faceCount: number;
  firstSeen: Date;
  lastSeen: Date;
  isPrivate: boolean;
}

interface FaceRecognitionResult {
  imageId: string;
  imageName: string;
  faces: DetectedFace[];
  processedAt: Date;
  processingTime: number;
}

interface FaceRecognitionProps {
  onCancel?: () => void;
  onRunRecognition?: (imageId: string) => Promise<void>;
  onAddPerson?: (name: string) => Promise<void>;
  onDeletePerson?: (personId: string) => Promise<void>;
}

const DEFAULT_PEOPLE: Person[] = [
  {
    id: 'person-1',
    name: 'Dad',
    avatar: '/dad.jpg',
    faceCount: 45,
    firstSeen: new Date('2023-01-01'),
    lastSeen: new Date('2024-01-12'),
    isPrivate: false,
  },
  {
    id: 'person-2',
    name: 'Mom',
    avatar: '/mom.jpg',
    faceCount: 38,
    firstSeen: new Date('2023-01-01'),
    lastSeen: new Date('2024-01-10'),
    isPrivate: false,
  },
  {
    id: 'person-3',
    name: 'Tom',
    avatar: '/tom.jpg',
    faceCount: 22,
    firstSeen: new Date('2023-05-01'),
    lastSeen: new Date('2024-01-08'),
    isPrivate: true,
  },
];

const DEFAULT_RESULTS: FaceRecognitionResult[] = [
  {
    imageId: 'img-1',
    imageName: 'family-vacation.jpg',
    faces: [
      {
        id: 'face-1',
        confidence: 0.95,
        boundingBox: { x: 100, y: 50, width: 60, height: 80 },
        embeddings: [0.1, 0.2, 0.3],
        isIdentified: true,
        personId: 'person-1',
        personName: 'Dad',
      },
      {
        id: 'face-2',
        confidence: 0.88,
        boundingBox: { x: 200, y: 60, width: 55, height: 75 },
        embeddings: [0.4, 0.5, 0.6],
        isIdentified: true,
        personId: 'person-2',
        personName: 'Mom',
      },
      {
        id: 'face-3',
        confidence: 0.72,
        boundingBox: { x: 300, y: 70, width: 50, height: 70 },
        embeddings: [0.7, 0.8, 0.9],
        isIdentified: false,
        personId: null,
        personName: null,
      },
    ],
    processedAt: new Date('2024-01-12'),
    processingTime: 0.8,
  },
];

export default function FaceRecognition({ onCancel, onRunRecognition, onAddPerson, onDeletePerson }: FaceRecognitionProps) {
  const [people, setPeople] = useState<Person[]>(DEFAULT_PEOPLE);
  const [results, setResults] = useState<FaceRecognitionResult[]>(DEFAULT_RESULTS);
  const [showSettings, setShowSettings] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [showUnidentified, setShowUnidentified] = useState(false);
  const [enablePrivacy, setEnablePrivacy] = useState(true);

  const totalFaces = results.reduce((sum, r) => sum + r.faces.length, 0);
  const identifiedFaces = results.reduce((sum, r) => sum + r.faces.filter(f => f.isIdentified).length, 0);
  const unidentifiedFaces = totalFaces - identifiedFaces;
  const avgConfidence = totalFaces > 0 ? results.reduce((sum, r) => sum + r.faces.reduce((s, f) => s + f.confidence, 0), 0) / totalFaces : 0;

  const handleRunRecognition = async (imageId: string) => {
    setIsProcessing(true);
    await onRunRecognition?.(imageId);
    setIsProcessing(false);
  };

  const handleAddPerson = async (name: string) => {
    await onAddPerson?.(name);
  };

  const handleDeletePerson = async (personId: string) => {
    await onDeletePerson?.(personId);
    setPeople(people.filter(p => p.id !== personId));
  };

  const handleTogglePrivacy = (personId: string) => {
    setPeople(people.map(p => 
      p.id === personId ? { ...p, isPrivate: !p.isPrivate } : p
    ));
  };

  const filteredFaces = results.flatMap(r => 
    r.faces.filter(f => 
      f.confidence >= confidenceThreshold &&
      (!showUnidentified || !f.isIdentified) &&
      (!selectedPerson || f.personId === selectedPerson)
    )
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhận diện khuôn mặt
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {identifiedFaces}/{totalFaces} identified
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt face recognition
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Confidence threshold: {(confidenceThreshold * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-recognize on upload
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Face privacy mode
              </span>
              <button
                type="button"
                onClick={() => setEnablePrivacy(!enablePrivacy)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enablePrivacy ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enablePrivacy ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Total Faces</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalFaces}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Identified</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {identifiedFaces}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Unidentified</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {unidentifiedFaces}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <FaceSmile className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Avg Confidence</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {(avgConfidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowUnidentified(!showUnidentified)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
              showUnidentified
                ? 'bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                : 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            {showUnidentified ? 'Show All' : 'Unidentified Only'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedPerson(null)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            <Users className="h-3 w-3" />
            All People
          </button>
        </div>
      </div>

      {/* Person Filter */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
          Filter by Person
        </label>
        <select
          value={selectedPerson || ''}
          onChange={(e) => setSelectedPerson(e.target.value || null)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">All People</option>
          {people.map(p => (
            <option key={p.id} value={p.id}>{p.name} ({p.faceCount} faces)</option>
          ))}
        </select>
      </div>

      {/* People Directory */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          People Directory
        </h4>
        <div className="space-y-2">
          {people.map((person) => (
            <div
              key={person.id}
              className={`p-4 rounded-lg border-2 ${
                selectedPerson === person.id
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {person.name}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {person.faceCount} faces
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTogglePrivacy(person.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                    title={person.isPrivate ? 'Unlock' : 'Lock'}
                  >
                    {person.isPrivate ? (
                      <Lock className="h-3 w-3 text-amber-500" />
                    ) : (
                      <Unlock className="h-3 w-3 text-slate-500" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeletePerson(person.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">First Seen</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {person.firstSeen.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Seen</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {person.lastSeen.toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recognition Results */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Recognition Results
        </h4>
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.imageId}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {result.imageName}
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {result.faces.length} faces detected
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRunRecognition(result.imageId)}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  <Scan className="h-3 w-3" />
                  {isProcessing ? 'Processing...' : 'Re-scan'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Processed</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.processedAt.toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Time</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {result.processingTime}s
                  </div>
                </div>
              </div>

              {/* Detected Faces */}
              <div className="space-y-2">
                {result.faces.filter(f => f.confidence >= confidenceThreshold).map((face) => (
                  <div
                    key={face.id}
                    className={`p-3 rounded-lg border ${
                      face.isIdentified
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30'
                        : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaceSmile className={`h-4 w-4 ${face.isIdentified ? 'text-green-500' : 'text-amber-500'}`} />
                        <div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {face.isIdentified ? face.personName : 'Unknown'}
                          </span>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {(face.confidence * 100).toFixed(0)}% confidence
                          </div>
                        </div>
                      </div>
                      {face.isIdentified && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full">
                          Identified
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">X</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {face.boundingBox.x}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Y</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {face.boundingBox.y}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Width</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {face.boundingBox.width}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">Height</div>
                        <div className="text-xs text-slate-700 dark:text-slate-300">
                          {face.boundingBox.height}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Nhận diện khuôn mặt sử dụng computer vision để xác định người trong ảnh kỷ niệm với face detection, face recognition, face embeddings, person directory, privacy mode (private faces), confidence thresholding, unidentified face tracking, và re-scan functionality.
        </p>
      </div>
    </div>
  );
}