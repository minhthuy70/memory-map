'use client';

import { useState } from 'react';

export default function MemoryPenpals() {
  const [penpalId, setPenpalId] = useState('');
  const [language, setLanguage] = useState('english');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [status, setStatus] = useState('pending');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Memory Pen-pals (Bạn bốn phương)</h3>
      <p className="text-gray-600 mb-4">Kết nối bạn bè qua câu chuyện kỷ niệm với translation và safety reporting</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Penpal ID</label>
          <input
            type="text"
            value={penpalId}
            onChange={(e) => setPenpalId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="penpal-user-id"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="english">English 🇬🇧</option>
            <option value="vietnamese">Vietnamese 🇻🇳</option>
            <option value="french">French 🇫🇷</option>
            <option value="spanish">Spanish 🇪🇸</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm">Anonymous Mode</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="pending">Pending ⏳</option>
            <option value="active">Active 💬</option>
            <option value="ended">Ended 🏁</option>
          </select>
        </div>

        <div className="bg-cyan-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Penpal Connection</h4>
          <div className="h-32 bg-gradient-to-b from-cyan-200 via-sky-300 to-blue-400 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">✉️</div>
              <span className="text-white font-bold text-lg">Memory Exchange</span>
              <div className="text-white text-sm capitalize">{status} • {isAnonymous ? 'Anonymous' : 'Public'}</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700"
        >
          {saved ? 'Saved!' : 'Connect Penpal'}
        </button>
      </div>
    </div>
  );
}
