import { type FC } from 'react';
import type { Announcement, Language } from '../../types';
import { translations } from '../../i18n';
import {
  Megaphone,
  Pin,
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ZoomIn,
  FileText,
} from 'lucide-react';

interface AnnouncementManagerProps {
  announcements: Announcement[];
  lang: Language;
  onAddClick: () => void;
  onEditClick: (announcement: Announcement) => void;
  onDeleteClick: (id: string) => void;
  onPhotoClick: (url: string, title: string) => void;
}

export const AnnouncementManager: FC<AnnouncementManagerProps> = ({
  announcements,
  lang,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onPhotoClick,
}) => {
  const t = translations[lang];

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return isoString;
    }
  };

  return (
    <section className="space-y-4 pt-4 border-t border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block" />
            {t.manageAnnouncementsTitle}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.manageAnnouncementsDesc}
          </p>
        </div>

        <button
          type="button"
          onClick={onAddClick}
          className="px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.postAnnouncementBtn}</span>
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            {t.noAnnouncementsMessage}
          </p>
          <button
            type="button"
            onClick={onAddClick}
            className="mt-4 px-4 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            {t.postAnnouncementBtn}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="divide-y divide-slate-100">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {item.imageUrl ? (
                    <div
                      onClick={() => onPhotoClick(item.imageUrl!, item.title)}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer relative group"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center justify-center shrink-0">
                      <Megaphone className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-red-700 border border-red-200">
                          <Pin className="w-3 h-3 fill-red-700" />
                          {t.pinnedBadge}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>

                    {item.content && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onEditClick(item)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.editAnnouncementBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(t.confirmDeleteAnnouncement)) {
                        onDeleteClick(item.id);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t.deleteAnnouncementBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
