import { useState, useEffect, useCallback } from 'react';
import type { Language, LevelStat, ExamRoom, AdminUser, JLPTLevel, FormQuotaStat, Announcement } from './types';
import { initialLevelStats, initialExamRooms, initialFormQuota } from './data/mockData';
import { translations, getAnnualExamShort } from './i18n';
import { api, getAuthToken, subscribeToSSE } from './api';
import { Navbar } from './components/Navbar';
import { PublicView } from './components/PublicView';
import { AdminView } from './components/AdminView';

const STORAGE_KEY_LANG = 'jlpt_lang_v1';
const STORAGE_KEY_AUTH = 'jlpt_admin_auth_v1';

export function App() {
  // 1. Language state (defaults to 'lo')
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return saved === 'en' ? 'en' : 'lo';
  });

  // Sync html lang attribute for Lao font rendering rules
  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  }, [lang]);

  // 2. View Mode ('public' | 'admin')
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');

  // 3. Admin Authentication state
  const [adminUser, setAdminUser] = useState<AdminUser>(() => {
    const token = getAuthToken();
    const saved = localStorage.getItem(STORAGE_KEY_AUTH);
    if (token && saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...parsed, isAuthenticated: true };
      } catch {
        // ignore
      }
    }
    return { isAuthenticated: false, username: '', role: 'guest' };
  });

  // 4. Data states loaded from persistent database
  const [levelStats, setLevelStats] = useState<LevelStat[]>(initialLevelStats);
  const [formQuota, setFormQuota] = useState<FormQuotaStat>(initialFormQuota);
  const [examRooms, setExamRooms] = useState<ExamRoom[]>(initialExamRooms);
  const [examYear, setExamYear] = useState<string>('2026');
  const [examDate, setExamDate] = useState<string>('2026-07-05');
  const [registrationDeadline, setRegistrationDeadline] = useState<string>('2026-03-31');
  const [campusMap, setCampusMap] = useState<string>('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Fetch live data from backend
  const fetchLevels = useCallback(async () => {
    try {
      const data = await api.getLevels();
      setLevelStats(data.levels);
      setFormQuota(data.formQuota);
      if (data.examYear) {
        setExamYear(data.examYear);
      }
      if (data.examDate) {
        setExamDate(data.examDate);
      }
      if (data.registrationDeadline) {
        setRegistrationDeadline(data.registrationDeadline);
      }
      if (data.campusMap !== undefined) {
        setCampusMap(data.campusMap);
      }
    } catch {
      // Keep existing
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    try {
      const data = await api.getRooms();
      setExamRooms(data);
    } catch {
      // Keep existing
    }
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch {
      // Keep existing
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.allSettled([
      fetchLevels(),
      fetchRooms(),
      fetchAnnouncements(),
    ]);
  }, [fetchLevels, fetchRooms, fetchAnnouncements]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Subscribe to real-time Server-Sent Events (SSE)
  useEffect(() => {
    const unsubscribe = subscribeToSSE((event) => {
      if (event === 'levels_updated') {
        fetchLevels();
      } else if (event === 'rooms_updated' || event === 'applicants_updated') {
        fetchRooms();
        fetchLevels();
      } else if (event === 'announcements_updated') {
        fetchAnnouncements();
      }
    });

    // Fallback polling every 12 seconds for multi-user reliability
    const interval = setInterval(refreshAll, 12000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [fetchLevels, fetchRooms, fetchAnnouncements, refreshAll]);

  // Auth Handlers
  const handleLogin = (username: string) => {
    const user: AdminUser = {
      isAuthenticated: true,
      username,
      role: 'Examiner Admin',
    };
    setAdminUser(user);
    localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
  };

  const handleLogout = () => {
    api.logout();
    setAdminUser({ isAuthenticated: false, username: '', role: 'guest' });
    localStorage.removeItem(STORAGE_KEY_AUTH);
    setViewMode('public');
  };

const handleAuthError = (err: any) => {
    const msg = err?.message || '';
    if (
      msg.includes('token') ||
      msg.includes('Authentication') ||
      msg.includes('Unauthorized') ||
      msg.includes('expired')
    ) {
      handleLogout();
      alert(
        lang === 'lo'
          ? 'ກະລຸນາເຂົ້າສູ່ລະບົບເ Jediົ້າໜ້າທີ່ກ່ອນ (Please login as admin)'
          : 'Please login as institute staff first'
      );
      return true;
    }
    return false;
  };

  // Level stats handlers (Admin)
  const handleIncrementRegistered = async (level: JLPTLevel) => {
    try {
      await api.incrementLevel(level);
      await fetchLevels();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to increment');
    }
  };

  const handleUpdateGlobalQuota = async (totalQuota: number, formsSold?: number, registrationOpen?: boolean) => {
    try {
      const res = await api.updateGlobalQuota(totalQuota, formsSold, registrationOpen);
      setFormQuota(res.formQuota);
      await fetchLevels();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to update total form quota');
    }
  };

  const handleUpdateExamSchedule = async (newYear: string, newDate: string, newDeadline?: string) => {
    try {
      const res = await api.updateExamSchedule(newYear, newDate, newDeadline);
      setExamYear(res.examYear);
      setExamDate(res.examDate);
      if (res.registrationDeadline) {
        setRegistrationDeadline(res.registrationDeadline);
      }
      await fetchLevels();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to update exam schedule');
    }
  };

  const handleUpdateLevel = async (
    level: string,
    data: { registered: number; fee: number; testTime: string; quota: number }
  ) => {
    try {
      await api.updateLevel(level, {
        registeredCount: data.registered,
        fee: data.fee,
        testTime: data.testTime,
        quota: data.quota,
      });
      await fetchLevels();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to update exam level details');
    }
  };

  const handleUpdateLevelRegistered = async (
    level: string,
    registered: number
  ) => {
    try {
      await api.updateLevel(level, registered);
      await fetchLevels();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to update registered count');
    }
  };

  const handleUpdateCampusMap = async (newMap: string) => {
    try {
      await api.updateCampusMap(newMap);
      setCampusMap(newMap);
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to update campus map');
    }
  };

  // Exam rooms handlers (Admin)
  const handleSaveRoom = async (
    roomData: Omit<ExamRoom, 'id' | 'examinees'> & { id?: string }
  ) => {
    try {
      if (roomData.id) {
        await api.updateRoom(roomData.id, {
          code: roomData.code,
          building: roomData.building,
          floor: roomData.floor,
          level: roomData.level,
          capacity: roomData.capacity,
          imageUrl: roomData.imageUrl,
        });
      } else {
        await api.createRoom({
          code: roomData.code,
          building: roomData.building,
          floor: roomData.floor,
          level: roomData.level,
          capacity: roomData.capacity,
          imageUrl: roomData.imageUrl,
        });
      }
      await fetchRooms();
    } catch (err: any) {
      alert(err.message || 'Failed to save room');
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await api.deleteRoom(roomId);
      await fetchRooms();
    } catch (err: any) {
      alert(err.message || 'Failed to delete room');
    }
  };

  const handleAddExamineeToRoom = async (
    roomId: string,
    fullName: string
  ) => {
    try {
      await api.addApplicant(roomId, fullName);
      await fetchRooms();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to add examinee');
      throw err;
    }
  };

  const handleBatchAddExaminees = async (
    roomId: string,
    examinees: { fullName: string }[]
  ) => {
    try {
      await api.batchAddApplicants(roomId, examinees);
      await fetchRooms();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to batch add examinees');
      throw err;
    }
  };

  const handleRemoveExamineeFromRoom = async (
    _roomId: string,
    examineeId: string
  ) => {
    try {
      await api.deleteApplicant(examineeId);
      await fetchRooms();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to remove examinee');
      throw err;
    }
  };

  const handleSaveAnnouncement = async (data: {
    id?: string;
    title: string;
    content?: string;
    imageUrl?: string;
    isPinned: boolean;
  }) => {
    try {
      if (data.id) {
        await api.updateAnnouncement(data.id, {
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          isPinned: data.isPinned,
        });
      } else {
        await api.createAnnouncement({
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl,
          isPinned: data.isPinned,
        });
      }
      await fetchAnnouncements();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to save announcement');
      throw err;
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await api.deleteAnnouncement(id);
      await fetchAnnouncements();
    } catch (err: any) {
      if (handleAuthError(err)) return;
      alert(err.message || 'Failed to delete announcement');
      throw err;
    }
  };

  const handleResetData = async () => {
    try {
      await api.resetDemo();
      await refreshAll();
    } catch (err: any) {
      alert(err.message || 'Failed to reset demo data');
      throw err;
    }
  };

  const t = translations[lang];

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 text-slate-900 ${lang === 'lo' ? 'lao-text' : ''}`}>
      {/* Navigation Bar */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        adminUser={adminUser}
        onLogout={handleLogout}
        examYear={examYear}
        examDate={examDate}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {viewMode === 'public' ? (
          <PublicView
            levelStats={levelStats}
            formQuota={formQuota}
            examRooms={examRooms}
            announcements={announcements}
            lang={lang}
            examYear={examYear}
            examDate={examDate}
            registrationDeadline={registrationDeadline}
            campusMap={campusMap}
          />
        ) : (
          <AdminView
            levelStats={levelStats}
            formQuota={formQuota}
            examRooms={examRooms}
            adminUser={adminUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onIncrementRegistered={handleIncrementRegistered}
            onUpdateGlobalQuota={handleUpdateGlobalQuota}
            onUpdateExamSchedule={handleUpdateExamSchedule}
            onUpdateLevel={handleUpdateLevel}
            onUpdateLevelRegistered={handleUpdateLevelRegistered}
            onSaveRoom={handleSaveRoom}
            onDeleteRoom={handleDeleteRoom}
            onAddExamineeToRoom={handleAddExamineeToRoom}
            onBatchAddExaminees={handleBatchAddExaminees}
            onRemoveExamineeFromRoom={handleRemoveExamineeFromRoom}
            onResetData={handleResetData}
            lang={lang}
            examYear={examYear}
            examDate={examDate}
            registrationDeadline={registrationDeadline}
            campusMap={campusMap}
            onUpdateCampusMap={handleUpdateCampusMap}
            announcements={announcements}
            onSaveAnnouncement={handleSaveAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        )}
      </main>

{viewMode === 'public' ? (
          <footer className="bg-slate-900 text-slate-400 py-6 sm:py-8 border-t border-slate-800 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <div>
                <p className="font-semibold text-slate-300">
                  {t.instituteName} &bull; {getAnnualExamShort(lang, examYear)}
                </p>
                <p className="text-slate-400 mt-1">
                  {t.footerText.replace('2026', examYear)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                  <span>{t.liveConnected}</span>
                </span>
                <span className="text-slate-400">
                  Language: <strong className="text-slate-200">{lang === 'lo' ? 'ລາວ (Lao)' : 'English'}</strong>
                </span>
              </div>
            </div>
          </footer>
        ) : null}
    </div>
  );
}

export default App;
