'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Crown,
  Edit2,
  Filter,
  Info,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  User,
  Users
} from 'lucide-react';

interface UserRoleManagementProps {
  onCancel?: () => void;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
}

interface UserRole {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  assignedAt: string;
  assignedBy: string;
}

export default function UserRoleManagement({ onCancel }: UserRoleManagementProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'admin', permissions: ['all_access', 'user_management', 'content_moderation', 'system_settings'], userCount: 3 },
    { id: '2', name: 'moderator', permissions: ['content_moderation', 'user_view', 'report_management'], userCount: 12 },
    { id: '3', name: 'user', permissions: ['basic_access', 'create_memories', 'upload_photos'], userCount: 1250 },
  ]);

  const [userRoles, setUserRoles] = useState<UserRole[]>([
    { id: '1', username: 'admin_user', email: 'admin@example.com', role: 'admin', assignedAt: '2026-07-01', assignedBy: 'system' },
    { id: '2', username: 'moderator_1', email: 'mod1@example.com', role: 'moderator', assignedAt: '2026-08-15', assignedBy: 'admin_user' },
    { id: '3', username: 'moderator_2', email: 'mod2@example.com', role: 'moderator', assignedAt: '2026-08-20', assignedBy: 'admin_user' },
    { id: '4', username: 'john_doe', email: 'john@example.com', role: 'user', assignedAt: '2026-09-01', assignedBy: 'system' },
    { id: '5', username: 'jane_smith', email: 'jane@example.com', role: 'user', assignedAt: '2026-09-05', assignedBy: 'system' },
  ]);

  const filteredUsers = userRoles.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const updateRole = (userId: string) => {
    if (newRole) {
      setUserRoles(userRoles.map(user => user.id === userId ? {
        ...user,
        role: newRole as any,
        assignedAt: new Date().toISOString().split('T')[0],
        assignedBy: 'admin',
      } : user));
      setEditingUser(null);
      setNewRole('');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'moderator': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'user': return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3" />;
      case 'moderator': return <Shield className="h-3 w-3" />;
      case 'user': return <User className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              User Role Management
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage user roles and permissions
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
        <div className="grid grid-cols-3 gap-2">
          {roles.map((role) => (
            <div key={role.id} className="p-3 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getRoleIcon(role.name)}
                <span className="text-sm font-semibold text-slate-900 dark:text-white capitalize">{role.name}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{role.userCount} users</p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.slice(0, 2).map((perm) => (
                  <span key={perm} className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-1 rounded">
                    {perm}
                  </span>
                ))}
                {role.permissions.length > 2 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">+{role.permissions.length - 2}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex-1"
          />
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">User Roles</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{user.username}</span>
                      <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>Assigned: {user.assignedAt}</span>
                      <span>By: {user.assignedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingUser === user.id ? (
                    <>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="px-2 py-1 rounded text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => updateRole(user.id)}
                        className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                        className="px-2 py-1 rounded text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(user.id);
                        setNewRole(user.role);
                      }}
                      className="px-2 py-1 rounded text-xs bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 rounded-lg text-xs bg-purple-600 hover:bg-purple-700 text-white border-0 flex items-center gap-1">
            <Plus className="h-3 w-3" />
            Create Role
          </button>
          <button className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1">
            <Users className="h-3 w-3" />
            View Permissions
          </button>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Role Management Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Use principle of least privilege for access</li>
              <li>• Regularly review role assignments</li>
              <li>• Document role change reasons</li>
              <li>• Audit high-privilege role holders</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
