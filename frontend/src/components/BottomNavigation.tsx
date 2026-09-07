'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Map, Calendar, BarChart3, User, Plus } from 'lucide-react';

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { path: '/dashboard', icon: Map, label: 'Bản đồ' },
    { path: '/timeline', icon: Calendar, label: 'Timeline' },
    { path: '/memories/new', icon: Plus, label: 'Thêm', isMain: true },
    { path: '/statistics', icon: BarChart3, label: 'Thống kê' },
    { path: '/profile', icon: User, label: 'Hồ sơ' },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Hide bottom navigation on login/register pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password') {
    return null;
  }

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 z-50 md:hidden"
      role="navigation"
      aria-label="Điều hướng chính"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/memories/new' && pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all
                ${item.isMain 
                  ? 'bg-primary text-white -mt-6 shadow-lg shadow-primary/30' 
                  : isActive 
                    ? 'text-primary' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }
              `}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={item.isMain ? 'p-2 bg-primary rounded-full' : ''}>
                <Icon className={`h-5 w-5 ${item.isMain ? 'text-white' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium ${item.isMain ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
