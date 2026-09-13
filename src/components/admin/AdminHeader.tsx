import { ShieldCheck, RotateCcw, LogOut, Calendar, KeyRound, MapPin } from 'lucide-react';
import type { Language } from '../../types';
import { translations, formatExamDate } from '../../i18n';
import { Button, Badge } from '../ui';

interface AdminHeaderProps {
  examDate: string;
  lang: Language;
  onExamYearClick: () => void;
  onCampusMapClick: () => void;
  onChangePasswordClick: () => void;
  onResetClick: () => void;
  onLogout: () => void;
}

export function AdminHeader({
  examDate,
  lang,
  onExamYearClick,
  onCampusMapClick,
  onChangePasswordClick,
  onResetClick,
  onLogout,
}: AdminHeaderProps) {
  const t = translations[lang];
  const formattedExamDate = formatExamDate(examDate, lang);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-red-500 flex items-center justify-center font-bold">
          <ShieldCheck className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">
              {t.adminDashboardTitle}
            </h2>
            <Badge variant="success" size="xs" dot>
              Online
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {t.adminDashboardSubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<MapPin className="w-3.5 h-3.5 text-red-500" />}
          onClick={onCampusMapClick}
        >
          {t.manageCampusMapBtn}
        </Button>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Calendar className="w-3.5 h-3.5" />}
          onClick={onExamYearClick}
        >
          {t.editExamScheduleBtn} ({formattedExamDate.shortDate})
        </Button>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<KeyRound className="w-3.5 h-3.5 text-amber-400" />}
          onClick={onChangePasswordClick}
        >
          {t.adminSettingsBtn}
        </Button>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          onClick={onResetClick}
        >
          {t.resetToDefaultBtn}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
          onClick={onLogout}
        >
          {t.logout}
        </Button>
      </div>
    </div>
  );
}