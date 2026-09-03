'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'facebook' | null>(null);

  // Email verification modal state
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  // Timer countdown for resend verification
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Password requirements
  const passwordCriteria = [
    { label: 'Tối thiểu 8 ký tự', met: formData.password.length >= 8 },
    { label: 'Chữ hoa (A-Z)', met: /[A-Z]/.test(formData.password) },
    { label: 'Chữ thường (a-z)', met: /[a-z]/.test(formData.password) },
    { label: 'Chữ số (0-9)', met: /[0-9]/.test(formData.password) },
    { label: 'Ký tự đặc biệt (!@#$...)', met: /[^a-zA-Z0-9]/.test(formData.password) },
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

  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (!agreedToTerms) {
      setError('Vui lòng đồng ý với Điều khoản sử dụng để tiếp tục.');
      return;
    }

    if (!agreedToPrivacy) {
      setError('Vui lòng đồng ý với Chính sách bảo mật để tiếp tục.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        name: formData.name.trim() || undefined,
      });

      setAuth(response.access_token, response.user);
      
      // Prompt user to verify email
      setSuccessMessage('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth Handler
  const handleGoogleOAuth = async () => {
    setError('');
    setOauthLoading('google');
    try {
      // Simulate/Trigger Google OAuth authentication
      const email = prompt('Nhập địa chỉ Gmail để đăng ký nhanh:', formData.email || 'user@gmail.com');
      if (!email) {
        setOauthLoading(null);
        return;
      }

      const googleName = email.split('@')[0];
      const response = await authApi.oauth({
        provider: 'google',
        email: email,
        name: googleName.charAt(0).toUpperCase() + googleName.slice(1),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        providerId: `google_${Date.now()}`,
      });

      setAuth(response.access_token, response.user);
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Đăng ký bằng Google thất bại.';
      setError(message);
    } finally {
      setOauthLoading(null);
    }
  };

  // Facebook OAuth Handler
  const handleFacebookOAuth = async () => {
    setError('');
    setOauthLoading('facebook');
    try {
      // Simulate/Trigger Facebook OAuth authentication
      const email = prompt('Nhập địa chỉ Email Facebook để đăng ký nhanh:', formData.email || 'user@facebook.com');
      if (!email) {
        setOauthLoading(null);
        return;
      }

      const fbName = email.split('@')[0];
      const response = await authApi.oauth({
        provider: 'facebook',
        email: email,
        name: fbName.charAt(0).toUpperCase() + fbName.slice(1),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        providerId: `fb_${Date.now()}`,
      });

      setAuth(response.access_token, response.user);
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Đăng ký bằng Facebook thất bại.';
      setError(message);
    } finally {
      setOauthLoading(null);
    }
  };

  // Trigger Send Email Verification Code
  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setError('Vui lòng nhập email trước khi yêu cầu mã xác thực.');
      return;
    }

    setIsSendingCode(true);
    setVerifyError('');
    setVerifySuccess('');

    try {
      const res = await authApi.sendVerificationCode(formData.email);
      setVerifySuccess(res.message);
      setResendTimer(60);
      setShowVerifyModal(true);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Không thể gửi mã xác nhận.';
      setVerifyError(message);
    } finally {
      setIsSendingCode(false);
    }
  };

  // Handle OTP Code Change
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Submit OTP Verification Code
  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = verificationCode.join('');
    if (fullCode.length !== 6) {
      setVerifyError('Vui lòng nhập đủ 6 chữ số của mã xác nhận.');
      return;
    }

    setIsVerifyingCode(true);
    setVerifyError('');

    try {
      const res = await authApi.verifyEmail({
        email: formData.email,
        code: fullCode,
      });

      setVerifySuccess(res.message || 'Xác thực email thành công!');
      setTimeout(() => {
        setShowVerifyModal(false);
      }, 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Mã xác nhận không đúng hoặc đã hết hạn.';
      setVerifyError(message);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group transition-transform hover:scale-105">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <MapPin className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Memory Map</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Lưu giữ và chia sẻ từng khoảnh khắc đáng nhớ trên bản đồ
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={handleGoogleOAuth}
              disabled={oauthLoading !== null || isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium transition-all shadow-xs hover:shadow-sm disabled:opacity-60 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{oauthLoading === 'google' ? 'Đang kết nối Google...' : 'Đăng ký bằng Google'}</span>
            </button>

            <button
              type="button"
              onClick={handleFacebookOAuth}
              disabled={oauthLoading !== null || isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-medium transition-all shadow-xs hover:shadow-sm disabled:opacity-60 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>{oauthLoading === 'facebook' ? 'Đang kết nối Facebook...' : 'Đăng ký bằng Facebook'}</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="shrink mx-4 text-xs uppercase tracking-wider text-slate-400 font-semibold">Hoặc đăng ký bằng Email</span>
            <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          {/* Error & Success Messages */}
          {error && (
            <div className="mb-6 flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm">
              <Check className="w-5 h-5 shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            {/* Email Input with Verification Action */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Địa chỉ Email <span className="text-red-500">*</span>
                </label>
                {formData.email && (
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode}
                    className="text-xs text-primary hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Mail className="w-3 h-3" />
                    {isSendingCode ? 'Đang gửi mã...' : 'Xác thực email'}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  placeholder="ban@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              {formData.password && (
                <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-600 dark:text-slate-400">Độ mạnh mật khẩu:</span>
                    <span className={`font-semibold ${passwordStrength.textColor}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2.5">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.bgColor}`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    />
                  </div>

                  {/* Checklist */}
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

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkboxes: Terms & Privacy as separate requirements */}
            <div className="space-y-2.5 pt-2">
              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" target="_blank" className="text-primary hover:underline font-medium">
                    Điều khoản sử dụng
                  </Link>
                  <span className="text-red-500 ml-0.5">*</span>
                </span>
              </label>

              {/* Privacy Policy Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  id="privacy-checkbox"
                  checked={agreedToPrivacy}
                  onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Tôi đồng ý với{' '}
                  <Link href="/privacy" target="_blank" className="text-primary hover:underline font-medium">
                    Chính sách bảo mật
                  </Link>
                  <span className="text-red-500 ml-0.5">*</span>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || oauthLoading !== null}
              className="w-full mt-4 py-3 bg-primary text-white rounded-xl hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang tạo tài khoản...</span>
                </>
              ) : (
                <>
                  <span>Đăng ký tài khoản</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to login */}
          <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Xác thực địa chỉ Email
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Chúng tôi đã gửi mã 6 chữ số đến <span className="font-semibold text-slate-900 dark:text-white">{formData.email}</span>
              </p>
            </div>

            {verifyError && (
              <div className="mb-4 text-xs sm:text-sm bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-3 rounded-xl border border-red-200 dark:border-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{verifyError}</span>
              </div>
            )}

            {verifySuccess && (
              <div className="mb-4 text-xs sm:text-sm bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{verifySuccess}</span>
              </div>
            )}

            <form onSubmit={handleVerifyCodeSubmit}>
              {/* 6-box OTP input */}
              <div className="flex justify-between gap-2 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-12 text-center text-lg font-bold border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isVerifyingCode || verificationCode.join('').length !== 6}
                className="w-full py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer text-sm"
              >
                {isVerifyingCode ? 'Đang kiểm tra...' : 'Xác thực ngay'}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
              {resendTimer > 0 ? (
                <span>Gửi lại mã sau {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={isSendingCode}
                  className="text-primary hover:underline font-semibold cursor-pointer"
                >
                  Gửi lại mã xác nhận
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
