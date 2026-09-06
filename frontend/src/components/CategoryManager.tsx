'use client';

import React, { useState } from 'react';
import { categoriesApi, Category, CreateCategoryData, UpdateCategoryData } from '@/lib/categories-api';
import { Folder, Plus, Edit2, Trash2, X, Save, Check } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
}

export default function CategoryManager({ categories, onCategoriesChange }: CategoryManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCategoryData | UpdateCategoryData>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!formData.name || !formData.icon) {
      setError('Vui lòng nhập tên và icon cho danh mục');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newCategory = await categoriesApi.create(formData as CreateCategoryData);
      onCategoriesChange([...categories, newCategory]);
      setIsCreating(false);
      setFormData({});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const updatedCategory = await categoriesApi.update(id, formData as UpdateCategoryData);
      onCategoriesChange(categories.map(cat => cat.id === id ? updatedCategory : cat));
      setEditingId(null);
      setFormData({});
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật danh mục');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    setLoading(true);
    setError('');

    try {
      await categoriesApi.delete(id);
      onCategoriesChange(categories.filter(cat => cat.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa danh mục');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({});
    setError('');
  };

  const ICONS = ['❤️', '👨‍👩‍👧', '👥', '🎓', '💼', '✈️', '🎉', '🌱', '⭐', '🎵', '🏠', '🚗', '🍔', '📚', '⚽', '🎮', '💡', '🔧', '🎨', '📱'];
  const COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#10b981', '#6b7280', '#6366f1'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Quản lý danh mục
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm mới</span>
        </button>
      </div>

      {error && (
        <div className="p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Create Form */}
      {isCreating && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tên danh mục</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Công việc"
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Icon</label>
              <select
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">Chọn icon</option>
                {ICONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Màu sắc</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    formData.color === color ? 'border-primary scale-110' : 'border-slate-300 dark:border-slate-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? <span>Đang tạo...</span> : <><Save className="h-3.5 w-3.5" /><span>Tạo danh mục</span></>}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600"
          >
            {editingId === category.id ? (
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  <select
                    value={formData.icon || ''}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    {ICONS.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-1">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-6 h-6 rounded border-2 transition-all ${
                        formData.color === color ? 'border-primary scale-110' : 'border-slate-300 dark:border-slate-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                  style={{ backgroundColor: `${category.color}20`, color: category.color }}
                >
                  {category.icon}
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{category.name}</span>
                  {category.usageCount > 0 && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">({category.usageCount} kỷ niệm)</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1">
              {editingId === category.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleUpdate(category.id)}
                    disabled={loading}
                    className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-1.5 bg-slate-400 hover:bg-slate-500 text-white rounded-lg transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
                    disabled={category.usageCount > 0}
                    className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={category.usageCount > 0 ? 'Không thể xóa danh mục đang sử dụng' : 'Xóa danh mục'}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}