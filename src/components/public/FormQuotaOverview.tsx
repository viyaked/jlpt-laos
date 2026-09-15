import type { FormQuotaStat, Language } from '../../types';
import { translations } from '../../i18n';
import { Card, Badge } from '../ui';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface FormQuotaOverviewProps {
  formQuota: FormQuotaStat;
  lang: Language;
}

export function FormQuotaOverview({ formQuota, lang }: FormQuotaOverviewProps) {
  const t = translations[lang];
  const { remainingForms, registrationOpen } = formQuota;
  const isFull = remainingForms <= 0 || !registrationOpen;

  return (
    <Card variant="default" padding="none" className="p-5 sm:p-6 rounded-2xl shadow-xs animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block" aria-hidden="true" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {t.totalFormQuotaTitle}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-lo">
            {t.totalFormQuotaDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" size="md" className="bg-slate-50 text-slate-800 border-slate-300 font-bold py-1 px-3">
            {t.totalFormsLabel}: {formQuota.totalQuota} {t.formUnit}
          </Badge>
          <Badge
            variant={registrationOpen && !isFull ? 'success' : 'danger'}
            size="md"
            dot
            className="text-xs sm:text-sm py-1 px-3 font-semibold"
          >
            {registrationOpen && !isFull ? t.statusOpen : t.statusFull}
          </Badge>
        </div>
      </div>

      {/* Only Remaining Forms Card */}
      <div className="pt-5">
        <div
          className={`p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
            isFull
              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
              : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {isFull ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            )}
            <span className="text-base sm:text-lg font-bold text-slate-900">
              {t.remainingFormsLabel}
            </span>
          </div>

          <div className="flex items-baseline gap-2 shrink-0 bg-white/90 backdrop-blur-xs px-6 py-3 rounded-xl border border-slate-200/60 shadow-xs self-start sm:self-auto">
            <span
              className={`text-4xl sm:text-5xl font-black tracking-tight leading-none ${
                isFull ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {remainingForms}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-500">{t.formUnit}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}