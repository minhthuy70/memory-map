'use client';

import { useState } from 'react';

export default function FamilyTreeInteractive() {
  const [familyMembers, setFamilyMembers] = useState([
    { id: 1, name: 'Grandfather John', relationship: 'grandfather', birthYear: 1940, generation: 1 },
    { id: 2, name: 'Grandmother Mary', relationship: 'grandmother', birthYear: 1942, generation: 1 },
    { id: 3, name: 'Father Robert', relationship: 'father', birthYear: 1965, generation: 2, parentId: 1 },
    { id: 4, name: 'Mother Sarah', relationship: 'mother', birthYear: 1968, generation: 2 },
    { id: 5, name: 'You', relationship: 'self', birthYear: 1990, generation: 3, parentId: 3 },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: 'child',
    birthYear: 2020,
  });

  const handleAdd = () => {
    setIsAdding(true);
    setTimeout(() => {
      setFamilyMembers(prev => [
        ...prev,
        {
          id: prev.length + 1,
          name: newMember.name,
          relationship: newMember.relationship,
          birthYear: newMember.birthYear,
          generation: 4,
        },
      ]);
      setNewMember({ name: '', relationship: 'child', birthYear: 2020 });
      setIsAdding(false);
    }, 1500);
  };

  const getGenerationColor = (gen: number) => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100'];
    return colors[gen - 1] || 'bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Interactive Multi-generational Family Tree</h2>
      <p className="text-gray-600 mb-6">
        Ancestral family tree graph, attach memories and life locations to each family member, birthplaces map overlay.
      </p>

      <div className="space-y-4">
        {/* Family Tree Visualization */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium mb-3">Family Tree</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(gen => (
              <div key={gen} className="flex gap-2">
                <div className="w-24 text-sm font-medium pt-2">Gen {gen}</div>
                <div className="flex-1 flex gap-2">
                  {familyMembers
                    .filter(m => m.generation === gen)
                    .map(member => (
                      <div
                        key={member.id}
                        className={`flex-1 p-3 rounded text-center ${getGenerationColor(member.generation)}`}
                      >
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-gray-600">{member.birthYear}</p>
                        <p className="text-xs capitalize">{member.relationship}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Family Member */}
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-medium mb-3">Add Family Member</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={newMember.name}
              onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Birth Year"
              value={newMember.birthYear}
              onChange={(e) => setNewMember({ ...newMember, birthYear: parseInt(e.target.value) })}
              className="p-2 border rounded"
            />
          </div>
          <select
            value={newMember.relationship}
            onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
            className="w-full p-2 border rounded mb-3"
          >
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="child">Child</option>
            <option value="spouse">Spouse</option>
            <option value="grandparent">Grandparent</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={isAdding || !newMember.name}
            className={`w-full py-2 rounded font-medium ${
              isAdding || !newMember.name
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isAdding ? 'Adding...' : 'Add Member'}
          </button>
        </div>

        <div className="p-4 bg-green-50 rounded">
          <h4 className="font-medium text-green-800 mb-2">Family Tree Features:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Multi-generational visualization</li>
            <li>• Attach memories to family members</li>
            <li>• Birthplace map overlay</li>
            <li>• Lineage search and filtering</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
