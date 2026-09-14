import { Search } from 'lucide-react';
import type { Language } from '../../types';
import { translations } from '../../i18n';
import { Select } from '../ui';

interface RoomFiltersProps {
  selectedLevel: string;
  onLevelChange: (value: string) => void;
  selectedBuilding: string;
  onBuildingChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  buildings: string[];
  lang: Language;
}

export function RoomFilters({
  selectedLevel,
  onLevelChange,
  selectedBuilding,
  onBuildingChange,
  searchQuery,
  onSearchChange,
  buildings,
  lang,
}: RoomFiltersProps) {
  const t = translations[lang];

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 animate-slideUp">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchByNameOrRoom}
            className="w-full pl-9 pr-4 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            aria-label={t.searchByNameOrRoom}
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            value={selectedLevel}
            onChange={(e) => onLevelChange(e.target.value)}
            options={[
              { value: 'ALL', label: t.filterAllLevels },
              { value: 'N1', label: 'JLPT N1' },
              { value: 'N2', label: 'JLPT N2' },
              { value: 'N3', label: 'JLPT N3' },
              { value: 'N4', label: 'JLPT N4' },
              { value: 'N5', label: 'JLPT N5' },
            ]}
            aria-label={t.levelLabel}
            className="py-3 text-sm font-medium text-slate-700"
          />
        </div>

        <div className="sm:col-span-3">
          <Select
            value={selectedBuilding}
            onChange={(e) => onBuildingChange(e.target.value)}
            options={[
              { value: 'ALL', label: t.filterAllBuildings },
              ...buildings.map((b) => ({ value: b, label: b })),
            ]}
            aria-label={t.buildingLabel}
            className="py-3 text-sm font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="text-xs text-slate-600 flex items-center gap-1.5">
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8h.01" />
        </svg>
        <span>
          {lang === 'lo' ? (
            <>
              <strong className="font-bold text-slate-800">ພິມຊື່ເຕັມຂອງທ່ານ</strong> ເພື່ອກວດເບິ່ງຫ້ອງສອບຂອງທ່ານ
            </>
          ) : (
            <>
              <strong className="font-bold text-slate-800">Enter your full name</strong> to find your exam room
            </>
          )}
        </span>
      </div>
    </div>
  );
}