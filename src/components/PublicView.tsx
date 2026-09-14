'use client';

import { useState, useEffect, useCallback, type FC } from 'react';
import type { LevelStat, ExamRoom, Language, FormQuotaStat } from '../types';
import { translations, formatRoomName } from '../i18n';
import { api } from '../api';
import { RosterModal } from './RosterModal';
import { CampusMapModal } from './CampusMapModal';
import { ImageViewerModal } from './ImageViewerModal';
import { MapPin } from 'lucide-react';
import {
  AnnouncementBanner,
  FormQuotaOverview,
  LevelStatsGrid,
  RoomFilters,
  RoomGrid,
} from './public';

interface PublicViewProps {
  levelStats: LevelStat[];
  formQuota: FormQuotaStat;
  examRooms: ExamRoom[];
  lang: Language;
  examYear?: string;
  examDate?: string;
  campusMap?: string;
}

export const PublicView: FC<PublicViewProps> = ({
  levelStats,
  formQuota,
  examRooms,
  lang,
  examYear: _examYear = '2026',
  examDate = '2026-07-05',
  campusMap = '',
}) => {
  const t = translations[lang];
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<ExamRoom | null>(null);
  const [matchedRoomIds, setMatchedRoomIds] = useState<Set<string>>(new Set());
  const [isCampusMapOpen, setIsCampusMapOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<{ isOpen: boolean; url: string; title: string; subtitle?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setMatchedRoomIds(new Set());
      return;
    }

    let active = true;
    api.searchRoomsByName(q)
      .then((results) => {
        if (active) {
          setMatchedRoomIds(new Set(results.map((result) => result.room.id)));
        }
      })
      .catch(() => {
        if (active) {
          setMatchedRoomIds(new Set());
        }
      });

    return () => {
      active = false;
    };
  }, [searchQuery]);

  const buildings = Array.from(new Set(examRooms.map((r) => r.building)));

  const filteredRooms = examRooms.filter((room) => {
    const matchLevel = selectedLevel === 'ALL' || room.level === selectedLevel;
    const matchBuilding = selectedBuilding === 'ALL' || room.building === selectedBuilding;
    const query = searchQuery.trim();

    if (!query) {
      return matchLevel && matchBuilding;
    }

    return matchLevel && matchBuilding && matchedRoomIds.has(room.id);
  });

  const handleRoomClick = useCallback((room: ExamRoom) => {
    setSelectedRoom(room);
  }, []);

  const handlePhotoClick = useCallback((room: ExamRoom, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewPhoto({
      isOpen: true,
      url: room.imageUrl!,
      title: formatRoomName(room.code, lang),
      subtitle: `${room.building} • ${room.floor} (JLPT ${room.level})`,
    });
  }, [lang]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-8 sm:pb-12 animate-fadeIn">
      <AnnouncementBanner formQuota={formQuota} lang={lang} examDate={examDate} />

      <section className="space-y-6">
        <FormQuotaOverview formQuota={formQuota} lang={lang} />
        <LevelStatsGrid levelStats={levelStats} lang={lang} />
      </section>

      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-6 bg-slate-900 rounded-sm inline-block" aria-hidden="true" />
              {t.roomsSectionTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.roomsSectionSubtitle}
            </p>
          </div>

          <button
            onClick={() => setIsCampusMapOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span>{t.viewCampusMapBtn}</span>
          </button>
        </div>

        <RoomFilters
          selectedLevel={selectedLevel}
          onLevelChange={setSelectedLevel}
          selectedBuilding={selectedBuilding}
          onBuildingChange={setSelectedBuilding}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          buildings={buildings}
          lang={lang}
        />

        <RoomGrid
          rooms={filteredRooms}
          lang={lang}
          matchedRoomIds={matchedRoomIds}
          onRoomClick={handleRoomClick}
          onPhotoClick={handlePhotoClick}
        />
      </section>

      <RosterModal
        room={selectedRoom}
        isOpen={Boolean(selectedRoom)}
        onClose={() => setSelectedRoom(null)}
        lang={lang}
      />

      <CampusMapModal
        isOpen={isCampusMapOpen}
        onClose={() => setIsCampusMapOpen(false)}
        campusMap={campusMap}
        isAdmin={false}
        lang={lang}
      />

      <ImageViewerModal
        isOpen={previewPhoto.isOpen}
        onClose={() => setPreviewPhoto({ isOpen: false, url: '', title: '' })}
        imageUrl={previewPhoto.url}
        title={previewPhoto.title}
        subtitle={previewPhoto.subtitle}
        lang={lang}
      />
    </div>
  );
};