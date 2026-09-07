'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useAuthStore } from '@/lib/auth-store';

const tourSteps: Step[] = [
  {
    target: '.dashboard-header',
    content: 'Chào mừng bạn đến với Memory Map! Đây là bảng điều khiển chính để quản lý kỷ niệm của bạn.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.add-memory-button',
    content: 'Nhấn vào đây để thêm kỷ niệm mới. Bạn có thể chọn vị trí trên bản đồ, thêm ảnh, và ghi lại những khoảnh khắc đặc biệt.',
    placement: 'bottom',
  },
  {
    target: '.memory-map-container',
    content: 'Bản đồ tương tác hiển thị tất cả kỷ niệm của bạn. Các marker được gom nhóm khi ở gần nhau.',
    placement: 'top',
  },
  {
    target: '.filter-controls',
    content: 'Sử dụng bộ lọc để tìm kỷ niệm theo danh mục, tâm trạng, hoặc từ khóa tìm kiếm.',
    placement: 'bottom',
  },
  {
    target: '.timeline-section',
    content: 'Xem kỷ niệm của bạn theo thời gian. Timeline giúp bạn theo dõi hành trình và những kỷ niệm quan trọng.',
    placement: 'top',
  },
  {
    target: '.statistics-section',
    content: 'Thống kê chi tiết về kỷ niệm của bạn: số lượng, danh mục, tâm trạng và hoạt động hàng tháng.',
    placement: 'top',
  },
  {
    target: '.theme-toggle',
    content: 'Chuyển đổi giữa chế độ sáng và tối theo sở thích của bạn.',
    placement: 'bottom',
  },
  {
    target: '.profile-menu',
    content: 'Quản lý hồ sơ, cài đặt và xuất/nhập dữ liệu từ đây.',
    placement: 'bottom',
  },
];

export default function FeatureTour() {
  const [runTour, setRunTour] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem('hasSeenFeatureTour');
    if (!hasSeenTour && user) {
      // Delay tour start to allow UI to render
      setTimeout(() => {
        setRunTour(true);
      }, 1500);
    }
  }, [user]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      localStorage.setItem('hasSeenFeatureTour', 'true');
    }
  };

  const handleStartTour = () => {
    setRunTour(true);
  };

  return (
    <>
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        disableOverlayClose
        hideCloseButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: '#6366f1',
            backgroundColor: '#ffffff',
            textColor: '#1e293b',
          },
          tooltip: {
            fontSize: '14px',
            padding: '16px',
          },
          tooltipContent: {
            padding: '8px 0',
          },
          buttonNext: {
            backgroundColor: '#6366f1',
            borderRadius: '8px',
            padding: '8px 16px',
          },
          buttonBack: {
            color: '#64748b',
            marginRight: '8px',
          },
          buttonSkip: {
            color: '#64748b',
          },
        }}
        locale={{
          back: 'Quay lại',
          close: 'Đóng',
          last: 'Hoàn thành',
          next: 'Tiếp theo',
          open: 'Mở hộp thoại',
          skip: 'Bỏ qua',
        }}
      />
      
      {/* Floating button to restart tour */}
      {!runTour && (
        <button
          onClick={handleStartTour}
          className="fixed bottom-6 left-6 z-[9999] bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-hover transition-all flex items-center gap-2 text-sm font-medium"
          title="Xem hướng dẫn tính năng"
        >
          <span>📖</span>
          <span>Hướng dẫn</span>
        </button>
      )}
    </>
  );
}
