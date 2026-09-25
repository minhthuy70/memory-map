'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Calendar, MapPin, Users, Award, Bell, X, Check, Settings } from 'lucide-react';

interface Milestone {
  id: string;
  type: 'memories' | 'anniversary' | 'locations' | 'categories' | 'streak';
  title: string;
  description: string;
  icon: React.ReactNode;
  achieved: boolean;
  achievedAt?: Date;
  progress: number;
  target: number;
  current: number;
}

interface MilestoneNotificationsProps {
  milestones?: Milestone[];
  onDismiss?: (id: string) => void;
  onSettings?: () => void;
  enabled?: boolean;
}

const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'first-memory',
    type: 'memories',
    title: 'Kỷ niệm đầu tiên!',
    description: 'Bạn đã tạo kỷ niệm đầu tiên trên Memory Map',
    icon: <Star className="h-5 w-5" />,
    achieved: false,
    progress: 0,
    target: 1,
    current: 0,
  },
  {
    id: '10-memories',
    type: 'memories',
    title: '10 kỷ niệm',
    description: 'Bạn đã lưu trữ 10 kỷ niệm đẹp',
    icon: <Trophy className="h-5 w-5" />,
    achieved: false,
    progress: 0,
    target: 10,
    current: 0,
  },
  {
    id: '50-memories',
    type: 'memories',
    title: '50 kỷ niệm',
    description: 'Bạn đã xây dựng kho tàng 50 kỷ niệm',
    icon: <Award className="h-5 w-5" />,
    achieved: false,
    progress: 0,
    target: 50,
    current: 0,
  },
  {
    id: '100-memories',
    type: 'memories',
    title: '100 kỷ niệm',
    description: 'Chúc mừng! Bạn đã đạt 100 kỷ niệm',
    icon: <Trophy className="h-5 w-5" />,
    achieved: false,
    progress: 0,
    target: 100,
    current: 0,
  },
  {
    id: '1-year-anniversary',
    type: 'anniversary',
    title: '1 năm cùng Memory Map',
    description: 'Cảm ơn bạn đã đồng hành suốt 1 năm',
    icon: <Calendar className="h-5 w-5" />,
    achieved: false,
    progress: 0,
    target: 365,
    current: 0,
  },
  {
    id: '10-locations',
    type: 'locations',
    title: '10 địa điểm',
    description: 'Bạn đã khám phá 10 địa điểm khác nhau',
    icon: <MapPin className="h-5 w-5" />,
    achieved: false,
    progress: 0,
    target: 10,
    current: 0,
  },
  {
    id: 'all-categories',
    type: 'categories',
    title: 'Thử hết danh mục',
    description: 'Bạn đã sử dụng tất cả các danh mục',
    icon: <Users className="h-5 w-5" />,
    achieved: false,
    progress: 0,
    target: 9,
    current: 0,
  },
];

export default function MilestoneNotifications({
  milestones = DEFAULT_MILESTONES,
  onDismiss,
  onSettings,
  enabled = true,
}: MilestoneNotificationsProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [showMilestoneList, setShowMilestoneList] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Check for newly achieved milestones
    const newlyAchieved = milestones.find(m => m.achieved && !m.achievedAt);
    if (newlyAchieved) {
      setCurrentMilestone(newlyAchieved);
      setShowNotification(true);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [milestones, enabled]);

  const handleDismiss = () => {
    if (currentMilestone && onDismiss) {
      onDismiss(currentMilestone.id);
    }
    setShowNotification(false);
  };

  const handleViewAll = () => {
    setShowMilestoneList(true);
    setShowNotification(false);
  };

  const achievedCount = milestones.filter(m => m.achieved).length;
  const totalCount = milestones.length;
  const progressPercentage = (achievedCount / totalCount) * 100;

  if (!enabled) return null;

  return (
    <>
      {/* Milestone Notification Toast */}
      {showNotification && currentMilestone && (
        <div className="fixed top-4 right-4 z-[2000] w-96 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/90 dark:to-orange-950/90 border border-amber-200 dark:border-amber-800 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
                {currentMilestone.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm">
                    🎉 Cột mốc mới!
                  </h4>
                  <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-bold rounded-full">
                    MỚI
                  </span>
                </div>
                <h5 className="font-semibold text-slate-900 dark:text-white text-base mb-1">
                  {currentMilestone.title}
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                  {currentMilestone.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {achievedCount}/{totalCount}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 hover:bg-amber-100 dark:hover:bg-amber-900 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-amber-200 dark:border-amber-800">
              <button
                type="button"
                onClick={handleViewAll}
                className="flex-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Xem tất cả
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Milestone List Modal */}
      {showMilestoneList && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                      Cột mốc thành tích
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {achievedCount}/{totalCount} đã đạt được
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onSettings && (
                    <button
                      type="button"
                      onClick={onSettings}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      title="Cài đặt"
                    >
                      <Settings className="h-4 w-4 text-slate-500" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowMilestoneList(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                </div>
              </div>
              
              {/* Overall Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Tiến độ tổng thể
                  </span>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {progressPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-3">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      milestone.achieved
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-300 dark:border-amber-700'
                        : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        milestone.achieved
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                          : 'bg-slate-200 dark:bg-slate-600'
                      }`}>
                        {milestone.achieved ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <div className="h-4 w-4 text-slate-400">
                            {milestone.icon}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${
                            milestone.achieved
                              ? 'text-amber-900 dark:text-amber-100'
                              : 'text-slate-700 dark:text-slate-300'
                          } text-sm`}>
                            {milestone.title}
                          </h4>
                          {milestone.achieved && (
                            <span className="px-2 py-0.5 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-bold rounded-full">
                              Đạt được
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                          {milestone.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                milestone.achieved
                                  ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                  : 'bg-slate-400 dark:bg-slate-500'
                              }`}
                              style={{ width: `${(milestone.current / milestone.target) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            {milestone.current}/{milestone.target}
                          </span>
                        </div>
                        {milestone.achievedAt && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            Đạt được: {new Date(milestone.achievedAt).toLocaleDateString('vi-VN')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Milestone Button */}
      <button
        type="button"
        onClick={() => setShowMilestoneList(true)}
        className="fixed bottom-4 right-4 z-[1000] p-3 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="Xem cột mốc"
      >
        <Trophy className="h-5 w-5" />
      </button>
    </>
  );
}