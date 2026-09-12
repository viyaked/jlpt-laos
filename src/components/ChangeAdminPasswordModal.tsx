import { useState, useEffect, type FC, type FormEvent } from 'react';
import type { Language } from '../types';
import { translations } from '../i18n';
import { api } from '../api';
import {
  KeyRound,
  X,
  AlertCircle,
  Save,
  Loader2,
  User,
  Lock,
  Users,
  UserPlus,
  Trash2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AdminUserItem {
  id: string;
  username: string;
  role: string;
  created_at: string;
}

interface ChangeAdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onSuccess: (newUsername: string) => void;
  lang: Language;
}

export const ChangeAdminPasswordModal: FC<ChangeAdminPasswordModalProps> = ({
  isOpen,
  onClose,
  currentUsername,
  onSuccess,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'password' | 'admins'>('password');

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin List & Creation state
  const [adminList, setAdminList] = useState<AdminUserItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin');
  const [adminCreateError, setAdminCreateError] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    if (isOpen) {
      setNewUsername(currentUsername);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccessMsg('');
      setAdminCreateError('');
      loadAdminList();
    }
  }, [isOpen, currentUsername]);

  const loadAdminList = async () => {
    setIsLoadingList(true);
    try {
      const res = await api.getAdminUsers();
      setAdminList(res.users || []);
    } catch {
      // ignore
    } finally {
      setIsLoadingList(false);
    }
  };

  if (!isOpen) return null;

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!currentPassword.trim()) {
      setError(lang === 'lo' ? 'ກະລຸນາປ້ອນລະຫັດຜ່ານປັດຈຸບັນ' : 'Current password is required');
      return;
    }

    if (newPassword && newPassword.length < 4) {
      setError(lang === 'lo' ? 'ລະຫັດຜ່ານໃໝ່ຕ້ອງມີຢ່າງໜ້ອຍ 4 ຕົວອັກສອນ' : 'New password must be at least 4 characters');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError(t.passwordMismatchError);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.changeAdminCredentials({
        currentPassword,
        newUsername: newUsername.trim() || undefined,
        newPassword: newPassword.trim() || undefined,
      });

      onSuccess(res.user.username);
      setSuccessMsg(t.credentialsUpdateSuccess);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      loadAdminList();
    } catch (err: any) {
      setError(err.message || 'Failed to update credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAdmin = async (e: FormEvent) => {
    e.preventDefault();
    setAdminCreateError('');

    if (!newAdminUsername.trim()) {
      setAdminCreateError(lang === 'lo' ? 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້' : 'Username is required');
      return;
    }

    if (!newAdminPassword.trim() || newAdminPassword.trim().length < 4) {
      setAdminCreateError(lang === 'lo' ? 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 4 ຕົວອັກສອນ' : 'Password must be at least 4 characters');
      return;
    }

    setIsCreatingAdmin(true);
    try {
      await api.createAdminUser({
        username: newAdminUsername.trim(),
        password: newAdminPassword.trim(),
        role: newAdminRole,
      });

      setNewAdminUsername('');
      setNewAdminPassword('');
      loadAdminList();
      alert(t.adminCreatedSuccess);
    } catch (err: any) {
      setAdminCreateError(err.message || 'Failed to create admin');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleDeleteAdmin = async (userId: string, targetUsername: string) => {
    if (targetUsername === currentUsername) {
      alert(lang === 'lo' ? 'ບໍ່ສາມາດລຶບບັນຊີທີ່ກຳລັງເຂົ້າສູ່ລະບົບຢູ່ໄດ້' : 'Cannot delete currently logged-in account');
      return;
    }

    if (!window.confirm(`${t.deleteAdminConfirm} (${targetUsername})`)) {
      return;
    }

    try {
      await api.deleteAdminUser(userId);
      loadAdminList();
      alert(t.adminDeletedSuccess);
    } catch (err: any) {
      alert(err.message || 'Failed to delete admin user');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {t.changePasswordModalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.changePasswordModalDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'password'
                ? 'border-red-600 text-red-700 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{t.tabChangePassword}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admins')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'admins'
                ? 'border-red-600 text-red-700 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.tabManageAdmins} ({adminList.length})</span>
          </button>
        </div>

        {/* TAB 1: Change Password */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 text-red-800 text-xs p-3 rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Current Username (Editable) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.newUsernameLabel}</span>
              </label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={currentUsername}
                className="w-full px-3.5 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Current Password */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>{t.currentPasswordLabel} *</span>
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
                {lang === 'lo' ? 'ລະຫັດຜ່ານໃໝ່ (ເລືອກໃສ່ ຫຼື ບໍ່ໃສ່ກໍ່ໄດ້)' : 'New Password (Optional)'}
              </span>

              {/* New Password */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.newPasswordLabel}</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.confirmNewPasswordLabel}</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t.cancelBtn}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-semibold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{t.saveBtn}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Manage Administrators (List & Add) */}
        {activeTab === 'admins' && (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Admin Accounts List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t.adminListTitle}</span>
                </span>
                {isLoadingList && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50 overflow-hidden">
                {adminList.map((user) => {
                  const isCurrent = user.username === currentUsername;
                  return (
                    <div
                      key={user.id}
                      className="p-3 flex items-center justify-between hover:bg-white transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">
                              {user.username}
                            </span>
                            {isCurrent && (
                              <span className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                                {lang === 'lo' ? 'ທ່ານ' : 'You'}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 block">
                            {user.role} &bull; {user.created_at ? user.created_at.substring(0, 10) : ''}
                          </span>
                        </div>
                      </div>

                      {!isCurrent && adminList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAdmin(user.id, user.username)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Admin"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add New Admin Form */}
            <div className="pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-3">
                <UserPlus className="w-4 h-4 text-emerald-600" />
                <span>{t.addAdminBtn}</span>
              </span>

              {adminCreateError && (
                <div className="mb-3 bg-red-50 text-red-800 text-xs p-2.5 rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{adminCreateError}</span>
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.usernameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="e.g. staff_somxay"
                    className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.passwordLabel} (min 4 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    {t.adminRoleLabel}
                  </label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="admin">Admin (ຜູ້ດູແລລະບົບ)</option>
                    <option value="examiner">Staff Examiner (ກຳມະການສອບເສັງ)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingAdmin}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 text-white font-bold rounded-lg text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isCreatingAdmin ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )}
                  <span>{t.addAdminBtn}</span>
                </button>
              </form>
            </div>

            {/* Footer Close */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t.closeBtn}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
