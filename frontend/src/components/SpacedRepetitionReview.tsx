'use client';

import { useState } from 'react';
import { Repeat, X, RefreshCw, Info, Clock, Star, Plus, CheckCircle, Target, TrendingUp, Calendar, Edit } from 'lucide-react';

interface SpacedRepetitionReviewProps {
  onCancel?: () => void;
}

interface ReviewItem {
  id: string;
  memoryId: string;
  memoryTitle: string;
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReview: string;
  lastReviewed?: string;
  status: 'new' | 'learning' | 'review' | 'relearning';
  grade?: number;
}

interface ReviewSession {
  id: string;
  date: string;
  itemsReviewed: number;
  correct: number;
  incorrect: number;
  avgGrade: number;
  duration: number;
}

interface SpacedRepetitionSettings {
  algorithm: 'SM2' | 'FSRS' | 'Anki';
  newCardsPerDay: number;
  reviewsPerDay: number;
  easeFactor: number;
  intervalModifier: number;
}

export default function SpacedRepetitionReview({ onCancel }: SpacedRepetitionReviewProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isReviewEnabled, setIsReviewEnabled] = useState(true);

  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([
    { id: '1', memoryId: 'mem_1', memoryTitle: 'Beach sunset', interval: 7, easeFactor: 2.5, repetitions: 5, nextReview: '2024-01-17', lastReviewed: '2024-01-10', status: 'review', grade: 4 },
    { id: '2', memoryId: 'mem_2', memoryTitle: 'Family dinner', interval: 14, easeFactor: 2.8, repetitions: 8, nextReview: '2024-01-18', lastReviewed: '2024-01-04', status: 'review', grade: 5 },
    { id: '3', memoryId: 'mem_3', memoryTitle: 'Mountain hike', interval: 3, easeFactor: 2.2, repetitions: 2, nextReview: '2024-01-16', lastReviewed: '2024-01-13', status: 'learning', grade: 3 },
  ]);

  const [reviewSessions, setReviewSessions] = useState<ReviewSession[]>([
    { id: '1', date: '2024-01-17', itemsReviewed: 15, correct: 12, incorrect: 3, avgGrade: 4.2, duration: 25 },
    { id: '2', date: '2024-01-16', itemsReviewed: 20, correct: 18, incorrect: 2, avgGrade: 4.5, duration: 30 },
  ]);

  const [srSettings, setSrSettings] = useState<SpacedRepetitionSettings>({
    algorithm: 'SM2',
    newCardsPerDay: 20,
    reviewsPerDay: 100,
    easeFactor: 2.5,
    intervalModifier: 1.0,
  });

  const [currentReview, setCurrentReview] = useState({
    memoryId: '',
    memoryTitle: '',
    interval: 1,
    easeFactor: 2.5,
    repetitions: 0,
    status: 'new' as 'new' | 'learning' | 'review' | 'relearning',
  });

  const addReviewItem = () => {
    const newItem: ReviewItem = {
      id: Date.now().toString(),
      memoryId: currentReview.memoryId || 'mem_' + Date.now(),
      memoryTitle: currentReview.memoryTitle,
      interval: currentReview.interval,
      easeFactor: currentReview.easeFactor,
      repetitions: currentReview.repetitions,
      nextReview: new Date(Date.now() + currentReview.interval * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: currentReview.status,
    };
    setReviewItems([...reviewItems, newItem]);
    setCurrentReview({
      memoryId: '',
      memoryTitle: '',
      interval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      status: 'new',
    });
  };

  const gradeItem = (id: string, grade: number) => {
    setReviewItems(reviewItems.map(item => {
      if (item.id !== id) return item;
      
      let newInterval = item.interval;
      let newEaseFactor = item.easeFactor;
      let newRepetitions = item.repetitions + 1;
      
      // Simplified SM-2 algorithm
      if (grade >= 3) {
        if (newRepetitions === 1) {
          newInterval = 1;
        } else if (newRepetitions === 2) {
          newInterval = 6;
        } else {
          newInterval = Math.round(item.interval * item.easeFactor);
        }
        newEaseFactor = item.easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
        if (newEaseFactor < 1.3) newEaseFactor = 1.3;
      } else {
        newRepetitions = 0;
        newInterval = 1;
      }
      
      const nextReviewDate = new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      return {
        ...item,
        interval: newInterval,
        easeFactor: newEaseFactor,
        repetitions: newRepetitions,
        nextReview: nextReviewDate,
        lastReviewed: new Date().toISOString().split('T')[0],
        grade,
        status: newRepetitions === 0 ? 'relearning' : 'review',
      };
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'learning': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'review': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'relearning': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getDueToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return reviewItems.filter(item => item.nextReview <= today).length;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl">
            <Repeat className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Spaced Repetition Review
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Review memories with optimal intervals
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isReviewEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isReviewEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Due Today</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{getDueToday()}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Items</p>
            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{reviewItems.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Ease</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400">{(reviewItems.reduce((acc, i) => acc + i.easeFactor, 0) / reviewItems.length).toFixed(2)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Avg Interval</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{Math.round(reviewItems.reduce((acc, i) => acc + i.interval, 0) / reviewItems.length)}d</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isReviewEnabled}
              onChange={(e) => setIsReviewEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Review</span>
          </div>
          <button
            type="button"
            onClick={addReviewItem}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Item
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Review Item</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Memory Title</span>
              </div>
              <input
                type="text"
                value={currentReview.memoryTitle}
                onChange={(e) => setCurrentReview({ ...currentReview, memoryTitle: e.target.value })}
                placeholder="Enter memory title..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Interval (days)</span>
              </div>
              <input
                type="number"
                value={currentReview.interval}
                onChange={(e) => setCurrentReview({ ...currentReview, interval: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Ease Factor</span>
              </div>
              <input
                type="number"
                step="0.1"
                value={currentReview.easeFactor}
                onChange={(e) => setCurrentReview({ ...currentReview, easeFactor: parseFloat(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Status</span>
              </div>
              <select
                value={currentReview.status}
                onChange={(e) => setCurrentReview({ ...currentReview, status: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="new">New</option>
                <option value="learning">Learning</option>
                <option value="review">Review</option>
                <option value="relearning">Relearning</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Spaced Repetition Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Repeat className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-slate-900 dark:text-white">Algorithm</span>
              </div>
              <select
                value={srSettings.algorithm}
                onChange={(e) => setSrSettings({ ...srSettings, algorithm: e.target.value as any })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              >
                <option value="SM2">SM-2</option>
                <option value="FSRS">FSRS</option>
                <option value="Anki">Anki</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">New Cards/Day</span>
              </div>
              <input
                type="number"
                value={srSettings.newCardsPerDay}
                onChange={(e) => setSrSettings({ ...srSettings, newCardsPerDay: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Reviews/Day</span>
              </div>
              <input
                type="number"
                value={srSettings.reviewsPerDay}
                onChange={(e) => setSrSettings({ ...srSettings, reviewsPerDay: parseInt(e.target.value) })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-20"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Review Items</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {reviewItems.map((item) => (
              <div key={item.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Repeat className="h-4 w-4 text-pink-400" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.memoryTitle}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Interval: {item.interval}d • Ease: {item.easeFactor.toFixed(2)} • Reps: {item.repetitions}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Next: {item.nextReview}</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => gradeItem(item.id, grade)}
                      className={`px-2 py-1 rounded text-xs ${
                        grade <= 2 ? 'bg-red-600 hover:bg-red-700' : 
                        grade === 3 ? 'bg-amber-600 hover:bg-amber-700' : 
                        'bg-green-600 hover:bg-green-700'
                      } text-white border-0`}
                    >
                      {grade}
                    </button>
                  ))}
                  {item.grade && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Last: {item.grade}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Review Sessions</h4>
          <div className="space-y-2">
            {reviewSessions.map((session) => (
              <div key={session.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-pink-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{session.date}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{session.itemsReviewed} items • {session.duration}min</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 dark:text-green-400">{session.correct} correct</span>
                    <span className="text-xs text-red-600 dark:text-red-400">{session.incorrect} incorrect</span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{session.avgGrade} avg</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Spaced Repetition Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Review memories at optimal intervals using SM-2 algorithm</li>
              <li>• Grade responses 1-5 to adjust intervals</li>
              <li>• Track ease factor and repetitions</li>
              <li>• Status: new, learning, review, relearning</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
