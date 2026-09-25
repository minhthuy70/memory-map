'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  as,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Folder,
  Globe,
  Home,
  Image,
  ImageIcon,
  Lock,
  Plus,
  Settings,
  Share2,
  Star,
  Users,
  Zap
} from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  role: 'admin' | 'parent' | 'child' | 'guest';
  avatar: string;
  joinedAt: Date;
  lastActive: Date;
}

interface SharedMemory {
  id: string;
  title: string;
  type: 'image' | 'video' | 'text';
  createdBy: string;
  createdAt: Date;
  likes: number;
  comments: number;
  isFavorite: boolean;
}

interface FamilyActivity {
  id: string;
  type: 'memory_added' | 'member_joined' | 'comment_added' | 'memory_liked';
  description: string;
  user: string;
  timestamp: Date;
}

interface FamilyWorkspaceProps {
  onCancel?: () => void;
  onCreateMemory?: () => Promise<void>;
}

const DEFAULT_MEMBERS: FamilyMember[] = [
  {
    id: 'member-1',
    name: 'Dad',
    role: 'admin',
    avatar: '/dad.jpg',
    joinedAt: new Date('2023-01-01'),
    lastActive: new Date(),
  },
  {
    id: 'member-2',
    name: 'Mom',
    role: 'parent',
    avatar: '/mom.jpg',
    joinedAt: new Date('2023-01-02'),
    lastActive: new Date('2024-01-13'),
  },
  {
    id: 'member-3',
    name: 'Tom',
    role: 'child',
    avatar: '/tom.jpg',
    joinedAt: new Date('2023-06-15'),
    lastActive: new Date('2024-01-12'),
  },
  {
    id: 'member-4',
    name: 'Emma',
    role: 'child',
    avatar: '/emma.jpg',
    joinedAt: new Date('2023-06-15'),
    lastActive: new Date('2024-01-10'),
  },
];

const DEFAULT_MEMORIES: SharedMemory[] = [
  {
    id: 'memory-1',
    title: 'Family Vacation 2024',
    type: 'image',
    createdBy: 'Dad',
    createdAt: new Date('2024-01-05'),
    likes: 12,
    comments: 5,
    isFavorite: true,
  },
  {
    id: 'memory-2',
    title: 'PartyPopper Party',
    type: 'video',
    createdBy: 'Mom',
    createdAt: new Date('2024-01-08'),
    likes: 8,
    comments: 3,
    isFavorite: false,
  },
  {
    id: 'memory-3',
    title: 'Sunday Dinner',
    type: 'image',
    createdBy: 'Tom',
    createdAt: new Date('2024-01-10'),
    likes: 6,
    comments: 2,
    isFavorite: false,
  },
];

const DEFAULT_ACTIVITIES: FamilyActivity[] = [
  {
    id: 'activity-1',
    type: 'memory_added',
    description: 'added "Family Vacation 2024"',
    user: 'Dad',
    timestamp: new Date('2024-01-05'),
  },
  {
    id: 'activity-2',
    type: 'comment_added',
    description: 'commented on "PartyPopper Party"',
    user: 'Emma',
    timestamp: new Date('2024-01-09'),
  },
  {
    id: 'activity-3',
    type: 'memory_liked',
    description: 'liked "Sunday Dinner"',
    user: 'Mom',
    timestamp: new Date('2024-01-11'),
  },
];

export default function FamilyWorkspace({ onCancel, onCreateMemory }: FamilyWorkspaceProps) {
  const [members, setMembers] = useState<FamilyMember[]>(DEFAULT_MEMBERS);
  const [memories, setMemories] = useState<SharedMemory[]>(DEFAULT_MEMORIES);
  const [activities, setActivities] = useState<FamilyActivity[]>(DEFAULT_ACTIVITIES);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'memories' | 'members' | 'activities'>('memories');
  const [isPublic, setIsPublic] = useState(false);

  const memberCount = members.length;
  const memoryCount = memories.length;
  const activityCount = activities.length;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-500';
      case 'parent':
        return 'text-blue-500';
      case 'child':
        return 'text-green-500';
      case 'guest':
        return 'text-slate-500';
      default:
        return 'text-slate-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'video':
        return <Activity className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handleToggleFavorite = (memoryId: string) => {
    setMemories(memories.map(m => 
      m.id === memoryId ? { ...m, isFavorite: !m.isFavorite } : m
    ));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Không gian làm việc gia đình
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {memberCount} members, {memoryCount} memories
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
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

      {showSettings && (
        <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt family workspace
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Public workspace
              </span>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  isPublic ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    isPublic ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Auto-backup
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Activity notifications
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Members</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {memberCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Folder className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Memories</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {memoryCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Activities</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {activityCount}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            {isPublic ? <Globe className="h-3 w-3 text-slate-500" /> : <Lock className="h-3 w-3 text-slate-500" />}
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Visibility</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white capitalize">
            {isPublic ? 'Public' : 'Private'}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('memories')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'memories'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Memories
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'members'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Members
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activities')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'activities'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Activities
          </button>
        </div>
      </div>

      {/* Memories Tab */}
      {activeTab === 'memories' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
              Shared Memories
            </h4>
            <button
              type="button"
              onClick={onCreateMemory}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add Memory
            </button>
          </div>
          <div className="space-y-2">
            {memories.map((memory) => (
              <div
                key={memory.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${memory.isFavorite ? 'text-yellow-500' : 'text-slate-500'}`}>
                      {getTypeIcon(memory.type)}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {memory.title}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        by {memory.createdBy}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(memory.id)}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                  >
                    <Star className={`h-4 w-4 ${memory.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-slate-500'}`} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Likes</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {memory.likes}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Comments</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {memory.comments}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Created</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {memory.createdAt.toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Family Members
          </h4>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                      <Users className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {member.name}
                      </span>
                      <div className={`text-xs ${getRoleColor(member.role)} capitalize`}>
                        {member.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Joined</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {member.joinedAt.toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">Last Active</div>
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      {member.lastActive.toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="mb-4">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Recent Activities
          </h4>
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start gap-2 mb-2">
                  <Activity className="h-4 w-4 text-slate-500" />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {activity.user}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {' '}{activity.description}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  {activity.timestamp.toLocaleDateString('vi-VN')} at {activity.timestamp.toLocaleTimeString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg">
        <p className="text-[10px] text-orange-700 dark:text-orange-400">
          <strong>Lưu ý:</strong> Không gian làm việc gia đình cho phép gia đình tạo không gian chung để chia sẻ kỷ niệm với member management, shared memories, activity tracking, và role-based access.
        </p>
      </div>
    </div>
  );
}