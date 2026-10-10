'use client';

import { useState } from 'react';

export default function InnerChildDialogue() {
  const [dialogues, setDialogues] = useState([
    { id: 1, age: 8, prompt: 'What made you happy at this age?', response: 'Playing with my dog...', emotionalTone: 'compassionate' },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newDialogue, setNewDialogue] = useState({
    age: 10,
    prompt: '',
    response: '',
    emotionalTone: 'compassionate',
    reflectionType: 'healing',
  });

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setDialogues(prev => [
        ...prev,
        {
          id: prev.length + 1,
          age: newDialogue.age,
          prompt: newDialogue.prompt,
          response: newDialogue.response,
          emotionalTone: newDialogue.emotionalTone,
        },
      ]);
      setNewDialogue({ age: 10, prompt: '', response: '', emotionalTone: 'compassionate', reflectionType: 'healing' });
      setIsCreating(false);
    }, 1500);
  };

  const getEmotionalToneIcon = (tone: string) => {
    switch (tone) {
      case 'compassionate': return '💕';
      case 'curious': return '🤔';
      case 'sad': return '😢';
      case 'hopeful': return '🌟';
      default: return '💭';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Inner Child Dialogue Space</h2>
      <p className="text-gray-600 mb-6">
        Guided journaling prompts addressed to childhood photos, healing past wounds, milestone reflection, compassionate self-dialogue.
      </p>

      <div className="space-y-4">
        {/* Create New Dialogue */}
        <div className="bg-pink-50 p-4 rounded">
          <h3 className="font-medium mb-3">Start Dialogue with Your Inner Child</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-sm mb-1">Age</label>
              <input
                type="number"
                value={newDialogue.age}
                onChange={(e) => setNewDialogue({ ...newDialogue, age: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                min={1}
                max={18}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Emotional Tone</label>
              <select
                value={newDialogue.emotionalTone}
                onChange={(e) => setNewDialogue({ ...newDialogue, emotionalTone: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="compassionate">Compassionate 💕</option>
                <option value="curious">Curious 🤔</option>
                <option value="sad">Sad 😢</option>
                <option value="hopeful">Hopeful 🌟</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm mb-1">Reflection Type</label>
            <select
              value={newDialogue.reflectionType}
              onChange={(e) => setNewDialogue({ ...newDialogue, reflectionType: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="healing">Healing Past Wounds</option>
              <option value="milestone">Milestone Reflection</option>
              <option value="gratitude">Gratitude to Younger Self</option>
            </select>
          </div>
          <textarea
            placeholder="Prompt for your inner child..."
            value={newDialogue.prompt}
            onChange={(e) => setNewDialogue({ ...newDialogue, prompt: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={2}
          />
          <textarea
            placeholder="Your response / dialogue..."
            value={newDialogue.response}
            onChange={(e) => setNewDialogue({ ...newDialogue, response: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={3}
          />
          <button
            onClick={handleCreate}
            disabled={isCreating || !newDialogue.prompt || !newDialogue.response}
            className={`w-full py-2 rounded font-medium ${
              isCreating || !newDialogue.prompt || !newDialogue.response
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {isCreating ? 'Saving...' : 'Save Dialogue'}
          </button>
        </div>

        {/* Dialogues List */}
        <div>
          <h3 className="font-medium mb-3">Past Dialogues</h3>
          <div className="space-y-3">
            {dialogues.map(dialogue => (
              <div key={dialogue.id} className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded border border-pink-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{getEmotionalToneIcon(dialogue.emotionalTone)}</span>
                  <div>
                    <p className="font-medium">Age {dialogue.age}</p>
                    <p className="text-xs text-gray-600 capitalize">{dialogue.emotionalTone}</p>
                  </div>
                </div>
                <div className="bg-white p-3 rounded mb-2">
                  <p className="text-sm text-gray-600 mb-1">Prompt:</p>
                  <p className="text-sm">{dialogue.prompt}</p>
                </div>
                <div className="bg-white p-3 rounded">
                  <p className="text-sm text-gray-600 mb-1">Response:</p>
                  <p className="text-sm">{dialogue.response}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-purple-50 rounded">
          <h4 className="font-medium text-purple-800 mb-2">Healing Through Inner Child Work:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Address childhood wounds with compassion</li>
            <li>• Reconnect with your younger self</li>
            <li>• Heal past trauma through dialogue</li>
            <li>• Celebrate milestones and growth</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
