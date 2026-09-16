'use client';

import { useState } from 'react';
import { Languages, X, RefreshCw, Info, BookOpen, Star, Plus, Volume2, CheckCircle, Target, TrendingUp, Calendar } from 'lucide-react';

interface MemoryBasedLanguageLearningProps {
  onCancel?: () => void;
}

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  memoryId: string;
  memoryContext: string;
  language: string;
  proficiency: number;
  reviewCount: number;
  lastReviewed?: string;
  nextReview?: string;
  isMastered: boolean;
}

interface LearningProgress {
  language: string;
  wordsLearned: number;
  wordsMastered: number;
  totalReviews: number;
  accuracy: number;
}

interface LearningSettings {
  targetLanguage: string;
  dailyGoal: number;
  autoGenerate: boolean;
  audioEnabled: boolean;
}

export default function MemoryBasedLanguageLearning({ onCancel }: MemoryBasedLanguageLearningProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isLearningEnabled, setIsLearningEnabled] = useState(true);

  const [vocabularyItems, setVocabularyItems] = useState<VocabularyItem[]>([
    { id: '1', word: 'beach', translation: 'bãi biển', memoryId: 'mem_1', memoryContext: 'Beautiful sunset at the beach', language: 'Vietnamese', proficiency: 85, reviewCount: 12, lastReviewed: '2024-01-17', nextReview: '2024-01-20', isMastered: false },
    { id: '2', word: 'sunset', translation: 'hoàng hôn', memoryId: 'mem_1', memoryContext: 'Amazing sunset colors', language: 'Vietnamese', proficiency: 92, reviewCount: 15, lastReviewed: '2024-01-16', nextReview: '2024-01-25', isMastered: true },
    { id: '3', word: 'family', translation: 'gia đình', memoryId: 'mem_2', memoryContext: 'Family dinner gathering', language: 'Vietnamese', proficiency: 70, reviewCount: 8, lastReviewed: '2024-01-15', nextReview: '2024-01-18', isMastered: false },
  ]);

  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([
    { language: 'Vietnamese', wordsLearned: 50, wordsMastered: 15, totalReviews: 200, accuracy: 85 },
    { language: 'Spanish', wordsLearned: 30, wordsMastered: 8, totalReviews: 120, accuracy: 78 },
  ]);

  const [learningSettings, setLearningSettings] = useState<LearningSettings>({
    targetLanguage: 'Vietnamese',
    dailyGoal: 10,
    autoGenerate: true,
    audioEnabled: true,
  });

  const [currentWord, setCurrentWord] = useState({
    word: '',
    translation: '',
    memoryId: '',
    memoryContext: '',
    language: 'Vietnamese',
  });

  const addVocabulary = () => {
    const newItem: VocabularyItem = {
      id: Date.now().toString(),
      word: currentWord.word,
      translation: currentWord.translation,
      memoryId: currentWord.memoryId || 'mem_' + Date.now(),
      memoryContext: currentWord.memoryContext,
      language: currentWord.language,
      proficiency: 0,
      reviewCount: 0,
      isMastered: false,
    };
    setVocabularyItems([...vocabularyItems, newItem]);
    setCurrentWord({
      word: '',
      translation: '',
      memoryId: '',
      memoryContext: '',
      language: 'Vietnamese',
    });
  };

  const markMastered = (id: string) => {
    setVocabularyItems(vocabularyItems.map(item => 
      item.id === id ? { ...item, isMastered: true, proficiency: 100 } : item
    ));
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return 'text-green-600 dark:text-green-400';
    if (proficiency >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Languages className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Memory-Based Language Learning
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Learn languages from your memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isLearningEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isLearningEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Words</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{vocabularyItems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mastered</p>
            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{vocabularyItems.filter(w => w.isMastered).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Reviews</p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{vocabularyItems.reduce((acc, w) => acc + w.reviewCount, 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Proficiency</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{Math.round(vocabularyItems.reduce((acc, w) => acc + w.proficiency, 0) / vocabularyItems.length)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isLearningEnabled}
              onChange={(e) => setIsLearningEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Learning</span>
          </div>
          <button
            type="button"
            onClick={addVocabulary}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Word
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Vocabulary</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-teal-400" />
                <span className="text-xs text-slate-900 dark:text-white">Word</span>
              </div>
              <input
                type="text"
                value={currentWord.word}
                onChange={(e) => setCurrentWord({ ...currentWord, word: e.target.value })}
                placeholder="Enter word..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Languages className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Translation</span>
              </div>
              <input
                type="text"
                value={currentWord.translation}
                onChange={(e) => setCurrentWord({ ...currentWord, translation: e.target.value })}
                placeholder="Enter translation..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Language</span>
              </div>
              <select
                value={currentWord.language}
                onChange={(e) => setCurrentWord({ ...currentWord, language: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="Vietnamese">Vietnamese</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory Context</span>
              </div>
              <textarea
                value={currentWord.memoryContext}
                onChange={(e) => setCurrentWord({ ...currentWord, memoryContext: e.target.value })}
                placeholder="Context from your memory..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Learning Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-teal-400" />
                <span className="text-xs text-slate-900 dark:text-white">Target Language</span>
              </div>
              <select
                value={learningSettings.targetLanguage}
                onChange={(e) => setLearningSettings({ ...learningSettings, targetLanguage: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="Vietnamese">Vietnamese</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Daily Goal</span>
              </div>
              <input
                type="number"
                value={learningSettings.dailyGoal}
                onChange={(e) => setLearningSettings({ ...learningSettings, dailyGoal: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={learningSettings.autoGenerate}
                onChange={(e) => setLearningSettings({ ...learningSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Audio Enabled</span>
              </div>
              <input
                type="checkbox"
                checked={learningSettings.audioEnabled}
                onChange={(e) => setLearningSettings({ ...learningSettings, audioEnabled: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Vocabulary List</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {vocabularyItems.map((item) => (
              <div key={item.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-teal-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.word}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">→ {item.translation}</span>
                        {item.isMastered && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Mastered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.language} • {item.memoryContext}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${getProficiencyColor(item.proficiency)}`}>
                      {item.proficiency}%
                    </span>
                    {!item.isMastered && (
                      <button
                        type="button"
                        onClick={() => markMastered(item.id)}
                        className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Master
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.reviewCount} reviews</span>
                  {item.nextReview && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Next: {item.nextReview}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Learning Progress</h4>
          <div className="space-y-2">
            {learningProgress.map((progress) => (
              <div key={progress.language} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Languages className="h-4 w-4 text-teal-400" />
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{progress.language}</span>
                  </div>
                  <span className={`text-xs font-bold ${getProficiencyColor(progress.accuracy)}`}>
                    {progress.accuracy}% accuracy
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Learned</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{progress.wordsLearned}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mastered</p>
                    <p className="text-xs font-bold text-green-600 dark:text-green-400">{progress.wordsMastered}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Reviews</p>
                    <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400">{progress.totalReviews}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Accuracy</p>
                    <p className={`text-xs font-bold ${getProficiencyColor(progress.accuracy)}`}>{progress.accuracy}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Language Learning Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Learn vocabulary from your personal memories</li>
              <li>• Track proficiency and mastery progress</li>
              <li>• Auto-generate vocabulary from memories</li>
              <li>• Audio pronunciation support</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
