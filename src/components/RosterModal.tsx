import type { ExamRoom, Language } from '../types';
import { translations, formatRoomName } from '../i18n';
import { Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { Button, Modal } from './ui';

interface RosterModalProps {
  room: ExamRoom | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const RosterModal = ({ room, isOpen, onClose, lang }: RosterModalProps) => {
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
          {room.imageUrl && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
              <img src={room.imageUrl} alt={room.code} className="w-full h-44 object-cover" />
              <div className="absolute bottom-2 right-2 bg-slate-950/75 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-red-400" aria-hidden="true" />
                <span>{t.viewRoomPhotoBtn}</span>
              </div>
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

          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs sm:text-sm text-emerald-950">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <strong className="block mb-1 font-bold text-emerald-950 text-sm">{t.roomDetailsPrivacyTitle}</strong>
                <span className="font-medium text-emerald-900 leading-relaxed">{t.roomDetailsPrivacyDesc}</span>
              </div>
            </div>
          </div>

          <Button variant="primary" fullWidth onClick={onClose}>
            {t.closeBtn}
          </Button>
        </div>
      )}
    </Modal>
  );
};
