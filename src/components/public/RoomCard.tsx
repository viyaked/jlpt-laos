import { Building, Layers, Image as ImageIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ExamRoom, Language, JLPTLevel } from '../../types';
import { translations, formatRoomName } from '../../i18n';
import { Badge } from '../ui';

interface RoomCardProps {
  room: ExamRoom;
  lang: Language;
  isMatched: boolean;
  onClick: () => void;
  onPhotoClick: (e: React.MouseEvent) => void;
}

const LEVEL_BADGES: Record<JLPTLevel, { bg: string; text: string }> = {
  N5: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', text: 'text-emerald-700' },
  N4: { bg: 'bg-sky-50 border-sky-200 text-sky-700', text: 'text-sky-700' },
  N3: { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', text: 'text-indigo-700' },
  N2: { bg: 'bg-amber-50 border-amber-200 text-amber-700', text: 'text-amber-700' },
  N1: { bg: 'bg-rose-50 border-rose-200 text-rose-700', text: 'text-rose-700' },
};

export function RoomCard({
  room,
  lang,
  isMatched,
  onClick,
  onPhotoClick,
}: RoomCardProps) {
  const t = translations[lang];
  const roomName = formatRoomName(room.code, lang);
  const levelBadge = LEVEL_BADGES[room.level] || {
    bg: 'bg-slate-100 border-slate-200 text-slate-800',
    text: 'text-slate-800',
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={`
        cursor-pointer group flex flex-col justify-between transition-all duration-200
        p-5 rounded-2xl border shadow-xs hover:shadow-md hover:-translate-y-0.5 bg-white
        ${
          isMatched
            ? 'border-emerald-500 ring-2 ring-emerald-500/25 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-slate-300'
        }
      `}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div>
        {/* Top Header: Room Name + JLPT Level Badge */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <h4 className="font-bold text-lg sm:text-xl text-slate-900 group-hover:text-red-700 transition-colors truncate">
            {roomName}
          </h4>
          <Badge
            variant="outline"
            size="sm"
            className={`${levelBadge.bg} shrink-0 font-bold px-2.5 py-0.5 rounded-lg border`}
          >
            JLPT {room.level}
          </Badge>
        </div>

        {/* Room Photo Preview if Available */}
        {room.imageUrl && (
          <div
            onClick={onPhotoClick}
            className="relative rounded-xl overflow-hidden border border-slate-200/80 mb-3.5 bg-slate-900 group/img cursor-pointer h-28 sm:h-32 shadow-xs"
          >
            <img
              src={room.imageUrl}
              alt={room.code}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-bold shadow-xs">
              <ImageIcon className="w-3 h-3 text-red-400" aria-hidden="true" />
              <span>{t.viewRoomPhotoBtn}</span>
            </div>
          </div>
        )}

        {/* Building and Floor Info Chips */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-2 rounded-xl text-xs">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <span className="text-slate-400 text-[10px] block leading-tight">{t.buildingLabel}</span>
              <strong className="font-bold text-slate-800 text-xs">{room.building}</strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/70 px-2.5 py-2 rounded-xl text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="truncate">
              <span className="text-slate-400 text-[10px] block leading-tight">{t.floorLabel}</span>
              <strong className="font-bold text-slate-800 text-xs">{room.floor}</strong>
            </span>
          </div>
        </div>

        {/* Matched Banner (when user search matches examinee) */}
        {isMatched && (
          <div className="bg-emerald-100/90 text-emerald-950 p-2.5 rounded-xl text-xs sm:text-sm font-bold mb-3 border border-emerald-300 flex items-center gap-2 animate-fadeIn shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <span className="font-lo">{t.roomAssignmentFound}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 group-hover:text-red-700 transition-colors">
        <span>{t.viewRoomDetailsBtn}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </div>
    </div>
  );
}