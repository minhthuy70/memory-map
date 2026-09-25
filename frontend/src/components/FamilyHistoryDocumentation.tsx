'use client';

import { useState } from 'react';
import { Users, X, RefreshCw, Info, Calendar, FamilyTree, FileText, Star, Plus, BookOpen, Clock } from 'lucide-react';

interface FamilyHistoryDocumentationProps {
  onCancel?: () => void;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  birthDate?: string;
  deathDate?: string;
  location?: string;
  occupation?: string;
  biography?: string;
  photos?: number;
  memoriesLinked?: number;
}

interface FamilyEvent {
  id: string;
  date: string;
  eventType: 'birth' | 'marriage' | 'death' | 'migration' | 'milestone' | 'other';
  description: string;
  memberIds: string[];
  location?: string;
}

interface FamilySettings {
  autoLinkMemories: boolean;
  includePhotos: boolean;
  timelineView: boolean;
  privacyMode: boolean;
}

export default function FamilyHistoryDocumentation({ onCancel }: FamilyHistoryDocumentationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isDocumentationEnabled, setIsDocumentationEnabled] = useState(true);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'John Smith', relationship: 'Father', birthDate: '1950-05-15', deathDate: undefined, location: 'New York', occupation: 'Engineer', biography: 'Worked as an engineer for 40 years', photos: 5, memoriesLinked: 12 },
    { id: '2', name: 'Mary Smith', relationship: 'Mother', birthDate: '1952-08-20', deathDate: undefined, location: 'New York', occupation: 'Teacher', biography: 'Dedicated teacher at local school', photos: 8, memoriesLinked: 15 },
    { id: '3', name: 'Robert Smith', relationship: 'Grandfather', birthDate: '1925-03-10', deathDate: '2010-11-30', location: 'Chicago', occupation: 'Doctor', biography: 'Family physician for 50 years', photos: 3, memoriesLinked: 8 },
  ]);

  const [familyEvents, setFamilyEvents] = useState<FamilyEvent[]>([
    { id: '1', date: '1980-06-15', eventType: 'marriage', description: 'John and Mary got married', memberIds: ['1', '2'], location: 'New York' },
    { id: '2', date: '1950-05-15', eventType: 'birth', description: 'John Smith was born', memberIds: ['1'], location: 'Chicago' },
    { id: '3', date: '2010-11-30', eventType: 'death', description: 'Robert Smith passed away', memberIds: ['3'], location: 'Chicago' },
  ]);

  const [familySettings, setFamilySettings] = useState<FamilySettings>({
    autoLinkMemories: true,
    includePhotos: true,
    timelineView: true,
    privacyMode: false,
  });

  const [currentMember, setCurrentMember] = useState({
    name: '',
    relationship: '',
    birthDate: '',
    deathDate: '',
    location: '',
    occupation: '',
    biography: '',
  });

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: currentMember.name,
      relationship: currentMember.relationship,
      birthDate: currentMember.birthDate || undefined,
      deathDate: currentMember.deathDate || undefined,
      location: currentMember.location,
      occupation: currentMember.occupation,
      biography: currentMember.biography,
      photos: 0,
      memoriesLinked: 0,
    };
    setFamilyMembers([...familyMembers, newMember]);
    setCurrentMember({
      name: '',
      relationship: '',
      birthDate: '',
      deathDate: '',
      location: '',
      occupation: '',
      biography: '',
    });
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'birth': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'marriage': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      case 'death': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'migration': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'milestone': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'other': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Family History Documentation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Document family history along timeline
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs rounded ${isDocumentationEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {isDocumentationEnabled ? 'Enabled' : 'Disabled'}
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Members</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{familyMembers.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Events</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{familyEvents.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Photos</p>
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{familyMembers.reduce((acc, m) => acc + (m.photos || 0), 0)}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Linked Memories</p>
            <p className="text-lg font-bold text-pink-600 dark:text-pink-400">{familyMembers.reduce((acc, m) => acc + (m.memoriesLinked || 0), 0)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700">
            <input
              type="checkbox"
              checked={isDocumentationEnabled}
              onChange={(e) => setIsDocumentationEnabled(e.target.checked)}
              className="rounded"
            />
            <span className="text-slate-700 dark:text-slate-300">Enable Documentation</span>
          </div>
          <button
            type="button"
            onClick={addFamilyMember}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add Member
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Add Family Member</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Name</span>
              </div>
              <input
                type="text"
                value={currentMember.name}
                onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                placeholder="Enter name..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FamilyTree className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Relationship</span>
              </div>
              <input
                type="text"
                value={currentMember.relationship}
                onChange={(e) => setCurrentMember({ ...currentMember, relationship: e.target.value })}
                placeholder="e.g., Father, Mother, Grandfather..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Birth Date</span>
              </div>
              <input
                type="date"
                value={currentMember.birthDate}
                onChange={(e) => setCurrentMember({ ...currentMember, birthDate: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Death Date</span>
              </div>
              <input
                type="date"
                value={currentMember.deathDate}
                onChange={(e) => setCurrentMember({ ...currentMember, deathDate: e.target.value })}
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Location</span>
              </div>
              <input
                type="text"
                value={currentMember.location}
                onChange={(e) => setCurrentMember({ ...currentMember, location: e.target.value })}
                placeholder="City, Country..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Occupation</span>
              </div>
              <input
                type="text"
                value={currentMember.occupation}
                onChange={(e) => setCurrentMember({ ...currentMember, occupation: e.target.value })}
                placeholder="e.g., Engineer, Teacher..."
                className="px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 w-48"
              />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 mb-2">
                <Star className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Biography</span>
              </div>
              <textarea
                value={currentMember.biography}
                onChange={(e) => setCurrentMember({ ...currentMember, biography: e.target.value })}
                placeholder="Biographical information..."
                className="w-full px-2 py-1 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-0 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Family Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-amber-400" />
                <span className="text-xs text-slate-900 dark:text-white">Auto Link Memories</span>
              </div>
              <input
                type="checkbox"
                checked={familySettings.autoLinkMemories}
                onChange={(e) => setFamilySettings({ ...familySettings, autoLinkMemories: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Include Photos</span>
              </div>
              <input
                type="checkbox"
                checked={familySettings.includePhotos}
                onChange={(e) => setFamilySettings({ ...familySettings, includePhotos: e.target.checked })}
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-xs text-slate-900 dark:text-white">Timeline View</span>
              </div>
              <input
                type="checkbox"
                checked={familySettings.timelineView}
                onChange={(e) => setFamilySettings({ ...familySettings, timelineView: e.target.checked })}
                className="rounded"
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Family Members</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {familyMembers.map((member) => (
              <div key={member.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-amber-400" />
                    <div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{member.name}</span>
                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">({member.relationship})</span>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {member.birthDate && `Born: ${member.birthDate}`}
                    {member.deathDate && ` • Died: ${member.deathDate}`}
                  </p>
                  {member.location && <p className="text-xs text-slate-500 dark:text-slate-400">Location: {member.location}</p>}
                  {member.occupation && <p className="text-xs text-slate-500 dark:text-slate-400">Occupation: {member.occupation}</p>}
                </div>
                {member.biography && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">{member.biography}</p>
                )}
                <div className="flex gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{member.photos || 0} photos</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{member.memoriesLinked || 0} memories</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Family Events Timeline</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {familyEvents.map((event) => (
              <div key={event.id} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-amber-400" />
                    <span className="text-xs text-slate-900 dark:text-white">{event.date}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getEventTypeColor(event.eventType)}`}>
                      {event.eventType}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{event.location}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{event.description}</p>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Family History Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Document family members with biographical information</li>
              <li>• Track family events along timeline</li>
              <li>• Link photos and memories to family members</li>
              <li>• Event types: birth, marriage, death, migration, milestone</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
