import { useState, type FC } from 'react';
import type { LevelStat, ExamRoom, AdminUser, Language, JLPTLevel, FormQuotaStat } from '../types';
import { translations, getAnnualExamTitle, getAnnualExamShort, formatExamDate } from '../i18n';
import { api } from '../api';
import { EditQuotaModal } from './EditQuotaModal';
import { EditGlobalQuotaModal } from './EditGlobalQuotaModal';
import { EditExamYearModal } from './EditExamYearModal';
import { AddEditRoomModal } from './AddEditRoomModal';
import { ManageRoomExamineesModal } from './ManageRoomExamineesModal';
import { LoginModal } from './LoginModal';
import { ChangeAdminPasswordModal } from './ChangeAdminPasswordModal';
import {
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  LogIn,
  LogOut,
  Sliders,
  Calendar,
  Loader2,
  KeyRound,
} from 'lucide-react';

interface AdminViewProps {
  levelStats: LevelStat[];
  formQuota: FormQuotaStat;
  examRooms: ExamRoom[];
  adminUser: AdminUser;
  onLogin: (username: string) => void;
  onLogout: () => void;
  onIncrementRegistered: (level: JLPTLevel) => void;
  onUpdateGlobalQuota: (totalQuota: number, formsSold?: number) => void;
  onUpdateExamSchedule: (newYear: string, newDate: string) => void;
  onUpdateLevelRegistered: (level: string, registered: number) => void;
  onSaveRoom: (roomData: Omit<ExamRoom, 'id' | 'examinees'> & { id?: string }) => void;
  onDeleteRoom: (roomId: string) => void;
  onAddExamineeToRoom: (roomId: string, firstName: string, lastName: string) => void;
  onBatchAddExaminees: (roomId: string, examinees: { firstName: string; lastName: string }[]) => void;
  onRemoveExamineeFromRoom: (roomId: string, examineeId: string) => void;
  onResetData: () => void;
  lang: Language;
  examYear?: string;
  examDate?: string;
}

export const AdminView: FC<AdminViewProps> = ({
  levelStats,
  formQuota,
  examRooms,
  adminUser,
  onLogin,
  onLogout,
  onIncrementRegistered,
  onUpdateGlobalQuota,
  onUpdateExamSchedule,
  onUpdateLevelRegistered,
  onSaveRoom,
  onDeleteRoom,
  onAddExamineeToRoom,
  onBatchAddExaminees,
  onRemoveExamineeFromRoom,
  onResetData,
  lang,
  examYear = '2026',
  examDate = '2026-07-05',
}) => {
  const t = translations[lang];
  const formattedExamDate = formatExamDate(examDate, lang);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isGlobalQuotaModalOpen, setIsGlobalQuotaModalOpen] = useState(false);
  const [isExamYearModalOpen, setIsExamYearModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<LevelStat | null>(null);
  const [roomModalData, setRoomModalData] = useState<{ isOpen: boolean; room: ExamRoom | null }>({
    isOpen: false,
    room: null,
  });
  const [manageExamineesRoom, setManageExamineesRoom] = useState<ExamRoom | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenManageExaminees = async (room: ExamRoom) => {
    try {
      const data = await api.getRoomApplicants(room.id);
      setManageExamineesRoom({
        ...room,
        examinees: (data.applicants || []).map((a: any) => ({
          id: a.id,
          firstName: a.firstName,
          lastName: a.lastName,
          registeredDate: '',
        })),
      });
    } catch {
      setManageExamineesRoom(room);
    }
  };

  const refreshRoomExaminees = async (roomId: string) => {
    try {
      const data = await api.getRoomApplicants(roomId);
      setManageExamineesRoom((prev) =>
        prev && prev.id === roomId
          ? {
              ...prev,
              examinees: (data.applicants || []).map((a: any) => ({
                id: a.id,
                firstName: a.firstName,
                lastName: a.lastName,
                registeredDate: '',
              })),
            }
          : prev
      );
    } catch {
      // ignore
    }
  };


  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoggingIn(true);
    try {
      const res = await api.login('admin', 'jlpt2026');
      onLogin(res.user.username);
    } catch {
      onLogin('admin');
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  // If not authenticated, render Login view directly
  if (!adminUser.isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 animate-fadeIn">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 text-white p-6 border-b-2 border-red-700 text-center">
            <div className="w-12 h-12 rounded-xl bg-red-700 text-white mx-auto flex items-center justify-center mb-3 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {t.loginTitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {t.loginSubtitle}
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-xs leading-relaxed">
              <span className="font-semibold block mb-0.5">{t.loginHint}</span>
              <span>{getAnnualExamShort(lang, examYear)} &bull; JLPT Examination Committee</span>
            </div>

            <button
              onClick={handleDemoLogin}
              disabled={isDemoLoggingIn}
              className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDemoLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              <span>{t.demoLoginBtn}</span>
            </button>

            <div className="text-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                {t.login} (Manual Credentials)
              </button>
            </div>
          </div>
        </div>

        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={onLogin}
          lang={lang}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Staff Admin Top Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-red-500 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                {t.adminDashboardTitle}
              </h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                Online
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t.adminDashboardSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsExamYearModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            title={t.editExamScheduleBtn}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.editExamScheduleBtn} ({formattedExamDate.shortDate})</span>
          </button>

          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors border border-slate-800"
            title={t.adminSettingsBtn}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.adminSettingsBtn}</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all applicant data and exam rooms to defaults?')) {
                onResetData();
                triggerToast(t.resetSuccess);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors"
            title={t.resetToDefaultBtn}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetToDefaultBtn}</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
            title={t.logout}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </div>


      {/* 1. Global Form Quota & Exam Schedule & Level Adjustment */}
      <section className="space-y-6">
        {/* Exam Schedule (Year & Date) Configuration Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block"></span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {t.examYearCardTitle}
                </h3>
                <span className="text-xs bg-slate-900 text-white px-2.5 py-0.5 rounded-full font-bold">
                  {t.examDateLabel}: {formattedExamDate.shortDate}
                </span>
                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
                  ປີ {examYear}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t.examYearCardDesc}
              </p>
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t.examDateLabel}</span>
                  <span className="font-bold text-slate-900">{formattedExamDate.longDate} ({formattedExamDate.shortDate})</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t.examYearPreviewLabel}</span>
                  <span className="font-bold text-red-700">{getAnnualExamTitle(lang, examYear)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsExamYearModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.editExamScheduleBtn}</span>
            </button>
          </div>
        </div>
        {/* Global Unified Form Quota Admin Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="w-2.5 h-6 bg-red-700 rounded-sm inline-block"></span>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {t.totalFormQuotaTitle}
                </h3>
                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
                  {t.unifiedFormBadge}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {t.totalFormQuotaDesc}
              </p>
            </div>

            <button
              onClick={() => setIsGlobalQuotaModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t.editGlobalQuotaBtn}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    {t.totalFormsLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGlobalQuotaModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 hover:text-slate-900 bg-slate-200/70 hover:bg-slate-200 px-2 py-0.5 rounded transition-colors"
                    title={t.editDirectlyBtn}
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{t.editDirectlyBtn}</span>
                  </button>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-900">
                    {formQuota.totalQuota}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {t.formUnit}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 p-3.5 rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-900 block">
                    {t.usedFormsLabel}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsGlobalQuotaModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200/80 px-2 py-0.5 rounded transition-colors"
                    title={t.editDirectlyBtn}
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{t.editDirectlyBtn}</span>
                  </button>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-blue-800">
                    {formQuota.totalRegistered}
                  </span>
                  <span className="text-xs text-blue-600 font-medium">
                    {t.formUnit}
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border ${
              formQuota.remaining <= 0
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50/70 border-emerald-100 text-emerald-800'
            }`}>
              <span className="text-[11px] font-semibold block">
                {t.remainingFormsLabel}
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-2xl font-black ${
                  formQuota.remaining <= 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}>
                  {formQuota.remaining}
                </span>
                <span className="text-xs font-medium opacity-80">
                  {t.formUnit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Applicants Quick Adjustment */}
        <div>
          <div className="mb-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span>{t.quickAdjustTitle}</span>
            </h4>
            <p className="text-xs text-slate-500">
              {t.quickAdjustDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {levelStats.map((stat) => {
              const isQuotaFull = formQuota.remaining <= 0;

              return (
                <div
                  key={stat.level}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Level Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {stat.level}
                        </span>
                        <span className="font-bold text-xs text-slate-800">
                          JLPT {stat.level}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">
                        {stat.testTime}
                      </span>
                    </div>

                    {/* Registered Display */}
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-3">
                      <span className="text-[10px] font-medium text-slate-600 block truncate">
                        {t.registeredInLevel}
                      </span>
                      <span className="text-2xl font-black text-slate-900 block mt-0.5">
                        {stat.registered} <span className="text-xs font-normal text-slate-500">{t.personUnit}</span>
                      </span>
                    </div>
                  </div>

                  {/* Adjustment Buttons: +1 or Edit Count */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        onIncrementRegistered(stat.level);
                        triggerToast(`+1 Applicant added to JLPT ${stat.level}`);
                      }}
                      disabled={isQuotaFull}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                        isQuotaFull
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-red-700 hover:bg-red-800 text-white shadow-xs active:scale-95'
                      }`}
                      title={t.addOneBtn}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.addOneBtn}</span>
                    </button>

                    <button
                      onClick={() => setEditingStat(stat)}
                      className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                      title={t.editDirectlyBtn}
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{t.editDirectlyBtn}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Exam Rooms Management */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-6 bg-slate-900 rounded-sm inline-block"></span>
              {t.manageRoomsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t.manageRoomsDesc}
            </p>
          </div>

          <button
            onClick={() => setRoomModalData({ isOpen: true, room: null })}
            className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewRoomBtn}</span>
          </button>
        </div>

        {/* Room Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white font-semibold text-xs border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">{t.roomNameField}</th>
                  <th className="py-3 px-4">{t.levelField}</th>
                  <th className="py-3 px-4">{t.buildingField}</th>
                  <th className="py-3 px-4">{t.floorField}</th>
                  <th className="py-3 px-4 text-center">{t.examineeCount} / {t.roomCapacity}</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {room.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        JLPT {room.level}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-xs">
                      {room.building}
                    </td>
                    <td className="py-3 px-4 text-slate-700 text-xs">
                      {room.floor}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono text-xs font-semibold text-slate-800">
                        {room.examineeCount ?? room.examinees.length} / {room.capacity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Manage Examinees */}
                        <button
                          onClick={() => handleOpenManageExaminees(room)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-md text-xs font-semibold transition-colors flex items-center gap-1 border border-red-200"
                          title={t.manageExamineesBtn}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{t.manageExamineesBtn}</span>
                        </button>


                        {/* Edit Room */}
                        <button
                          onClick={() => setRoomModalData({ isOpen: true, room })}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title={t.editRoomBtn}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Room */}
                        <button
                          onClick={() => {
                            if (window.confirm(t.confirmDeleteRoom)) {
                              onDeleteRoom(room.id);
                              triggerToast('Room deleted successfully');
                            }
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title={t.deleteRoomBtn}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Global Total Form Quota Modal */}
      <EditGlobalQuotaModal
        isOpen={isGlobalQuotaModalOpen}
        onClose={() => setIsGlobalQuotaModalOpen(false)}
        currentTotalQuota={formQuota.totalQuota}
        totalRegistered={formQuota.totalRegistered}
        onSave={(newQuota, newFormsSold) => {
          onUpdateGlobalQuota(newQuota, newFormsSold);
          triggerToast(t.saveSuccess);
        }}
        lang={lang}
      />

      {/* Edit Exam Schedule Modal */}
      <EditExamYearModal
        isOpen={isExamYearModalOpen}
        onClose={() => setIsExamYearModalOpen(false)}
        currentYear={examYear}
        currentDate={examDate}
        onSave={(newYear, newDate) => {
          onUpdateExamSchedule(newYear, newDate);
          triggerToast(t.examScheduleSuccess);
        }}
        lang={lang}
      />

      {/* Direct Level Registered Count Edit Modal */}
      <EditQuotaModal
        stat={editingStat}
        isOpen={Boolean(editingStat)}
        onClose={() => setEditingStat(null)}
        onSave={(level, registered) => {
          onUpdateLevelRegistered(level, registered);
          triggerToast(t.saveSuccess);
        }}
        lang={lang}
      />

      {/* Add / Edit Room Modal */}
      <AddEditRoomModal
        room={roomModalData.room}
        isOpen={roomModalData.isOpen}
        onClose={() => setRoomModalData({ isOpen: false, room: null })}
        onSave={(roomData) => {
          onSaveRoom(roomData);
          triggerToast(t.saveSuccess);
        }}
        lang={lang}
      />

      {/* Manage Examinees in Room Modal */}
      <ManageRoomExamineesModal
        room={manageExamineesRoom}
        isOpen={Boolean(manageExamineesRoom)}
        onClose={() => setManageExamineesRoom(null)}
        onAddExaminee={async (roomId, firstName, lastName) => {
          await onAddExamineeToRoom(roomId, firstName, lastName);
          await refreshRoomExaminees(roomId);
          triggerToast('Examinee added successfully');
        }}
        onBatchAddExaminees={async (roomId, examinees) => {
          await onBatchAddExaminees(roomId, examinees);
          await refreshRoomExaminees(roomId);
          triggerToast(`Batch added ${examinees.length} examinees`);
        }}
        onRemoveExaminee={async (roomId, examineeId) => {
          await onRemoveExamineeFromRoom(roomId, examineeId);
          await refreshRoomExaminees(roomId);
          triggerToast('Examinee removed');
        }}
        lang={lang}
      />

      {/* Change Admin Password / Credentials Modal */}
      <ChangeAdminPasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentUsername={adminUser.username}
        onSuccess={(newUsername) => {
          onLogin(newUsername);
          triggerToast(t.credentialsUpdateSuccess);
        }}
        lang={lang}
      />
    </div>
  );
};

