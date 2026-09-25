'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  as,
  BookOpen,
  CheckCircle,
  Clock,
  Home,
  Layers,
  Layout,
  Navigation,
  RefreshCw,
  Settings,
  SettingsIcon,
  Smartphone,
  User,
  Zap
} from 'lucide-react';

interface NavigationRoute {
  id: string;
  name: string;
  path: string;
  animated: boolean;
  transition: 'push' | 'pop' | 'modal' | 'replace';
  timestamp: Date;
}

interface TabItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  active: boolean;
}

interface NativeNavigationProps {
  onCancel?: () => void;
  onPushRoute?: (route: NavigationRoute) => Promise<void>;
  onPopRoute?: () => Promise<void>;
  onNavigateTo?: (path: string) => Promise<void>;
}

const DEFAULT_ROUTES: NavigationRoute[] = [
  {
    id: 'route-1',
    name: 'Home',
    path: '/home',
    animated: true,
    transition: 'push',
    timestamp: new Date(),
  },
  {
    id: 'route-2',
    name: 'Memories',
    path: '/memories',
    animated: true,
    transition: 'push',
    timestamp: new Date(Date.now() - 3600000),
  },
];

const DEFAULT_TABS: TabItem[] = [
  { id: 'tab-1', name: 'Home', icon: 'home', path: '/home', active: true },
  { id: 'tab-2', name: 'Memories', icon: 'book', path: '/memories', active: false },
  { id: 'tab-3', name: 'Map', icon: 'map', path: '/map', active: false },
  { id: 'tab-4', name: 'Profile', icon: 'user', path: '/profile', active: false },
];

export default function NativeNavigation({ onCancel, onPushRoute, onPopRoute, onNavigateTo }: NativeNavigationProps) {
  const [routes, setRoutes] = useState<NavigationRoute[]>(DEFAULT_ROUTES);
  const [tabs, setTabs] = useState<TabItem[]>(DEFAULT_TABS);
  const [showSettings, setShowSettings] = useState(false);
  const [currentTransition, setCurrentTransition] = useState<'push' | 'pop' | 'modal' | 'replace'>('push');
  const [enableAnimation, setEnableAnimation] = useState(true);
  const [navigationMode, setNavigationMode] = useState<'stack' | 'tab' | 'bottom'>('stack');

  const handlePush = async () => {
    const newRoute: NavigationRoute = {
      id: `route-${Date.now()}`,
      name: 'New Route',
      path: `/route-${Date.now()}`,
      animated: enableAnimation,
      transition: currentTransition,
      timestamp: new Date(),
    };
    if (onPushRoute) {
      await onPushRoute(newRoute);
    }
    setRoutes(prev => [...prev, newRoute]);
  };

  const handlePop = async () => {
    if (routes.length > 1) {
      if (onPopRoute) {
        await onPopRoute();
      }
      setRoutes(prev => prev.slice(0, -1));
    }
  };

  const handleTabSwitch = (tabId: string) => {
    setTabs(prev => prev.map(t => ({ ...t, active: t.id === tabId })));
  };

  const getTransitionColor = (transition: string) => {
    switch (transition) {
      case 'push':
        return 'text-blue-500';
      case 'pop':
        return 'text-green-500';
      case 'modal':
        return 'text-purple-500';
      case 'replace':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  const getTabIcon = (icon: string) => {
    switch (icon) {
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'book':
        return <BookOpen className="h-4 w-4" />;
      case 'map':
        return <Layout className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Điều hướng native
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {routes.length} routes • {navigationMode} mode
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Cài đặt"
          >
            <Settings className="h-4 w-4 text-slate-500" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Đóng"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
            Cài đặt navigation
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Enable animation
              </span>
              <button
                type="button"
                onClick={() => setEnableAnimation(!enableAnimation)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  enableAnimation ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    enableAnimation ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Transition type
              </label>
              <select
                value={currentTransition}
                onChange={(e) => setCurrentTransition(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="push">Push</option>
                <option value="pop">Pop</option>
                <option value="modal">Modal</option>
                <option value="replace">Replace</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Navigation mode
              </label>
              <select
                value={navigationMode}
                onChange={(e) => setNavigationMode(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="stack">Stack Navigation</option>
                <option value="tab">Tab Navigation</option>
                <option value="bottom">Bottom Sheet</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Stack Depth</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {routes.length}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Transition</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {currentTransition}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Mode</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {navigationMode}
          </div>
        </div>
        <div className="p-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] text-slate-600 dark:text-slate-400">Animation</span>
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {enableAnimation ? 'On' : 'Off'}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={handlePush}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          Push Route
        </button>
        <button
          type="button"
          onClick={handlePop}
          disabled={routes.length <= 1}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-500 hover:bg-slate-600 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Pop Route
        </button>
      </div>

      {/* Navigation Stack */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Navigation Stack
        </h4>
        <div className="space-y-2">
          {routes.map((route, index) => (
            <div
              key={route.id}
              className={`p-4 rounded-lg border-2 ${
                index === routes.length - 1
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {route.name}
                  </span>
                  {index === routes.length - 1 && (
                    <CheckCircle className="h-3 w-3 text-blue-500" />
                  )}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getTransitionColor(route.transition)}`}>
                  {route.transition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Path</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {route.path}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Animated</div>
                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    {route.animated ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(route.timestamp).toLocaleTimeString('vi-VN')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="mb-4">
        <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">
          Tab Bar
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabSwitch(tab.id)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                tab.active
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex flex-col items-center gap-1">
                {getTabIcon(tab.icon)}
                <span className="text-[10px] font-medium">{tab.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg">
        <p className="text-[10px] text-blue-700 dark:text-blue-400">
          <strong>Lưu ý:</strong> Điều hướng native sử dụng native navigation controller với stack navigation, tab bar, bottom sheet, và customizable transitions.
        </p>
      </div>
    </div>
  );
}