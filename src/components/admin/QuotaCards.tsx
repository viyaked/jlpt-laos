import { Calendar, Clock, Sliders, Banknote, Plus, Edit2, Users } from 'lucide-react';
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

        <div className="flex items-center gap-3">
          <Badge variant={formQuota.registrationOpen ? 'success' : 'danger'} size="sm" dot>
            {formQuota.registrationOpen ? t.statusOpen : t.statusFull}
          </Badge>
          <Button variant="secondary" size="sm" leftIcon={<Sliders className="w-3.5 h-3.5" />} onClick={onEditClick}>
            {t.editGlobalQuotaBtn}
          </Button>
        </div>
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

interface LevelTheme {
  badgeBg: string;
  badgeText: string;
  barColor: string;
  accentBg: string;
  borderColor: string;
}

const LEVEL_THEMES: Record<string, LevelTheme> = {
  N5: {
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: 'text-emerald-700',
    barColor: 'bg-emerald-500',
    accentBg: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200/70',
  },
  N4: {
    badgeBg: 'bg-sky-600 text-white',
    badgeText: 'text-sky-700',
    barColor: 'bg-sky-500',
    accentBg: 'bg-sky-50/50',
    borderColor: 'border-sky-200/70',
  },
  N3: {
    badgeBg: 'bg-indigo-600 text-white',
    badgeText: 'text-indigo-700',
    barColor: 'bg-indigo-500',
    accentBg: 'bg-indigo-50/50',
    borderColor: 'border-indigo-200/70',
  },
  N2: {
    badgeBg: 'bg-amber-600 text-white',
    badgeText: 'text-amber-700',
    barColor: 'bg-amber-500',
    accentBg: 'bg-amber-50/50',
    borderColor: 'border-amber-200/70',
  },
  N1: {
    badgeBg: 'bg-rose-600 text-white',
    badgeText: 'text-rose-700',
    barColor: 'bg-rose-500',
    accentBg: 'bg-rose-50/50',
    borderColor: 'border-rose-200/70',
  },
};

interface LevelAdjustmentCardProps {
  levelStats: LevelStat[];
  formQuota: FormQuotaStat;
  lang: Language;
  onIncrement: (level: JLPTLevel) => void;
  onEditClick: (stat: LevelStat) => void;
}

export function LevelAdjustmentCard({
  levelStats,
  formQuota,
  lang,
  onIncrement,
  onEditClick,
}: LevelAdjustmentCardProps) {
  const t = translations[lang];
  const isFormsFull = formQuota.isFormsFull;
  const totalCapacity = levelStats.reduce((acc, s) => acc + s.quota, 0);

  return (
    <Card variant="default" padding="lg" className="space-y-5 animate-slideUp">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block" aria-hidden="true" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              {t.quickAdjustTitle}
            </h3>
            <Badge variant="outline" size="sm" className="bg-red-50 text-red-700 border-red-200">
              5 {lang === 'lo' ? 'ລະດັບ' : 'Levels'}
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-lo leading-relaxed">
            {t.quickAdjustDesc}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto text-xs bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-slate-500">{t.totalRegisteredLabel}:</span>
          </div>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-sm font-black text-slate-900">{formQuota.totalRegistered}</span>
            <span className="text-slate-400 font-normal">/</span>
            <span className="text-xs font-semibold text-slate-600">{totalCapacity}</span>
            <span className="text-[11px] text-slate-500 font-sans ml-0.5">{t.personUnit}</span>
          </div>
        </div>
      </div>

      {/* Level Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {levelStats.map((stat) => {
          const theme = LEVEL_THEMES[stat.level] || {
            badgeBg: 'bg-slate-900 text-white',
            badgeText: 'text-slate-700',
            barColor: 'bg-slate-700',
            accentBg: 'bg-slate-50',
            borderColor: 'border-slate-200',
          };
          const remaining = Math.max(0, stat.quota - stat.registered);
          const isLevelFull = remaining <= 0;
          const fillPercent =
            stat.quota > 0 ? Math.min(100, Math.round((stat.registered / stat.quota) * 100)) : 0;
          const cannotAdd = isLevelFull || isFormsFull;

          return (
            <div
              key={stat.level}
              className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-4 shadow-xs hover:shadow-md ${
                isLevelFull ? 'border-rose-300 ring-1 ring-rose-100' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Level Header: Badge + Level Title + Exam Time */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`w-11 h-11 rounded-xl ${theme.badgeBg} font-black text-base flex items-center justify-center shadow-xs shrink-0`}
                  >
                    {stat.level}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-base text-slate-900 leading-none">
                      JLPT {stat.level}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span>{stat.testTime}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics Box */}
                <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 mb-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{t.registeredInLevel}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isLevelFull
                          ? 'bg-rose-100 text-rose-700 font-semibold'
                          : 'bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      {isLevelFull ? (lang === 'lo' ? 'ເຕັມແລ້ວ' : 'FULL') : `${fillPercent}%`}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                        {stat.registered}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        / {stat.quota}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {t.slotsUnit}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isLevelFull ? 'bg-rose-500' : theme.barColor
                      }`}
                      style={{ width: `${fillPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5 text-slate-500">
                    <span>{lang === 'lo' ? 'ຍັງເຫຼືອ:' : 'Remaining:'}</span>
                    <span className={`font-bold ${isLevelFull ? 'text-rose-600' : 'text-slate-900'}`}>
                      {remaining} {t.slotsUnit}
                    </span>
                  </div>
                </div>

                {/* Exam Fee Line */}
                <div className="flex items-center justify-between text-xs px-1 text-slate-600 font-medium mb-3">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Banknote className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                    <span>{t.examFeeField}</span>
                  </span>
                  <span className="font-bold font-mono text-slate-900 text-xs">
                    {stat.fee.toLocaleString()} LAK
                  </span>
                </div>
              </div>

              {/* Action Buttons: Perfectly balanced side-by-side with equal height */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 mt-auto">
                <button
                  type="button"
                  onClick={() => onIncrement(stat.level)}
                  disabled={cannotAdd}
                  className="h-9.5 px-2 inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-xs"
                  title={t.addOneBtn}
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span>{cannotAdd ? (lang === 'lo' ? 'ເຕັມ' : 'Full') : '+1'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditClick(stat)}
                  className="h-9.5 px-2 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 active:scale-95 transition-all border border-slate-200/80"
                  title={t.editDirectlyBtn}
                >
                  <Edit2 className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                  <span>{lang === 'lo' ? 'ແກ້ໄຂ' : 'Edit'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}