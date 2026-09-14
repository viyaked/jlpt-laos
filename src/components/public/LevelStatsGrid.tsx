import { Clock } from 'lucide-react';
import type { LevelStat, Language } from '../../types';
import { translations } from '../../i18n';
import { Card } from '../ui';

interface LevelStatsGridProps {
  levelStats: LevelStat[];
  lang: Language;
}

export function LevelStatsGrid({ levelStats, lang }: LevelStatsGridProps) {
  const t = translations[lang];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {levelStats.map((stat) => {
          const remaining = Math.max(0, stat.quota - stat.registered);
          const isFull = remaining <= 0;

          return (
            <Card key={stat.level} variant="default" padding="sm" className="flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                      {stat.level}
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      JLPT {stat.level}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 my-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    {t.remainingCount}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-2xl font-black ${isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {remaining}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {t.slotsUnit}
                    </span>
                  </div>
                  {isFull && (
                    <span className="text-xs text-rose-700 font-bold mt-1 block">
                      {t.statusFull}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    <span>{stat.testTime}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-slate-900 font-bold">
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