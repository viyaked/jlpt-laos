import { useState, useEffect, type FC } from 'react';
import type { LevelStat, ExamRoom, Language, FormQuotaStat } from '../types';
import { translations } from '../i18n';
import { api } from '../api';
import { RosterModal } from './RosterModal';
import {
  Users,
  Ticket,
  Building,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  ExternalLink,
  Info,
} from 'lucide-react';

interface PublicViewProps {
  levelStats: LevelStat[];
  formQuota: FormQuotaStat;
  examRooms: ExamRoom[];
  lang: Language;
}

export const PublicView: FC<PublicViewProps> = ({
  levelStats,
  formQuota,
  examRooms,
  lang,
}) => {
  const t = translations[lang];

  // State for filtering rooms & search
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRoom, setActiveRoom] = useState<ExamRoom | null>(null);
  const [matchedCandidates, setMatchedCandidates] = useState<any[]>([]);

  // Live search candidates across database
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length >= 2) {
      api.searchApplicants(q)
        .then(setMatchedCandidates)
        .catch(() => setMatchedCandidates([]));
    } else {
      setMatchedCandidates([]);
    }
  }, [searchQuery]);

  // Extract unique buildings
  const buildings = Array.from(new Set(examRooms.map((r) => r.building)));

  // Filter exam rooms
  const filteredRooms = examRooms.filter((room) => {
    const matchLevel = selectedLevel === 'ALL' || room.level === selectedLevel;
    const matchBuilding =
      selectedBuilding === 'ALL' || room.building === selectedBuilding;

    if (!searchQuery.trim()) {
      return matchLevel && matchBuilding;
    }

    const q = searchQuery.toLowerCase().trim();
    const matchRoomCode = room.code.toLowerCase().includes(q);
    const matchRoomBuilding = room.building.toLowerCase().includes(q);
    const matchRoomFloor = room.floor.toLowerCase().includes(q);
    const hasMatchedDbCandidate = matchedCandidates.some((m) => m.room.id === room.id);

    return matchLevel && matchBuilding && (matchRoomCode || matchRoomBuilding || matchRoomFloor || hasMatchedDbCandidate);
  });

  // Calculate totals from unified formQuota
  const totalRegistered = formQuota.totalRegistered;
  const totalQuota = formQuota.totalQuota;
  const totalRemaining = formQuota.remaining;
  const percentFilled = Math.min(100, Math.round((totalRegistered / Math.max(1, totalQuota)) * 100));
  const isFull = formQuota.isFull || totalRemaining <= 0;
  const isAlmostFull = !isFull && totalRemaining <= 30;

  return (
    <div className="space-y-8 pb-12">
      {/* Announcement Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800 mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>{t.realtimeBadge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            {t.publicWelcomeTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            {t.publicWelcomeSubtitle}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/80">
            <div>
              <span className="text-xs text-slate-400 block">{t.examDate}</span>
              <span className="font-semibold text-sm text-white flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4 text-red-400" />
                05/07/2026
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">{t.usedFormsLabel}</span>
              <span className="font-bold text-lg text-blue-400 flex items-center gap-1.5 mt-0.5">
                <Users className="w-4 h-4" />
                {totalRegistered} <span className="text-xs font-normal text-slate-300">{t.formUnit}</span>
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">{t.remainingFormsLabel}</span>
              <span className={`font-bold text-lg flex items-center gap-1.5 mt-0.5 ${
                isFull ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                <Ticket className="w-4 h-4" />
                {totalRemaining} <span className="text-xs font-normal text-slate-300">{t.formUnit}</span>
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">{t.totalFormsLabel}</span>
              <span className="font-bold text-lg text-slate-200 mt-0.5 block">
                {totalQuota} <span className="text-xs font-normal text-slate-400">{t.formUnit}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Real-time Unified Form Quota & Level Overview */}
      <section className="space-y-6">
        {/* Unified Form Quota Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block"></span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {t.totalFormQuotaTitle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  {t.unifiedFormBadge}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {t.totalFormQuotaDesc}
              </p>
            </div>

            {/* Status Badge */}
            {isFull ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 self-start sm:self-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                {t.statusFull}
              </span>
            ) : isAlmostFull ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 self-start sm:self-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
                {t.statusAlmostFull}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 self-start sm:self-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                {t.statusOpen}
              </span>
            )}
          </div>

          {/* 3 Large Counter Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Forms */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-xs font-semibold text-slate-600 block">
                {t.totalFormsLabel}
              </span>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {totalQuota}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {t.formUnit} ({t.slotsUnit})
                </span>
              </div>
            </div>

            {/* Registered Forms */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4">
              <span className="text-xs font-semibold text-blue-900 block">
                {t.usedFormsLabel}
              </span>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className="text-3xl font-black text-blue-800 tracking-tight">
                  {totalRegistered}
                </span>
                <span className="text-xs font-medium text-blue-600">
                  {t.formUnit} ({t.personUnit})
                </span>
              </div>
            </div>

            {/* Remaining Forms */}
            <div className={`p-4 rounded-xl border ${
              isFull
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
            }`}>
              <span className="text-xs font-semibold block">
                {t.remainingFormsLabel}
              </span>
              <div className="flex items-baseline gap-1.5 mt-2">
                <span className={`text-3xl font-black tracking-tight ${
                  isFull ? 'text-rose-700' : 'text-emerald-700'
                }`}>
                  {totalRemaining}
                </span>
                <span className="text-xs font-medium opacity-80">
                  {t.formUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium text-slate-600">
              <span>{t.filledPercent}: <strong className="text-slate-900">{percentFilled}%</strong></span>
              <span>{totalRemaining} {t.formUnit} {t.seatsLeft}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull ? 'bg-red-600' : isAlmostFull ? 'bg-amber-500' : 'bg-red-700'
                }`}
                style={{ width: `${percentFilled}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 2. JLPT Levels Details Section (No per-level quota!) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <span>{t.levelInfoTitle}</span>
            </h4>
            <span className="text-xs text-slate-500">
              {t.levelInfoDesc}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {levelStats.map((stat) => {
              const levelPercentOfTotal = totalRegistered > 0
                ? Math.round((stat.registered / totalRegistered) * 100)
                : 0;

              return (
                <div
                  key={stat.level}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
                          {stat.level}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          JLPT {stat.level}
                        </span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                        {levelPercentOfTotal}% {t.percentOfTotal}
                      </span>
                    </div>

                    {/* Registered count for this level */}
                    <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 my-2">
                      <span className="text-[11px] font-medium text-slate-600 block">
                        {t.registeredInLevel}
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-900">
                          {stat.registered}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {t.personUnit}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Level Details: Time and Fee */}
                  <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{stat.testTime}</span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-slate-700 font-semibold">
                      <span>{stat.fee.toLocaleString()} LAK</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Exam Rooms Directory & Roster Viewer */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-6 bg-slate-900 rounded-sm inline-block"></span>
              {t.roomsSectionTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.roomsSectionSubtitle}
            </p>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchByNameOrRoom}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            {/* Level Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                aria-label={t.levelLabel}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 font-medium text-slate-700"
              >
                <option value="ALL">{t.filterAllLevels}</option>
                <option value="N1">JLPT N1</option>
                <option value="N2">JLPT N2</option>
                <option value="N3">JLPT N3</option>
                <option value="N4">JLPT N4</option>
                <option value="N5">JLPT N5</option>
              </select>
            </div>

            {/* Building Filter */}
            <div className="sm:col-span-3">
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                aria-label={t.buildingLabel}
                className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 font-medium text-slate-700"
              >
                <option value="ALL">{t.filterAllBuildings}</option>
                {buildings.map((bldg) => (
                  <option key={bldg} value={bldg}>
                    {bldg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 italic">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t.searchByNameHint}</span>
          </div>
        </div>

        {/* Exam Room Cards Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => {
              // Highlight if candidate search matches someone in this room
              const matchedCandidate = searchQuery.trim()
                ? (matchedCandidates.find((m) => m.room.id === room.id) ||
                   room.examinees.find((ex) =>
                     `${ex.firstName} ${ex.lastName}`
                       .toLowerCase()
                       .includes(searchQuery.toLowerCase().trim())
                   ))
                : null;

              return (
                <div
                  key={room.id}
                  onClick={() => setActiveRoom(room)}
                  className={`bg-white rounded-xl border p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${
                    matchedCandidate
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Room Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-slate-900 group-hover:text-red-700 transition-colors">
                            {room.code}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-bold rounded bg-slate-100 text-slate-700 border border-slate-200">
                            JLPT {room.level}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-mono">
                        {room.examineeCount ?? room.examinees.length} / {room.capacity} {t.personUnit}
                      </span>
                    </div>


                    {/* Location Information */}
                    <div className="space-y-1.5 mb-4 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          <strong className="font-semibold text-slate-700">{t.buildingLabel}:</strong> {room.building}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          <strong className="font-semibold text-slate-700">{t.floorLabel}:</strong> {room.floor}
                        </span>
                      </div>
                    </div>

                    {/* Search match notice */}
                    {matchedCandidate && (
                      <div className="bg-emerald-100 text-emerald-900 p-2 rounded-lg text-xs font-medium mb-3 border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>
                          {t.foundCandidatesNotice}: <strong>{matchedCandidate.firstName} {matchedCandidate.lastName}</strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Button to View Examinee List */}
                  <button
                    type="button"
                    className="w-full mt-2 py-2 px-3 bg-slate-100 hover:bg-red-700 hover:text-white text-slate-800 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 group-hover:bg-red-700 group-hover:text-white"
                  >
                    <span>{t.viewRosterBtn}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-800 text-base mb-1">
              {t.noRoomsFound}
            </h4>
            <p className="text-xs text-slate-500">
              {t.searchByNameHint}
            </p>
          </div>
        )}
      </section>

      {/* Roster Modal View */}
      <RosterModal
        room={activeRoom}
        isOpen={Boolean(activeRoom)}
        onClose={() => setActiveRoom(null)}
        lang={lang}
      />
    </div>
  );
};
