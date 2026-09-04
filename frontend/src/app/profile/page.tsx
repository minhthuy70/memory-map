'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Lock, 
  ArrowLeft, 
  LogOut, 
  Shield, 
  Camera, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  EyeOff, 
  Upload,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/auth-api';
import SessionsManager from '@/components/SessionsManager';
import ThemeToggle from '@/components/ThemeToggle';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, setAuth } = useAuthStore();

  const [profileData, setProfileData] = useState<any>(user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Editing Name
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || '');

  // Changing Email with Verification
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailCode, setEmailCode] = useState(['', '', '', '', '', '']);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [emailCountdown, setEmailCountdown] = useState(0);
  const [emailActionLoading, setEmailActionLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Avatar Uploading
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Changing Password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Dialogs
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showSessionsManager, setShowSessionsManager] = useState(false);

  // Email resend timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emailCountdown > 0) {
      interval = setInterval(() => {
        setEmailCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailCountdown]);

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

  const newPasswordStrength = calculatePasswordStrength(passwordForm.newPassword);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await authApi.getProfile();
      setProfileData(data);
      setNameInput(data.name || '');
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Không thể tải thông tin hồ sơ';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [isAuthenticated, router]);

  // Handle Name Update
  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError('Họ và tên không được để trống.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const updated = await authApi.updateProfile({ name: nameInput.trim() });
      setProfileData((prev: any) => ({ ...prev, name: updated.name }));
      if (user) {
        setAuth(useAuthStore.getState().token!, { ...user, name: updated.name });
      }
      setIsEditingName(false);
      setSuccessMessage('Cập nhật họ và tên thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Không thể cập nhật họ tên');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Avatar File Upload
  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WebP, ...).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước ảnh không được vượt quá 5MB.');
      return;
    }

    setIsUploadingAvatar(true);
    setError('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;
        const updated = await authApi.updateProfile({ avatar: base64Data });
        setProfileData((prev: any) => ({ ...prev, avatar: updated.avatar }));
        if (user) {
          setAuth(useAuthStore.getState().token!, { ...user, avatar: updated.avatar });
        }
        setSuccessMessage('Tải lên ảnh đại diện thành công!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Không thể tải lên ảnh đại diện');
      } finally {
        setIsUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Request Email Change OTP
  const handleRequestEmailCode = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setEmailError('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    setEmailActionLoading(true);
    setEmailError('');

    try {
      const res = await authApi.requestEmailChange(newEmail);
      setIsCodeSent(true);
      setEmailCountdown(60);
      setSuccessMessage(res.message);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setEmailError(err.response?.data?.message || err.message || 'Không thể gửi mã xác nhận.');
    } finally {
      setEmailActionLoading(false);
    }
  };

  // Confirm Email Change with OTP
  const handleConfirmEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = emailCode.join('');
    if (fullCode.length !== 6) {
      setEmailError('Vui lòng nhập đầy đủ 6 số của mã xác nhận.');
      return;
    }

    setEmailActionLoading(true);
    setEmailError('');

    try {
      const res = await authApi.confirmEmailChange({
        newEmail,
        code: fullCode,
      });

      setProfileData((prev: any) => ({ ...prev, email: res.user.email, isEmailVerified: true }));
      setAuth(res.access_token, res.user);

      setIsChangingEmail(false);
      setIsCodeSent(false);
      setNewEmail('');
      setEmailCode(['', '', '', '', '', '']);
      setSuccessMessage('Thay đổi email và xác thực thành công!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      setEmailError(err.response?.data?.message || err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn.');
    } finally {
      setEmailActionLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    try {
      setIsLoading(true);
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
      setSuccessMessage('Đổi mật khẩu thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || err.message || 'Đổi mật khẩu thất bại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading && !profileData) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Memory Map
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors font-medium cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
          {/* Profile Hero Header */}
          <div className="bg-linear-to-r from-indigo-600 via-sky-600 to-primary p-6 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar with Upload Hover Trigger */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/40 shadow-xl relative">
                  {profileData?.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-14 w-14 text-white/90" />
                  )}

                  {/* Upload Overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity cursor-pointer"
                    title="Tải lên ảnh đại diện mới"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Đổi ảnh</span>
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />

                {/* Floating camera icon */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full shadow-md hover:scale-110 transition-transform cursor-pointer border border-slate-200 dark:border-slate-700"
                  aria-label="Tải ảnh đại diện"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {profileData?.name || 'Chưa đặt tên'}
                  </h1>
                  {profileData?.isEmailVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 border border-emerald-300/40 text-emerald-100">
                      <ShieldCheck className="w-3 h-3" /> Đã xác thực
                    </span>
                  )}
                </div>
                <p className="text-white/80 text-sm font-medium mb-3">{profileData?.email}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-xs rounded-xl text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profileData?.memoryCount || 0} kỷ niệm đã lưu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8">
            {/* Global Alerts */}
            {error && (
              <div className="mb-6 flex items-start gap-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 p-4 rounded-2xl text-sm">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl text-sm">
                <Check className="w-5 h-5 shrink-0 mt-0.5" />
                <div>{successMessage}</div>
              </div>
            )}

            {/* Profile Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Name */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Họ và tên</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {profileData?.name || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingName(!isEditingName)}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer"
                >
                  {isEditingName ? 'Đóng' : 'Đổi tên'}
                </button>
              </div>

              {/* Email with Change Action */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Địa chỉ Email</p>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm break-all">
                      {profileData?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChangingEmail(!isChangingEmail)}
                  className="text-xs text-primary hover:underline font-semibold cursor-pointer shrink-0 ml-2"
                >
                  {isChangingEmail ? 'Đóng' : 'Đổi email'}
                </button>
              </div>

              {/* Account Created Date */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ngày tạo tài khoản</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {profileData?.createdAt
                      ? new Date(profileData.createdAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'Không xác định'}
                  </p>
                </div>
              </div>

              {/* Last Login Date */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Đăng nhập gần nhất</p>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">
                    {profileData?.lastLoginAt
                      ? new Date(profileData.lastLoginAt).toLocaleString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : 'Chưa có dữ liệu'}
                  </p>
                </div>
              </div>
            </div>

            {/* In-place Form: Edit Full Name */}
            {isEditingName && (
              <form onSubmit={handleNameUpdate} className="mb-6 p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-primary" />
                  <span>Chỉnh sửa tên đầy đủ</span>
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Nhập họ và tên mới"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      Lưu thay đổi
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-300 cursor-pointer"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* In-place Form: Edit Email with Verification */}
            {isChangingEmail && (
              <div className="mb-6 p-5 bg-sky-50/70 dark:bg-slate-800/80 rounded-2xl border border-sky-200 dark:border-slate-700 animate-in fade-in">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Thay đổi email với xác thực (Email Verification)</span>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Để đảm bảo an toàn, hệ thống sẽ gửi mã xác thực 6 số đến email mới trước khi cập nhật.
                </p>

                {emailError && (
                  <div className="mb-3 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Step 1: Input Email & Request Code */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      disabled={isCodeSent}
                      className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Nhập địa chỉ email mới"
                    />
                    <button
                      type="button"
                      onClick={handleRequestEmailCode}
                      disabled={emailActionLoading || emailCountdown > 0 || !newEmail}
                      className="px-5 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {emailActionLoading ? 'Đang gửi...' : emailCountdown > 0 ? `Gửi lại sau ${emailCountdown}s` : 'Gửi mã xác thực'}
                    </button>
                  </div>

                  {/* Step 2: Input 6-digit Code & Confirm */}
                  {isCodeSent && (
                    <form onSubmit={handleConfirmEmailChange} className="pt-2 border-t border-sky-200/60 dark:border-slate-700/60">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Nhập mã xác nhận 6 chữ số gửi đến {newEmail}:
                      </label>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {emailCode.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`profile-otp-${idx}`}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value.slice(-1);
                              const copy = [...emailCode];
                              copy[idx] = val;
                              setEmailCode(copy);
                              if (val && idx < 5) {
                                document.getElementById(`profile-otp-${idx + 1}`)?.focus();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !emailCode[idx] && idx > 0) {
                                document.getElementById(`profile-otp-${idx - 1}`)?.focus();
                              }
                            }}
                            className="w-10 h-11 text-center font-bold text-base border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                          />
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={emailActionLoading || emailCode.join('').length !== 6}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
                        >
                          {emailActionLoading ? 'Đang xác thực...' : 'Xác nhận đổi Email'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingEmail(false);
                            setIsCodeSent(false);
                          }}
                          className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-300 cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>{isUploadingAvatar ? 'Đang tải ảnh...' : 'Tải lên ảnh đại diện'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl hover:bg-slate-700 font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>{isChangingPassword ? 'Đóng form đổi mật khẩu' : 'Đổi mật khẩu'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSessionsManager(!showSessionsManager)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                <Shield className="h-4 w-4" />
                <span>{showSessionsManager ? 'Đóng quản lý phiên' : 'Quản lý phiên đăng nhập'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeactivateConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                <Clock className="h-4 w-4" />
                <span>Vô hiệu hóa tài khoản</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>Xóa tài khoản</span>
              </button>
            </div>

            {/* Sessions Manager */}
            {showSessionsManager && (
              <div className="mb-6 p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in">
                <SessionsManager />
              </div>
            )}

            {/* Change Password Form */}
            {isChangingPassword && (
              <form onSubmit={handlePasswordChange} className="mb-6 p-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <span>Đổi mật khẩu tài khoản</span>
                </h3>

                {passwordError && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {/* Current Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full pl-4 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
                      required
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Mật khẩu mới (tối thiểu 6 ký tự)
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full pl-4 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
                      required
                      minLength={6}
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  {passwordForm.newPassword && (
                    <div className="mt-2.5 p-3 bg-white dark:bg-slate-750 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                        <span className={`font-semibold ${newPasswordStrength.textColor}`}>
                          {newPasswordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full transition-all duration-300 ${newPasswordStrength.bgColor}`}
                          style={{ width: `${newPasswordStrength.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full pl-4 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary"
                      required
                      minLength={6}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold text-sm transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordError('');
                    }}
                    className="px-5 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-300 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            {/* Delete Account Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="mb-6 p-6 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-300 dark:border-red-900 animate-in fade-in">
                <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">
                  Xác nhận xóa tài khoản vĩnh viễn?
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4 leading-relaxed">
                  Hành động này <strong>không thể hoàn tác</strong>. Toàn bộ thông tin tài khoản, bản đồ kỷ niệm, hình ảnh và dữ liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        await authApi.deleteAccount();
                        await logout();
                        router.push('/');
                      } catch (err: any) {
                        setError(err.response?.data?.message || err.message || 'Xóa tài khoản thất bại');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Đang xóa...' : 'Đồng ý xóa vĩnh viễn'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-300 cursor-pointer"
                  >
                    Hủy thao tác
                  </button>
                </div>
              </div>
            )}

            {/* Deactivate Account Confirmation Dialog */}
            {showDeactivateConfirm && (
              <div className="mb-6 p-6 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-300 dark:border-amber-900 animate-in fade-in">
                <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">
                  Vô hiệu hóa tài khoản tạm thời?
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4 leading-relaxed">
                  Tài khoản của bạn sẽ tạm thời bị vô hiệu hóa và bạn sẽ được đăng xuất. Bạn có thể kích hoạt lại tài khoản bất cứ lúc nào bằng cách liên hệ quản trị viên.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        await authApi.deactivateAccount();
                        await logout();
                        router.push('/');
                      } catch (err: any) {
                        setError(err.response?.data?.message || err.message || 'Vô hiệu hóa thất bại');
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Đang xử lý...' : 'Xác nhận vô hiệu hóa'}
                  </button>
                  <button
                    onClick={() => setShowDeactivateConfirm(false)}
                    className="px-4 py-2.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-300 cursor-pointer"
                  >
                    Hủy thao tác
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
