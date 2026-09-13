import { Clock } from 'lucide-react';
import type { LevelStat, FormQuotaStat, Language } from '../../types';
import { translations } from '../../i18n';
import { Card, Badge } from '../ui';

interface LevelStatsGridProps {
  levelStats: LevelStat[];
  formQuota: FormQuotaStat;
  lang: Language;
}

export function LevelStatsGrid({ levelStats, formQuota, lang }: LevelStatsGridProps) {
  const t = translations[lang];
  const totalRegistered = formQuota.totalRegistered;

  return (
    <div className="space-y-3 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-slate-900 rounded-sm inline-block" aria-hidden="true" />
          {t.levelInfoTitle}
        </h4>
        <span className="text-xs text-slate-500">
          {t.levelInfoDesc}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {levelStats.map((stat) => {
          const levelPercentOfTotal = totalRegistered > 0
            ? Math.round((stat.registered / totalRegistered) * 100)
            : 0;

          return (
            <Card key={stat.level} variant="default" padding="md" className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      {stat.level}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      JLPT {stat.level}
                    </span>
                  </div>
                  <Badge variant="outline" size="xs" className="bg-slate-100 text-slate-600 border-slate-200">
                    {levelPercentOfTotal}% {t.percentOfTotal}
                  </Badge>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 my-2">
                  <span className="text-[11px] font-medium text-slate-600 block">
                    {t.registeredInLevel}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-slate-900">
                      {stat.registered}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {t.personUnit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" aria-hidden="true" />
                    <span>{stat.testTime}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-slate-700 font-semibold">
                  <span>{stat.fee.toLocaleString()} LAK</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}