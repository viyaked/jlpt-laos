import type { ExamRoom, Language } from '../../types';
import { translations } from '../../i18n';
import { AlertCircle } from 'lucide-react';
import { RoomCard } from './RoomCard';

interface RoomGridProps {
  rooms: ExamRoom[];
  lang: Language;
  matchedRoomIds: Set<string>;
  onRoomClick: (room: ExamRoom) => void;
  onPhotoClick: (room: ExamRoom, e: React.MouseEvent) => void;
}

export function RoomGrid({
  rooms,
  lang,
  matchedRoomIds,
  onRoomClick,
  onPhotoClick,
}: RoomGridProps) {
  const t = translations[lang];

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center animate-fadeIn">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" aria-hidden="true" />
        <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1.5">
          {t.noRoomsFound}
        </h4>
        <p className="text-xs sm:text-sm text-slate-600">
          {lang === 'lo' ? (
            <>
              ກະລຸນາ <strong className="font-bold text-slate-900">ພິມຊື່ເຕັມຂອງທ່ານ</strong> ເພື່ອກວດເບິ່ງຫ້ອງສອບເສັງ
            </>
          ) : (
            <>
              Please <strong className="font-bold text-slate-900">enter your full name</strong> to find your exam room
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-slideUp" role="list">
      {rooms.map((room) => {
        const isMatched = matchedRoomIds.has(room.id);

        return (
          <RoomCard
            key={room.id}
            room={room}
            lang={lang}
            isMatched={isMatched}
            onClick={() => onRoomClick(room)}
            onPhotoClick={(e) => onPhotoClick(room, e)}
          />
        );
      })}
    </div>
  );
}