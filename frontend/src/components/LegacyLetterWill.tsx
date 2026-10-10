'use client';

import { useState } from 'react';

export default function LegacyLetterWill() {
  const [letters, setLetters] = useState([
    { id: 1, recipientName: 'Daughter Emma', recipientEmail: 'emma@example.com', milestoneAge: 18, title: 'Letter to my daughter on her 18th birthday', isDelivered: false },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newLetter, setNewLetter] = useState({
    recipientName: '',
    recipientEmail: '',
    recipientBirthday: '',
    milestoneAge: 18,
    title: '',
    content: '',
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setLetters(prev => [
        ...prev,
        {
          id: prev.length + 1,
          recipientName: newLetter.recipientName,
          recipientEmail: newLetter.recipientEmail,
          recipientBirthday: newLetter.recipientBirthday,
          milestoneAge: newLetter.milestoneAge,
          title: newLetter.title,
          content: newLetter.content,
          isDelivered: false,
        },
      ]);
      setNewLetter({ recipientName: '', recipientEmail: '', recipientBirthday: '', milestoneAge: 18, title: '', content: '' });
      setIsAdding(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Legacy Letter & Digital Will</h2>
      <p className="text-gray-600 mb-6">
        Personal legacy letters to children on their 18th/30th birthday, designated memory beneficiary transfer, proof-of-life ping cycle.
      </p>

      <div className="space-y-4">
        {/* Create Letter */}
        <div className="bg-purple-50 p-4 rounded">
          <h3 className="font-medium mb-3">Write Legacy Letter</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Recipient Name"
              value={newLetter.recipientName}
              onChange={(e) => setNewLetter({ ...newLetter, recipientName: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Recipient Email"
              value={newLetter.recipientEmail}
              onChange={(e) => setNewLetter({ ...newLetter, recipientEmail: e.target.value })}
              className="p-2 border rounded"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="date"
              placeholder="Recipient Birthday"
              value={newLetter.recipientBirthday}
              onChange={(e) => setNewLetter({ ...newLetter, recipientBirthday: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newLetter.milestoneAge}
              onChange={(e) => setNewLetter({ ...newLetter, milestoneAge: parseInt(e.target.value) })}
              className="p-2 border rounded"
            >
              <option value={18}>18th Birthday</option>
              <option value={21}>21st Birthday</option>
              <option value={30}>30th Birthday</option>
              <option value={50}>50th Birthday</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Letter Title"
            value={newLetter.title}
            onChange={(e) => setNewLetter({ ...newLetter, title: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          />
          <textarea
            placeholder="Your message to the future..."
            value={newLetter.content}
            onChange={(e) => setNewLetter({ ...newLetter, content: e.target.value })}
            className="w-full p-2 border rounded mb-3"
            rows={5}
          />
          <button
            onClick={handleAdd}
            disabled={isAdding || !newLetter.recipientName || !newLetter.title || !newLetter.content}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newLetter.recipientName || !newLetter.title || !newLetter.content
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {isAdding ? 'Saving...' : 'Save Letter'}
          </button>
        </div>

        {/* Letters List */}
        <div>
          <h3 className="font-medium mb-3">Legacy Letters</h3>
          <div className="space-y-2">
            {letters.map(letter => (
              <div key={letter.id} className="p-4 bg-white border rounded">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{letter.title}</p>
                    <p className="text-sm text-gray-600">To: {letter.recipientName}</p>
                    <p className="text-sm text-gray-600">Deliver on: {letter.milestoneAge}th birthday</p>
                  </div>
                  {letter.isDelivered ? (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Delivered</span>
                  ) : (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded">Pending</span>
                  )}
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{letter.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded">
          <h4 className="font-medium text-blue-800 mb-2">Legacy Features:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Scheduled delivery on milestone birthdays</li>
            <li>• Designated memory beneficiary transfer</li>
            <li>• Proof-of-life ping cycle</li>
            <li>• Cryptographic time-lock sealing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
