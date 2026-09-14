import type { ExamRoom, Language } from '../types';
import { translations, formatRoomName } from '../i18n';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';
import { Button, Modal } from './ui';

interface RosterModalProps {
  room: ExamRoom | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onViewPhoto?: (room: ExamRoom) => void;
}

export const RosterModal = ({ room, isOpen, onClose, lang, onViewPhoto }: RosterModalProps) => {
  const t = translations[lang];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room ? formatRoomName(room.code, lang) : undefined}
      description={room ? `JLPT ${room.level} • ${room.building} • ${room.floor}` : undefined}
      size="full"
      className="rounded-none sm:rounded-2xl"
    >
      {room && (
        <div className="space-y-4">
          {room.imageUrl ? (
            <div className="space-y-2">
              <div
                role="button"
                tabIndex={0}
                onClick={() => onViewPhoto?.(room)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewPhoto?.(room);
                  }
                }}
                className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                title={t.clickToEnlarge}
              >
                <img
                  src={room.imageUrl}
                  alt={room.code}
                  className="w-full h-44 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors" />
                <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm font-medium">
                  <ZoomIn className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
                  <span>{t.clickToEnlarge}</span>
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                fullWidth
                leftIcon={<ImageIcon className="w-4 h-4 text-white" aria-hidden="true" />}
                onClick={() => onViewPhoto?.(room)}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 shadow-sm"
              >
                {t.viewExamRoomPhotoBtn || t.viewRoomPhotoBtn}
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-slate-500 text-xs sm:text-sm flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4 text-slate-400" aria-hidden="true" />
              <span>{t.noRoomPhoto}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <span className="text-xs text-slate-600 block font-semibold">{t.levelLabel}</span>
              <strong className="font-bold text-base text-slate-900">JLPT {room.level}</strong>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <span className="text-xs text-slate-600 block font-semibold">{t.buildingLabel}</span>
              <strong className="font-bold text-base text-slate-900">{room.building}</strong>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <span className="text-xs text-slate-600 block font-semibold">{t.floorLabel}</span>
              <strong className="font-bold text-base text-slate-900">{room.floor}</strong>
            </div>
          </div>

          <Button
            variant={room.imageUrl ? "outline" : "primary"}
            fullWidth
            onClick={onClose}
          >
            {t.closeBtn}
          </Button>
        </div>
      )}
    </Modal>
  );
};
