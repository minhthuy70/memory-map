'use client';

import { useState } from 'react';
import { BookOpen, CheckCircle, Globe, Info, Languages, RefreshCw, Star, Volume2 } from 'lucide-react';

interface LanguageTranslationProps {
  onCancel?: () => void;
}

interface LanguageTranslation {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  completion: number;
  lastUpdated: string;
  translators: number;
}

interface TranslationEntry {
  key: string;
  vi: string;
  en: string;
  ja: string;
  ko: string;
  zhCN: string;
  zhTW: string;
  fr: string;
  es: string;
  de: string;
  pt: string;
  th: string;
  id: string;
  ar: string;
  hi: string;
}

export default function LanguageTranslation({ onCancel }: LanguageTranslationProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('vi');

  const [languages, setLanguages] = useState<LanguageTranslation[]>([
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', direction: 'ltr', completion: 100, lastUpdated: '2026-09-14', translators: 5 },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', direction: 'ltr', completion: 100, lastUpdated: '2026-09-14', translators: 8 },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', direction: 'ltr', completion: 95, lastUpdated: '2026-09-13', translators: 4 },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', direction: 'ltr', completion: 92, lastUpdated: '2026-09-12', translators: 3 },
    { code: 'zhCN', name: 'Chinese Simplified', nativeName: '简体中文', flag: '🇨🇳', direction: 'ltr', completion: 98, lastUpdated: '2026-09-14', translators: 6 },
    { code: 'zhTW', name: 'Chinese Traditional', nativeName: '繁體中文', flag: '🇹🇼', direction: 'ltr', completion: 96, lastUpdated: '2026-09-13', translators: 5 },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr', completion: 90, lastUpdated: '2026-09-11', translators: 4 },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr', completion: 89, lastUpdated: '2026-09-10', translators: 5 },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr', completion: 88, lastUpdated: '2026-09-09', translators: 3 },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', direction: 'ltr', completion: 86, lastUpdated: '2026-09-08', translators: 4 },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', direction: 'ltr', completion: 82, lastUpdated: '2026-09-07', translators: 2 },
    { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', direction: 'ltr', completion: 84, lastUpdated: '2026-09-06', translators: 3 },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl', completion: 80, lastUpdated: '2026-09-05', translators: 2 },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr', completion: 78, lastUpdated: '2026-09-04', translators: 2 },
  ]);

  const [translations, setTranslations] = useState<TranslationEntry[]>([
    { key: 'welcome', vi: 'Chào mừng đến với Memory Map', en: 'Welcome to Memory Map', ja: 'Memory Mapへようこそ', ko: 'Memory Map에 오신 것을 환영합니다', zhCN: '欢迎使用 Memory Map', zhTW: '歡迎使用 Memory Map', fr: 'Bienvenue sur Memory Map', es: 'Bienvenido a Memory Map', de: 'Willkommen bei Memory Map', pt: 'Bem-vindo ao Memory Map', th: 'ยินดีต้อนรับสู่ Memory Map', id: 'Selamat datang di Memory Map', ar: 'مرحباً بك في Memory Map', hi: 'Memory Map में आपका स्वागत है' },
    { key: 'login', vi: 'Đăng nhập', en: 'Login', ja: 'ログイン', ko: '로그인', zhCN: '登录', zhTW: '登入', fr: 'Connexion', es: 'Iniciar sesión', de: 'Anmelden', pt: 'Entrar', th: 'เข้าสู่ระบบ', id: 'Masuk', ar: 'تسجيل الدخول', hi: 'लॉग इन करें' },
    { key: 'memories', vi: 'Kỷ niệm', en: 'Memories', ja: '思い出', ko: '추억', zhCN: '回忆', zhTW: '回憶', fr: 'Souvenirs', es: 'Recuerdos', de: 'Erinnerungen', pt: 'Memórias', th: 'ความทรงจำ', id: 'Kenangan', ar: 'الذكريات', hi: 'यादें' },
    { key: 'settings', vi: 'Cài đặt', en: 'Settings', ja: '設定', ko: '설정', zhCN: '设置', zhTW: '設定', fr: 'Paramètres', es: 'Configuración', de: 'Einstellungen', pt: 'Configurações', th: 'การตั้งค่า', id: 'Pengaturan', ar: 'الإعدادات', hi: 'सेटिंग्स' },
    { key: 'logout', vi: 'Đăng xuất', en: 'Logout', ja: 'ログアウト', ko: '로그아웃', zhCN: '退出', zhTW: '登出', fr: 'Déconnexion', es: 'Cerrar sesión', de: 'Abmelden', pt: 'Sair', th: 'ออกจากระบบ', id: 'Keluar', ar: 'تسجيل الخروج', hi: 'लॉग आउट' },
  ]);

  const getCurrentLanguage = () => {
    return languages.find(l => l.code === selectedLanguage) || languages[0];
  };

  const currentLanguage = getCurrentLanguage();

  const getCompletionColor = (completion: number) => {
    if (completion >= 95) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
    if (completion >= 80) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  const getTranslationValue = (entry: TranslationEntry, langCode: string) => {
    const mapping: Record<string, keyof TranslationEntry> = {
      vi: 'vi',
      en: 'en',
      ja: 'ja',
      ko: 'ko',
      zhCN: 'zhCN',
      zhTW: 'zhTW',
      fr: 'fr',
      es: 'es',
      de: 'de',
      pt: 'pt',
      th: 'th',
      id: 'id',
      ar: 'ar',
      hi: 'hi',
    };
    return entry[mapping[langCode]] || entry.en;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Language Translations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage all language translations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Show details"
          >
            {showDetails ? <Info className="h-4 w-4 text-slate-500" /> : <Info className="h-4 w-4 text-slate-500" />}
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

      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Languages</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{languages.length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Complete</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">{languages.filter(l => l.completion === 100).length}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Selected</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentLanguage.name}</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Translators</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentLanguage.translators}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name} ({lang.nativeName})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Language: {currentLanguage.flag} {currentLanguage.name}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Native Name</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentLanguage.nativeName}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Direction</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white uppercase">
                {currentLanguage.direction}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Completion</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${getCompletionColor(currentLanguage.completion)}`}>
                {currentLanguage.completion}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-slate-500" />
                <span className="text-xs text-slate-700 dark:text-slate-300">Last Updated</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {currentLanguage.lastUpdated}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Translations Preview</h4>
          <div className="space-y-2">
            {translations.map((entry) => (
              <div key={entry.key} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{entry.key}</span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {getTranslationValue(entry, selectedLanguage)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg">
          <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">All Languages</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-3 rounded-lg border text-left ${
                  selectedLanguage === lang.code
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedLanguage === lang.code && <CheckCircle className="h-3 w-3 text-blue-500" />}
                  <span className="text-sm">{lang.flag}</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">{lang.name}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{lang.nativeName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${getCompletionColor(lang.completion)}`}>
                    {lang.completion}%
                  </span>
                  {lang.direction === 'rtl' && (
                    <span className="px-1 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      RTL
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showDetails && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Language Translation Tips</h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• Vietnamese is the default source language</li>
              <li>• Completion percentage indicates translation coverage</li>
              <li>• RTL languages require special layout handling</li>
              <li>• Multiple translators can collaborate on each language</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
