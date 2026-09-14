import { useState, type FC } from 'react';
import type { LevelStat, ExamRoom, AdminUser, Language, JLPTLevel, FormQuotaStat } from '../types';
import { translations, formatRoomName } from '../i18n';
import { api } from '../api';
import { EditQuotaModal } from './EditQuotaModal';
import { EditGlobalQuotaModal } from './EditGlobalQuotaModal';
import { EditExamYearModal } from './EditExamYearModal';
import { AddEditRoomModal } from './AddEditRoomModal';
import { ManageRoomExamineesModal } from './ManageRoomExamineesModal';
import { ChangeAdminPasswordModal } from './ChangeAdminPasswordModal';
import { CampusMapModal } from './CampusMapModal';
import { ImageViewerModal } from './ImageViewerModal';
import {
  AdminHeader,
  AdminFooter,
  LoginView,
  ToastNotification,
  ExamScheduleCard,
  GlobalQuotaCard,
  LevelAdjustmentCard,
  RoomTable,
  AddRoomButton,
} from './admin';

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
  onUpdateLevel?: (
    level: string,
    data: { registered: number; fee: number; testTime: string; quota: number }
  ) => void;
  onUpdateLevelRegistered?: (level: string, registered: number) => void;
  onSaveRoom: (roomData: Omit<ExamRoom, 'id' | 'examinees'> & { id?: string }) => void;
  onDeleteRoom: (roomId: string) => void;
  onAddExamineeToRoom: (roomId: string, fullName: string) => void;
  onBatchAddExaminees: (roomId: string, examinees: { fullName: string }[]) => void;
  onRemoveExamineeFromRoom: (roomId: string, examineeId: string) => void;
  onResetData: () => void;
  lang: Language;
  examYear?: string;
  examDate?: string;
  campusMap?: string;
  onUpdateCampusMap?: (map: string) => Promise<void>;
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
  onUpdateLevel,
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
  campusMap = '',
  onUpdateCampusMap,
}) => {
  const t = translations[lang];

  // Modals state
  const [isGlobalQuotaModalOpen, setIsGlobalQuotaModalOpen] = useState(false);
  const [isExamYearModalOpen, setIsExamYearModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isCampusMapModalOpen, setIsCampusMapModalOpen] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<{ isOpen: boolean; url: string; title: string; subtitle?: string }>({
    isOpen: false,
    url: '',
    title: '',
  });
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


  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await api.login(loginUsername, loginPassword);
      onLogin(res.user.username);
    } catch (err: any) {
      setLoginError(err.message || t.loginError);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // If not authenticated, render Login view directly
  if (!adminUser.isAuthenticated) {
    return (
      <LoginView
        lang={lang}
        username={loginUsername}
        password={loginPassword}
        error={loginError}
        loading={isLoggingIn}
        onUsernameChange={setLoginUsername}
        onPasswordChange={setLoginPassword}
        onSubmit={handleLoginSubmit}
      />
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <ToastNotification message={toastMessage} />

      <AdminHeader
        examDate={examDate}
        lang={lang}
        onExamYearClick={() => setIsExamYearModalOpen(true)}
        onCampusMapClick={() => setIsCampusMapModalOpen(true)}
        onChangePasswordClick={() => setIsChangePasswordModalOpen(true)}
        onResetClick={() => {
          if (window.confirm('Reset all applicant data and exam rooms to defaults?')) {
            onResetData();
            triggerToast(t.resetSuccess);
          }
        }}
        onLogout={onLogout}
      />


      <section className="space-y-6">
        <ExamScheduleCard
          examYear={examYear}
          examDate={examDate}
          lang={lang}
          onEditClick={() => setIsExamYearModalOpen(true)}
        />

        <GlobalQuotaCard
          formQuota={formQuota}
          lang={lang}
          onEditClick={() => setIsGlobalQuotaModalOpen(true)}
        />

        <LevelAdjustmentCard
          levelStats={levelStats}
          formQuota={formQuota}
          lang={lang}
          onIncrement={(level: JLPTLevel) => {
            onIncrementRegistered(level);
            triggerToast(`+1 Applicant added to JLPT ${level}`);
          }}
          onEditClick={setEditingStat}
        />
      </section>


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

          <AddRoomButton
            lang={lang}
            onClick={() => setRoomModalData({ isOpen: true, room: null })}
          />
        </div>

        <RoomTable
          rooms={examRooms}
          lang={lang}
          onEdit={(room: ExamRoom) => setRoomModalData({ isOpen: true, room })}
          onDelete={(roomId: string) => {
            if (window.confirm(t.confirmDeleteRoom)) {
              onDeleteRoom(roomId);
              triggerToast('Room deleted successfully');
            }
          }}
          onManageExaminees={handleOpenManageExaminees}
          onPhotoClick={(room: ExamRoom, e: React.MouseEvent) => {
            e.stopPropagation();
            setPreviewPhoto({
              isOpen: true,
              url: room.imageUrl!,
              title: formatRoomName(room.code, lang),
              subtitle: `${room.building} • ${room.floor} (JLPT ${room.level})`,
            });
          }}
          confirmDeleteMessage={t.confirmDeleteRoom}
        />
      </section>


      <EditGlobalQuotaModal
        isOpen={isGlobalQuotaModalOpen}
        onClose={() => setIsGlobalQuotaModalOpen(false)}
        currentTotalQuota={formQuota.totalQuota}
        currentFormsSold={formQuota.formsSold}
        onSave={(newTotalQuota: number, newFormsSold: number) => {
          onUpdateGlobalQuota(newTotalQuota, newFormsSold);
          triggerToast(t.saveSuccess);
        }}
        lang={lang}
      />


      <EditExamYearModal
        isOpen={isExamYearModalOpen}
        onClose={() => setIsExamYearModalOpen(false)}
        currentYear={examYear}
        currentDate={examDate}
        onSave={(newYear: string, newDate: string) => {
          onUpdateExamSchedule(newYear, newDate);
          triggerToast(t.examScheduleSuccess);
        }}
        lang={lang}
      />


      <EditQuotaModal
        stat={editingStat}
        isOpen={Boolean(editingStat)}
        onClose={() => setEditingStat(null)}
        onSave={(level: string, data: { registered: number; fee: number; testTime: string; quota: number }) => {
          if (onUpdateLevel) {
            onUpdateLevel(level, data);
          } else if (onUpdateLevelRegistered) {
            onUpdateLevelRegistered(level, data.registered);
          }
          triggerToast(t.saveSuccess);
        }}
        lang={lang}
      />


      <AddEditRoomModal
        room={roomModalData.room}
        isOpen={roomModalData.isOpen}
        onClose={() => setRoomModalData({ isOpen: false, room: null })}
        onSave={(roomData: Omit<ExamRoom, 'id' | 'examinees'> & { id?: string }) => {
          onSaveRoom(roomData);
          triggerToast(t.saveSuccess);
        }}
        lang={lang}
      />


      <ManageRoomExamineesModal
        room={manageExamineesRoom}
        isOpen={Boolean(manageExamineesRoom)}
        onClose={() => setManageExamineesRoom(null)}
        onAddExaminee={async (roomId: string, fullName: string) => {
          await onAddExamineeToRoom(roomId, fullName);
          await refreshRoomExaminees(roomId);
          triggerToast('Examinee added successfully');
        }}
        onBatchAddExaminees={async (roomId: string, examinees: { fullName: string }[]) => {
          await onBatchAddExaminees(roomId, examinees);
          await refreshRoomExaminees(roomId);
          triggerToast(`Batch added ${examinees.length} examinees`);
        }}
        onRemoveExaminee={async (roomId: string, examineeId: string) => {
          await onRemoveExamineeFromRoom(roomId, examineeId);
          await refreshRoomExaminees(roomId);
          triggerToast('Examinee removed');
        }}
        lang={lang}
      />


      <ChangeAdminPasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        currentUsername={adminUser.username}
        onSuccess={(newUsername: string) => {
          onLogin(newUsername);
          triggerToast(t.credentialsUpdateSuccess);
        }}
        lang={lang}
      />


      <CampusMapModal
        isOpen={isCampusMapModalOpen}
        onClose={() => setIsCampusMapModalOpen(false)}
        campusMap={campusMap}
        isAdmin={true}
        onSaveMap={async (newMap: string) => {
          if (onUpdateCampusMap) {
            await onUpdateCampusMap(newMap);
            triggerToast(newMap ? t.campusMapUploadedSuccess : t.campusMapDeletedSuccess);
          }
        }}
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


      <AdminFooter lang={lang} examYear={examYear} />
    </div>
  );
};
