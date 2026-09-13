import type { ExamRoom, Language } from '../../types';
import { translations } from '../../i18n';
import { AlertCircle } from 'lucide-react';
import { RoomCard } from './RoomCard';

interface RoomGridProps {
  rooms: ExamRoom[];
  lang: Language;
  searchQuery: string;
  matchedCandidates: any[];
  onRoomClick: (room: ExamRoom) => void;
  onPhotoClick: (room: ExamRoom, e: React.MouseEvent) => void;
}

export function RoomGrid({
  rooms,
  lang,
  searchQuery,
  matchedCandidates,
  onRoomClick,
  onPhotoClick,
}: RoomGridProps) {
  const t = translations[lang];

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center animate-fadeIn">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" aria-hidden="true" />
        <h4 className="font-semibold text-slate-800 text-base mb-1">
          {t.noRoomsFound}
        </h4>
        <p className="text-xs text-slate-500">
          {t.searchByNameHint}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-slideUp" role="list">
      {rooms.map((room) => {
        const matchedCandidate = searchQuery.trim()
          ? (matchedCandidates.find((m) => m.room.id === room.id) ||
             room.examinees.find((ex) =>
               `${ex.firstName} ${ex.lastName}`
                 .toLowerCase()
                 .includes(searchQuery.toLowerCase().trim())
             ))
          : null;

        return (
          <RoomCard
            key={room.id}
            room={room}
            lang={lang}
            matchedCandidate={matchedCandidate}
            onClick={() => onRoomClick(room)}
            onPhotoClick={(e) => onPhotoClick(room, e)}
          />
        );
      })}
    </div>
  );
}