import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/register" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            Quay lại đăng ký
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Điều khoản sử dụng
            </h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Cập nhật lần cuối: 1 tháng 9, 2026
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              1. Chấp nhận điều khoản
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Bằng việc sử dụng ứng dụng Memory Map, bạn đồng ý tuân thủ các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              2. Mô tả dịch vụ
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Memory Map là một ứng dụng nhật ký kỹ thuật số cho phép người dùng lưu giữ những kỷ niệm của mình trên bản đồ. Chúng tôi cung cấp các tính năng bao gồm:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-4 space-y-2">
              <li>Lưu trữ và quản lý kỷ niệm cá nhân</li>
              <li>Đánh dấu vị trí trên bản đồ</li>
              <li>Ghi lại cảm xúc và chi tiết của từng kỷ niệm</li>
              <li>Xem lại lịch sử qua timeline và thống kê</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              3. Trách nhiệm người dùng
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Là người dùng, bạn đồng ý:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-4 space-y-2">
              <li>Chỉ đăng tải nội dung mà bạn có quyền sử dụng</li>
              <li>Không đăng tải nội dung vi phạm pháp luật hoặc đạo đức</li>
              <li>Không sử dụng dịch vụ cho mục đích thương mại hoặc phi pháp</li>
              <li>Bảo mật thông tin đăng nhập của mình</li>
              <li>Chịu trách nhiệm cho mọi hoạt động trên tài khoản của bạn</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              4. Quyền sở hữu nội dung
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Bạn giữ quyền sở hữu đối với tất cả nội dung mà bạn đăng tải lên Memory Map. Tuy nhiên, bằng việc đăng tải nội dung, bạn cấp cho chúng tôi quyền sử dụng, sao chép, hiển thị và phân phối nội dung đó cho mục đích cung cấp dịch vụ.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              5. Bảo mật
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn theo Chính sách Bảo Mật của chúng tôi. Vui lòng đọc kỹ chính sách này để hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              6. Giới hạn trách nhiệm
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Memory Map không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi, bao gồm nhưng không giới hạn thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc hậu quả.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              7. Thay đổi điều khoản
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên trang này. Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi được đăng tải sẽ được coi là chấp nhận các điều khoản mới.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              8. Liên hệ
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi qua email: support@memorymap.com
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại đăng ký
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
