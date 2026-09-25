'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Plus, FileText } from 'lucide-react';

interface MemoryTemplate {
  id: string;
  name: string;
  defaultCategory: string;
  defaultMood: string;
  defaultContent?: string;
}

const DEFAULT_TEMPLATES: MemoryTemplate[] = [
  {
    id: '1',
    name: 'Kỷ niệm du lịch',
    defaultCategory: 'Travel',
    defaultMood: 'HAPPY',
    defaultContent: 'Đã đến thăm...',
  },
  {
    id: '2',
    name: 'Kỷ niệm gia đình',
    defaultCategory: 'Family',
    defaultMood: 'LOVE',
    defaultContent: 'Một ngày đáng nhớ với gia đình...',
  },
];

export default function MemoryTemplates() {
  const [templates, setTemplates] = useState<MemoryTemplate[]>(DEFAULT_TEMPLATES);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<MemoryTemplate>>({
    name: '',
    defaultCategory: '',
    defaultMood: '',
    defaultContent: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('memoryTemplates');
    if (saved) {
      try {
        setTemplates(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse templates:', e);
      }
    }
  }, []);

  const handleCreate = () => {
    if (!newTemplate.name || !newTemplate.defaultCategory || !newTemplate.defaultMood) {
      return;
    }

    const template: MemoryTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      defaultCategory: newTemplate.defaultCategory,
      defaultMood: newTemplate.defaultMood,
      defaultContent: newTemplate.defaultContent,
    };

    const updated = [...templates, template];
    setTemplates(updated);
    localStorage.setItem('memoryTemplates', JSON.stringify(updated));
    setIsCreating(false);
    setNewTemplate({ name: '', defaultCategory: '', defaultMood: '', defaultContent: '' });
  };

  const handleDelete = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    setTemplates(updated);
    localStorage.setItem('memoryTemplates', JSON.stringify(updated));
  };

  const handleApply = (template: MemoryTemplate) => {
    // Emit event or store in session storage for the memory form to pick up
    sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
    // Navigate to new memory page
    window.location.href = '/memories/new';
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
            Mẫu kỷ niệm
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(!isCreating)}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
          title="Tạo mẫu mới"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {isCreating && (
        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Tên mẫu"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={newTemplate.defaultCategory}
            onChange={(e) => setNewTemplate({ ...newTemplate, defaultCategory: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Chọn danh mục mặc định</option>
            <option value="Love">Love (❤️)</option>
            <option value="Family">Family (👨‍👩‍👧)</option>
            <option value="Friends">Friends (👥)</option>
            <option value="Study">Study (🎓)</option>
            <option value="Work">Work (💼)</option>
            <option value="Travel">Travel (✈️)</option>
            <option value="Event">Event (🎉)</option>
            <option value="Personal">Personal (🌱)</option>
            <option value="Other">Other (⭐)</option>
          </select>
          <select
            value={newTemplate.defaultMood}
            onChange={(e) => setNewTemplate({ ...newTemplate, defaultMood: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Chọn tâm trạng mặc định</option>
            <option value="HAPPY">Vui vẻ (😊)</option>
            <option value="SAD">Buồn (😢)</option>
            <option value="EXCITED">Hào hứng (🤩)</option>
            <option value="PEACEFUL">Bình yên (😌)</option>
            <option value="NOSTALGIC">Hoài niệm (🥹)</option>
            <option value="LOVE">Yêu thương (❤️)</option>
            <option value="ANGRY">Giận dữ (😡)</option>
            <option value="TIRED">Mệt mỏi (😴)</option>
            <option value="NEUTRAL">Trung lập (😐)</option>
          </select>
          <textarea
            placeholder="Nội dung mặc định (tùy chọn)"
            value={newTemplate.defaultContent}
            onChange={(e) => setNewTemplate({ ...newTemplate, defaultContent: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              className="flex-1 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Tạo mẫu
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 py-2 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {templates.length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center py-4">
            Chưa có mẫu nào. Tạo mẫu để lưu cấu hình mặc định.
          </p>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg group hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                  {template.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {template.defaultCategory} • {template.defaultMood}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleApply(template)}
                  className="p-1.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
                  title="Áp dụng mẫu"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(template.id)}
                  className="p-1.5 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  title="Xóa mẫu"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-1 pt-2 border-t border-slate-200 dark:border-slate-700">
        <p>• Áp dụng mẫu để điền trước thông tin khi tạo kỷ niệm mới</p>
        <p>• Các mẫu được lưu trên trình duyệt của bạn</p>
      </div>
    </div>
  );
}
