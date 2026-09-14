import { type FC } from 'react';
import type { Announcement, Language } from '../../types';
import { translations } from '../../i18n';
import {
  Megaphone,
  Pin,
  Calendar,
  ZoomIn,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

interface InformationBoardProps {
  announcements: Announcement[];
  lang: Language;
  onViewPoster: (imageUrl: string, title: string) => void;
}

export const InformationBoard: FC<InformationBoardProps> = ({
  announcements,
  lang,
  onViewPoster,
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
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 relative overflow-hidden animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5 sm:mt-0">
            <Megaphone className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {t.infoBoardTitle}
              </h3>
              {announcements.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {announcements.length}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
              {t.infoBoardSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Announcements List / Grid */}
      {announcements.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-500">
            {t.noAnnouncementsMessage}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {announcements.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden group ${
                item.isPinned
                  ? 'border-red-300 bg-gradient-to-b from-red-50/40 via-white to-white shadow-xs hover:shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Poster Image preview if available */}
                {item.imageUrl && (
                  <div
                    onClick={() => onViewPoster(item.imageUrl!, item.title)}
                    className="relative w-full h-52 sm:h-60 bg-slate-900 overflow-hidden cursor-pointer group/img"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-4">
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                        <ZoomIn className="w-3.5 h-3.5" />
                        {t.viewFullPosterBtn}
                      </span>
                      <span className="text-[11px] text-slate-300 bg-black/40 px-2 py-1 rounded">
                        <ImageIcon className="w-3 h-3 inline mr-1" />
                        Poster
                      </span>
                    </div>
                  </div>
                )}

                {/* Content body */}
                <div className="p-5 sm:p-6 space-y-3">
                  {/* Badges and date */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-red-700 border border-red-200">
                          <Pin className="w-3 h-3 fill-red-700" />
                          {t.pinnedBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1 shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-red-700 transition-colors">
                    {item.title}
                  </h4>

                  {/* Text Details */}
                  {item.content && (
                    <div
                      className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line"
                      style={{
                        lineHeight: '1.85',
                        wordBreak: 'keep-all',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer with poster link */}
              <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                {item.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => onViewPoster(item.imageUrl!, item.title)}
                    className="text-red-700 hover:text-red-800 font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{t.viewFullPosterBtn}</span>
                  </button>
                ) : (
                  <span className="text-slate-400 text-[11px] font-medium">
                    JLPT Information
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
