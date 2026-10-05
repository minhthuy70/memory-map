'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface AIInterview {
  id: string;
  question: string;
  answer: string | null;
  audioUrl: string | null;
  duration: number | null;
  isCompleted: boolean;
  createdAt: string;
  completedAt: string | null;
}

export default function AIBiographerInterviewer() {
  const { token } = useAuth();
  const [interviews, setInterviews] = useState<AIInterview[]>([]);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);
  const [currentInterview, setCurrentInterview] = useState<AIInterview | null>(null);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, [token, showCompletedOnly]);

  const fetchInterviews = async () => {
    try {
      const url = showCompletedOnly
        ? 'http://localhost:3001/ai-companion/interviews?completedOnly=true'
        : 'http://localhost:3001/ai-companion/interviews';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    }
  };

  const generateQuestion = async () => {
    try {
      await fetch('http://localhost:3001/ai-companion/interviews/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      await fetchInterviews();
    } catch (error) {
      console.error('Failed to generate question:', error);
    }
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInterview || !answer.trim()) return;

    try {
      await fetch(`http://localhost:3001/ai-companion/interviews/${currentInterview.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answer,
          isCompleted: true,
        }),
      });

      setCurrentInterview(null);
      setAnswer('');
      await fetchInterviews();
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const deleteInterview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview?')) return;

    try {
      await fetch(`http://localhost:3001/ai-companion/interviews/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchInterviews();
    } catch (error) {
      console.error('Failed to delete interview:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">AI Biographer Voice Interviewer</h2>
        <button
          onClick={generateQuestion}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          ✨ Generate New Question
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          id="showCompletedOnly"
          checked={showCompletedOnly}
          onChange={(e) => setShowCompletedOnly(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="showCompletedOnly" className="text-sm text-gray-700">
          Show completed interviews only
        </label>
      </div>

      {/* Current Interview */}
      {currentInterview && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
          <h3 className="text-lg font-semibold text-purple-800 mb-3">Current Question</h3>
          <p className="text-lg text-gray-800 mb-4 italic">"{currentInterview.question}"</p>

          <form onSubmit={submitAnswer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Share your thoughts and memories..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Submit Answer
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentInterview(null);
                  setAnswer('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Skip
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Interviews ({interviews.length})
        </h3>

        {interviews.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">
            No interviews yet. Click "Generate New Question" to start your life story interview.
          </p>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className={`p-4 border rounded-lg transition-colors ${
                  interview.isCompleted
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        interview.isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {interview.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-800 font-medium mb-2 italic">
                      "{interview.question}"
                    </p>

                    {interview.answer && (
                      <div className="mt-3 p-3 bg-white rounded">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                          {interview.answer}
                        </p>
                      </div>
                    )}

                    {interview.audioUrl && (
                      <div className="mt-2">
                        <audio controls className="w-full h-8">
                          <source src={interview.audioUrl} type="audio/mpeg" />
                        </audio>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {!interview.isCompleted && (
                      <button
                        onClick={() => setCurrentInterview(interview)}
                        className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm transition-colors"
                      >
                        Answer
                      </button>
                    )}
                    <button
                      onClick={() => deleteInterview(interview.id)}
                      className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <h4 className="font-semibold text-purple-800 mb-2">About the AI Biographer</h4>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Friendly conversational AI interviewer</li>
          <li>• Asks thought-provoking life questions</li>
          <li>• Transcribes & crafts your life story</li>
          <li>• Perfect for creating personal memoirs</li>
        </ul>
      </div>
    </div>
  );
}
