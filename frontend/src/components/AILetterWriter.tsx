'use client';

import { useState } from 'react';
import { Mail, X, RefreshCw, Info, CheckCircle, Star, Zap, Copy, Send, User } from 'lucide-react';

interface AILetterWriterProps {
  onCancel?: () => void;
}

interface GeneratedLetter {
  id: string;
  memoryId: string;
  memoryTitle: string;
  recipient: string;
  relationship: 'family' | 'friend' | 'partner' | 'colleague' | 'mentor';
  letter: string;
  tone: 'formal' | 'casual' | 'warm' | 'professional' | 'romantic';
  wordCount: number;
  createdAt: string;
  isSent: boolean;
}

interface LetterSettings {
  autoWrite: boolean;
  defaultTone: 'formal' | 'casual' | 'warm' | 'professional' | 'romantic';
  includeMemories: boolean;
  personalDetails: boolean;
}

export default function AILetterWriter({ onCancel }: AILetterWriterProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isWriterEnabled, setIsWriterEnabled] = useState(true);

  const [generatedLetters, setGeneratedLetters] = useState<GeneratedLetter[]>([
    { id: '1', memoryId: '1', memoryTitle: 'Family Vacation', recipient: 'Mom', relationship: 'family', letter: 'Dear Mom,\n\nI hope this letter finds you well. I wanted to share some wonderful memories from our family vacation. The time we spent together at the beach was truly special. Building sandcastles and watching the sunset together are moments I will cherish forever.\n\nThank you for always being there and making these memories possible.\n\nWith love,\nYour child', tone: 'warm', wordCount: 65, createdAt: '2024-01-15', isSent: true },
    { id: '2', memoryId: '2', memoryTitle: 'College Reunion', recipient: 'John', relationship: 'friend', letter: 'Hi John,\n\nThinking back to our college reunion brings a smile to my face. It was amazing catching up with everyone and reminiscing about our university days. The stories we shared and the laughter we had reminded me of how special those times were.\n\nLet\'s not wait so long before the next gathering!\n\nBest,\nYour friend', tone: 'casual', wordCount: 58, createdAt: '2024-02-20', isSent: false },
  ]);

  const [letterSettings, setLetterSettings] = useState<LetterSettings>({
    autoWrite: false,
    defaultTone: 'warm',
    includeMemories: true,
    personalDetails: true,
  });

  const [recipient, setRecipient] = useState('');
  const [relationship, setRelationship] = useState<'family' | 'friend' | 'partner' | 'colleague' | 'mentor'>('family');

  const writeLetter = () => {
    const tones: Array<'formal' | 'casual' | 'warm' | 'professional' | 'romantic'> = ['formal', 'casual', 'warm', 'professional', 'romantic'];
    const newLetter: GeneratedLetter = {
      id: Date.now().toString(),
      memoryId: Date.now().toString(),
      memoryTitle: `Memory ${generatedLetters.length + 1}`,
      recipient: recipient || 'Recipient',
      relationship: relationship,
      letter: `Dear ${recipient || 'Recipient'},\n\nI am writing to share some special memories with you. The moments we shared are precious and I wanted to express how much they mean to me. These memories will stay with me forever as a reminder of our connection.\n\nThank you for being part of my journey.\n\nWarm regards,\nYour friend`,
      tone: letterSettings.defaultTone,
      wordCount: Math.floor(Math.random() * 30) + 50,
      createdAt: new Date().toISOString().split('T')[0],
      isSent: false,
    };
    setGeneratedLetters([...generatedLetters, newLetter]);
    setRecipient('');
  };

  const sendLetter = (id: string) => {
    setGeneratedLetters(generatedLetters.map(letter => 
      letter.id === id ? { ...letter, isSent: true } : letter
    ));
  };

  const getRelationshipColor = (rel: string) => {
    switch (rel) {
      case 'family': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'friend': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'partner': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'colleague': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'mentor': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'formal': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'casual': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'warm': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'professional': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'romantic': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              AI Letter Writer
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Write letters to loved ones from memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isWriterEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isWriterEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Letters</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{generatedLetters.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Sent</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{generatedLetters.filter(l => l.isSent).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Words</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{(generatedLetters.reduce((acc, l) => acc + l.wordCount, 0) / generatedLetters.length).toFixed(0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Relationships</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{5}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isWriterEnabled}
              onChange={(e) => setIsWriterEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Writer</span>
          </div>
          <button
            type="button"
            onClick={writeLetter}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Mail className="h-3 w-3" />
            Write Letter
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Letter Recipient</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-violet-400" />
                <span className="text-xs text-slate-900 dark:text-white">Recipient Name</span>
              </div>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient name..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Relationship</span>
              </div>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="family">Family</option>
                <option value="friend">Friend</option>
                <option value="partner">Partner</option>
                <option value="colleague">Colleague</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Letter Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-violet-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Write</span>
              </div>
              <input
                type="checkbox"
                checked={letterSettings.autoWrite}
                onChange={(e) => setLetterSettings({ ...letterSettings, autoWrite: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Tone</span>
              </div>
              <select
                value={letterSettings.defaultTone}
                onChange={(e) => setLetterSettings({ ...letterSettings, defaultTone: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="formal">Formal</option>
                <option value="casual">Casual</option>
                <option value="warm">Warm</option>
                <option value="professional">Professional</option>
                <option value="romantic">Romantic</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Info className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Memories</span>
              </div>
              <input
                type="checkbox"
                checked={letterSettings.includeMemories}
                onChange={(e) => setLetterSettings({ ...letterSettings, includeMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Personal Details</span>
              </div>
              <input
                type="checkbox"
                checked={letterSettings.personalDetails}
                onChange={(e) => setLetterSettings({ ...letterSettings, personalDetails: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Generated Letters</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {generatedLetters.map((letter) => (
              <div key={letter.id} className={`p-3 rounded-lg border ${letter.isSent ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">To: {letter.recipient}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getRelationshipColor(letter.relationship)}`}>
                          {letter.relationship}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getToneColor(letter.tone)}`}>
                          {letter.tone}
                        </span>
                        {letter.isSent && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Sent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{letter.memoryTitle} • {letter.wordCount} words • {letter.createdAt}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-900 dark:text-white whitespace-pre-line">{letter.letter}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => sendLetter(letter.id)}
                    className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                  >
                    <Send className="h-3 w-3" />
                    Send
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Letter Writer Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• AI writes letters based on memory content</li>
              <li>• Relationships: family, friend, partner, colleague, mentor</li>
              <li>• Tones: formal, casual, warm, professional, romantic</li>
              <li>• Memory inclusion and personal detail options</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
