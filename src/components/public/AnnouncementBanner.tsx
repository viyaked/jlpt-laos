import { Calendar } from 'lucide-react';
import type { Language } from '../../types';
import { translations, formatExamDate } from '../../i18n';

interface AnnouncementBannerProps {
  lang: Language;
  examDate: string;
}

export function AnnouncementBanner({ lang, examDate }: AnnouncementBannerProps) {
  const t = translations[lang];
  const formattedExamDate = formatExamDate(examDate, lang);

  return (
    <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-slate-800 relative overflow-hidden animate-fadeIn">
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800 mb-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" aria-hidden="true" />
          <span>{t.realtimeBadge}</span>
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
          {t.publicWelcomeTitle}
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
          {t.publicWelcomeSubtitle}
        </p>

        <div className="pt-4 border-t border-slate-700/80">
          <span className="text-xs text-slate-400 block mb-1">{t.examDateLabel}</span>
          <span className="font-semibold text-sm sm:text-base text-white flex items-center gap-1.5 mt-1">
            <Calendar className="w-4 h-4 text-red-400" aria-hidden="true" />
            {formattedExamDate.shortDate}
          </span>
          <span className="text-[11px] text-slate-300 block truncate mt-0.5">
            {formattedExamDate.longDate}
          </span>
        </div>
      </div>
    </section>
  );
}