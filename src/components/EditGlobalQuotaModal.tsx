import { useState, useEffect, type FC, type FormEvent } from 'react';
import type { Language } from '../types';
import { translations } from '../i18n';
import { X, AlertCircle, Save, Layers, TrendingUp, ToggleRight } from 'lucide-react';

interface EditGlobalQuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTotalQuota: number;
  currentFormsSold: number;
  currentRegistrationOpen: boolean;
  onSave: (newTotalQuota: number, newFormsSold: number, newRegistrationOpen: boolean) => void;
  lang: Language;
}

export const EditGlobalQuotaModal: FC<EditGlobalQuotaModalProps> = ({
  isOpen,
  onClose,
  currentTotalQuota,
  currentFormsSold,
  currentRegistrationOpen,
  onSave,
  lang,
}) => {
  const [totalQuota, setTotalQuota] = useState(currentTotalQuota);
  const [formsSold, setFormsSold] = useState(currentFormsSold);
  const [registrationOpen, setRegistrationOpen] = useState(currentRegistrationOpen);
  const [error, setError] = useState('');

  useEffect(() => {
    setTotalQuota(currentTotalQuota);
    setFormsSold(currentFormsSold);
    setRegistrationOpen(currentRegistrationOpen);
    setError('');
  }, [currentTotalQuota, currentFormsSold, currentRegistrationOpen, isOpen]);

  if (!isOpen) return null;
  const t = translations[lang];

  const remaining = Math.max(0, totalQuota - formsSold);
  const isFull = remaining <= 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (totalQuota < 1) {
      setError(lang === 'lo' ? 'ຈຳນວນຟອມທັງໝົດຕ້ອງຫຼາຍກວ່າ 0' : 'Total form quota must be at least 1');
      return;
    }
    if (formsSold < 0) {
      setError(lang === 'lo' ? 'ຈຳນວນຟອມທີ່ຂາຍແລ້ວຕ້ອງບໍ່ຫຼຸດ 0' : 'Forms sold cannot be negative');
      return;
    }
    if (formsSold > totalQuota) {
      setError(
        t.formsSoldError ||
        (lang === 'lo'
          ? `ຈຳນວນຟອມທີ່ຂາຍແລ້ວ (${formsSold}) ບໍ່ສາມາດເກີນຈຳນວນຟອມທັງໝົດ (${totalQuota})`
          : `Forms sold (${formsSold}) cannot exceed total quota (${totalQuota})`)
      );
      return;
    }
    onSave(totalQuota, formsSold, registrationOpen);
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
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors">
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

          {/* 1. Total Form Quota Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-800">
                {t.totalFormsLabel} ({t.formUnit}) *
              </label>
              <span className="text-[11px] text-slate-500 font-medium">
                {t.totalQuota}
              </span>
            </div>
            <input
              type="number"
              min={1}
              value={totalQuota}
              onChange={(e) => setTotalQuota(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 text-lg font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:bg-white focus:outline-none transition-all"
            />
            {/* Quick Presets for Total Quota */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-500 font-semibold mr-1">
                {lang === 'lo' ? 'ກຳນົດດ່ວນ:' : 'Presets:'}
              </span>
              {[300, 400, 500, 600, 800, 1000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTotalQuota(preset)}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-lg border transition-all ${
                    totalQuota === preset
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.totalFormQuotaDesc}
            </span>
          </div>

          {/* 2. Forms Sold (Directly Editable) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.usedFormsLabel} ({t.formUnit}) *</span>
              </label>
              <span className="text-[11px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                {t.editDirectlyBtn}
              </span>
            </div>
            <input
              type="number"
              min={0}
              max={totalQuota}
              value={formsSold}
              onChange={(e) => setFormsSold(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3.5 py-2.5 text-lg font-bold text-blue-950 bg-blue-50/50 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none transition-all"
            />
            {/* Quick Add Buttons */}
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-blue-700 font-semibold mr-1">
                {lang === 'lo' ? 'ເພີ່ມດ່ວນ:' : 'Quick Add:'}
              </span>
              {[1, 5, 10, 20].map((inc) => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => setFormsSold((prev) => Math.min(totalQuota, prev + inc))}
                  disabled={formsSold >= totalQuota}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100/90 text-blue-800 hover:bg-blue-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  +{inc}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.formsSoldDesc}
            </span>
          </div>

          {/* 3. Calculated Remaining Result */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
            isFull
              ? 'bg-rose-50 border-rose-200'
              : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div>
              <span className={`text-xs font-bold block ${isFull ? 'text-rose-900' : 'text-emerald-900'}`}>
                {t.remainingFormsLabel}:
              </span>
              <span className="text-[11px] text-slate-500">
                {isFull ? t.statusFull : t.statusOpen}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-black ${isFull ? 'text-rose-700' : 'text-emerald-700'}`}>
                {remaining}
              </span>
              <span className={`text-xs font-medium ${isFull ? 'text-rose-600' : 'text-emerald-700'}`}>
                {t.formUnit}
              </span>
            </div>
          </div>

          {/* 4. Registration Status Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-purple-900 flex items-center gap-1.5">
                <ToggleRight className="w-3.5 h-3.5 text-purple-600" />
                <span>{t.registrationStatusLabel}</span>
              </label>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                registrationOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {registrationOpen ? t.statusOpen : t.statusFull}
              </span>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setRegistrationOpen(!registrationOpen)}
                className={`relative w-14 h-8 rounded-full transition-colors flex items-center ${
                  registrationOpen ? 'bg-emerald-600' : 'bg-rose-400'
                }`}
                aria-label={registrationOpen ? t.statusOpen : t.statusFull}
              >
                <div className={`absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  registrationOpen ? 'translate-x-7' : 'translate-x-1'
                }`}>
                </div>
              </button>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.registrationStatusDesc}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
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
