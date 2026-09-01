import Link from 'next/link';
import { MapPin, ArrowLeft, Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
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
              Chính sách bảo mật
            </h1>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Cập nhật lần cuối: 1 tháng 9, 2026
            </p>

            <div className="bg-primary/10 dark:bg-primary/20 rounded-lg p-4 mb-6 border border-primary/20">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6 flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              1. Thông tin chúng tôi thu thập
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi thu thập các loại thông tin sau:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-4 space-y-2">
              <li><strong>Thông tin tài khoản:</strong> Tên, email, mật khẩu (được mã hóa)</li>
              <li><strong>Thông tin kỷ niệm:</strong> Tiêu đề, nội dung, vị trí, ngày tháng, cảm xúc</li>
              <li><strong>Dữ liệu vị trí:</strong> Tọa độ GPS khi bạn đánh dấu vị trí trên bản đồ</li>
              <li><strong>Hình ảnh:</strong> Ảnh bạn tải lên để đi kèm với kỷ niệm</li>
              <li><strong>Dữ liệu sử dụng:</strong> Thông tin về cách bạn sử dụng ứng dụng</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              2. Cách chúng tôi sử dụng thông tin
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi sử dụng thông tin của bạn để:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-4 space-y-2">
              <li>Cung cấp và cải thiện dịch vụ Memory Map</li>
              <li>Xác thực và bảo mật tài khoản của bạn</li>
              <li>Hiển thị và quản lý kỷ niệm của bạn trên bản đồ</li>
              <li>Cung cấp thống kê và phân tích về dữ liệu của bạn</li>
              <li>Gửi thông báo quan trọng về tài khoản của bạn</li>
              <li>Phát hiện và ngăn chặn hoạt động gian lận</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              3. Bảo mật dữ liệu
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi thực hiện các biện pháp bảo mật sau:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-4 space-y-2">
              <li>Mã hóa mật khẩu bằng thuật toán an toàn</li>
              <li>Sử dụng HTTPS cho tất cả các kết nối</li>
              <li>Giới hạn quyền truy cập dữ liệu của nhân viên</li>
              <li>Thực hiện sao lưu dữ liệu định kỳ</li>
              <li>Cập nhật thường xuyên các biện pháp bảo mật</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              4. Chia sẻ thông tin
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, ngoại trừ trong các trường hợp sau:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-4 space-y-2">
              <li>Khi có yêu cầu từ cơ quan pháp luật</li>
              <li>Để bảo vệ quyền và tài sản của Memory Map</li>
              <li>Với các nhà cung cấp dịch vụ đáng tin cậy để vận hành dịch vụ</li>
              <li>Khi bạn đồng ý chia sẻ thông tin</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              5. Quyền của bạn
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Bạn có quyền:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-slate-400 mb-4 space-y-2">
              <li>Truy cập và xem thông tin cá nhân của bạn</li>
              <li>Chỉnh sửa hoặc cập nhật thông tin</li>
              <li>Xóa tài khoản và dữ liệu liên quan</li>
              <li>Hủy đăng ký email hoặc thông báo</li>
              <li>Yêu cầu bản sao dữ liệu cá nhân</li>
            </ul>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              6. Cookie
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng, ghi nhớ phiên đăng nhập và phân tích sử dụng ứng dụng. Bạn có thể quản lý cookie trong cài đặt trình duyệt của mình.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              7. Lưu trữ dữ liệu
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi lưu trữ dữ liệu của bạn trong khi bạn sử dụng dịch vụ. Khi bạn xóa tài khoản, chúng tôi sẽ xóa dữ liệu cá nhân của bạn trong vòng 30 ngày, ngoại trừ dữ liệu cần thiết cho mục đích pháp lý hoặc an ninh.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              8. Trẻ em
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Memory Map không dành cho trẻ em dưới 13 tuổi. Chúng tôi không thu thập thông tin từ trẻ em. Nếu phát hiện thông tin từ trẻ em, chúng tôi sẽ xóa ngay lập tức.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              9. Thay đổi chính sách
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Chúng tôi có thể cập nhật chính sách bảo mật này. Các thay đổi sẽ được thông báo qua email hoặc thông báo trong ứng dụng. Việc bạn tiếp tục sử dụng dịch vụ sau khi thông báo sẽ được coi là chấp nhận chính sách mới.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 mt-6">
              10. Liên hệ
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Nếu bạn có câu hỏi hoặc lo ngại về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua email: privacy@memorymap.com
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
