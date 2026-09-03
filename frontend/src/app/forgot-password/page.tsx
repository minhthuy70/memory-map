'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { authApi } from '@/lib/auth-api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Send verification code / reset instructions via email API
      const res = await authApi.sendVerificationCode(email);
      setMessage(res.message || 'Mã xác nhận khôi phục mật khẩu đã được gửi đến email của bạn.');
      setIsSent(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể gửi email khôi phục mật khẩu.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

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
            Khôi phục mật khẩu
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Nhập email tài khoản của bạn để nhận hướng dẫn đặt lại mật khẩu
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
          {isSent ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Kiểm tra email của bạn
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {message}
              </p>
              <div className="pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block w-full py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all text-sm"
                >
                  Quay lại đăng nhập
                </Link>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  Thử lại với email khác
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email tài khoản
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                    placeholder="ban@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi liên kết khôi phục</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại trang đăng nhập</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
