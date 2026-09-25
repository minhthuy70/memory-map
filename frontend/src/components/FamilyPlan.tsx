'use client';

import { useState } from 'react';
import { Users, X, RefreshCw, Info, CheckCircle, Star, Zap, Shield, UserPlus } from 'lucide-react';

interface FamilyPlanProps {
  onCancel?: () => void;
}

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  joinedAt: string;
  isActive: boolean;
}

interface PlanFeature {
  id: string;
  name: string;
  description: string;
  isIncluded: boolean;
  value: string;
}

export default function FamilyPlan({ onCancel }: FamilyPlanProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', joinedAt: '2024-01-15', isActive: true },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'member', joinedAt: '2024-02-20', isActive: true },
    { id: '3', name: 'Child 1', email: 'child1@example.com', role: 'member', joinedAt: '2024-03-10', isActive: true },
    { id: '4', name: 'Child 2', email: 'child2@example.com', role: 'member', joinedAt: '2024-04-05', isActive: true },
    { id: '5', name: 'Guest', email: 'guest@example.com', role: 'member', joinedAt: '2024-05-01', isActive: false },
  ]);

  const [planFeatures, setPlanFeatures] = useState<PlanFeature[]>([
    { id: '1', name: 'Family Accounts', description: 'Up to 5 accounts', isIncluded: true, value: '5 accounts' },
    { id: '2', name: 'Shared Workspace', description: 'Collaborative family workspace', isIncluded: true, value: '1 workspace' },
    { id: '3', name: 'Storage Space', description: 'Combined family storage', isIncluded: true, value: '50GB' },
    { id: '4', name: 'Parental Controls', description: 'Content moderation for kids', isIncluded: true, value: 'Included' },
    { id: '5', name: 'Basic AI Features', description: 'AI features for family', isIncluded: true, value: '10 uses/day' },
    { id: '6', name: 'Video Support', description: 'Family video memories', isIncluded: true, value: 'Unlimited' },
    { id: '7', name: 'Advanced AI', description: 'Advanced AI features', isIncluded: false, value: 'Pro only' },
    { id: '8', name: 'Custom Domain', description: 'Custom domain branding', isIncluded: false, value: 'Enterprise only' },
  ]);

  const toggleFeature = (id: string) => {
    setPlanFeatures(planFeatures.map(feature => 
      feature.id === id ? { ...feature, isIncluded: !feature.isIncluded } : feature
    ));
  };

  const toggleMemberActive = (id: string) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === id ? { ...member, isActive: !member.isActive } : member
    ));
  };

  const addMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: 'New Member',
      email: 'new@example.com',
      role: 'member',
      joinedAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    setFamilyMembers([...familyMembers, newMember]);
  };

  const removeMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'member': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Family Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              5 accounts, shared workspace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-600 dark:text-green-400">$24.99/mo</span>
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Price</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">$24.99/mo</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Members</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{familyMembers.length}/5</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Storage</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">50GB</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Active</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{familyMembers.filter(m => m.isActive).length}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsSelected(!isSelected)}
            className={`px-3 py-1.5 rounded-lg text-xs border-0 flex items-center gap-1 ${isSelected ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-200 dark:bg-slate-700'} text-white`}
          >
            {isSelected ? <Check className="h-3 w-3" /> : <Star className="h-3 w-3" />}
            {isSelected ? 'Selected' : 'Select Plan'}
          </button>
          <button
            type="button"
            onClick={addMember}
            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 text-white border-0 flex items-center gap-1"
          >
            <UserPlus className="h-3 w-3" />
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
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Family Members ({familyMembers.length}/5)</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {familyMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{member.name}</span>
                      {member.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Active
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs ${getRoleColor(member.role)}`}>
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Joined: {member.joinedAt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleMemberActive(member.id)}
                    className={`px-2 py-1 rounded text-xs ${member.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                  >
                    {member.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Plan Features</h4>
          <div className="space-y-2">
            {planFeatures.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${feature.isIncluded ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    {feature.isIncluded && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{feature.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{feature.description}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold ${feature.isIncluded ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'}`}>
                  {feature.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Family Plan Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Family plan allows up to 5 accounts</li>
              <li>• Shared workspace for family collaboration</li>
              <li>• Parental controls for content moderation</li>
              <li>• 50GB storage for family memories</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
