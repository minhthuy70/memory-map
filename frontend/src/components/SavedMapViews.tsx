'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, Plus, Map as MapIcon } from 'lucide-react';

interface SavedMapView {
  id: string;
  name: string;
  center: [number, number];
  zoom: number;
  filters: {
    category?: string;
    mood?: string;
  };
  createdAt: string;
}

export default function SavedMapViews({
  currentView,
  onViewRestore,
}: {
  currentView: { center: [number, number]; zoom: number; filters: any };
  onViewRestore: (view: SavedMapView) => void;
}) {
  const [savedViews, setSavedViews] = useState<SavedMapView[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('savedMapViews');
    if (saved) {
      try {
        setSavedViews(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved views:', e);
      }
    }
  }, []);

  const handleSave = () => {
    if (!newViewName.trim()) return;

    const newView: SavedMapView = {
      id: Date.now().toString(),
      name: newViewName.trim(),
      center: currentView.center,
      zoom: currentView.zoom,
      filters: currentView.filters,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedViews, newView];
    setSavedViews(updated);
    localStorage.setItem('savedMapViews', JSON.stringify(updated));
    setIsCreating(false);
    setNewViewName('');
  };

  const handleDelete = (id: string) => {
    const updated = savedViews.filter((v) => v.id !== id);
    setSavedViews(updated);
    localStorage.setItem('savedMapViews', JSON.stringify(updated));
  };

  const handleRestore = (view: SavedMapView) => {
    onViewRestore(view);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="h-4 w-4 text-primary" />
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
            Chế độ xem đã lưu
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          title="Lưu chế độ xem hiện tại"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {isCreating && (
        <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg space-y-2">
          <input
            type="text"
            placeholder="Tên chế độ xem"
            value={newViewName}
            onChange={(e) => setNewViewName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {savedViews.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
            Chưa có chế độ xem nào được lưu
          </p>
        ) : (
          savedViews.map((view) => (
            <div
              key={view.id}
              className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-700/30 rounded-lg group hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-3.5 w-3.5 text-primary shrink-0" />
                  <h5 className="font-medium text-slate-900 dark:text-white text-xs truncate">
                    {view.name}
                  </h5>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {new Date(view.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleRestore(view)}
                  className="p-1.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
                  title="Khôi phục chế độ xem"
                >
                  <MapIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(view.id)}
                  className="p-1.5 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  title="Xóa chế độ xem"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
