'use client';

import { useState } from 'react';
import { Users, Plus, Share2, X, Settings, Check, Lock, Clock, Eye, Sparkles, AlertTriangle } from 'lucide-react';

interface SharedAlbum {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  memories: string[];
  members: Array<{ id: string; name: string; role: 'owner' | 'editor' | 'viewer' }>;
  visibility: 'private' | 'public' | 'link';
  createdAt: Date;
  lastModified: Date;
}

interface SharedAlbumsProps {
  albums?: SharedAlbum[];
  onCreateAlbum?: (album: Omit<SharedAlbum, 'id' | 'createdAt' | 'lastModified'>) => Promise<void>;
  onEditAlbum?: (id: string, album: Partial<SharedAlbum>) => Promise<void>;
  onDeleteAlbum?: (id: string) => Promise<void>;
  onShareAlbum?: (id: string) => Promise<void>;
  onAddMemory?: (albumId: string, memoryId: string) => Promise<void>;
  onRemoveMemory?: (albumId: string, memoryId: string) => Promise<void>;
  onInviteMember?: (albumId: string, email: string, role: SharedAlbum['members'][0]['role']) => Promise<void>;
  onRemoveMember?: (albumId: string, memberId: string) => Promise<void>;
  onCancel?: () => void;
  isCreating?: boolean;
  isEditing?: boolean;
}

const DEFAULT_ALBUMS: SharedAlbum[] = [
  {
    id: 'album-1',
    name: 'Kỷ niệm gia đình',
    description: 'Tất cả kỷ niệm về gia đình',
    memories: ['1', '2', '3'],
    members: [
      { id: 'user-1', name: 'Nguyễn Văn A', role: 'owner' },
      { id: 'user-2', name: 'Trần Thị B', role: 'editor' },
    ],
    visibility: 'private',
    createdAt: new Date(),
    lastModified: new Date(),
  },
];

export default function SharedAlbums({
  albums = DEFAULT_ALBUMS,
  onCreateAlbum,
  onEditAlbum,
  onDeleteAlbum,
  onShareAlbum,
  onAddMemory,
  onRemoveMemory,
  onInviteMember,
  onRemoveMember,
  onCancel,
  isCreating = false,
  isEditing = false,
}: SharedAlbumsProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private' as SharedAlbum['visibility'],
  });
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingAlbumId, setSharingAlbumId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'viewer' | 'editor'>('viewer');

  const handleCreate = async () => {
    if (onCreateAlbum && formData.name) {
      await onCreateAlbum(formData);
      setShowCreateForm(false);
      resetForm();
    }
  };

  const handleEdit = async (id: string) => {
    if (onEditAlbum) {
      await onEditAlbum(id, formData);
      setEditingId(null);
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    if (onDeleteAlbum) {
      await onDeleteAlbum(id);
    }
  };

  const handleShare = async (id: string) => {
    if (onShareAlbum) {
      await onShareAlbum(id);
    }
  };

  const handleInvite = async (albumId: string) => {
    if (onInviteMember && inviteEmail) {
      await onInviteMember(albumId, inviteEmail, inviteRole);
      setInviteEmail('');
    }
  };

  const handleRemoveMember = async (albumId: string, memberId: string) => {
    if (onRemoveMember) {
      await onRemoveMember(albumId, memberId);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      visibility: 'private',
    });
  };

  const getVisibilityColor = (visibility: SharedAlbum['visibility']) => {
    switch (visibility) {
      case 'private':
        return 'from-green-400 to-emerald-500';
      case 'public':
        return 'from-blue-400 to-cyan-500';
      case 'link':
        return 'from-purple-400 to-indigo-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getVisibilityLabel = (visibility: SharedAlbum['visibility']) => {
    switch (visibility) {
      case 'private':
        return 'Riêng tư';
      case 'public':
        return 'Công khai';
      case 'link':
        return 'Link';
      default:
        return 'Riêng tư';
    }
  };

  const getRoleColor = (role: SharedAlbum['members'][0]['role']) => {
    switch (role) {
      case 'owner':
        return 'from-amber-400 to-orange-500';
      case 'editor':
        return 'from-blue-400 to-cyan-500';
      case 'viewer':
        return 'from-slate-400 to-slate-500';
      default:
        return 'from-slate-400 to-slate-500';
    }
  };

  const getRoleLabel = (role: SharedAlbum['members'][0]['role']) => {
    switch (role) {
      case 'owner':
        return 'Chủ';
      case 'editor':
        return 'Biên tập';
      case 'viewer':
        return 'Xem';
      default:
        return 'Xem';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Album chia sẻ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {albums.length} album
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            Tạo album
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

      {/* Create/Edit Form */}
      {(showCreateForm || editingId) && (
        <div className="mb-6 p-4 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">
            {editingId ? 'Chỉnh sửa album' : 'Tạo album mới'}
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tên album
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên album..."
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập mô tả album..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Quyền truy cập
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as SharedAlbum['visibility'] })}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="private">Riêng tư</option>
                <option value="public">Công khai</option>
                <option value="link">Link chia sẻ</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-4 border-t border-teal-200 dark:border-teal-800">
            <button
              type="button"
              onClick={editingId ? () => handleEdit(editingId) : handleCreate}
              disabled={!formData.name || isCreating || isEditing}
              className="flex-1 px-3 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {isCreating || isEditing ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo album'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="px-3 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Albums List */}
      <div className="space-y-3">
        {albums.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chưa có album chia sẻ nào
            </p>
          </div>
        ) : (
          albums.map((album) => (
            <div
              key={album.id}
              className="p-4 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getVisibilityColor(album.visibility)}`}>
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 text-sm">
                        {album.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 bg-gradient-to-r ${getVisibilityColor(album.visibility)} text-white text-[10px] font-bold rounded-full`}>
                          {getVisibilityLabel(album.visibility)}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-full">
                          {album.memories.length} kỷ niệm
                        </span>
                        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400 text-[10px] font-bold rounded-full">
                          {album.members.length} thành viên
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(album.id)}
                        className="p-1.5 hover:bg-teal-100 dark:hover:bg-teal-900 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Settings className="h-3 w-3 text-slate-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShare(album.id)}
                        className="p-1.5 hover:bg-teal-100 dark:hover:bg-teal-900 rounded-lg transition-colors"
                        title="Chia sẻ"
                      >
                        <Share2 className="h-3 w-3 text-slate-500" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(album.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                        title="Xóa album"
                      >
                        <X className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {album.description}
                  </p>

                  {/* Members */}
                  <div className="mb-2">
                    <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Thành viên:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {album.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-1 px-2 py-1 bg-slate-200 dark:bg-slate-600 rounded-full"
                        >
                          <span className="text-[10px] text-slate-600 dark:text-slate-400">{member.name}</span>
                          <span className={`px-1.5 py-0.5 bg-gradient-to-r ${getRoleColor(member.role)} text-white text-[8px] font-bold rounded-full`}>
                            {getRoleLabel(member.role)}
                          </span>
                          {member.role !== 'owner' && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(album.id, member.id)}
                              className="hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                            >
                              <X className="h-2 w-2 text-red-500" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invite Member */}
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Email thành viên..."
                      className="flex-1 px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    />
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as 'viewer' | 'editor')}
                      className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    >
                      <option value="viewer">Xem</option>
                      <option value="editor">Biên tập</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleInvite(album.id)}
                      disabled={!inviteEmail}
                      className="px-2 py-1 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Mời
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>Cập nhật: {new Date(album.lastModified).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Text */}
      <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-lg">
        <p className="text-[10px] text-teal-700 dark:text-teal-400">
          <strong>Lưu ý:</strong> Album chia sẻ cho phép bạn tạo album và chia sẻ với người khác. 
          Bạn có thể mời thành viên với các quyền truy cập khác nhau (chủ, biên tập, xem).
        </p>
      </div>
    </div>
  );
}