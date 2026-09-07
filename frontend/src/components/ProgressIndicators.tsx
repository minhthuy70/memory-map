'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Circle, Trophy, Target, Star, Zap } from 'lucide-react';

interface ProgressItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: any;
  category: 'basic' | 'intermediate' | 'advanced';
}

const progressItems: ProgressItem[] = [
  {
    id: 'first-memory',
    title: 'Tạo kỷ niệm đầu tiên',
    description: 'Tạo kỷ niệm đầu tiên trên bản đồ',
    completed: false,
    icon: CheckCircle,
    category: 'basic',
  },
  {
    id: 'add-image',
    title: 'Thêm ảnh',
    description: 'Thêm ít nhất 1 ảnh vào kỷ niệm',
    completed: false,
    icon: Star,
    category: 'basic',
  },
  {
    id: 'use-filters',
    title: 'Sử dụng bộ lọc',
    description: 'Sử dụng bộ lọc để tìm kỷ niệm',
    completed: false,
    icon: Target,
    category: 'basic',
  },
  {
    id: '5-memories',
    title: '5 kỷ niệm',
    description: 'Tạo 5 kỷ niệm',
    completed: false,
    icon: Trophy,
    category: 'intermediate',
  },
  {
    id: '10-memories',
    title: '10 kỷ niệm',
    description: 'Tạo 10 kỷ niệm',
    completed: false,
    icon: Trophy,
    category: 'intermediate',
  },
  {
    id: 'use-all-categories',
    title: 'Sử dụng tất cả danh mục',
    description: 'Tạo kỷ niệm với tất cả danh mục',
    completed: false,
    icon: Zap,
    category: 'advanced',
  },
  {
    id: 'use-all-moods',
    title: 'Sử dụng tất cả tâm trạng',
    description: 'Tạo kỷ niệm với tất cả tâm trạng',
    completed: false,
    icon: Star,
    category: 'advanced',
  },
];

export default function ProgressIndicators() {
  const [items, setItems] = useState<ProgressItem[]>(progressItems);
  const [memoryCount, setMemoryCount] = useState(0);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['basic']));

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem('progressIndicators');
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setItems(parsed.items || progressItems);
      setMemoryCount(parsed.memoryCount || 0);
    }

    // Load memory count
    const count = localStorage.getItem('memoryCount');
    if (count) {
      setMemoryCount(parseInt(count, 10));
    }
  }, []);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const updateProgress = (itemId: string, completed: boolean) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, completed } : item
    );
    setItems(updatedItems);
    localStorage.setItem('progressIndicators', JSON.stringify({
      items: updatedItems,
      memoryCount,
    }));
  };

  const calculateProgress = (category: string) => {
    const categoryItems = items.filter(item => item.category === category);
    const completed = categoryItems.filter(item => item.completed).length;
    return categoryItems.length > 0 ? (completed / categoryItems.length) * 100 : 0;
  };

  const totalProgress = items.filter(item => item.completed).length / items.length * 100;
  const completedCount = items.filter(item => item.completed).length;

  const categories = [
    { id: 'basic', name: 'Cơ bản', color: 'bg-blue-500' },
    { id: 'intermediate', name: 'Trung cấp', color: 'bg-green-500' },
    { id: 'advanced', name: 'Nâng cao', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Tiến độ khám phá</h3>
          </div>
          <span className="text-sm font-bold text-primary">
            {completedCount}/{items.length}
          </span>
        </div>
        
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        
        <p className="text-xs text-slate-600 dark:text-slate-400">
          {totalProgress < 30
            ? 'Bắt đầu khám phá các tính năng cơ bản!'
            : totalProgress < 70
            ? 'Tiếp tục khám phá để mở khóa thêm tính năng!'
            : 'Tuyệt vời! Bạn đã làm quen với hầu hết tính năng!'}
        </p>
      </div>

      {/* Category Progress */}
      {categories.map((category) => {
        const progress = calculateProgress(category.id);
        const isExpanded = expandedCategories.has(category.id);
        const categoryItems = items.filter(item => item.category === category.id);

        return (
          <div key={category.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                <span className="font-medium text-slate-900 dark:text-white text-sm">
                  {category.name}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ({categoryItems.filter(item => item.completed).length}/{categoryItems.length})
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                  <div
                    className={`${category.color} h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {Math.round(progress)}%
                </span>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3 animate-in slide-in-from-top-2">
                {categoryItems.map((item) => {
                  const Icon = item.completed ? CheckCircle : Circle;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <button
                        onClick={() => updateProgress(item.id, !item.completed)}
                        className="mt-0.5 shrink-0"
                        title={item.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            item.completed
                              ? 'text-green-500'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
