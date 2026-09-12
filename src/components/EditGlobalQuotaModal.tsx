import { useState, useEffect, type FC, type FormEvent } from 'react';
import type { Language } from '../types';
import { translations } from '../i18n';
import { X, AlertCircle, Save, Layers } from 'lucide-react';

interface EditGlobalQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTotalQuota: number;
  totalRegistered: number;
  onSave: (newTotalQuota: number) => void;
  lang: Language;
}

export const EditGlobalQuotaModal: FC<EditGlobalQuotaModalProps> = ({
  isOpen,
  onClose,
  currentTotalQuota,
  totalRegistered,
  onSave,
  lang,
}) => {
  const [totalQuota, setTotalQuota] = useState(currentTotalQuota);
  const [error, setError] = useState('');

  useEffect(() => {
    setTotalQuota(currentTotalQuota);
    setError('');
  }, [currentTotalQuota, isOpen]);

  if (!isOpen) return null;
  const t = translations[lang];

  const remaining = Math.max(0, totalQuota - totalRegistered);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (totalQuota < 1) {
      setError('Total form quota must be at least 1');
      return;
    }
    if (totalQuota < totalRegistered) {
      setError(`Total quota cannot be less than already registered applicants (${totalRegistered})`);
      return;
    }
    onSave(totalQuota);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {t.editGlobalQuotaModalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.unifiedFormBadge}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Current Registered (Read-only summary) */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-900">
              {t.usedFormsLabel}:
            </span>
            <span className="text-base font-extrabold text-blue-800">
              {totalRegistered} <span className="text-xs font-normal text-blue-700">{t.formUnit} / {t.personUnit}</span>
            </span>
          </div>

          {/* Total Form Quota Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.totalFormsLabel} ({t.formUnit}) *
            </label>
            <input
              type="number"
              min={Math.max(1, totalRegistered)}
              value={totalQuota}
              onChange={(e) => setTotalQuota(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 text-lg font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.totalFormQuotaDesc}
            </span>
          </div>

          {/* Calculated Remaining Result */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-900">
              {t.remainingFormsLabel}:
            </span>
            <span className="text-xl font-extrabold text-emerald-700">
              {remaining} <span className="text-xs font-normal text-emerald-800">{t.formUnit}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
