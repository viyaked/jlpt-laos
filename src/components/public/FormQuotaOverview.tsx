import type { FormQuotaStat, Language } from '../../types';
import { translations } from '../../i18n';
import { Card, Badge } from '../ui';

interface FormQuotaOverviewProps {
  formQuota: FormQuotaStat;
  lang: Language;
}

export function FormQuotaOverview({ formQuota, lang }: FormQuotaOverviewProps) {
  const t = translations[lang];

  const remainingForms = formQuota.remainingForms;
  const isFull = formQuota.isFormsFull || remainingForms <= 0;

  return (
    <Card variant="default" padding="none" className="p-4 sm:p-5 md:p-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block" aria-hidden="true" />
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {t.remainingFormsLabel}
            </h3>
          </div>
        </div>

        {isFull ? (
          <Badge variant="danger" size="sm" dot>
            {t.statusFull}
          </Badge>
        ) : (
          <Badge variant="success" size="sm" dot>
            {t.statusOpen}
          </Badge>
        )}
      </div>

      <div className={`p-4 sm:p-5 rounded-xl border ${isFull ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-100 text-emerald-800'}`}>
        <span className="text-xs font-semibold block mb-1">
          {t.remainingFormsLabel}
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl sm:text-4xl font-black tracking-tight ${isFull ? 'text-rose-700' : 'text-emerald-700'}`}>
            {remainingForms}
          </span>
          <span className="text-xs font-medium opacity-80">
            {t.formUnit}
          </span>
        </div>
      </div>
    </Card>
  );
}