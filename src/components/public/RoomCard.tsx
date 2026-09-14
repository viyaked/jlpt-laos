import { Building, Layers, Image as ImageIcon, CheckCircle2, ExternalLink } from 'lucide-react';
import type { ExamRoom, Language } from '../../types';
import { translations, formatRoomName } from '../../i18n';
import { Card, Badge, Button } from '../ui';

interface RoomCardProps {
  room: ExamRoom;
  lang: Language;
  isMatched: boolean;
  onClick: () => void;
  onPhotoClick: (e: React.MouseEvent) => void;
}

export function RoomCard({
  room,
  lang,
  isMatched,
  onClick,
  onPhotoClick,
}: RoomCardProps) {
  const t = translations[lang];
  const roomName = formatRoomName(room.code, lang);

  return (
    <Card
      variant={isMatched ? 'outlined' : 'default'}
      padding="none"
      className={`
        cursor-pointer group flex flex-col justify-between transition-all
        p-4 sm:p-5
        ${isMatched
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}
      `}
      onClick={onClick}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl text-slate-900 group-hover:text-red-700 transition-colors truncate">
                {roomName}
              </span>
              <Badge variant="outline" size="sm" className="bg-slate-100 text-slate-700 border-slate-200 shrink-0">
                JLPT {room.level}
              </Badge>
            </div>
          </div>
        </div>

        {room.imageUrl && (
          <div
            onClick={onPhotoClick}
            className="relative rounded-lg overflow-hidden border border-slate-200 mb-3 bg-slate-900 group/img cursor-pointer h-24 sm:h-28 shadow-xs"
          >
            <img
              src={room.imageUrl}
              alt={room.code}
              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
            />
            <div className="absolute bottom-2 right-2 bg-slate-950/75 backdrop-blur-xs text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
              <ImageIcon className="w-3 h-3 text-red-400" aria-hidden="true" />
              <span>{t.viewRoomPhotoBtn}</span>
            </div>
          </div>
        )}

        <div className="space-y-1.5 mb-4 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-slate-700">{t.buildingLabel}:</strong> {room.building}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-slate-700">{t.floorLabel}:</strong> {room.floor}
            </span>
          </div>
        </div>

        {isMatched && (
          <div className="bg-emerald-100 text-emerald-900 p-2 rounded-lg text-xs sm:text-sm font-medium mb-3 border border-emerald-200 flex items-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>{t.roomAssignmentFound}</span>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        fullWidth
        leftIcon={<ExternalLink className="w-4 h-4" />}
        className="group-hover:bg-red-700 group-hover:text-white transition-colors py-2.5"
      >
        {t.viewRoomDetailsBtn}
      </Button>
    </Card>
  );
}