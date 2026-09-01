'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { authApi } from '@/lib/auth-api';
import { useAuthStore } from '@/store/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Bạn phải đồng ý với điều khoản sử dụng và chính sách bảo mật');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register(formData);
      setAuth(response.access_token, response.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <MapPin className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">Memory Map</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Start preserving your memories today
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Minimum 6 characters
              </p>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" className="text-primary hover:text-primary-hover underline">
                    điều khoản sử dụng
                  </Link>
                  {' '}và{' '}
                  <Link href="/privacy" className="text-primary hover:text-primary-hover underline">
                    chính sách bảo mật
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-hover focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
