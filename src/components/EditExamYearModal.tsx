import { useState, useEffect, type FC, type FormEvent } from 'react';
import type { Language } from '../types';
import { translations, getAnnualExamTitle, getAnnualExamShort } from '../i18n';
import { X, AlertCircle, Save, Calendar, Sparkles } from 'lucide-react';

interface EditExamYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: string;
  onSave: (newYear: string) => void;
  lang: Language;
}

export const EditExamYearModal: FC<EditExamYearModalProps> = ({
  isOpen,
  onClose,
  currentYear,
  onSave,
  lang,
}) => {
  const [year, setYear] = useState(currentYear || '2026');
  const [error, setError] = useState('');

  useEffect(() => {
    setYear(currentYear || '2026');
    setError('');
  }, [currentYear, isOpen]);

  if (!isOpen) return null;
  const t = translations[lang];

  const currentYearNum = parseInt(currentYear, 10) || new Date().getFullYear();
  const presets = [
    String(currentYearNum),
    String(currentYearNum + 1),
    String(currentYearNum + 2),
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanYear = year.trim();
    if (!cleanYear) {
      setError(lang === 'lo' ? 'ກະລຸນາໃສ່ປີສອບເສັງ' : 'Please enter an exam year');
      return;
    }
    if (cleanYear.length < 4 || isNaN(Number(cleanYear))) {
      setError(lang === 'lo' ? 'ກະລຸນາໃສ່ຕົວເລກປີ ຄ.ສ. ທີ່ຖືກຕ້ອງ (ຕົວຢ່າງ: 2026)' : 'Please enter a valid 4-digit year (e.g. 2026)');
      return;
    }

    onSave(cleanYear);
    onClose();
  };

  const previewTitle = getAnnualExamTitle(lang, year || '2026');
  const previewShort = getAnnualExamShort(lang, year || '2026');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b-2 border-red-700 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {t.editExamYearModalTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.examYearCardDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 text-xs p-3 rounded-lg border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Year Input Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t.examYearLabel} *
            </label>
            <div className="relative">
              <input
                type="text"
                maxLength={4}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setError('');
                }}
                placeholder={t.examYearPlaceholder}
                className="w-full px-3.5 py-2.5 text-xl font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none tracking-wider"
                autoFocus
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                A.D.
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {t.examYearHelp}
            </span>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              {lang === 'lo' ? 'ເລືອກໄວ:' : 'Quick Select:'}
            </span>
            <div className="flex gap-2">
              {presets.map((presetYear) => (
                <button
                  key={presetYear}
                  type="button"
                  onClick={() => setYear(presetYear)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    year === presetYear
                      ? 'bg-red-700 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {presetYear}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.examYearPreviewLabel}</span>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs">
              <div className="text-xs font-semibold text-red-700 mb-0.5">
                {previewShort}
              </div>
              <div className="text-sm font-bold text-slate-900 leading-snug" lang={lang}>
                {previewTitle}
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition-colors"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
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
