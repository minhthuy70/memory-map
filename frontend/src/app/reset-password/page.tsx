'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  MapPin, 
  Lock, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { authApi } from '@/lib/auth-api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenError, setTokenError] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setTokenError('Không tìm thấy mã xác thực khôi phục mật khẩu. Vui lòng kiểm tra lại liên kết.');
      setIsValidatingToken(false);
      return;
    }

    const checkToken = async () => {
      try {
        const res = await authApi.verifyResetToken(token);
        setUserEmail(res.email);
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || 'Liên kết đặt lại mật khẩu đã hết hạn (chỉ có hiệu lực trong 1 giờ) hoặc không hợp lệ.';
        setTokenError(msg);
      } finally {
        setIsValidatingToken(false);
      }
    };

    checkToken();
  }, [token]);

  // Password requirements checklist
  const passwordCriteria = [
    { label: 'Tối thiểu 8 ký tự', met: newPassword.length >= 8 },
    { label: 'Chữ hoa (A-Z)', met: /[A-Z]/.test(newPassword) },
    { label: 'Chữ thường (a-z)', met: /[a-z]/.test(newPassword) },
    { label: 'Chữ số (0-9)', met: /[0-9]/.test(newPassword) },
    { label: 'Ký tự đặc biệt (!@#$...)', met: /[^a-zA-Z0-9]/.test(newPassword) },
  ];

  const calculatePasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: 'Chưa nhập', bgColor: 'bg-slate-200 dark:bg-slate-700', textColor: 'text-slate-400', percentage: 0 };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: 'Yếu', bgColor: 'bg-red-500', textColor: 'text-red-500', percentage: 25 };
    if (score <= 4) return { score, label: 'Trung bình', bgColor: 'bg-amber-500', textColor: 'text-amber-500', percentage: 65 };
    return { score, label: 'Mạnh', bgColor: 'bg-emerald-500', textColor: 'text-emerald-500', percentage: 100 };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authApi.resetPassword({
        token: token!,
        newPassword,
      });

      setSuccessMessage(res.message || 'Đặt lại mật khẩu thành công! Bạn có thể sử dụng mật khẩu mới để đăng nhập.');
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="text-center py-10 space-y-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Đang xác thực liên kết khôi phục mật khẩu...
        </p>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Clock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Liên kết không hợp lệ hoặc đã hết hạn
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
          {tokenError}
        </p>
        <div className="pt-4">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all text-sm shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yêu cầu liên kết mới</span>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Đặt lại mật khẩu thành công!
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {successMessage}
          </p>
        </div>
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all shadow-md hover:shadow-lg text-sm"
          >
            <span>Đăng nhập ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {userEmail && (
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          Đặt lại mật khẩu cho tài khoản: <strong className="text-slate-900 dark:text-white">{userEmail}</strong>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* New Password */}
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Mật khẩu mới <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            placeholder="Tối thiểu 6 ký tự"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">Độ mạnh mật khẩu:</span>
              <span className={`font-semibold ${passwordStrength.textColor}`}>
                {passwordStrength.label}
              </span>
            </div>
            
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2.5">
              <div
                className={`h-full transition-all duration-300 ${passwordStrength.bgColor}`}
                style={{ width: `${passwordStrength.percentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              {passwordCriteria.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {item.met ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <span className={item.met ? 'text-slate-900 dark:text-slate-200 font-medium' : 'text-slate-400 dark:text-slate-500'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm New Password */}
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Xác nhận mật khẩu mới <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
            placeholder="Nhập lại mật khẩu mới"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {confirmPassword && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            {newPassword === confirmPassword ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-3.5 h-3.5" /> Mật khẩu xác nhận trùng khớp
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <X className="w-3.5 h-3.5" /> Mật khẩu xác nhận chưa khớp
              </span>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Đang cập nhật mật khẩu...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Cập nhật mật khẩu mới</span>
          </>
        )}
      </button>

      <div className="text-center pt-2">
        <Link
          href="/login"
          className="text-xs sm:text-sm text-slate-500 hover:text-primary transition-colors font-medium"
        >
          Hủy và quay lại đăng nhập
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group transition-transform hover:scale-105">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Memory Map</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Đặt lại mật khẩu
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Tạo mật khẩu mới an toàn cho tài khoản Memory Map của bạn
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
          <Suspense fallback={
            <div className="text-center py-10 space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Đang tải biểu mẫu...</p>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
