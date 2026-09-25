'use client';

import { useState, useEffect } from 'react';
import { X, Lightbulb, MapPin, Image, Filter, TrendingUp, Share2, Download, ChevronRight } from 'lucide-react';

interface TutorialCard {
  id: string;
  icon: any;
  title: string;
  description: string;
  action: string;
  actionUrl: string;
  priority: 'high' | 'medium' | 'low';
}

const tutorialCards: TutorialCard[] = [
  {
    id: 'first-memory',
    icon: MapPin,
    title: 'Tạo kỷ niệm đầu tiên',
    description: 'Bắt đầu hành trình của bạn bằng cách tạo kỷ niệm đầu tiên trên bản đồ.',
    action: 'Tạo ngay',
    actionUrl: '/memories/new',
    priority: 'high',
  },
  {
    id: 'add-images',
    icon: Image,
    title: 'Thêm ảnh vào kỷ niệm',
    description: 'Làm cho kỷ niệm của bạn sinh động hơn bằng cách thêm ảnh.',
    action: 'Tìm hiểu',
    actionUrl: '/memories/new',
    priority: 'medium',
  },
  {
    id: 'use-filters',
    icon: Filter,
    title: 'Sử dụng bộ lọc',
    description: 'Tìm kỷ niệm nhanh chóng bằng cách sử dụng bộ lọc thông minh.',
    action: 'Thử ngay',
    actionUrl: '/dashboard',
    priority: 'medium',
  },
  {
    id: 'view-stats',
    icon: TrendingUp,
    title: 'Xem thống kê',
    description: 'Khám phá những thông tin thú vị về kỷ niệm của bạn.',
    action: 'Xem thống kê',
    actionUrl: '/statistics',
    priority: 'low',
  },
  {
    id: 'share-memories',
    icon: Share2,
    title: 'Chia sẻ kỷ niệm',
    description: 'Chia sẻ những khoảnh khắc đặc biệt với bạn bè và gia đình.',
    action: 'Chia sẻ',
    actionUrl: '/dashboard',
    priority: 'low',
  },
  {
    id: 'export-data',
    icon: Download,
    title: 'Xuất dữ liệu',
    description: 'Sao lưu kỷ niệm của bạn bằng cách xuất dữ liệu.',
    action: 'Xuất ngay',
    actionUrl: '/profile',
    priority: 'low',
  },
];

export default function TutorialCards() {
  const [visibleCards, setVisibleCards] = useState<TutorialCard[]>([]);
  const [dismissedCards, setDismissedCards] = useState<Set<string>>(new Set());
  const [memoryCount, setMemoryCount] = useState(0);

  useEffect(() => {
    // Load dismissed cards from localStorage
    const dismissed = localStorage.getItem('dismissedTutorialCards');
    if (dismissed) {
      setDismissedCards(new Set(JSON.parse(dismissed)));
    }

    // Load memory count from localStorage or API
    const loadMemoryCount = async () => {
      try {
        const count = localStorage.getItem('memoryCount');
        if (count) {
          setMemoryCount(parseInt(count, 10));
        }
      } catch (error) {
        console.error('Error loading memory count:', error);
      }
    };
    loadMemoryCount();
  }, []);

  useEffect(() => {
    // Filter cards based on memory count and dismissed status
    let cardsToShow = tutorialCards.filter(card => !dismissedCards.has(card.id));

    // If user has memories, hide the "first memory" card
    if (memoryCount > 0) {
      cardsToShow = cardsToShow.filter(card => card.id !== 'first-memory');
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    cardsToShow.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Show only top 2 cards
    setVisibleCards(cardsToShow.slice(0, 2));
  }, [dismissedCards, memoryCount]);

  const handleDismiss = (cardId: string) => {
    const newDismissed = new Set(dismissedCards);
    newDismissed.add(cardId);
    setDismissedCards(newDismissed);
    localStorage.setItem('dismissedTutorialCards', JSON.stringify([...newDismissed]));
  };

  const handleAction = (actionUrl: string) => {
    if (actionUrl.startsWith('/')) {
      window.location.href = actionUrl;
    }
  };

  if (visibleCards.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Gợi ý cho bạn</span>
        </h3>
        <button
          onClick={() => {
            // Dismiss all visible cards
            visibleCards.forEach(card => handleDismiss(card.id));
          }}
          className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
        >
          Ẩn tất cả
        </button>
      </div>

      {visibleCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 rounded-xl p-4 animate-in fade-in slide-in-from-left-2"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {card.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                  {card.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(card.actionUrl)}
                    className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
                  >
                    {card.action}
                    <ChevronRight className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => handleDismiss(card.id)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => handleDismiss(card.id)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors shrink-0"
                title="Đóng gợi ý này"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
