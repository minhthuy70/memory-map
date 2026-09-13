'use client';

import { useState } from 'react';
import { Shield, X, Settings, CheckCircle, AlertTriangle, Clock, Activity, BarChart3, Filter, Zap, Calendar, Users, Lock, Unlock, Key, UserPlus, UserMinus, Check, X as XIcon } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  category: 'memory' | 'user' | 'settings' | 'content';
  description: string;
}

interface UserRole {
  userId: string;
  userName: string;
  roleId: string;
  assignedAt: Date;
}

interface RoleBasedAccessProps {
  onCancel?: () => void;
  onAssignRole?: (userId: string, roleId: string) => Promise<void>;
}

const DEFAULT_ROLES: Role[] = [
  {
    id: 'role-1',
    name: 'Admin',
    description: 'Full access to all features',
    permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_settings'],
    userCount: 2,
  },
  {
    id: 'role-2',
    name: 'Parent',
    description: 'Full access to family features',
    permissions: ['create', 'read', 'update', 'delete', 'manage_children'],
    userCount: 2,
  },
  {
    id: 'role-3',
    name: 'Child',
    description: 'Limited access with parental controls',
    permissions: ['create', 'read', 'update'],
    userCount: 2,
  },
  {
    id: 'role-4',
    name: 'Guest',
    description: 'Read-only access',
    permissions: ['read'],
    userCount: 1,
  },
];

const DEFAULT_PERMISSIONS: Permission[] = [
  {
    id: 'perm-1',
    name: 'create',
    category: 'memory',
    description: 'Create new memories',
  },
  {
    id: 'perm-2',
    name: 'read',
    category: 'memory',
    description: 'View memories',
  },
  {
    id: 'perm-3',
    name: 'update',
    category: 'memory',
    description: 'Edit memories',
  },
  {
    id: 'perm-4',
    name: 'delete',
    category: 'memory',
    description: 'Delete memories',
  },
  {
    id: 'perm-5',
    name: 'manage_users',
    category: 'user',
    description: 'Manage user accounts',
  },
  {
    id: 'perm-6',
    name: 'manage_settings',
    category: 'settings',
    description: 'Change system settings',
  },
  {
    id: 'perm-7',
    name: 'manage_children',
    category: 'user',
    description: 'Manage child accounts',
  },
];

const DEFAULT_USER_ROLES: UserRole[] = [
  {
    userId: 'user-1',
    userName: 'Dad',
    roleId: 'role-1',
    assignedAt: new Date('2023-01-01'),
  },
  {
    userId: 'user-2',
    userName: 'Mom',
    roleId: 'role-2',
    assignedAt: new Date('2023-01-02'),
  },
  {
    userId: 'user-3',
    userName: 'Tom',
    roleId: 'role-3',
    assignedAt: new Date('2023-06-15'),
  },
  {
    userId: 'user-4',
    userName: 'Emma',
    roleId: 'role-3',
    assignedAt: new Date('2023-06-15'),
  },
  {
    userId: 'user-5',
    userName: 'Guest User',
    roleId: 'role-4',
    assignedAt: new Date('2024-01-10'),
  },
];

export default function RoleBasedAccess({ onCancel, onAssignRole }: RoleBasedAccessProps) {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [permissions, setPermissions] = useState<Permission[]>(DEFAULT_PERMISSIONS);
  const [userRoles, setUserRoles] = useState<UserRole[]>(DEFAULT_USER_ROLES);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedRole, setSelectedRole] = useState('role-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const totalRoles = roles.length;
  const totalPermissions = permissions.length;
  const totalUsers = userRoles.length;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'memory':
        return 'text-blue-500';
      case 'user':
        return 'text-green-500';
      case 'settings':
        return 'text-purple-500';
      case 'content':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.includes(permissionId) || false;
  };

  const togglePermission = (roleId: string, permissionId: string) => {
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        const hasPerm = r.permissions.includes(permissionId);
        return {
          ...r,
          permissions: hasPerm
            ? r.permissions.filter(p => p !== permissionId)
            : [...r.permissions, permissionId],
        };
      }
      return r;
    }));
  };

  const handleAssignRole = async (userId: string, roleId: string) => {
    await onAssignRole?.(userId, roleId);
    setUserRoles(userRoles.map(ur =>
      ur.userId === userId ? { ...ur, roleId, assignedAt: new Date() } : ur
    ));
  };

  const filteredPermissions = selectedCategory === 'all'
    ? permissions
    : permissions.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Truy cập dựa trên vai trò
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {totalRoles} roles, {totalPermissions} permissions
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
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt role-based access
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Default role for new users
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Guest</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Permission inheritance
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Audit logging
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
            <Shield className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Roles</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalRoles}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Key className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Permissions</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalPermissions}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Users</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {totalUsers}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Protected</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {roles.reduce((sum, r) => sum + r.permissions.length, 0)}
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
          Select Role
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {roles.map(r => (
            <option key={r.id} value={r.id}>{r.name} ({r.userCount} users)</option>
          ))}
        </select>
      </div>

      {/* Permission Category Filter */}
      <div className="mb-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('memory')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'memory'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Memory
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('user')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('settings')}
            className={`flex-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              selectedCategory === 'settings'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Permission Matrix
        </h4>
        <div className="space-y-2">
          {filteredPermissions.map((permission) => (
            <div
              key={permission.id}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {permission.name}
                    </span>
                    <div className={`text-xs ${getCategoryColor(permission.category)} capitalize`}>
                      {permission.category}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => togglePermission(selectedRole, permission.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    hasPermission(selectedRole, permission.id)
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-slate-200 dark:bg-slate-600'
                  }`}
                >
                  {hasPermission(selectedRole, permission.id) ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <XIcon className="h-4 w-4 text-slate-500" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {permission.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Role Details */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Role Details
        </h4>
        <div className="p-4 rounded-lg border-2 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Role Name</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {roles.find(r => r.id === selectedRole)?.name}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Users</div>
              <div className="text-xs text-slate-700 dark:text-slate-300">
                {roles.find(r => r.id === selectedRole)?.userCount}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1">
            Description
          </div>
          <div className="text-xs text-slate-700 dark:text-slate-300">
            {roles.find(r => r.id === selectedRole)?.description}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 mb-1">
            Permissions ({roles.find(r => r.id === selectedRole)?.permissions.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {roles.find(r => r.id === selectedRole)?.permissions.map((perm) => (
              <span
                key={perm}
                className="px-2 py-1 text-[10px] rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* User Roles */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          User Role Assignments
        </h4>
        <div className="space-y-2">
          {userRoles.map((userRole) => (
            <div
              key={userRole.userId}
              className="p-4 rounded-lg border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {userRole.userName}
                  </span>
                </div>
                <select
                  value={userRole.roleId}
                  onChange={(e) => handleAssignRole(userRole.userId, e.target.value)}
                  className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                Assigned: {userRole.assignedAt.toLocaleDateString('vi-VN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Truy cập dựa trên vai trò cho phép phân quyền theo vai trò với role management, permission matrix, user-role assignment, và granular access control.
        </p>
      </div>
    </div>
  );
}