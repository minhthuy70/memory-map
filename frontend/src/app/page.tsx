'use client';

import Link from 'next/link';
import { MapPin, Heart } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <MapPin className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-slate-900 dark:text-white">Memory Map</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link 
            href="/login"
            className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="px-5 py-2 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors text-sm font-semibold shadow-xs"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
            Your memories have a place.
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
            Lưu giữ những khoảnh khắc quan trọng của bạn trên chính nơi chúng từng xảy ra.
          </p>
          <Link 
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white text-lg rounded-full hover:bg-primary-hover transition-colors shadow-lg hover:shadow-xl"
          >
            <Heart className="h-5 w-5" />
            Bắt đầu lưu kỷ niệm
          </Link>
        </div>

        <div className="relative h-96 md:h-[500px] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary dark:text-accent mx-auto mb-4 animate-pulse" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Bản đồ kỷ niệm của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <MapPin className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Đánh dấu vị trí
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Chọn vị trí trên bản đồ nơi kỷ niệm của bạn đã diễn ra.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <Heart className="h-12 w-12 text-secondary mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Lưu cảm xúc
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Ghi lại cảm xúc và chi tiết của từng khoảnh khắc đặc biệt.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
            <MapPin className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Khám phá lại
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Xem lại hành trình của bạn qua bản đồ và timeline.
            </p>
          </div>
        </div>
      </main>

      <footer className="text-center py-8 text-slate-600 dark:text-slate-400">
        <p>© 2026 Memory Map. Made with ❤️</p>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <Link href="/terms" className="hover:text-primary hover:underline">
            Điều khoản sử dụng
          </Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-primary hover:underline">
            Chính sách bảo mật
          </Link>
        </div>
      </footer>
    </div>
  );
}
