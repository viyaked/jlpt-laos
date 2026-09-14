import { Calendar, Clock, Sliders, Banknote, Plus, Edit2 } from 'lucide-react';
import type { LevelStat, FormQuotaStat, Language, JLPTLevel } from '../../types';
import { translations, formatExamDate, getAnnualExamTitle } from '../../i18n';
import { Card, Badge, Button } from '../ui';

interface ExamScheduleCardProps {
  examYear: string;
  examDate: string;
  lang: Language;
  onEditClick: () => void;
}

export function ExamScheduleCard({ examYear, examDate, lang, onEditClick }: ExamScheduleCardProps) {
  const t = translations[lang];
  const formattedExamDate = formatExamDate(examDate, lang);

  return (
    <Card variant="default" padding="lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block" aria-hidden="true" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.examYearCardTitle}
            </h3>
            <Badge variant="default" size="sm" className="bg-slate-900 text-white">
              {t.examDateLabel}: {formattedExamDate.shortDate}
            </Badge>
            <Badge variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200">
              ປີ {examYear}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {t.examYearCardDesc}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t.examDateLabel}</span>
              <span className="font-bold text-slate-900">{formattedExamDate.longDate} ({formattedExamDate.shortDate})</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t.examYearPreviewLabel}</span>
              <span className="font-bold text-red-700">{getAnnualExamTitle(lang, examYear)}</span>
            </div>
          </div>
        </div>

        <Button variant="primary" leftIcon={<Calendar className="w-4 h-4" />} onClick={onEditClick} className="self-start sm:self-auto shrink-0">
          {t.editExamScheduleBtn}
        </Button>
      </div>
    </Card>
  );
}

interface GlobalQuotaCardProps {
  formQuota: FormQuotaStat;
  lang: Language;
  onEditClick: () => void;
}

export function GlobalQuotaCard({ formQuota, lang, onEditClick }: GlobalQuotaCardProps) {
  const t = translations[lang];

  return (
    <Card variant="default" padding="lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block" aria-hidden="true" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.totalFormQuotaTitle}
            </h3>
            <Badge variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200">
              {t.unifiedFormBadge}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {t.totalFormQuotaDesc}
          </p>
        </div>

        <Button variant="secondary" size="sm" leftIcon={<Sliders className="w-3.5 h-3.5" />} onClick={onEditClick}>
          {t.editGlobalQuotaBtn}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4">
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600 block">
                {t.totalFormsLabel}
              </span>
              <Button variant="ghost" size="xs" leftIcon={<Edit2 className="w-3 h-3" />} onClick={onEditClick} className="text-slate-700 hover:text-slate-900">
                {t.editDirectlyBtn}
              </Button>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">
                {formQuota.totalQuota}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {t.formUnit}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-blue-900 block">
                {t.formsSoldLabel}
              </span>
              <Button variant="ghost" size="xs" leftIcon={<Edit2 className="w-3 h-3" />} onClick={onEditClick} className="text-blue-700 hover:text-blue-900">
                {t.editFormsSoldBtn}
              </Button>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-blue-800">
                {formQuota.formsSold}
              </span>
              <span className="text-xs text-blue-600 font-medium">
                {t.formUnit}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 border border-amber-100 p-3.5 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-900 block">
                {t.totalRegisteredLabel}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-amber-800">
                {formQuota.totalRegistered}
              </span>
              <span className="text-xs text-amber-600 font-medium">
                {t.personUnit}
              </span>
            </div>
          </div>
        </div>

        <div className={`p-3.5 rounded-xl border ${
          formQuota.isFormsFull
            ? 'bg-rose-50 border-rose-200 text-rose-800'
            : 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
        }`}>
          <span className="text-[11px] font-semibold block">
            {t.remainingFormsLabel}
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-2xl font-black ${
              formQuota.isFormsFull ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              {formQuota.remainingForms}
            </span>
            <span className="text-xs font-medium opacity-80">
              {t.formUnit}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface LevelAdjustmentCardProps {
  levelStats: LevelStat[];
  formQuota: FormQuotaStat;
  lang: Language;
  onIncrement: (level: JLPTLevel) => void;
  onEditClick: (stat: LevelStat) => void;
}

export function LevelAdjustmentCard({ levelStats, formQuota, lang, onIncrement, onEditClick }: LevelAdjustmentCardProps) {
  const t = translations[lang];
  const isFormsFull = formQuota.isFormsFull;

  return (
    <div className="animate-slideUp">
      <div className="mb-3">
        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <span className="w-2.5 h-5 bg-slate-900 rounded-sm inline-block" aria-hidden="true" />
          {t.quickAdjustTitle}
        </h4>
        <p className="text-xs text-slate-500">
          {t.quickAdjustDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {levelStats.map((stat) => (
          <Card key={stat.level} variant="default" padding="md" className="flex flex-col justify-between hover:border-slate-300 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                    {stat.level}
                  </span>
                  <span className="font-bold text-xs text-slate-800">
                    JLPT {stat.level}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  <span>{stat.testTime}</span>
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-2">
                <span className="text-[10px] font-medium text-slate-600 block truncate">
                  {t.registeredInLevel}
                </span>
                <span className="text-2xl font-black text-slate-900 block mt-0.5">
                  {stat.registered} <span className="text-xs font-normal text-slate-500">{t.personUnit}</span>
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/60 px-2.5 py-1.5 rounded-md border border-slate-100 mb-3 font-mono">
                <span className="flex items-center gap-1 text-slate-600">
                  <Banknote className="w-3 h-3 text-slate-400" aria-hidden="true" />
                  <span>{t.examFeeField}</span>
                </span>
                <span className="font-bold text-red-700">
                  {stat.fee.toLocaleString()} LAK
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <Button
                variant={isFormsFull ? 'ghost' : 'danger'}
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => onIncrement(stat.level)}
                disabled={isFormsFull}
                className="flex items-center justify-center gap-1"
              >
                <span>{t.addOneBtn}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit2 className="w-3 h-3" />}
                onClick={() => onEditClick(stat)}
                className="flex items-center justify-center gap-1"
              >
                <span>{t.editDirectlyBtn}</span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}