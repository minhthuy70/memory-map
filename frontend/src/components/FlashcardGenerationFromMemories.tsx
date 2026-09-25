'use client';

import { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Info,
  Layers,
  Plus,
  RefreshCw,
  RotateCw,
  Star,
  Target
} from 'lucide-react';

interface FlashcardGenerationFromMemoriesProps {
  onCancel?: () => void;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  memoryId: string;
  memoryTitle: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reviewCount: number;
  correctCount: number;
  lastReviewed?: string;
  nextReview?: string;
  isMastered: boolean;
}

interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  category: string;
  createdAt: string;
}

interface FlashcardSettings {
  autoGenerate: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  batchSize: number;
  includeImages: boolean;
}

export default function FlashcardGenerationFromMemories({ onCancel }: FlashcardGenerationFromMemoriesProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isGenerationEnabled, setIsGenerationEnabled] = useState(true);

  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: '1', front: 'What is the main feature of the beach memory?', back: 'Beautiful sunset with orange and pink colors', memoryId: 'mem_1', memoryTitle: 'Beach sunset', category: 'Places', difficulty: 'easy', reviewCount: 5, correctCount: 4, lastReviewed: '2024-01-17', nextReview: '2024-01-20', isMastered: false },
    { id: '2', front: 'Who was present at the family dinner?', back: 'Parents, siblings, and grandparents', memoryId: 'mem_2', memoryTitle: 'Family dinner', category: 'Events', difficulty: 'medium', reviewCount: 8, correctCount: 6, lastReviewed: '2024-01-16', nextReview: '2024-01-19', isMastered: false },
    { id: '3', front: 'What year did the hiking trip take place?', back: '2023', memoryId: 'mem_3', memoryTitle: 'Mountain hike', category: 'Activities', difficulty: 'easy', reviewCount: 12, correctCount: 11, lastReviewed: '2024-01-15', nextReview: '2024-01-25', isMastered: true },
  ]);

  const [flashcardDecks, setFlashcardDecks] = useState<FlashcardDeck[]>([
    { id: '1', name: 'Family Memories', description: 'Flashcards about family events', cardCount: 15, category: 'Family', createdAt: '2024-01-01' },
    { id: '2', name: 'Travel Memories', description: 'Flashcards from travel experiences', cardCount: 20, category: 'Travel', createdAt: '2024-01-05' },
  ]);

  const [flashcardSettings, setFlashcardSettings] = useState<FlashcardSettings>({
    autoGenerate: true,
    difficulty: 'medium',
    batchSize: 10,
    includeImages: false,
  });

  const [currentCard, setCurrentCard] = useState({
    front: '',
    back: '',
    memoryId: '',
    memoryTitle: '',
    category: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
  });

  const addFlashcard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: currentCard.front,
      back: currentCard.back,
      memoryId: currentCard.memoryId || 'mem_' + Date.now(),
      memoryTitle: currentCard.memoryTitle,
      category: currentCard.category,
      difficulty: currentCard.difficulty,
      reviewCount: 0,
      correctCount: 0,
      isMastered: false,
    };
    setFlashcards([...flashcards, newCard]);
    setCurrentCard({
      front: '',
      back: '',
      memoryId: '',
      memoryTitle: '',
      category: '',
      difficulty: 'medium',
    });
  };

  const reviewCard = (id: string, correct: boolean) => {
    setFlashcards(flashcards.map(card => 
      card.id === id 
        ? { 
            ...card, 
            reviewCount: card.reviewCount + 1, 
            correctCount: correct ? card.correctCount + 1 : card.correctCount,
            lastReviewed: new Date().toISOString().split('T')[0],
            isMastered: card.correctCount + (correct ? 1 : 0) >= 10,
          } 
        : card
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'hard': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getAccuracy = (card: Flashcard) => {
    return card.reviewCount > 0 ? Math.round((card.correctCount / card.reviewCount) * 100) : 0;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Flashcard Generation from Memories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create flashcards from your memories (Anki-style)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isGenerationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isGenerationEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Flashcards</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{flashcards.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Decks</p>
            <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{flashcardDecks.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mastered</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{flashcards.filter(f => f.isMastered).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Accuracy</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{Math.round(flashcards.reduce((acc, f) => acc + getAccuracy(f), 0) / flashcards.length)}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isGenerationEnabled}
              onChange={(e) => setIsGenerationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Generation</span>
          </div>
          <button
            type="button"
            onClick={addFlashcard}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Flashcard
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create Flashcard</h4>
          <div className="space-y-2">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-4 w-4 text-violet-400" />
                <span className="text-xs text-slate-900 dark:text-white">Front (Question)</span>
              </div>
              <textarea
                value={currentCard.front}
                onChange={(e) => setCurrentCard({ ...currentCard, front: e.target.value })}
                placeholder="Enter question..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Layers className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Back (Answer)</span>
              </div>
              <textarea
                value={currentCard.back}
                onChange={(e) => setCurrentCard({ ...currentCard, back: e.target.value })}
                placeholder="Enter answer..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Category</span>
              </div>
              <input
                type="text"
                value={currentCard.category}
                onChange={(e) => setCurrentCard({ ...currentCard, category: e.target.value })}
                placeholder="e.g., Places, Events..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-32"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Difficulty</span>
              </div>
              <select
                value={currentCard.difficulty}
                onChange={(e) => setCurrentCard({ ...currentCard, difficulty: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Flashcard Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-violet-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={flashcardSettings.autoGenerate}
                onChange={(e) => setFlashcardSettings({ ...flashcardSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Default Difficulty</span>
              </div>
              <select
                value={flashcardSettings.difficulty}
                onChange={(e) => setFlashcardSettings({ ...flashcardSettings, difficulty: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Batch Size</span>
              </div>
              <input
                type="number"
                value={flashcardSettings.batchSize}
                onChange={(e) => setFlashcardSettings({ ...flashcardSettings, batchSize: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Flashcard Decks</h4>
          <div className="space-y-2">
            {flashcardDecks.map((deck) => (
              <div key={deck.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-violet-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{deck.name}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{deck.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{deck.cardCount} cards</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Flashcards</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {flashcards.map((card) => (
              <div key={card.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-violet-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{card.front}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(card.difficulty)}`}>
                          {card.difficulty}
                        </span>
                        {card.isMastered && (
                          <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            Mastered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{card.memoryTitle} • {card.category}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold ${getAccuracy(card) >= 80 ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {getAccuracy(card)}%
                  </span>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Answer: {card.back}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => reviewCard(card.id, true)}
                    className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Correct
                  </button>
                  <button
                    type="button"
                    onClick={() => reviewCard(card.id, false)}
                    className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                  >
                    <RotateCw className="h-3 w-3" />
                    Review
                  </button>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{card.reviewCount} reviews</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Flashcard Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Generate flashcards from your memories</li>
              <li>• Organize into decks by category</li>
              <li>• Track mastery with spaced repetition</li>
              <li>• Difficulty levels: easy, medium, hard</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
