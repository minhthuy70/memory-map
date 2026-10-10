'use client';

import { useState } from 'react';

export default function ReminiscenceTherapy() {
  const [sessions, setSessions] = useState([
    { id: 1, prompt: 'Describe your favorite childhood memory', response: 'Playing in the park with friends...', completed: true },
    { id: 2, prompt: 'What was your first job like?', response: null, completed: false },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newSession, setNewSession] = useState({
    prompt: '',
    sensoryCue: '',
    moodBefore: '',
  });

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setSessions(prev => [
        ...prev,
        {
          id: prev.length + 1,
          prompt: newSession.prompt,
          response: null,
          completed: false,
        },
      ]);
      setNewSession({ prompt: '', sensoryCue: '', moodBefore: '' });
      setIsCreating(false);
    }, 1500);
  };

  const handleComplete = (id: number, response: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === id ? { ...session, response, completed: true } : session
      )
    );
  };

  const prompts = [
    'Describe your favorite childhood memory',
    'What was your first job like?',
    'Tell me about a memorable family vacation',
    'Describe your first day of school',
    'What was your favorite hobby as a child?',
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Reminiscence Therapy Workflow</h2>
      <p className="text-gray-600 mb-6">
        Structured reminiscence exercises for elderly cognitive stimulation and dementia/Alzheimer's care, sensory memory cues.
      </p>

      <div className="space-y-4">
        {/* Quick Prompts */}
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-3">Quick Prompt Suggestions</h3>
          <div className="grid grid-cols-2 gap-2">
            {prompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setNewSession({ ...newSession, prompt })}
                className="text-sm text-left p-2 bg-white rounded hover:bg-purple-100"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Create New Session */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Start New Therapy Session</h3>
          <textarea
            placeholder="Therapy prompt..."
            value={newSession.prompt}
            onChange={(e) => setNewSession({ ...newSession, prompt: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={2}
          />
          <select
            value={newSession.sensoryCue}
            onChange={(e) => setNewSession({ ...newSession, sensoryCue: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="">Select Sensory Cue (optional)</option>
            <option value="song">Song/Music</option>
            <option value="smell">Smell/Scent</option>
            <option value="location">Familiar Location</option>
            <option value="photo">Old Photo</option>
          </select>
          <select
            value={newSession.moodBefore}
            onChange={(e) => setNewSession({ ...newSession, moodBefore: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="">Current Mood (optional)</option>
            <option value="happy">Happy</option>
            <option value="sad">Sad</option>
            <option value="neutral">Neutral</option>
            <option value="anxious">Anxious</option>
          </select>
          <button
            onClick={handleCreate}
            disabled={isCreating || !newSession.prompt}
            className={`w-full py-2 rounded font-medium ${
              isCreating || !newSession.prompt
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isCreating ? 'Creating...' : 'Start Session'}
          </button>
        </div>

        {/* Sessions List */}
        <div>
          <h3 className="font-medium mb-3">Therapy Sessions</h3>
          <div className="space-y-3">
            {sessions.map(session => (
              <div
                key={session.id}
                className={`p-4 rounded border ${
                  session.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-medium">{session.prompt}</p>
                  {session.completed && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Completed</span>
                  )}
                </div>
                {session.completed ? (
                  <p className="text-sm text-gray-600">{session.response}</p>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      placeholder="Your response..."
                      className="w-full p-2 border rounded"
                      rows={2}
                      id={`response-${session.id}`}
                    />
                    <button
                      onClick={() => {
                        const response = (document.getElementById(`response-${session.id}`) as HTMLTextAreaElement).value;
                        handleComplete(session.id, response);
                      }}
                      className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                    >
                      Submit Response
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Benefits of Reminiscence Therapy:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Cognitive stimulation for elderly</li>
            <li>• Dementia/Alzheimer's care support</li>
            <li>• Mood improvement through positive memories</li>
            <li>• Sensory cues enhance memory recall</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
