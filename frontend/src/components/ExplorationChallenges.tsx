'use client';

import { useState } from 'react';

export default function ExplorationChallenges() {
  const [challengeType, setChallengeType] = useState('vietnam_provinces');
  const [progress, setProgress] = useState(25);
  const [targetCount, setTargetCount] = useState(63);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getChallengeInfo = () => {
    switch (challengeType) {
      case 'vietnam_provinces': return { name: '63 Vietnam Provinces', icon: '🇻🇳', target: 63 };
      case 'lighthouses': return { name: '10 Lighthouses', icon: '🗼', target: 10 };
      case 'extreme_poles': return { name: '4 Extreme Poles', icon: '🌍', target: 4 };
      default: return { name: 'Custom Challenge', icon: '🏆', target: targetCount };
    }
  };

  const info = getChallengeInfo();

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Travel & Exploration Challenges</h3>
      <p className="text-gray-600 mb-4">Thử thách check-in khám phá với badges và leaderboards</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Challenge Type</label>
          <select
            value={challengeType}
            onChange={(e) => setChallengeType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="vietnam_provinces">63 Vietnam Provinces 🇻🇳</option>
            <option value="lighthouses">10 Lighthouses 🗼</option>
            <option value="extreme_poles">4 Extreme Poles 🌍</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Progress: {progress}/{info.target}</label>
          <input
            type="range"
            min="0"
            max={info.target}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="bg-orange-50 p-4 rounded">
          <h4 className="font-semibold mb-2">Challenge Progress</h4>
          <div className="h-32 bg-gradient-to-b from-orange-200 via-amber-300 to-yellow-400 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">{info.icon}</div>
              <span className="text-white font-bold text-lg">{info.name}</span>
              <div className="text-white text-sm">{Math.round((progress / info.target) * 100)}% Complete</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
        >
          {saved ? 'Saved!' : 'Join Challenge'}
        </button>
      </div>
    </div>
  );
}
