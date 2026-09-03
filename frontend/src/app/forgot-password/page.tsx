'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Mail, ArrowLeft, CheckCircle2, AlertCircle, Send, ExternalLink, Clock } from 'lucide-react';
import { authApi } from '@/lib/auth-api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      setMessage(res.message || 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
      if (res.resetLink) {
        setResetLink(res.resetLink);
      }
      setIsSent(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể gửi email khôi phục mật khẩu. Vui lòng kiểm tra lại email.';
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
            Nhập email tài khoản để nhận liên kết đặt lại mật khẩu (hiệu lực 1 giờ)
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8">
          {isSent ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Đã gửi liên kết khôi phục!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {message}
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/40">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Liên kết sẽ tự động hết hạn sau <strong>60 phút (1 giờ)</strong>.</span>
              </div>

              {resetLink && (
                <div className="pt-2">
                  <a
                    href={resetLink}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all text-sm shadow-md"
                  >
                    <span>Mở trang đặt lại mật khẩu ngay</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div className="pt-4 space-y-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/login"
                  className="block w-full py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all text-sm shadow-xs"
                >
                  Quay lại đăng nhập
                </Link>
                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer pt-1"
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
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Link khôi phục có hiệu lực trong vòng 1 giờ</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang gửi liên kết...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi email đặt lại mật khẩu</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
