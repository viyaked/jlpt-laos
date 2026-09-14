import type { FormQuotaStat, Language } from '../../types';
import { translations } from '../../i18n';
import { Card, Badge } from '../ui';

interface FormQuotaOverviewProps {
  formQuota: FormQuotaStat;
  lang: Language;
}

export function FormQuotaOverview({ formQuota, lang }: FormQuotaOverviewProps) {
  const t = translations[lang];

  const totalRegistered = formQuota.totalRegistered;
  const formsSold = formQuota.formsSold;
  const totalQuota = formQuota.totalQuota;
  const remainingForms = formQuota.remainingForms;
  const percentFilled = Math.min(100, Math.round((formsSold / Math.max(1, totalQuota)) * 100));
  const isFull = formQuota.isFormsFull || remainingForms <= 0;
  const isAlmostFull = !isFull && remainingForms <= 30;

  return (
    <Card variant="default" padding="none" className="p-4 sm:p-5 md:p-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block" aria-hidden="true" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {t.totalFormQuotaTitle}
            </h3>
            <Badge variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200">
              {t.unifiedFormBadge}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            {t.totalFormQuotaDesc}
          </p>
        </div>

        {isFull ? (
          <Badge variant="danger" size="sm" dot>
            {t.statusFull}
          </Badge>
        ) : isAlmostFull ? (
          <Badge variant="warning" size="sm" dot>
            {t.statusAlmostFull}
          </Badge>
        ) : (
          <Badge variant="success" size="sm" dot>
            {t.statusOpen}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4">
          <span className="text-xs font-semibold text-slate-600 block">
            {t.totalFormsLabel}
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {totalQuota}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {t.formUnit} ({t.slotsUnit})
            </span>
          </div>
        </div>

        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 sm:p-4">
          <span className="text-xs font-semibold text-blue-900 block">
            {t.usedFormsLabel}
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-800 tracking-tight">
              {totalRegistered}
            </span>
            <span className="text-xs font-medium text-blue-600">
              {t.formUnit} ({t.personUnit})
            </span>
          </div>
        </div>

        <div className={`p-3 sm:p-4 rounded-xl border ${
          isFull
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
        }`}>
          <span className="text-xs font-semibold block">
            {t.remainingFormsLabel}
          </span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className={`text-2xl sm:text-3xl font-black tracking-tight ${
              isFull ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {remainingForms}
            </span>
            <span className="text-xs font-medium opacity-80">
              {t.formUnit}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-600">
          <span>{t.filledPercent}: <strong className="text-slate-900">{percentFilled}%</strong></span>
          <span>{remainingForms} {t.formUnit} {t.seatsLeft}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-200">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFull ? 'bg-red-600' : isAlmostFull ? 'bg-amber-500' : 'bg-red-700'
            }`}
            style={{ width: `${percentFilled}%` }}
            role="progressbar"
            aria-valuenow={percentFilled}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${t.filledPercent}: ${percentFilled}%`}
          ></div>
        </div>
      </div>
    </Card>
  );
}