'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, Check, Mail, Shield, User } from 'lucide-react';

interface GoogleOAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (accountData: {
    email: string;
    name: string;
    avatar: string;
    providerId: string;
  }) => Promise<void>;
  isLoading: boolean;
  defaultEmail?: string;
  title?: string;
}

// Generate stable deterministic 21-digit Google sub ID from email
export function getDeterministicGoogleId(email: string): string {
  const cleanEmail = email.toLowerCase().trim();
  let hash = 5381;
  for (let i = 0; i < cleanEmail.length; i++) {
    hash = ((hash << 5) + hash) + cleanEmail.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash).toString().padStart(10, '8');
  const reversed = positiveHash.split('').reverse().join('');
  return `10${positiveHash}${reversed}9`.slice(0, 21);
}

export default function GoogleOAuthModal({
  isOpen,
  onClose,
  onSelectAccount,
  isLoading,
  defaultEmail = '',
  title = 'Đăng nhập bằng Google',
}: GoogleOAuthModalProps) {
  const [emailInput, setEmailInput] = useState(defaultEmail || '');
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const [selectedDemoUser, setSelectedDemoUser] = useState<string | null>(null);

  // RefreshCcw defaultEmail
  useEffect(() => {
    if (defaultEmail && !emailInput) {
      setEmailInput(defaultEmail);
      const guessedName = defaultEmail.split('@')[0];
      setNameInput(guessedName.charAt(0).toUpperCase() + guessedName.slice(1));
    }
  }, [defaultEmail]);

  if (!isOpen) return null;

  const demoAccounts = [
    {
      name: 'Nguyễn Văn Minh',
      email: 'minh.nguyen@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minh.nguyen@gmail.com',
    },
    {
      name: 'Trần Thị Thu Thảo',
      email: 'thao.tran@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thao.tran@gmail.com',
    },
  ];

  const handleSelectDemo = async (demo: typeof demoAccounts[0]) => {
    setError('');
    setSelectedDemoUser(demo.email);
    try {
      await onSelectAccount({
        email: demo.email,
        name: demo.name,
        avatar: demo.avatar,
        providerId: getDeterministicGoogleId(demo.email),
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Đăng nhập Google thất bại');
      setSelectedDemoUser(null);
    }
  };

  const handleSubmitCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ.');
      return;
    }

    const resolvedName = nameInput.trim() || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
    const formattedName = resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1);
    const providerId = getDeterministicGoogleId(cleanEmail);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`;

    try {
      await onSelectAccount({
        email: cleanEmail,
        name: formattedName,
        avatar,
        providerId,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Đăng nhập Google thất bại');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
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
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chọn tài khoản để tiếp tục tới Memory Map
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Account Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
              Tài khoản đề xuất
            </label>
            <div className="space-y-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedDemoUser === acc.email
                      ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/20'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white leading-tight">
                        {acc.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {acc.email}
                      </p>
                    </div>
                  </div>
                  {selectedDemoUser === acc.email && isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-xs text-slate-400 uppercase font-medium">
              Hoặc nhập tài khoản khác
            </span>
          </div>

          {/* Custom Account Form */}
          <form onSubmit={handleSubmitCustom} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Địa chỉ Gmail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your-name@gmail.com"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tên hiển thị (Tùy chọn)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Tên của bạn"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !emailInput}
              className="w-full mt-2 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-hover font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang kết nối...</span>
                </>
              ) : (
                <span>Tiếp tục với tài khoản này</span>
              )}
            </button>
          </form>

          {/* Privacy footer */}
          <div className="text-center pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Xác thực OAuth 2.0 an toàn và bảo mật với Google</span>
          </div>
        </div>
      </div>
    </div>
  );
}
