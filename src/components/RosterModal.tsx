import { useState, useEffect, type FC } from 'react';
import type { ExamRoom, Language } from '../types';
import { translations } from '../i18n';
import { api } from '../api';
import { X, Search, ShieldAlert, Users, Loader2 } from 'lucide-react';

interface RosterModalProps {
  room: ExamRoom | null;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const RosterModal: FC<RosterModalProps> = ({
  room,
  isOpen,
  onClose,
  lang,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [examinees, setExaminees] = useState<{ id: string; firstName: string; lastName: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && room) {
      setIsLoading(true);
      api.getRoomApplicants(room.id)
        .then((data) => {
          setExaminees(data.applicants || []);
        })
        .catch(() => {
          setExaminees([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, room]);

  if (!isOpen || !room) return null;

  const t = translations[lang];

  const filteredExaminees = examinees.filter((ex) => {
    const fullName = `${ex.firstName} ${ex.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (

    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b-2 border-red-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm">
              {room.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight text-white">
                  {room.code}
                </h3>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  JLPT {room.level}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {room.building} &bull; {room.floor}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            title={t.closeBtn}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Notice Banner - Strict Compliance with Requirements */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold block text-amber-950 mb-0.5">
                {t.privacyNoticeTitle}
              </span>
              <p className="leading-relaxed">
                {t.privacyNoticeDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Content & List */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Stats & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-800 flex items-center gap-1.5">
                {t.totalInRoom}:{' '}
                <span className="font-bold text-red-700 text-base">
                  {isLoading ? '...' : examinees.length}
                </span>{' '}
                {t.personUnit}
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
              </span>

            </div>

            {/* Filter in Room */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchInRoomPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>
          </div>

          {/* Candidates Table: ONLY First Name & Last Name */}
          <div className="border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-xs">
                <tr>
                  <th className="py-2.5 px-4 w-16 text-center">{t.orderCol}</th>
                  <th className="py-2.5 px-4">{t.candidateNameCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExaminees.length > 0 ? (
                  filteredExaminees.map((ex, index) => (
                    <tr
                      key={ex.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-2.5 px-4 text-center font-mono text-xs text-slate-500">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-900 tracking-wide">
                        {ex.firstName} {ex.lastName}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-8 text-center text-slate-500 text-sm">
                      {searchTerm ? t.noRoomsFound : t.emptyRoster}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
