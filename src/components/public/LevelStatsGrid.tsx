import { Clock, Banknote, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { LevelStat, Language, JLPTLevel } from '../../types';
import { translations } from '../../i18n';
import { Badge } from '../ui';

interface LevelStatsGridProps {
  levelStats: LevelStat[];
  lang: Language;
}

const LEVEL_THEMES: Record<
  JLPTLevel,
  {
    badgeBg: string;
    badgeText: string;
    barColor: string;
    lightBg: string;
    borderColor: string;
  }
> = {
  N5: {
    badgeBg: 'bg-emerald-600 text-white',
    badgeText: 'text-emerald-700',
    barColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200/70',
  },
  N4: {
    badgeBg: 'bg-sky-600 text-white',
    badgeText: 'text-sky-700',
    barColor: 'bg-sky-500',
    lightBg: 'bg-sky-50/50',
    borderColor: 'border-sky-200/70',
  },
  N3: {
    badgeBg: 'bg-indigo-600 text-white',
    badgeText: 'text-indigo-700',
    barColor: 'bg-indigo-500',
    lightBg: 'bg-indigo-50/50',
    borderColor: 'border-indigo-200/70',
  },
  N2: {
    badgeBg: 'bg-amber-600 text-white',
    badgeText: 'text-amber-700',
    barColor: 'bg-amber-500',
    lightBg: 'bg-amber-50/50',
    borderColor: 'border-amber-200/70',
  },
  N1: {
    badgeBg: 'bg-rose-600 text-white',
    badgeText: 'text-rose-700',
    barColor: 'bg-rose-500',
    lightBg: 'bg-rose-50/50',
    borderColor: 'border-rose-200/70',
  },
};

export function LevelStatsGrid({ levelStats, lang }: LevelStatsGridProps) {
  const t = translations[lang];

  return (
    <div className="space-y-4 animate-slideUp">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <div>
          <h4 className="font-bold text-lg text-slate-900 flex items-center gap-2 tracking-tight">
            <span className="w-2.5 h-6 bg-slate-900 rounded-sm inline-block" aria-hidden="true" />
            {t.levelInfoTitle}
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 font-lo mt-0.5">
            {t.levelInfoDesc}
          </p>
        </div>
      </div>

      {/* Grid of 5 JLPT Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {levelStats.map((stat) => {
          const theme = LEVEL_THEMES[stat.level] || {
            badgeBg: 'bg-slate-900 text-white',
            badgeText: 'text-slate-700',
            barColor: 'bg-slate-700',
            lightBg: 'bg-slate-50',
            borderColor: 'border-slate-200',
          };
          const remaining = Math.max(0, stat.quota - stat.registered);
          const isFull = remaining <= 0;
          const isAlmostFull = !isFull && remaining <= 10;

          return (
            <div
              key={stat.level}
              className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                isFull
                  ? 'border-rose-300 ring-1 ring-rose-100'
                  : isAlmostFull
                  ? 'border-amber-300 ring-1 ring-amber-100'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Level Header: Color Badge + Level Title + Test Time */}
                <div className="flex items-center gap-3 mb-3.5">
                  <span
                    className={`w-11 h-11 rounded-xl ${theme.badgeBg} font-black text-base flex items-center justify-center shadow-xs shrink-0`}
                  >
                    {stat.level}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="font-bold text-base text-slate-900 leading-none">
                        JLPT {stat.level}
                      </h5>
                      {isFull ? (
                        <Badge variant="danger" size="sm" className="text-[10px] px-1.5 py-0.5 font-bold">
                          {lang === 'lo' ? 'ເຕັມ' : 'FULL'}
                        </Badge>
                      ) : isAlmostFull ? (
                        <Badge variant="warning" size="sm" className="text-[10px] px-1.5 py-0.5 font-bold">
                          {lang === 'lo' ? 'ໃກ້ເຕັມ' : 'LOW'}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono mt-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">{stat.testTime}</span>
                    </div>
                  </div>
                </div>

                {/* Remaining Seats Hero Card */}
                <div
                  className={`rounded-xl p-3.5 mb-3 border transition-colors ${
                    isFull
                      ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                      : isAlmostFull
                      ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                      : 'bg-slate-50/90 border-slate-200/80 text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold opacity-75">
                      {lang === 'lo' ? 'ຍັງເຫຼືອ' : 'Available'}
                    </span>
                    {isFull ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${
                        isFull ? 'text-rose-700' : isAlmostFull ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {remaining}
                    </span>
                    <span className="text-xs font-bold opacity-75">{t.slotsUnit}</span>
                  </div>
                </div>
              </div>

              {/* Fee Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Banknote className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lang === 'lo' ? 'ຄ່າສະໝັກ' : 'Fee'}</span>
                </span>
                <span className="font-mono font-bold text-slate-900 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60">
                  {stat.fee.toLocaleString()} LAK
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}