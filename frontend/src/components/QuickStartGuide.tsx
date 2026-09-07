'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, MapPin, Plus, Search, TrendingUp, Smile, Folder } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    title: 'Bước 1: Tạo kỷ niệm đầu tiên',
    description: 'Nhấn nút "Add Memory" và chọn vị trí trên bản đồ. Bạn có thể nhấp vào bản đồ hoặc tìm kiếm địa điểm.',
    tips: [
      'Sử dụng nút định vị để lấy vị trí hiện tại của bạn',
      'Tìm kiếm địa điểm bằng tên để dễ dàng tìm vị trí',
      'Kéo thả marker để điều chỉnh vị trí chính xác'
    ]
  },
  {
    icon: Plus,
    title: 'Bước 2: Thêm thông tin kỷ niệm',
    description: 'Điền tiêu đề, nội dung, chọn danh mục và tâm trạng cho kỷ niệm của bạn.',
    tips: [
      'Chọn danh mục phù hợp như Du lịch, Gia đình, Công việc...',
      'Thêm ảnh bằng URL để kỷ niệm sinh động hơn',
      'Đặt ngày tháng chính xác để theo dõi timeline'
    ]
  },
  {
    icon: Search,
    title: 'Bước 3: Tìm kiếm và lọc',
    description: 'Sử dụng thanh tìm kiếm và bộ lọc để tìm kỷ niệm theo danh mục, tâm trạng hoặc từ khóa.',
    tips: [
      'Tìm kiếm theo tiêu đề, địa điểm hoặc nội dung',
      'Kết hợp nhiều bộ lọc để tìm chính xác hơn',
      'Lịch sử tìm kiếm giúp bạn nhanh chóng truy cập lại'
    ]
  },
  {
    icon: TrendingUp,
    title: 'Bước 4: Xem thống kê',
    description: 'Khám phá thống kê chi tiết về kỷ niệm của bạn: số lượng, danh mục, tâm trạng và hoạt động hàng tháng.',
    tips: [
      'Xem biểu đồ phân phối tâm trạng để hiểu cảm xúc',
      'Theo dõi hoạt động hàng tháng để thấy sự phát triển',
      'Nhận thành tích khi đạt cột mốc quan trọng'
    ]
  },
  {
    icon: Smile,
    title: 'Bước 5: Quản lý tâm trạng',
    description: 'Theo dõi tâm trạng của bạn qua thời gian với 9 cảm xúc khác nhau.',
    tips: [
      'Vui vẻ, Buồn, Hào hứng, Bình yên, Hoài niệm...',
      'Tâm trạng giúp bạn hiểu rõ hơn về cảm xúc',
      'Lọc theo tâm trạng để xem kỷ niệm tương ứng'
    ]
  },
  {
    icon: Folder,
    title: 'Bước 6: Tùy chỉnh danh mục',
    description: 'Tạo danh mục tùy chỉnh để tổ chức kỷ niệm theo cách riêng của bạn.',
    tips: [
      'Danh mục mặc định: Tình yêu, Gia đình, Bạn bè...',
      'Tạo danh mục mới với icon và màu sắc riêng',
      'Sắp xếp kỷ niệm theo danh mục dễ dàng'
    ]
  }
];

export default function QuickStartGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenGuide, setHasSeenGuide] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('hasSeenQuickStartGuide');
    if (seen) {
      setHasSeenGuide(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenQuickStartGuide', 'true');
    setHasSeenGuide(true);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setCurrentStep(0);
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="fixed bottom-20 left-6 z-[9998] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm font-medium border border-slate-200 dark:border-slate-700"
        title="Hướng dẫn bắt đầu nhanh"
      >
        <span>🚀</span>
        <span className="hidden sm:inline">Bắt đầu nhanh</span>
      </button>
    );
  }

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {steps[currentStep].title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bước {currentStep + 1} / {steps.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
            {steps[currentStep].description}
          </p>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <span>💡</span>
              <span>Mẹo hữu ích:</span>
            </h3>
            <ul className="space-y-2">
              {steps[currentStep].tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Quay lại
          </button>

          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-primary'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
                aria-label={`Bước ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary-hover rounded-lg transition-colors flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
