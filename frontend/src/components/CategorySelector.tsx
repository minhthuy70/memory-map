'use client';

import React from 'react';
import { Category } from '@/lib/categories-api';
import { Folder } from 'lucide-react';

interface CategorySelectorProps {
  categories: Category[];
  value: string;
  onChange: (categoryId: string) => void;
  label?: string;
  showUsageCount?: boolean;
}

export default function CategorySelector({
  categories,
  value,
  onChange,
  label = 'Danh mục',
  showUsageCount = false,
}: CategorySelectorProps) {
  const selectedCategory = categories.find((c) => c.id === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Folder className="h-3.5 w-3.5 text-primary" />
          <span>{label}</span>
        </label>
        {selectedCategory && (
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Đã chọn:</span>
            <span className="font-semibold text-slate-800 dark:text-white">
              {selectedCategory.icon} {selectedCategory.name}
            </span>
          </span>
        )}
      </div>

      {/* Grid / Flex layout for categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {categories.map((cat) => {
          const isSelected = cat.id === value;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(cat.id)}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer select-none text-xs sm:text-sm ${
                isSelected
                  ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 font-bold dark:border-primary dark:bg-primary/20 dark:text-primary-light'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <span className="text-lg shrink-0">{cat.icon}</span>
              <div className="min-w-0 flex-1">
                <span className="truncate block font-medium">{cat.name}</span>
                {showUsageCount && typeof cat.usageCount === 'number' && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                    {cat.usageCount} kỷ niệm
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
