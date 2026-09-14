import { Search, X, ShieldCheck } from 'lucide-react';
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
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4 animate-slideUp">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search Input with Search Icon & Clear Button */}
        <div className="sm:col-span-6 relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchByNameOrRoom}
            className="w-full h-11 pl-10 pr-9 text-xs sm:text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 rounded-xl transition-all outline-none font-lo placeholder:text-slate-400"
            aria-label={t.searchByNameOrRoom}
          />
          {searchQuery.trim() && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/60 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Level Filter */}
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
            className="h-11 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 rounded-xl border-slate-200"
          />
        </div>

        {/* Building Filter */}
        <div className="sm:col-span-3">
          <Select
            value={selectedBuilding}
            onChange={(e) => onBuildingChange(e.target.value)}
            options={[
              { value: 'ALL', label: t.filterAllBuildings },
              ...buildings.map((b) => ({ value: b, label: b })),
            ]}
            aria-label={t.buildingLabel}
            className="h-11 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 rounded-xl border-slate-200"
          />
        </div>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="bg-slate-50/90 border border-slate-200/70 rounded-xl px-3.5 py-2.5 text-xs text-slate-600 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
        <span className="font-lo">
          {lang === 'lo' ? (
            <>
              <strong className="font-bold text-slate-800">ພິມຊື່ ແລະ ນາມສະກຸນຂອງທ່ານ</strong> ເພື່ອກວດເບິ່ງຫ້ອງສອບ (ລະບົບຮັກສາຄວາມເປັນສ່ວນຕົວ — ບໍ່ສະແດງຊື່ຜູ້ອື່ນ)
            </>
          ) : (
            <>
              <strong className="font-bold text-slate-800">Enter your full name</strong> to view your assigned exam room (Privacy protected — other candidates are hidden)
            </>
          )}
        </span>
      </div>
    </div>
  );
}