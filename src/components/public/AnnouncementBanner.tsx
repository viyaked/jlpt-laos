import { Calendar, Megaphone, BarChart3, Clock, MapPin } from 'lucide-react';
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
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-slate-800/80 relative overflow-hidden animate-fadeIn">
      {/* Ambient background glows */}
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-red-600/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute left-1/3 bottom-0 translate-y-12 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-800/70">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
            <span>{t.realtimeBadge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-snug">
            {t.publicWelcomeTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 font-lo leading-relaxed">
            {t.publicWelcomeSubtitle}
          </p>

          {/* Key capability pills for examinees */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-medium transition-colors border border-white/5">
              <Megaphone className="w-3.5 h-3.5 text-red-400 shrink-0" aria-hidden="true" />
              <span>{lang === 'lo' ? 'ປະກາດການສອບເສັງ' : 'Official Notices'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-medium transition-colors border border-white/5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>{lang === 'lo' ? 'ໂຄຕ້າ & ບ່ອນນັ່ງວ່າງ' : 'Live Quota & Seats'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-medium transition-colors border border-white/5">
              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
              <span>{lang === 'lo' ? 'ຕາຕະລາງເວລາ & ຄ່າທຳນຽມ' : 'Schedules & Fees'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-medium transition-colors border border-white/5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
              <span>{lang === 'lo' ? 'ຄົ້ນຫາຫ້ອງສອບ & ແຜນຜັງ' : 'Room Search & Map'}</span>
            </span>
          </div>
        </div>

        {/* Exam Date Card */}
        <div className="bg-slate-900/90 backdrop-blur-xs border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-center shrink-0 min-w-[220px]">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
            {t.examDateLabel}
          </span>
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <Calendar className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />
            <span className="font-mono">{formattedExamDate.shortDate}</span>
          </div>
          <span className="text-xs text-slate-400 font-lo mt-1">
            {formattedExamDate.longDate}
          </span>
        </div>
      </div>
    </section>
  );
}