import type { FC } from 'react';
import type { Language, AdminUser } from '../types';
import { translations } from '../i18n';
import { ShieldCheck, Users, LogOut, LogIn } from 'lucide-react';


interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: 'public' | 'admin';
  onViewModeChange: (mode: 'public' | 'admin') => void;
  adminUser: AdminUser;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  viewMode,
  onViewModeChange,
  adminUser,
  onLogout,
  onOpenLogin,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b-2 border-red-700">
      {/* Top Notice Bar */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium tracking-wide">
            {t.annualExamShort} &bull; {t.examDate}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span>{t.instituteSubtitle}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo & Institute Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewModeChange('public')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-700 flex items-center justify-center text-white shadow-sm border border-red-600 shrink-0">
              <span className="font-bold text-sm sm:text-base tracking-tighter">JLPT</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg tracking-tight text-white leading-tight">
                  {t.instituteName}
                </h1>
                <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-800 text-red-400 border border-slate-700">
                  日本語
                </span>
              </div>
              <p className="text-xs text-slate-300 font-normal leading-normal">
                {t.annualExamTitle}
              </p>
            </div>
          </div>

          {/* Controls: Portal Switcher, Language Switcher, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle Buttons */}
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center shadow-inner">
              <button
                onClick={() => onViewModeChange('public')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'public'
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={t.publicView}
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.publicView}</span>
              </button>

              <button
                onClick={() => onViewModeChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  viewMode === 'admin'
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
                title={t.adminView}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.adminView}</span>
                {adminUser.isAuthenticated && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => onLanguageChange('lo')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  lang === 'lo'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="ພາສາລາວ (Lao)"
              >
                ລາວ
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  lang === 'en'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Admin User Button / State */}
            {adminUser.isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  {t.adminBadge}
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                  title={t.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : viewMode === 'admin' ? (
              <button
                onClick={onOpenLogin}
                className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
