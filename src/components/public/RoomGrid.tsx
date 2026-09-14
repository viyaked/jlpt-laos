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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-10 sm:p-14 text-center animate-fadeIn shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3.5">
          <AlertCircle className="w-7 h-7" aria-hidden="true" />
        </div>
        <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-1">
          {t.noRoomsFound}
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 font-lo max-w-md mx-auto">
          {lang === 'lo' ? (
            <>
              ກະລຸນາ <strong className="font-bold text-slate-800">ພິມຊື່ ແລະ ນາມສະກຸນຂອງທ່ານ</strong> ໃນຊ່ອງຄົ້ນຫາດ້ານເທິງ ເພື່ອກວດເບິ່ງຫ້ອງສອບເສັງ
            </>
          ) : (
            <>
              Please <strong className="font-bold text-slate-800">enter your full name</strong> in the search box above to find your exam room
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