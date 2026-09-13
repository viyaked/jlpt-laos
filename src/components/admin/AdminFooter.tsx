import { type Language } from '../../types';
import { translations } from '../../i18n';

interface AdminFooterProps {
  lang: Language;
  examYear: string;
}

export function AdminFooter({ lang, examYear }: AdminFooterProps) {
  const t = translations[lang];

  return (
    <footer className="bg-slate-900 text-slate-400 py-6 sm:py-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div>
          <p className="font-semibold text-slate-300">
            {t.instituteName} &bull; {t.annualExamShort.replace('2026', examYear)}
          </p>
          <p className="text-slate-400 mt-1">
            {t.footerText.replace('2026', examYear)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>{t.liveConnected}</span>
          </span>
          <span className="text-slate-400">
            Language: <strong className="text-slate-200">{lang === 'lo' ? 'ລາວ (Lao)' : 'English'}</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}