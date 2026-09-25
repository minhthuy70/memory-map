'use client';

import { useState } from 'react';
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  HelpCircle,
  Info,
  Plus,
  RefreshCw,
  Star,
  Target,
  Trophy
} from 'lucide-react';

interface QuizFromYourMemoriesProps {
  onCancel?: () => void;
}

interface QuizQuestion {
  id: string;
  memoryId: string;
  memoryTitle: string;
  question: string;
  options: string[];
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  createdAt: string;
}

interface QuizAttempt {
  id: string;
  quizId: string;
  date: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  duration: number;
}

interface QuizSettings {
  autoGenerate: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  questionCount: number;
  timeLimit: number;
}

export default function QuizFromYourMemories({ onCancel }: QuizFromYourMemoriesProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isQuizEnabled, setIsQuizEnabled] = useState(true);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    { id: '1', memoryId: 'mem_1', memoryTitle: 'Beach sunset', question: 'What was the main feature of the beach memory?', options: ['Sunset colors', 'Ocean waves', 'Sand castle', 'Sea shells'], correctAnswer: 'Sunset colors', difficulty: 'easy', category: 'Places', createdAt: '2024-01-17' },
    { id: '2', memoryId: 'mem_2', memoryTitle: 'Family dinner', question: 'Who was present at the family dinner?', options: ['Parents only', 'Everyone', 'Siblings only', 'Grandparents only'], correctAnswer: 'Everyone', difficulty: 'medium', category: 'Events', createdAt: '2024-01-16' },
    { id: '3', memoryId: 'mem_3', memoryTitle: 'Mountain hike', question: 'What year did the hiking trip take place?', options: ['2022', '2023', '2024', '2021'], correctAnswer: '2023', difficulty: 'easy', category: 'Activities', createdAt: '2024-01-15' },
  ]);

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([
    { id: '1', quizId: 'quiz_1', date: '2024-01-17', score: 85, totalQuestions: 20, correctAnswers: 17, duration: 15 },
    { id: '2', quizId: 'quiz_2', date: '2024-01-16', score: 90, totalQuestions: 15, correctAnswers: 14, duration: 12 },
  ]);

  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    autoGenerate: true,
    difficulty: 'mixed',
    questionCount: 10,
    timeLimit: 300,
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    memoryId: '',
    memoryTitle: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    category: '',
  });

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      memoryId: currentQuestion.memoryId || 'mem_' + Date.now(),
      memoryTitle: currentQuestion.memoryTitle,
      question: currentQuestion.question,
      options: currentQuestion.options.filter(o => o),
      correctAnswer: currentQuestion.correctAnswer,
      difficulty: currentQuestion.difficulty,
      category: currentQuestion.category,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuizQuestions([...quizQuestions, newQuestion]);
    setCurrentQuestion({
      memoryId: '',
      memoryTitle: '',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: 'medium',
      category: '',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'hard': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'mixed': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Quiz from Your Memories
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test your memory with generated quizzes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isQuizEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isQuizEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Questions</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{quizQuestions.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Quizzes Taken</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{quizAttempts.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Score</p>
            <p className={`text-lg font-bold ${getScoreColor(quizAttempts.length > 0 ? quizAttempts.reduce((acc, a) => acc + a.score, 0) / quizAttempts.length : 0)}`}>
              {quizAttempts.length > 0 ? Math.round(quizAttempts.reduce((acc, a) => acc + a.score, 0) / quizAttempts.length) : 0}%
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Duration</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{quizAttempts.length > 0 ? Math.round(quizAttempts.reduce((acc, a) => acc + a.duration, 0) / quizAttempts.length) : 0}min</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isQuizEnabled}
              onChange={(e) => setIsQuizEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Quiz</span>
          </div>
          <button
            type="button"
            onClick={addQuestion}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Question
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Create Quiz Question</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory Title</span>
              </div>
              <input
                type="text"
                value={currentQuestion.memoryTitle}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, memoryTitle: e.target.value })}
                placeholder="Enter memory title..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Question</span>
              </div>
              <textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                placeholder="Enter question..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Options (4 choices)</span>
              </div>
              <div className="space-y-1">
                {currentQuestion.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({ ...currentQuestion, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Correct Answer</span>
              </div>
              <select
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="">Select correct answer</option>
                {currentQuestion.options.filter(o => o).map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Difficulty</span>
              </div>
              <select
                value={currentQuestion.difficulty}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value as any })}
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
                <span className="text-xs text-slate-900 dark:text-white">Category</span>
              </div>
              <input
                type="text"
                value={currentQuestion.category}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, category: e.target.value })}
                placeholder="e.g., Places, Events..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-32"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quiz Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Generate</span>
              </div>
              <input
                type="checkbox"
                checked={quizSettings.autoGenerate}
                onChange={(e) => setQuizSettings({ ...quizSettings, autoGenerate: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Difficulty</span>
              </div>
              <select
                value={quizSettings.difficulty}
                onChange={(e) => setQuizSettings({ ...quizSettings, difficulty: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Question Count</span>
              </div>
              <input
                type="number"
                value={quizSettings.questionCount}
                onChange={(e) => setQuizSettings({ ...quizSettings, questionCount: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Time Limit (sec)</span>
              </div>
              <input
                type="number"
                value={quizSettings.timeLimit}
                onChange={(e) => setQuizSettings({ ...quizSettings, timeLimit: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quiz Questions</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {quizQuestions.map((question) => (
              <div key={question.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-4 w-4 text-orange-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{question.question}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{question.memoryTitle} • {question.category}</p>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {question.options.map((option) => (
                      <span key={option} className={`px-2 py-0.5 rounded text-xs ${option === question.correctAnswer ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quiz Attempts</h4>
          <div className="space-y-2">
            {quizAttempts.map((attempt) => (
              <div key={attempt.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-orange-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{attempt.date}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{attempt.totalQuestions} questions • {attempt.duration}min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${getScoreColor(attempt.score)}`}>{attempt.score}%</span>
                    <Award className="h-4 w-4 text-amber-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Quiz Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Generate quiz questions from memory details</li>
              <li>• Multiple choice questions with 4 options</li>
              <li>• Difficulty levels: easy, medium, hard</li>
              <li>• Track quiz attempts and scores</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
