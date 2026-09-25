'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, User, Shield, AlertCircle, ArrowRight } from 'lucide-react';

interface FacebookOAuthModalProps {
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

// Generate stable deterministic Facebook UID from email (numeric string, ~15 digits)
export function getDeterministicFacebookId(email: string): string {
  const cleanEmail = email.toLowerCase().trim();
  let hash = 2166136261;
  for (let i = 0; i < cleanEmail.length; i++) {
    hash ^= cleanEmail.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  const base = Math.abs(hash).toString().padStart(9, '7');
  const reversed = base.split('').reverse().join('');
  return `${base}${reversed}`.slice(0, 15);
}

export default function FacebookOAuthModal({
  isOpen,
  onClose,
  onSelectAccount,
  isLoading,
  defaultEmail = '',
  title = 'Đăng nhập bằng Facebook',
}: FacebookOAuthModalProps) {
  const [emailInput, setEmailInput] = useState(defaultEmail || '');
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const [selectedDemoUser, setSelectedDemoUser] = useState<string | null>(null);

  // Sync defaultEmail
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
      name: 'Lê Minh Khoa',
      email: 'khoa.le@facebook.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=khoa.le@facebook.com',
    },
    {
      name: 'Phạm Thị Hương',
      email: 'huong.pham@facebook.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=huong.pham@facebook.com',
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
        providerId: getDeterministicFacebookId(demo.email),
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Đăng nhập Facebook thất bại');
      setSelectedDemoUser(null);
    }
  };

  const handleSubmitCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Vui lòng nhập địa chỉ email Facebook hợp lệ.');
      return;
    }

    const resolvedName = nameInput.trim() || cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
    const formattedName = resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1);
    const providerId = getDeterministicFacebookId(cleanEmail);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`;

    try {
      await onSelectAccount({
        email: cleanEmail,
        name: formattedName,
        avatar,
        providerId,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Đăng nhập Facebook thất bại');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Facebook F icon */}
            <div className="w-6 h-6 rounded-full bg-[#1877F2] flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
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
                      ? 'border-[#1877F2] bg-blue-50 dark:bg-blue-950/20 ring-2 ring-blue-200 dark:ring-blue-900'
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
                    <div className="w-4 h-4 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin" />
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
                Địa chỉ Email Facebook
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your-name@example.com"
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#1877F2]"
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
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#1877F2]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !emailInput}
              className="w-full mt-2 py-2.5 bg-[#1877F2] text-white rounded-xl hover:bg-[#166FE5] font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
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
            <span>Xác thực OAuth 2.0 an toàn và bảo mật với Facebook</span>
          </div>
        </div>
      </div>
    </div>
  );
}
