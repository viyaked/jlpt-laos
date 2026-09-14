import type { FormQuotaStat, Language } from '../../types';
import { translations } from '../../i18n';
import { Card, Badge } from '../ui';
import { FileText, CheckCircle2, AlertTriangle, Users } from 'lucide-react';

interface FormQuotaOverviewProps {
  formQuota: FormQuotaStat;
  lang: Language;
}

export function FormQuotaOverview({ formQuota, lang }: FormQuotaOverviewProps) {
  const t = translations[lang];
  const { totalQuota, formsSold, remainingForms, registrationOpen } = formQuota;
  const soldPercent = totalQuota > 0 ? Math.min(100, Math.round((formsSold / totalQuota) * 100)) : 0;
  const isFull = remainingForms <= 0 || !registrationOpen;

  return (
    <Card variant="default" padding="none" className="p-5 sm:p-6 rounded-2xl shadow-xs animate-slideUp">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
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
          <p className="text-xs sm:text-sm text-slate-500 font-lo">
            {t.totalFormQuotaDesc}
          </p>
        </div>

        <Badge
          variant={registrationOpen && !isFull ? 'success' : 'danger'}
          size="md"
          dot
          className="self-start sm:self-auto text-xs sm:text-sm py-1 px-3"
        >
          {registrationOpen && !isFull ? t.statusOpen : t.statusFull}
        </Badge>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5">
        {/* Remaining Forms (Hero Metric) */}
        <div
          className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
            isFull
              ? 'bg-rose-50/80 border-rose-200 text-rose-900'
              : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold block opacity-80">
              {t.remainingFormsLabel}
            </span>
            {isFull ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span
              className={`text-3xl sm:text-4xl font-black tracking-tight ${
                isFull ? 'text-rose-700' : 'text-emerald-700'
              }`}
            >
              {remainingForms}
            </span>
            <span className="text-xs font-bold opacity-80">{t.formUnit}</span>
          </div>
        </div>

        {/* Forms Sold */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 block">
              {t.formsSoldLabel}
            </span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {formsSold}
            </span>
            <span className="text-xs font-bold text-slate-500">{t.formUnit}</span>
          </div>
        </div>

        {/* Total Quota */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 block">
              {t.totalFormsLabel}
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {totalQuota}
            </span>
            <span className="text-xs font-bold text-slate-500">{t.formUnit}</span>
          </div>
        </div>
      </div>

      {/* Progress Track */}
      <div className="pt-4 mt-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>{lang === 'lo' ? 'ອັດຕາການຂາຍຟອມຕົວຈິງ' : 'Form Sales Progress'}</span>
          <span className="font-bold font-mono text-slate-700">{soldPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFull ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${soldPercent}%` }}
          />
        </div>
      </div>
    </Card>
  );
}